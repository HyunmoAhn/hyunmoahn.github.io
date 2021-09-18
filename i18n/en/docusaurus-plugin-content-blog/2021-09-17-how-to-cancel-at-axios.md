---
slug: how-to-cancel-at-axios
title: How to cancel at axios
description: The article that how to use cancel logic on axios request.
keywords: 
  - axios
  - javascript
  - HTTP
  - cancel
  - abort
authors:
  name: Hyunmo Ahn
  title: Front End Engineer @ Line Financial+
  url: https://github.com/HyunmoAhn
  image_url: https://github.com/HyunmoAhn.png
tags: [axios, library, how-to-work, javascript, web]
---

## Purpose
[axios](https://github.com/axios/axios) support feature to cancel HTTP Request. 
We will investigate that how to work about axios cancel logic.

:::info Prerequisites
- A rough knowledge about HTTP Request
- The usage about [Axios](https://github.com/axios/axios) library
:::

<!--truncate-->

## Usage
Before to know that how to work about cancel, We will check that how to use axios cancel.

### Simple Usage
```tsx
import axios from 'axios';

// Make CancelToken
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

// Register Cancel
axios
  .get('/url', { cancelToken: source.token })
  .catch((e) => {
    if (axios.isCancel(e)) { /* cancel logic */ }
  })

// Create Cancel
source.cancel('message');
```
If you want to cancel in axios, we need to make `CancelToken`. <br/>
Each time axios is requested, `cancelToken` is injected and the axios is canceled through `source.cancel`.

### Advanced Usage
If we request multiple axios same time, what action would cancel show?
```tsx
import axios from 'axios';

// Make CancelToken
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

// Register Cancel
axios
  .get('/url/first', { cancelToken: source.token })
  .catch((e) => {
    if (e.code === '403') { // session expired 
      source.cancel('session expired');
    } 
  })

// Register Cancel
axios
  .get('/url/second', { cancelToken: source.token })
  .catch((e) => {
    if (axios.isCancel(e)) { /* cancel logic */ }
  })
```
The scenario to be assumed when two axios requests are sent at the same time as above is as follows.
- `/url/first` response is faster than `/url/second` response.
- `/url/first` will get 403 session expired error code.

Then how will the response of `/url/second` be handled?

The answer is that at the time of cancel in `/url/first`, the request for `/url/second` also becomes cancel.

**This article starts with curiosity about how cancel in `/url/first` axios affects `/url/second` axios?** 

:::caution Question
Q1. If cancelToken is canceled in one axios request, why others axios request are also canceled?
:::

## Inner Axios

### What about CancelToken
[axios](https://github.com/axios/axios/blob/v0.21.1/lib/axios.js#L40-L42) has method associated with Cancel.
```tsx
// https://github.com/axios/axios/blob/v0.21.1/lib/axios.js#L40-L42
// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');
```
The preceding work to cancel axios was that create `CancelToken`.
So, We will watch [axios.CancelToken](https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js) first. Because we created token to use `CancelToken.source`. 
```tsx
// https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};
```
`source` is simple. It returns the object that has `token` and `cancel` and creates `CancelToken` internally.

```tsx
// https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js
function CancelToken(executor) {
  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    token.reason = new Cancel(message); // https://github.com/axios/axios/blob/v0.21.1/lib/cancel/Cancel.js
    resolvePromise(token.reason);
  });
}
```
To watch about [CancelToken](https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js), It seems complicated about structure. It has two roles.
1. Creates promise in `CancelToken`. We can't know how to use this promise yet.
2. Assigns `function cancel` to cancel in `CancelToken.source` scope. Through this, cancel is connected to the outside of the scope.

`CancelToken` make two function that promise and cancel function and when `cancel` is called `promise` is resolved. 
`cancel` is expanded to `CancelToken.source` scope by `executor` and it will be method to use outside.

#### Recap about CancelToken
- CancelToken is made by `CancelToken.source`, it will create promise and cancel function.
- The generated `cancel` here is transferred as a `CancelToken.source` return value and used as an external usable function. We can't know the purpose of promise yet.

### Where do use CancelToken.promise?

axios uses `adapter` in HTTP request internally and `adapter` has code that associated with `CancelToken.promise`.

Among them, look at the code on the [xhr](https://github.com/axios/axios/blob/master/lib/adapters/xhr.js) side.

```tsx
// https://github.com/axios/axios/blob/master/lib/adapters/xhr.js#L22-L187
var request = new XMLHttpRequest();

request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
request.onreadystatechange = function handleLoad() {
  // HTTP success logic 
};
request.send(requestData);
```
The basic work is same with logic of [XMLHttpRequest](https://developer.mozilla.org/ko/docs/Web/API/XMLHttpRequest) generally.
It connects url through `request.open`, handles success flow through `onreadystatechange` and sends HTTP requests through `request.send`.
Up to this point, it is the same as the `XMLHttpRequest` in the callback method.

In addition to normal operation, xhr adapter of axios uses cancelToken to use one more promise logic.
```tsx
// https://github.com/axios/axios/blob/master/lib/adapters/xhr.js#L168-L180
if (config.cancelToken) {
  // Handle cancellation
  config.cancelToken.promise.then(function onCanceled(cancel) {
    if (!request) {
      return;
    }

    request.abort();
    reject(cancel);
    // Clean up request
    request = null;
  });
} 
```
`CancelToken.promise` is used here. Every HTTP request uses cancelToken to call a promise.
**In other words, as if using `Promise.race`, it is using logic that handles the first of the two requests of `xhr` and `cancelToken.proimse`.**

If `promise` of cancelToken is resolved, `xhr` request is aborted and `axios` request is end with reject.
In this time, error object is [cancel](https://github.com/axios/axios/blob/v0.21.1/lib/cancel/Cancel.js) Object.

`cancelToken` is injected when axios is called, multiple axios request can use same `cancelToken`. So we can answer the first question we had. 

:::tip Question & Answer
> Q1. If cancelToken is canceled in one axios request, why others axios request are also canceled?

A1. axios receives cancelToken for every HTTP request, it enters a state of race with xhr requests and promise of cancelToken. 
If cancelToken is resolved from another axios request, All axios requests injected with the same cancelToken are terminated with reject because promise is resolved.

In the other words, if cancel occurs in one axios request, the remaining axios requests are also canceled because reject is being performed according to the progress state of cancelToken commonly used
:::

## Recap
axios make race condition by generating not only HTTP requests but also promise associated with cancel. The cancel promise used in this process may be used in several axios requests. <br/>
The promise associated with cancel is created together when creating [cancelToken](https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js) and the `cancelToken` also provides a function called `cancel` that resolves the cancel promise.<br/>
If `cancelToken.cancel` is called, cancel promise is resolved and every axios requests that is using canceled `cancelToken` are aborted and will return reject because cancel promise is associated race condition with HTTP request.

## Appendix
We checked how to process about axios cancel. In the next article, we will look at the questions encountered when using the axios cancel.

### What happens to cancelToken that have already been canceled?
So far, we've learned how to behave when cancelToken is canceled. Then how to work about already canceled `cancelToken`? <br/>
Let's take a look at [CancelToken](https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js) again, which we looked at above.
When the cancel occurs, [Cancel](https://github.com/axios/axios/blob/v0.21.1/lib/cancel/Cancel.js) is assigned in `CancelToken.reason`. This reason is used to determine whether there is a cancel.

```tsx
// https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js
function CancelToken(executor) {
  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    token.reason = new Cancel(message); // https://github.com/axios/axios/blob/v0.21.1/lib/cancel/Cancel.js
    resolvePromise(token.reason);
  });
}
```

CancelToken has another method to check cancel. It is [CancelToken.throwIfRequested](https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js#L36-L40).
```tsx
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};
```
It check it has reason, If it has reason it decide that this is canceled token and throw it.

This `throwIfRequested` is showed several location in axios request. It is presumed that these measures have been taken because cancels may occur in various cases.  

```tsx
// https://github.com/axios/axios/blob/v0.21.1/lib/core/dispatchRequest.js
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  ...

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    ...
  }
}
```
Therefore, once canceled `cancelToken` is implemented to automatically reject upon request from axios.
In order to normalize the axios request again after cancel, 
the `cancelToken` must be abandoned and a new `cancelToken` must be created to call the axios so that the axios request will not stop and make a normal call.

## Reference
- [axios github](https://github.com/axios/axios/tree/v0.21.1)
- [axios cancellation docs](https://axios-http.com/docs/cancellation)
