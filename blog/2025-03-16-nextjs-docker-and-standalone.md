---
slug: nextjs-docker-standalone-and-custom-server
title: Next.js를 Docker와 Standalone, 그리고 custom server
description: Next.js의 standalone과 custom server를 이리저리 조합해서 Dockerizing을 해보자.
keywords:
  - nextjs
  - docker
  - standalone
  - custom-server
  - web
authors: HyunmoAhn
tags: [nextjs, docker, standalone, custom-server, web, blog]
---

## Purpose

Next.js 프로젝트를 docker 환경에서 자주 사용한다. 그리고 Next.js의 [standalone](https://nextjs.org/docs/pages/api-reference/config/next-config-js/output#automatically-copying-traced-files)과
[custom server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server)를 같이 사용하는데,
각각의 목적과 동작을 이해하지 않으면 dockerizing을 하기 힘들 때가 있으므로 이번에 정리해보려고 한다.

## Intro

이번 글에서는 총 4가지 케이스로 dockerizing을 하는 예제를 보여준다.
각 케이스별로 [github 예제](https://github.com/HyunmoAhn/nextjs-docker-example)도 준비해두었으니, 조금 더 스스로 해보고 싶은게 있다면 활용해보길 바란다.

| 케이스 | 설명                        | Standalone | Custom Server |
|--------|-----------------------------|------------|---------------|
| 1      | 기본적인 Next.js 빌드 및 실행 | ❌        | ❌            |
| 2      | Standalone 모드로 실행       | ✅        | ❌            |
| 3      | Custom Server 사용          | ❌        | ✅            |
| 4      | Standalone + Custom Server  | ✅        | ✅            |

<!-- truncate -->

## Standalone? Custom Server?

먼저, Standalone과 Custom Server가 어떤 건지 알아보고 넘어가자. 그래야 어떤 장점을 가져갈 수 있을지 이해하며 Dockerizing을 할 수 있을 것이다.

### Standalone

[Standalone](https://nextjs.org/docs/pages/api-reference/config/next-config-js/output#automatically-copying-traced-files)은 Next.js에서 제공하는 빌드 설정이다.

> Next.js can automatically create a standalone folder that copies only the necessary files for a production deployment including select files in node_modules.

원문을 그대로 빌리자면, node_modules를 모두 사용하지 않고 production 환경에 필요한 파일만 사용하도록 추출해주는 모드라고 이해할 수 있다.
따라서, 빌드 된 결과물이 더 가벼워져서 용량이 줄어든다. 이를 통해 docker image의 용량이 줄어들어 배포시에 좀 더 빠르게 배포 할 수 있다는 장점이 있을 수 있다.

특히 실행 할 때 `next start`로 실행하는 일반 모드와 달리 `node index.js`로 실제 node 코드를 실행하는 방식으로 바뀐다. standalone의 목적으로 next를 실행하는 코드도 줄이는 목적으로 추정된다.
Next.js에서 docker를 사용하고자 하는 대표적인 [예제 코드](https://github.com/vercel/next.js/blob/canary/examples/with-docker/next.config.js#L3)도 standalone 기반으로 작성되어 있다.

```ts
// next.config.ts
module.exports = {
  output: 'standalone',
}
```


### Custom Server

[Custom Server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server)는 Next.js에서 제공하는 서버 코드를 그대로 사용하지 않고 일반적인 node server를 사용하는 방법이다.
별도의 서버 코드를 작성해야하지만, 그만큼 유연성이 높아진다. 예를 들어서 express를 사용해 request / response의 로그를 남길 수 있고, prom-client를 사용해서 metric을 수집하도록 설정 할 수도 있다.

다만 server 코드들은 Next.js의 빌드와는 별도의 프로세스이므로 별도의 dev server, build script를 작성해야한다는 부분도 복잡한 부분이다.
Dockerizing을 할 때에도 이 부분을 고려해야하고 장단점과 구조를 이해하지 못하면 지속적인 관리가 힘들 수 있다. [(docs)](https://github.com/vercel/next.js/blob/canary/examples/custom-server/server.ts)

```ts
// server.ts
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
```


## #1 기본적인 Next.js 빌드
먼저 standalone도 사용하지 않고 custom server도 사용하지 않는 기본적인 Next.js 빌드를 dockerizing 해보자. [(github)](https://github.com/HyunmoAhn/nextjs-docker-example/blob/main/basic/package.json)


```dockerfile
FROM node:22.14-alpine
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --only=production

COPY .next ./.next
COPY public ./public
COPY next.config.ts ./

ENV NODE_ENV=production

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "run", "start"]
```

Dockerfile은 위와 같이 설정된다. 빌드 및 dockerizing 과정을 차근차근 살펴보자.

### Install & Build

```shell
npm install
next build
```

먼저 package install 과정과 `next build`를 실행한다. 이 과정은 local 환경 혹은 CI server 환경에서 실행된다.
빌드 된 결과물은 `.next` 폴더에 생성된다.
```
basic
├── .next 
├── node_modules
├── public
├── next.config.ts
└── package.json
```

### Dockerized

```bash
docker build -t basic .
```
두번째로 dockerizing을 진행한다. 

```dockerfile
COPY package.json package-lock.json ./

RUN npm install --only=production
```
Dockerfile을 순서대로 진행하는 것인데, 주목할 점은 `pacakge.json`와 `package-lock.json` 을 복사하고 `npm install`을 실행하는 부분이다.

docker 환경에서도 npm install을 하는건 docker 실행시 사용하는 스크립트가 `next start` 스크립트이며, 이를 위해 `node_modules` 코드들이 필요한 것이다.

```dockerfile
COPY .next ./.next
COPY public ./public
COPY next.config.ts ./
```
이후에는 local(혹은 CI 환경)에서 빌드한 결과물을 docker 환경 안으로 copy한다.
이 과정이 .next와 public, next.config.ts를 가져가는 과정이다.

### Run
docker build가 완료 되었다면 docker image를 실행시켜 container를 생성한다.
```bash
docker run --rm -it -p 3000:3000 basic
```
`localhost:3000`으로 접속하면 Next.js 코드를 확인 할 수 있다.


이를 통해 Next.js 프로젝트를 도커로 빌드하고 실행하는 과정을 확인해보았다.

### Normal Next.js Dockerized Summary

| Index | Process         | Environment | Description                                                        |
|-------|-----------------|-------------|--------------------------------------------------------------------|
| 1     | Next Build      | Local       | Production server에서 사용 할 Next build output을 생성합니다.                 |
| 2     | Package install | Docker      | Docker 내부에서 next script를 사용해야하므로 package를 docker 내부에서 install 합니다. |
| 3     | Copy            | Docker      | Local에서 빌드 한 Next build output 을 docker 내부로 copy 합니다.              |
| 4     | Run next server | Docker      | `next start` 로 next server를 실행합니다.                                 |

일반 nextjs docker image의 용량을 확인해보면 다음과 같다.
```bash
REPOSITORY   TAG       IMAGE ID       SIZE
basic        latest    c0e9c49ff35a   758MB
````


## #2 Standalone 설정 빌드  

standalone 모드는 next.config.ts를 먼저 수정한다. [(github)](https://github.com/HyunmoAhn/nextjs-docker-example/blob/main/standalone/package.json)

```ts
// next.config.ts
module.exports = {
  output: 'standalone',
}
```

이후 Dockerfile도 조금씩 다른데, 차근차근 살펴보자.
```dockerfile
FROM node:22.14-alpine
WORKDIR /app

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

ENV NODE_ENV=production

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

### Install & Build

```shell
npm install
next build
```
standalone도 일반적인 next.js 빌드와 다를게 없다.
다만, 빌드 결과물이 `.next/standalone` 폴더에 생성되는게 다르다.
```
standalone
├── .next
│   ├── standalone
│   └── static
└── public
```

### Dockerized

```bash
docker build -t standalone .
```

dockerizing 과정도 간단하다.

```dockerfile
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
```

standalone의 dockerizing 과정은 파일의 COPY만 존재한다.
빌드 된 결과물 모두가 server에서 실행 가능한 코드가 모두 포함되어 있기 때문에 별도의 npm install 과정이 필요 없다.

### Run
docker build가 완료 되었다면 docker image를 실행시켜 container를 생성한다.
```bash
docker run --rm -it -p 3000:3000 basic
```
`localhost:3000`으로 접속하면 Next.js 코드를 확인 할 수 있다.

### Standalone Dockerized Summary

| Index | Process         | Environment | Description                                                                                                      |
|-------|-----------------|-------------|------------------------------------------------------------------------------------------------------------------|
| 1     | Next Build      | Local       | Production server에서 사용 할 Next build output을 생성합니다. <br/> stadalone 설정은 server 실행에 필요한 모든 코드를 build output에 포함한다. |
| 2     | Copy            | Docker      | Local에서 빌드 한 Next build output 을 docker 내부로 copy 합니다.                                                            |
| 3     | Run next server | Docker      | `next start` 로 next server를 실행합니다.                                                                               |

이렇게 standalone 과정에서는 docker에서의 npm install 과정이 필요없게 되고 docker 내부에  용랑은 다음과 같다.

```
REPOSITORY   TAG       IMAGE ID       SIZE
standalone   latest    a0c90e9f484c   201MB
```

## #3 Custom Server 설정 빌드

custom server는 Next.js의 server 코드를 직접 작성하는 것이고, server 로직의 아래 next module이 next의 코드를 실행해주는 것이다. [(github)](https://github.com/HyunmoAhn/nextjs-docker-example/blob/main/custom-server/package.json)

```ts
// server.ts
import { createServer } from 'http'
import { parse } from 'url'
// next module
 import next from 'next' 

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
// Initialize next app
const app = next({ dev }) 
const handle = app.getRequestHandler()
 
// Prepare .next folder
app.prepare().then(() => { 
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port)
 
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
```

따라서 중요한 점은 dev server와 production build에 `server.ts`의 실행을 별도로 해주어야한다.

```json
// package.json
{
  "scripts": {
    "dev": "nodemon",
    "build": "next build && tsc -p tsconfig.server.json"
  }
}
```

dev server는 nodemon으로 `server.ts`를 실행하여 hotload를 보장해주고, build의 경우는 next build 이후에 server.ts를 transpiling 해준다.

```dockerfile
FROM node:22.14-alpine
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --only=production

COPY .next ./.next
COPY public ./public
COPY next.config.ts ./
COPY dist-server ./

ENV NODE_ENV=production

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "index.js"]

```

Dockerfile도 조금 달라지는데, 차근차근 살펴보자.

### Install & Build

```shell
npm install
next build
tsc -p tsconfig.server.json
```

custom server의 경우 server.ts의 transpiling 과정이 추가된다.
```
custom-server
├── .next
├── node_modules
├── public
├── next.config.ts
├── dist-server
└── package.json
```

### Dockerized

```bash
docker build -t custom-server .
```

```dockerfile
COPY package.json package-lock.json ./

RUN npm install --only=production
```

일반 Next.js 빌드와 동일하게 docker 환경에서 package install을 진행한다.

```dockerfile
COPY .next ./.next
COPY public ./public
COPY next.config.ts ./
COPY dist-server ./
```

이후에는 동일하게 build 결과물을 docker 환경으로 copy하지만, 여기에 server.ts의 transpile 결과물이 추가된다.

```dockerfile
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "index.js"]
```

마지막으론 run 환경에서 `next start`를 사용하는게 아니라 `node index.js`로 node 서버를 직접 실행한다는 차이가 있다.

### Run

docker build가 완료 되었다면 docker image를 실행시켜 container를 생성한다.
```bash
docker run --rm -it -p 3000:3000 custom-server
```
`localhost:3000`으로 접속하면 Next.js 코드를 확인 할 수 있다.

### Custom Server Dockerized Summary

| Index | Process                   | Environment | Description                                                        |
|-------|---------------------------|-------------|--------------------------------------------------------------------|
| 1     | Next & Custom Server Build | Local       | Production server에서 사용 할 Next build 와 custom server output을 생성합니다. |
| 2     | Package install           | Docker      | Docker 내부에서 next script를 사용해야하므로 package를 docker 내부에서 install 합니다. |
| 3     | Copy                      | Docker      | Local에서 빌드 한 build output 을 docker 내부로 copy 합니다.              |
| 4     | Run node server           | Docker      | `node index.js` 로 custom node server를 실행합니다.                       |

docker 용량은 다음과 같다.
```
REPOSITORY   TAG       IMAGE ID       SIZE
custom-server   latest    8ee84abe5896   771MB
```

## #4 Standalone + Custom Server 설정 빌드

마지막으로는 standalone과 custom server를 모두 사용하는 케이스를 살펴보자. [(github)](https://github.com/HyunmoAhn/nextjs-docker-example/blob/main/custom-server-with-standalone/package.json)

참고로 Standalone과 Custom Server를 같이 사용하는 가이드는 따로 제공하지 않는 것으로 알고 있다.
Custom Server 문서에서 Standalone을 사용할 때 `next build`에서 생성되는 `server.js`을 사용하지 않아야한다고 이야기 하고 있다.

> When using standalone output mode, it does not trace custom server files. This mode outputs a separate minimal server.js file, instead. These cannot be used together. ([docs](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server#:~:text=When%20using%20standalone%20output%20mode%2C%20it%20does%20not%20trace%20custom%20server%20files.%20This%20mode%20outputs%20a%20separate%20minimal%20server.js%20file%2C%20instead.%20These%20cannot%20be%20used%20together.))

다소 복잡할 수 있지만, 일단 예제를 살펴보자.

Standalone과 Custom Server를 같이 사용할 때 고려해야하는 건 **Custom Server의 server.ts의 번들링**이다.
Standalone은 별도의 `node_modules` 인스톨 없이 next build 결과물을 사용하는게 장점이다. 하지만 Custom server에서 사용하는 module의 결과물은 standalone의 **결과물에 포함되어 있지 않다**.
그러면 custom server의 node_modules를 위해 다시 npm install이 필요하다는 결론에 이르게 된다.

custom server를 위한 package.json을 별도로 관리하진 않으므로, custom server의 node_modules도 install 없이 사용할 방법을 찾아야한다.
내가 접근한 방식은 bundling이다.

기존에 custom server의 접근 방식은 ts를 js로 바꾸어주는 tsc만 사용을 했다고 하면, 이번에는 bundling을 진행하여 별도 `node_modules` 없이 custom server를 실행 할 수 있도록 한다.
예제에서는 `esbuild`를 사용한다. 실제 현업에서는 `webpack`을 사용해도 좋고 `rollup`을 사용 할 수도 있다.

```ts
// scripts/build-server.ts
import { build } from "esbuild";

build({
  entryPoints: ["server/index.ts"],
  outfile: "dist-server/index.js",
  bundle: true,
  platform: "node",
  target: "node22",
  minify: true,
  sourcemap: false,
  external: ["next"],
}).catch(() => process.exit(1));
```
위와 같이 `server/index.ts`를 `dist-server/index.js`로 bundling 하는 스크립트로 custom server에서 어떤 모듈을 사용하더라도 문제가 없게 번들링한다.

이런 과정을 거치면 dockerizing 이후 오류를 만나게 될텐데, 필자의 경우 아래와 같이 module을 찾지 못하는 오류를 만났다.
```shell
node:internal/modules/cjs/loader:1225
  const err = new Error(message);
              ^

Error: Cannot find module './bundle5'
Require stack:
- /app/node_modules/next/dist/compiled/webpack/webpack.js
- /app/node_modules/next/dist/server/config-utils.js
- /app/node_modules/next/dist/server/config.js
- /app/node_modules/next/dist/server/next.js
- /app/index.js
    at Function.<anonymous> (node:internal/modules/cjs/loader:1225:15)
    at /app/node_modules/next/dist/server/require-hook.js:55:36
    at Function._load (node:internal/modules/cjs/loader:1055:27)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:220:24)
    at Module.<anonymous> (node:internal/modules/cjs/loader:1311:12)
    at mod.require (/app/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:136:16)
    at exports.init (/app/node_modules/next/dist/compiled/webpack/webpack.js:40:28)
    at loadWebpackHook (/app/node_modules/next/dist/server/config-utils.js:18:5) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/app/node_modules/next/dist/compiled/webpack/webpack.js',
    '/app/node_modules/next/dist/server/config-utils.js',
    '/app/node_modules/next/dist/server/config.js',
    '/app/node_modules/next/dist/server/next.js',
    '/app/index.js'
  ]
}
```
오류 내용을 분석해보면, `node_modules` 안에 있는 `next`와 같은 모듈을 찾지 못해서 발생하는 오류인데 이를 수정하기 위해 Dockerfile에 `node_modules/next`를 복사해주는 과정이 포함된다.

```dockerfile
FROM node:22.14-alpine
WORKDIR /app

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
COPY dist-server ./
# Copy for fixing `MODULE_NOT_FOUND` error
COPY node_modules/next ./node_modules/next 
 
ENV NODE_ENV=production

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "index.js"]
```

### Install & Build

```shell
npm install
next build
ts-node --project tsconfig.server.json scripts/build-server.ts
```

package의 install을 추가, `next build`를 진행 한 뒤 마지막으로 custom server의 bundling을 진행한다.
이때, `dist-server`의 server 코드는 `node_modules` 없이 단일 파일로 실행 가능한 코드로 번들링 된다.

```
standalone
├── .next
│   ├── standalone
│   └── static
├── dist-server
└── public
```

### Dockerized

```bash
docker build -t custom-server-with-standalone .
```

```dockerfile
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
COPY dist-server ./
# Copy for fixing `MODULE_NOT_FOUND` error
COPY node_modules/next ./node_modules/next 
```

dockerizing 과정에서 standalone과 custom server의 과정과 동일하게, standalone 파일을 복사 한 뒤 `dist-server` 파일 모두 docker 환경에 복사한다.
추가로, 위에 서술했던 `MODULE_NOT_FOUND` 오류를 해결하기 위해 `node_modules/next`를 복사해서 넣어준다.
프로젝트 케이스에 따라 다른 모듈을 추가로 복사해야 할 경우도 있으므로, 상황에 맞게 판단해서 추가해야한다. [(git issue)](https://github.com/vercel/next.js/discussions/34599#discussioncomment-8406070) 

```dockerfile
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "index.js"]
```
이후, custom server를 실행하는 건 동일하다.

### Run

docker build가 완료 되었다면 docker image를 실행시켜 container를 생성한다.
```bash
docker run --rm -it -p 3000:3000 custom-server-with-standalone
```
`localhost:3000`으로 접속하면 Next.js 코드를 확인 할 수 있다.

### Standalone + Custom Server Dockerized Summary

| Index | Process               | Environment | Description                                                                                                      |
|-------|-----------------------|-------------|------------------------------------------------------------------------------------------------------------------|
| 1     | Next Build            | Local       | Production server에서 사용 할 Next build output을 생성합니다. <br/> stadalone 설정은 server 실행에 필요한 모든 코드를 build output에 포함한다. |
| 2     | Custom Server Build   | Local       | Custom Server를 단독으로 실행할 수 있도록 bundling을 포함한 빌드를 진행합니다. <br/> esbuild, webpack, rollup 등 아무 도구든 상관 없습니다.          |
| 3     | Copy                  | Docker      | Local에서 빌드 한 build output 을 docker 내부로 copy 합니다.                                                            |
| 4     | Copy For Fixing Error | Docker      | Custom Server에서 더 필요한 module이 포함되지 않은 경우 node_modules에서 부분적으로 Copy 합니다.                                          |
| 3     | Run node server       | Docker      | `node index.js` 로 custom node server를 실행합니다.                                                                               |

docker 용량은 다음과 같다.
```shell
REPOSITORY                     TAG       IMAGE ID      SIZE
custom-server-with-standalone  latest    061bac5bae79  313MB
```

## Conclusion

이로써 Next.js의 4가지 경우의 dockerizing을 살펴보았다.

- **standalone의 경우** bundle size를 줄이기 위해 next build에 필요한 파일을 포함하게 하는 기법이다. 
- **custom server**는 next.js의 기본 서버 코드를 사용하지 않고 커스텀하면서 server 코드를 별도로 build, bundling하는 방법이다.

표로 정리한다면 다음과 같다.

| 케이스                        | Docker 에서 install | Server code 빌드 | 추가 조치 | 도커 용량 |
|----------------------------|-------------------|----------------|-------|-------|
| Normal Next Build          | ✅                 | ➖              | ➖     | 758MB |
| Standalone                 | ➖                 | ➖              | ➖     | 201MB |
| Custom Server              | ✅                 | ✅              | ➖     | 771MB |
| Standalone + Custom Server | ➖                 | ✅              | ✅     | 313MB |

이 내용을 토대로 각자 프로젝트 상황에 맞는 Next.js 조합을 찾아 dockerizing에 적용하는데 도움이 되면 좋을 것 같습니다.
