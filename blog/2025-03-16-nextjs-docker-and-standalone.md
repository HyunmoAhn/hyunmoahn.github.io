---
slug: nextjs-docker-and-standalone
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


## 기본적인 Next.js 빌드

먼저 standalone도 사용하지 않고 custom server도 사용하지 않는 기본적인 Next.js 빌드를 dockerizing 해보자. [(github)](https://github.com/HyunmoAhn/nextjs-docker-example/blob/main/basic/Dockerfile)

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

```bash
npm install
next build
```

먼저 package install 과정과 next build를 실행한다. 이 과정은 local 환경 혹은 CI server 환경에서 실행된다.
빌드 된 결과물은 `.next` 폴더에 생성된다.
```
basic
├── .next # Build output
├── node_modules
├── public
├── next.config.ts
└── package.json
```

### Dockerized

```bash
docker build -t basic .
```
두번째로 dockerizing을 진행한다. Dockerfile을 순서대로 진행하는 것인데, 주목할 점은 `pacakge.json`을 복사하고 `npm install`을 실행하는 부분이다.
docker 환경에서도 npm install을 하는건 docker 실행시 사용하는 스크립트가 `next start` 스크립트이며, 이를 위해 `node_modules` 코드들이 필요한 것이다.

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


## Standalone 모드로 실행

standalone 모드는 next.config.ts를 먼저 수정한다.

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

