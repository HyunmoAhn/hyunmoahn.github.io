---
slug: nextjs-docker-standalone-and-custom-server
title: Next.js with Docker, Standalone, and Custom Server
description: Let's explore Dockerizing Next.js by combining standalone mode and a custom server.
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

I frequently use Next.js projects in a Docker environment. Additionally, I often use both [Standalone](https://nextjs.org/docs/pages/api-reference/config/next-config-js/output#automatically-copying-traced-files) mode and a [Custom Server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server). If you don't fully understand the purpose and operation of these modes, Dockerizing a Next.js application can be challenging. This article serves as a structured guide for that.

## Intro

This article presents four different Dockerizing examples. I have also prepared a [GitHub repository](https://github.com/HyunmoAhn/nextjs-docker-example) with these examples. Feel free to explore them if you want to experiment further.

| Case | Description                 | Standalone | Custom Server |
|------|-----------------------------|------------|---------------|
| 1    | Basic Next.js build and run | ❌        | ❌            |
| 2    | Running in standalone mode  | ✅        | ❌            |
| 3    | Using a custom server       | ❌        | ✅            |
| 4    | Standalone + Custom Server  | ✅        | ✅            |

<!-- truncate -->

## Standalone? Custom Server?

Before diving into Dockerizing Next.js, let's first understand what Standalone mode and Custom Server are and what advantages they bring.

### Standalone

[Standalone](https://nextjs.org/docs/pages/api-reference/config/next-config-js/output#automatically-copying-traced-files) mode is a build setting provided by Next.js.

> Next.js can automatically create a standalone folder that copies only the necessary files for a production deployment, including select files in node_modules.

This means that instead of including the entire `node_modules`, the build extracts only the files needed for production. As a result, the output becomes significantly smaller, reducing Docker image size and improving deployment speed.

Another key difference is that instead of running `next start`, the application is executed using `node index.js`. This change likely aims to streamline execution by reducing Next.js-specific startup scripts. The official [Next.js Docker example](https://github.com/vercel/next.js/blob/canary/examples/with-docker/next.config.js#L3) also adopts standalone mode.

```ts
// next.config.ts
module.exports = {
  output: 'standalone',
}
```

### Custom Server

A [Custom Server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server) allows you to bypass Next.js's built-in server and instead use a traditional Node.js server. While this requires writing additional server code, it offers greater flexibility. For example, you can integrate Express to log request/response data or use `prom-client` to collect metrics.

However, since custom servers operate as separate processes from Next.js builds, you must manage a separate dev server and build script. This complexity extends to Dockerizing as well. Without a clear understanding of its structure and trade-offs, maintaining the project can become difficult. [(docs)](https://github.com/vercel/next.js/blob/canary/examples/custom-server/server.ts)

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



## #1 Basic Next.js Build

Let's start by Dockerizing a basic Next.js build without using standalone mode or a custom server. [(GitHub)](https://github.com/HyunmoAhn/nextjs-docker-example/blob/main/basic/package.json)

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

The Dockerfile is configured as shown above. Let's go through the build and Dockerizing process step by step.

### Install & Build

```shell
npm install
next build
```

First, we install the necessary packages and run `next build`. This process is executed in a local or CI server environment.  
The build output is generated inside the `.next` folder.

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

Next, we proceed with Dockerizing.

```dockerfile
COPY package.json package-lock.json ./

RUN npm install --only=production
```

The Dockerfile executes in order, and an important point to note is that we copy `package.json` and `package-lock.json`, then run `npm install`.

We need to install dependencies in the Docker environment because the `next start` script requires `node_modules`.

```dockerfile
COPY .next ./.next
COPY public ./public
COPY next.config.ts ./
```

Next, we copy the build output from the local (or CI) environment into the Docker container.  
This includes the `.next`, `public`, and `next.config.ts` files.

### Run

Once the Docker build is complete, we can run the container:

```bash
docker run --rm -it -p 3000:3000 basic
```

Navigating to `localhost:3000` will display the Next.js application.

This demonstrates the process of building and running a Next.js project inside a Docker container.

### Normal Next.js Dockerized Summary

| Index | Process         | Environment | Description                                                      |
|-------|----------------|-------------|------------------------------------------------------------------|
| 1     | Next Build      | Local       | Generates the Next.js build output for the production server.   |
| 2     | Package install | Docker      | Installs the necessary packages inside Docker for `next start`. |
| 3     | Copy            | Docker      | Copies the Next.js build output into the Docker container.      |
| 4     | Run next server | Docker      | Starts the Next.js server using `next start`.                   |

Checking the Docker image size:

```bash
REPOSITORY   TAG       IMAGE ID       SIZE
basic        latest    c0e9c49ff35a   758MB
```

---

## #2 Standalone Mode Build

To enable standalone mode, we first modify `next.config.ts`. [(GitHub)](https://github.com/HyunmoAhn/nextjs-docker-example/blob/main/standalone/package.json)

```ts
// next.config.ts
module.exports = {
  output: 'standalone',
}
```

The Dockerfile also differs slightly, so let's review it step by step.

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

The standalone mode build process is the same as a normal Next.js build.  
However, the build output is now generated inside the `.next/standalone` folder.

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

The Dockerizing process is also straightforward.

```dockerfile
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
```

Unlike the normal build, the standalone mode's Dockerizing process only involves copying files.  
Since the build output already contains everything required for execution, there is no need for an additional `npm install` step inside Docker.

### Run

Once the Docker build is complete, we can run the container:

```bash
docker run --rm -it -p 3000:3000 standalone
```

Navigating to `localhost:3000` will display the Next.js application.

### Standalone Dockerized Summary

| Index | Process         | Environment | Description                                                                                                      |
|-------|----------------|-------------|------------------------------------------------------------------------------------------------------------------|
| 1     | Next Build      | Local       | Generates the Next.js build output for the production server. <br/> The standalone mode includes all necessary files. |
| 2     | Copy            | Docker      | Copies the Next.js build output into the Docker container.                                                        |
| 3     | Run next server | Docker      | Starts the Next.js server using `node server.js`.                                                                |

In this standalone process, the npm install step inside Docker is no longer necessary, and the Docker image size is as follows.

```
REPOSITORY   TAG       IMAGE ID       SIZE
standalone   latest    a0c90e9f484c   201MB
```


## #3 Custom Server Build

A custom server involves manually writing the server code instead of relying on Next.js’s built-in server. 
In this approach, the custom server takes control while still utilizing Next.js’s core functionality. [(GitHub)](https://github.com/HyunmoAhn/nextjs-docker-example/blob/main/custom-server/package.json)

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

The key point is that the `server.ts` execution must be managed separately for the development server and the production build.

```json
// package.json
{
  "scripts": {
    "dev": "nodemon",
    "build": "next build && tsc -p tsconfig.server.json"
  }
}
```

The dev server uses `nodemon` for hot-reloading and the build step transpiles `server.ts` after `next build`.

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

The Dockerfile has some differences, so let's go through it step by step.

### Install & Build

```shell
npm install
next build
tsc -p tsconfig.server.json
```

The custom server requires an additional transpiling step for `server.ts`.

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

Just like in a normal Next.js build, we install dependencies inside Docker.

```dockerfile
COPY .next ./.next
COPY public ./public
COPY next.config.ts ./
COPY dist-server ./
```

We then copy the build output into the Docker container, including the transpiled `server.ts`.

```dockerfile
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "index.js"]
```

A key difference is that instead of using `next start`, we run the server with `node index.js`.

### Run

Once the Docker build is complete, we can run the container:

```bash
docker run --rm -it -p 3000:3000 custom-server
```

Navigating to `localhost:3000` will display the Next.js application.

### Custom Server Dockerized Summary

| Index | Process                   | Environment | Description                                                        |
|-------|---------------------------|-------------|--------------------------------------------------------------------|
| 1     | Next & Custom Server Build | Local       | Generates the Next.js build and transpiles the custom server.     |
| 2     | Package install           | Docker      | Installs required dependencies inside Docker.                      |
| 3     | Copy                      | Docker      | Copies the Next.js build and transpiled server into Docker.       |
| 4     | Run node server           | Docker      | Starts the custom server using `node index.js`.                   |

Checking the Docker image size:

```
REPOSITORY   TAG       IMAGE ID       SIZE
custom-server   latest    8ee84abe5896   771MB
```

## #4 Standalone + Custom Server Build

Finally, let's explore the case where both standalone mode and a custom server are used together. [(GitHub)](https://github.com/HyunmoAhn/nextjs-docker-example/blob/main/custom-server-with-standalone/package.json)

There is no official guide for using Standalone mode and a Custom Server together.  
The Next.js documentation states that `server.js` generated during `next build` should **not** be used when standalone mode is enabled.

> When using standalone output mode, it does not trace custom server files. This mode outputs a separate minimal `server.js` file instead. These cannot be used together. ([docs](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server#:~:text=When%20using%20standalone%20output%20mode%2C%20it%20does%20not%20trace%20custom%20server%20files.%20This%20mode%20outputs%20a%20separate%20minimal%20server.js%20file%2C%20instead.%20These%20cannot%20be%20used%20together.))

Although this approach is more complex, let's go through an example.

A key consideration when using Standalone mode and a Custom Server together is **bundling the custom server code**.  
Standalone mode's advantage is that the build output contains everything needed without requiring `node_modules` installation.  
However, this does **not** include dependencies required by the custom server.

Without additional steps, the custom server would require `node_modules`, which negates the purpose of Standalone mode.  
To solve this, we **bundle** the custom server.

Normally, `tsc` is used to transpile TypeScript to JavaScript.  
In this case, however, we use **bundling** to eliminate the need for `node_modules`.  
For this example, I used `esbuild`, but tools like Webpack or Rollup would also work.

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
The script above bundles `server/index.ts` into `dist-server/index.js`, ensuring that the custom server can run without issues regardless of the modules it uses.

However, after Dockerizing, you may encounter errors. In my case, I faced an issue where certain modules could not be found, as shown below.

This script bundles `server/index.ts` into a single file
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

To analyze the error, it occurs because Next.js modules inside `node_modules`, such as `next`, cannot be found.  
To resolve this, we need to modify the Dockerfile to explicitly copy `node_modules/next`.

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

After installing packages, we proceed with `next build`, followed by bundling the custom server.
At this point, the server code inside `dist-server` is bundled into a single file, eliminating the need for `node_modules`.

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

The Dockerizing process is similar to the standalone and custom server cases.  
We copy the standalone build output and all `dist-server` files into the Docker environment.

Additionally, we resolve the `MODULE_NOT_FOUND` error by copying `node_modules/next`.  
Depending on the project, additional modules may need to be copied. [(GitHub Issue)](https://github.com/vercel/next.js/discussions/34599#discussioncomment-8406070)

```dockerfile
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "index.js"]
```

Finally, the custom server is executed the same way as before.

### Run

Once the Docker build is complete, we can run the container:

```bash
docker run --rm -it -p 3000:3000 custom-server-with-standalone
```

Navigating to `localhost:3000` will display the Next.js application.

### Standalone + Custom Server Dockerized Summary

| Index | Process               | Environment | Description                                                                                                      |
|-------|-----------------------|-------------|------------------------------------------------------------------------------------------------------------------|
| 1     | Next Build            | Local       | Generates the Next.js build output for the production server. <br/> Standalone mode includes all required files. |
| 2     | Custom Server Build   | Local       | Bundles the custom server for independent execution. <br/> Any bundler (esbuild, Webpack, Rollup) can be used.  |
| 3     | Copy                  | Docker      | Copies the build output into the Docker container.                                                              |
| 4     | Copy For Fixing Error | Docker      | If additional modules are required for the custom server, they are copied from `node_modules`.                  |
| 5     | Run node server       | Docker      | The custom server is started using `node index.js`.                                                             |

Checking the final Docker image size:

```shell
REPOSITORY                     TAG       IMAGE ID      SIZE
custom-server-with-standalone  latest    061bac5bae79  313MB
```

---

## Conclusion

This article explored four different ways to Dockerize a Next.js project.

- **Standalone mode** reduces the bundle size by including only necessary files in the `next build` output.
- **Custom server** replaces the default Next.js server with a custom-built server that must be separately built and bundled.

### Summary Table:

| Case                         | Install in Docker | Server Code Build | Additional Steps | Docker Size |
|------------------------------|------------------|-------------------|-----------------|-------------|
| Normal Next.js Build         | ✅                | ➖                 | ➖               | 758MB       |
| Standalone                   | ➖                | ➖                 | ➖               | 201MB       |
| Custom Server                | ✅                | ✅                 | ➖               | 771MB       |
| Standalone + Custom Server   | ➖                | ✅                 | ✅               | 313MB       |

Based on these insights, I hope you can choose the best approach for Dockerizing your Next.js project.

