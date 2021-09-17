---
slug: how-to-cancel-at-axios
title: How to cancel at axios
authors:
  name: Hyunmo Ahn
  title: Front End Engineer @ Line Financial+
  url: https://github.com/HyunmoAhn
  image_url: https://github.com/HyunmoAhn.png
tags: [axios, library, how-to-work, javascript, web]
---

## Purpose
[axios](https://github.com/axios/axios) 에서는 HTTP Request를 cancel하는 기능을 제공한다. 이 cancel 기능이 어떤 로직으로 동작하는지 알아본다.

:::info Prerequisites
- HTTP 요청에 대한 대략적인 지식
- [Axios](https://github.com/axios/axios) 라이브러리에 대한 사용방법
:::


## Usage
Cancel이 어떻게 동작하는지 알아보기 이전에, axios에서 cancel을 어떻게 사용하라고 가이드하고 있는지 알아본다.

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

axios에서 cancel을 하고자한다면, 먼저 `CancelToken`을 만들어야한다. <br />
매 axios 호출시마다 cancelToken을 전달하게 되고, `source.cancel` 을 통해서 axios를 cancel하는 것이다.

### Advanced Usage
여러 axios요청을 동시에 보낸다면 cancel은 어떤 동작을 보여줄까?
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
위와 같이 axios 요청 2개를 동시에 보냈을 때 가정할 시나리오는 다음과 같다. 
- `/url/first`의 응답이 `/url/second`의 응답보다 빠르게 도달했다.
- `/url/first`은 403 세션 만료 에러를 받았다.

그렇다면 `/url/second`의 응답은 어떻게 처리가 될까?

정답은 `/url/first` 에서 cancel한 시점에 `/url/second` 요청도 cancel이 된다는 점이다. `/url/first` 요청과 `/url/second` 요청이 서로 다른 스코프에 있더라도 마찬가지이다. 

**`/url/first`에서 cancel 한 것이 어떻게 `/url/second`에도 영향을 끼치고 있을까에 대한 호기심에 이 글은 출발한다.**

:::caution Question
Q1. 하나의 axios요청에서 cancelToken이 cancel되었는데 어떻게 다른 axios request가 같이 취소가 될까?
:::

## Inner Axios

### What about CancelToken
[axios](https://github.com/axios/axios/blob/v0.21.1/lib/axios.js#L40-L42)에는 Cancel과 관련된 메소드가 붙어있다.
```tsx
// https://github.com/axios/axios/blob/v0.21.1/lib/axios.js#L40-L42
// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');
```
axios cancel을 위해서 선행되었던 작업은 CancelToken을 만드는 것 이었다. 따라서 [axios.CancelToken](https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js) 을 먼저 살펴본다. `CancelToken.source`를 사용해서 토큰을 생성했으므로, 해당 함수 동작부터 확인해본다. 
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
source는 단순하다. token과 cancel을 가지고 있는 객체를 반환하며, 내부에서 CancelToken을 생성한다.

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
[CancelToken](https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js) 생성에 대해서 보면 조금 구조가 복잡해보이지만, 하는 역할은 2가지이다.
1. `CancelToken`에 promise를 생성한다. 이 promise가 어떻게 쓰이는지는 아직 알 수 없다.
2. `CancelToken.source` 스코프에 있는 cancel에 `function cancel`을 할당한다. 이를 통해서 cancel이 스코프 외부와 연결이 된다.

CancelToken은 promise와 cancel 함수 2가지를 만들며, cancel을 호출했을때 promise가 resolve되는 로직을 갖고있다. cancel은 `executor`를 통해서 `CancelToken.source` 스코프로 확장되고 이는 외부에서 사용할 수 있는 메소드가 된다. 

#### Recap about CancelToken
- CancelToken은 `CancelToken.source`를 통해서 생성되며, promise와 cancel 함수를 각각 생성한다.
- 여기서 생성된 `cancel`은 `CancelToken.source` 리턴 값으로 전달되어 외부에서 사용가능한 함수로 사용되며, promise의 용도는 아직 알 수 없다.

### Where do use CancelToken.promise?

axios는 내부적으로 HTTP 요청에 adapter를 사용하고 adapter안에 이와 관련된 코드가 들어있다.
그 중에 [xhr](https://github.com/axios/axios/blob/master/lib/adapters/xhr.js)쪽 코드를 본다.

```tsx
// https://github.com/axios/axios/blob/master/lib/adapters/xhr.js#L22-L187
var request = new XMLHttpRequest();

request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
request.onreadystatechange = function handleLoad() {
  // HTTP success logic 
};
request.send(requestData);
```
기본 동작은 일반적으로 [XMLHttpRequest](https://developer.mozilla.org/ko/docs/Web/API/XMLHttpRequest)를 사용하는 방법과 동일하다. `request.open`을 통해서 url을 연결하고, `onreadystatechange`를 통해서 성공에 대해서 핸들링을 하고, `request.send`를 통해서 HTTP 요청을 보낸다.
여기까지는 콜백 방식의 XMLHttpRequest와 동일하다.

일반 동작 이외에도 axios의 xhr adapter에서는 cancelToken을 이용해서 promise 로직을 하나 더 사용한다.
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
`CancelToken.promise`은 여기서 사용한다. 매 HTTP 요청마다 cancelToken을 이용해서 promise를 호출하고 있다. **즉, 마치 `Promise.race`를 사용하는 것 처럼 `xhr`요청 응답과 `cancelToken.promise`의 두가지 중 먼저 오는 것을 처리하는 로직**을 사용하고 있는 것이다.

cancelToken의 promise가 resolve되면 xhr request는 abort되고 axios request는 reject로 종료되게된다. 이때 에러객체는 [cancel](https://github.com/axios/axios/blob/v0.21.1/lib/cancel/Cancel.js)객체가 전달된다.

cancelToken은 axios request때 주입을 받고, 여러 axios request가 동일한 cancelToken을 사용한다. 따라서 우리는 처음 가졌던 질문에 대답을 할 수 있다.

:::tip Question & Answer
> Q1. 하나의 axios요청에서 cancelToken이 cancel되었는데 어떻게 다른 axios request가 같이 취소가 될까?

A1. axios는 HTTP 요청마다 cancelToken을 받고, cancelToken의 promise를 통해서 xhr 요청과 race(경쟁)상태에 들어간다. 
다른 axios 요청에서 cancelToken이 resolve 되었다면 동일한 cancelToken을 주입받은 모든 axios 요청은 promise가 resolve되어 reject로 종료된다.

즉, 공통으로 사용하고 있는 cancelToken의 promise 상태에 따라 reject를 진행하고 있기 때문에 하나의 axios 요청에서 cancel이 발생하면, 나머지 axios 요청도 함께 cancel이 발생되게 되는 것이다.
:::

## Recap
axios는 호출시 HTTP요청 뿐 아니라 cancel과 관련되어 있는 promise를 발생시켜 경쟁상태를 형성한다. 이 과정에서 사용되는 cancel promise는 여러 axios 요청에서 사용 될 수 있다. <br/>
canel과 관련된 promise는 [cancelToken](https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js)을 만들 때 같이 생성되며 cancelToken에는 cancel promise를 resolve 시키는 함수 `cancel`도 같이 제공한다.<br/>
`cancelToken.cancel`이 호출되면 cancel promise는 resolve되고 이는 HTTP 요청과 경쟁상태를 형성하고 있기 때문에 cancel된 `cancelToken`을 사용하고 있는 모든 axios 요청은 abort되고 reject로 반환된다.

## Appendix
axios가 cancel을 어떻게 처리하는지에 대해서 알아보았다. 이후 글에서는 axios cancel을 사용했을때 만나게 되는 궁금증에 대해서 살펴볼 것이다. 

### What happens to cancelToken that have already been canceled?
이제껏 cancelToken을 cancel했을 때 어떻게 동작하는지에 대해서 알아보았다. 그렇다면 이미 cancel된 cancelToken은 어떻게 동작할까? <br/>
위에서도 살펴보았던 [CancelToken](https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js)을 다시 살펴보자.
cancel이 발생했을 때, `CancelToken.reason`에는 [Cancel](https://github.com/axios/axios/blob/v0.21.1/lib/cancel/Cancel.js) 객체가 할당된다. 이 reason이 cancel 여부를 판단하는데 이용된다.

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

CancelToken에는 cancel되었는지를 판단하는 다른 메소드가 있다. [CancelToken.throwIfRequested](https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js#L36-L40)가 바로 그 역할을 한다.
```tsx
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};
```
reason이 있는지 여부를 판단하고, reason이 있으면 이미 cancel된 token이라 판단하고 reason을 throw한다.

이 `throwIfRequested`는 axios request의 여러 군데에서 발견된다. 아마 다양한 케이스에서 cancel이 발생할 수 있기 때문에 이러한 조치들이 취해진 것으로 추정된다.

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

따라서 한번 cancel된 cancelToken은 axios요청시 자동으로 reject로 빠지도록 구현되어있다. 
cancel 이후 다시 axios 요청을 정상화시키기 위해서는 cancel된 CancelToken을 버리고, 새롭게 CancelToken을 생성해서 axios를 호출해야 axios 요청이 중단 되지 않고 정상 호출을 할 것이다. 

## Reference
- [axios github](https://github.com/axios/axios/tree/v0.21.1)
- [axios cancellation docs](https://axios-http.com/docs/cancellation)
