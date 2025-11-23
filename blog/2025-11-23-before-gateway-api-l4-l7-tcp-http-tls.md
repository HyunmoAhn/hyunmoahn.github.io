---
slug: before-gateway-api-l4-l7-tcp-http-tls
title: Gateway API 적용 전 – L4/L7, TCP/HTTP and TLS Termination을 이해하기
description: Ingress에서 Gateway API로 넘어가기 전, 이해가 필요했던 L4/L7, TCP/HTTP 그리고 TLS 종료
keywords:
  - k8s
  - LB
  - gatewayAPI
  - L4
  - L7
  - OSI 7 Layer
  - TCP
  - HTTP
  - TLS
authors: HyunmoAhn
tags: [k8s, LB, gatewayAPI, L4, L7, OSI 7 Layer, TCP, HTTP, TLS, web, blog]
---

## 동기

이 글은 명확한 주제를 가지고 작성하는 것은 아니다. 

Web Server를 운영하는데 [K8S(Kubernetes)](https://kubernetes.io/)로, [ingress nginx controller](https://github.com/kubernetes/ingress-nginx)를 사용하고 있다.
하지만, 26년 3월까지 [maintenance 종료](https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/)가 예정되어 있어 다음 방법으로 [Gateway API](https://gateway-api.sigs.k8s.io/)를 고민하고 있다.

Gateway API를 고민하며 평소에는 대소롭지 않게 여겼던 네트워크 지식을 몇 개 채우려고 정리한 글이다.

이 글을 보는 여러분들의 지식 욕구를 충족 시켜 줄지는 모르겠지만, 아래 문단의 "질문"이 궁금하다면 글을 계속 읽어보면 좋을지도 모른다.
전문적인 내용은 아니지만, 독자의 흥미를 유발하는 정도의 자극을 주었으면 좋겠다. 

## 질문

Q. LB(Load Balancer)를 사용하는데 L4 LB, L7 LB라는 용어가 자주 보인다. 이 두 가지의 차이는 무엇일까?

Q. Gateway API에서는 HTTP 연결과 TCP 연결을 구분해서 사용한다. 이 차이는 구체적으로 무엇일까?

Q. Gateway API의 [TLS 개념](https://gateway-api.sigs.k8s.io/guides/tls/)을 보게 되면 TLS Mode "Passthrough", "Terminate" 같은 용어가 나온다.
이것들은 어떤 개념일까?



<!-- truncate -->
## Gateway API?
[Gateway API](https://kubernetes.io/docs/concepts/services-networking/gateway/)는 K8S에서 ingress를 대체 할 수 있는 새로운 개념으로 등장하였다.
 단일 파일로 모든 설정을 커버하는 Ingress와는 다르게 Role 기반으로 Gateway API 리소스를 나누기도 하고, HTTP 뿐 아니라 TCP, GRPC 등 여러 프로토콜을 지원하고, 
헤더 변경, 트래픽 분류, 트래픽 미러링 등 다양한 기능들을 제공해주기도 한다.

글을 쓰는 현재 1.4.0 까지 공식 릴리즈가 되어있다. 

| Version                                                             | Release Date |
|---------------------------------------------------------------------|--------------|
| [1.4.0](https://kubernetes.io/blog/2025/11/06/gateway-api-v1-4/)    | 2025.10.06   |
| [1.3.0](https://kubernetes.io/blog/2025/06/02/gateway-api-v1-3/)    | 2025.04.24   |


## L4? L7?

실제 서비스를 운영하면서 로드밸런싱이 필요하다. 그런데 LB(Load Balancer)를 선택하는데 L4 LB, L7 LB와 같은 선택지가 존재하게 된다.
이 두가지 차이는 어떻게 발생을 할까? 이를 알기 위해서는 한번쯤은 들어봤을 법한 [OSI 7 계층](https://en.wikipedia.org/wiki/OSI_model)이 등장한다.

### OSI 7 Layer

```mermaid
flowchart TD

Application["L7 - Application Layer"] 
--> Presentation["L6 - Presentation Layer"]
--> Session["L5 - Session Layer"]
--> Transport["L4 - Transport Layer"]
--> Network["L3 - Network Layer"]
--> DataLink["L2 - Data Link Layer"]
--> Physical["L1 - Physical Layer"]
```

간략하게 짚고 넘어가면, 다음과 같다.
- L7 - Application: 사용자의 정보를 다루는 레이어(HTTP) 
- L6 - Presentation: L7에서 사용할 데이터를 준비하는 레이어
- L5 - Session: 통신의 수신과 송신을 연결하는 레이어
- L4 - Transport: 통신을 전달하는 레이어 (TCP)
- L3 - Network: 서로 다른 네트워크 간 전송을 담당하는 레이어
- L2 - Data Link: 같은 네트워크 간 전송을 담당하는 레이어
- L1 - Physical: 전기 신호가 실제로 이동하는 레이어

여기서 주로 하드웨어 장비와 가까운 L1, L2, L3는 제외하고, 경계와 구분이 애매모호한 L5, L6를 제외하고 우리가 집중 할 것은
L4와 L7이다.

- **L4 Transport**
   - 데이터를 전송하는 레이어.
   - TCP, UDP가 이쪽 계층.
   - TCP는 연결 지향(connection-oriented) 프로토콜로, 3-way handshake를 통해 연결을 수립하고 상태를 유지한다.
- **L7 Application**
   - 실제 데이터를 다루는 레이어.
   - HTTP 계층
   - 메세지(header, body)를 다룬다.

### 그래서, L4 LB? L7 LB?

LB에서 말하는 L4와 L7은 바로 OSI 7계층의 Layer를 의미한다.
**L4 LB**는 IP 주소와 Port 정보(Transport Layer)만을 확인하여 트래픽을 분산한다.
반대로 **L7 LB**는 HTTP 헤더, URL 경로, 쿠키 등 애플리케이션 계층의 정보까지 분석하여 더 세밀한 트래픽 제어가 가능하다.

LB가 어떤 계층의 정보를 분석하는지에 따라 L4와 L7을 구분할 수 있다.

### LB의 동작 모드

LB의 동작 모드는 별개의 개념으로 **DSR(Direct Server Return)** 과 **Proxy/NAT** 모드로 나뉜다.

**DSR(Direct Server Return) 모드**는 요청은 LB를 거치지만, 응답은 서버가 클라이언트에게 직접 전달한다.
```shell
# Request
Client -- TCP --> LB(DSR) -- TCP(src: client, dst: server) --> Server

# Response
Response: Server -- TCP(src: server, dst: client) --> Client (LB를 거치지 않음)
```

**Proxy/NAT 모드**는 LB가 클라이언트와 서버 사이에서 모든 트래픽을 중개한다.
```shell
# Request
Client -- TCP(src: client, dst: LB) --> LB(Proxy) -- TCP(src: LB, dst: server) --> Server

# Response
Server -- TCP(src: server, dst: LB) --> LB(Proxy) -- TCP(src: LB, dst: client) --> Client
```

일반적으로 L4 LB는 DSR 모드를, L7 LB는 Proxy 모드를 사용하는 경우가 많다.
L7 LB는 HTTP 메세지를 분석해야 하므로 반드시 Proxy 모드로 동작해야 하며,
L4 LB는 두 모드 모두 사용 가능하지만 성능상 이점으로 DSR 모드를 선호한다.


L4, L7의 차이와 주요 동작 모드를 정리하면 다음과 같다.

| 특징                  | L4 LB                    | L7 LB |
|---------------------|--------------------------|-------|
| 분석 계층               | IP, Port (Transport)     | HTTP 헤더, 경로 (Application) |
| 애플리케이션 메세지 확인      | ❌                        | ✅     |
| 주로 사용하는 모드          | DSR 또는 Proxy/NAT        | Proxy |
| DSR 모드 시 응답 경로     | Server → Client 직접      | 사용 불가 |
| Proxy 모드 시 TCP 연결   | Client-LB, LB-Server     | Client-LB, LB-Server |

특징들을 해석하면 다음과 같다.
- **L7 LB**는 HTTP 메세지를 확인할 수 있기 때문에 URL 경로별 라우팅, 헤더 기반 분기, 쿠키 기반 세션 유지 등 다양한 전략을 사용할 수 있다.
- **L4 LB (DSR 모드)** 는 메세지 확인은 불가능하지만, 응답 트래픽이 LB를 거치지 않고 서버에서 클라이언트로 직접 전달되어 LB의 네트워크 부하가 크게 줄어드는 성능상 이점이 있다. 일반적으로 응답 데이터가 요청보다 훨씬 크기 때문에 이 효과가 크다.  

이런 특징들을 본인의 애플리케이션에는 어떤 종류가 맞는지에 따라 결정할 수 있다.

## TCP? HTTP?

TCP는 L4 - Transport Layer로 데이터 전송에 관심을 가진다. 
반면 HTTP는 L7 - Application Layer로 메세지, 데이터의 내용에 관심을 가지는 레이어이다.

TCP의 역할은 데이터를 전송하는 것이며, 데이터를 한 번에 전송하면 속도가 늦어지거나 안정성이 떨어지기 때문에
여러 패킷으로 나누어 잘게 쪼개서 전달한다.
여러 개로 나뉜 패킷들의 올바른 전송을 위해 패킷들의 순서 정렬, 에러 제어 등 역할을 한다.
또한, 3 way handshake로 연결을 수립하고 4 way close로 연결을 종료하는 등 연결 및 전송을 수행한다.

HTTP의 역할은 메세지이다. 데이터에 의미를 부여하고 해석하고 사용하기 때문에 Header, Body와 같은 규칙을 가지고 있다.

**HTTP는 TCP 위에서 동작하는 프로토콜이다.**
- TCP: 연결 수립 및 데이터 전송 보장
- HTTP: TCP 연결 위에서 메시지 형식과 의미 정의

HTTP 1.1의 keep-alive나 HTTP 2의 multiplexing은 하나의 TCP 연결을 재사용하여 여러 HTTP 요청을 처리하는 기술이다.
TCP 연결 자체는 TCP가 관리하지만, 언제 연결을 유지하고 종료할지는 HTTP(Application 계층)에서 결정한다.

> The resulting protocol is more friendly to the network because fewer TCP connections can be
used in comparison to HTTP/1.x. - [HTTP/2 RFC](https://www.rfc-editor.org/rfc/rfc9113.pdf)

TCP와 HTTP의 역할에서도 L4와 L7의 차이가 드러난다.
L4는 데이터의 전송에 역할을 두기 때문에 TCP에 그런 역할이 녹아들었고, L7는 데이터의 사용에 역할을 두기 때문에 여러 의미 있는 정보들을 전달한다.

## TLS termination?
Gateway API는 [TLS](https://gateway-api.sigs.k8s.io/guides/tls/) 내용도 가이드 하고 있다.
해당 문서에서의 의도는 Gateway가 Client와 Server 사이에서 트래픽을 중개하는 여러가지 시나리오가 있고, 
그 시나리오에 따라 TLS를 복호화하고 암호화하는 경우가 달라진다.

예를 들어서 아래와 같이 Client가 암호화 된 TLS 패킷을 Gateway에서 전달 했을 때, 복호화를 하지 않는다면 내부 path나 header를 볼 수 없다.
```mermaid
flowchart LR
    Clinet --TLS Packet --> Gateway(Passthrough) -- TLS Packet  --> Server
```
이런 모드를 TLS Passthrough라고 한다. TLS 요청을 복호화 하지 않고 Server로 그대로 전달하기 때문에 Gateway는 Request의 정보를 볼 수 없다.

만약, 아래와 같이 Gateway에서 Server로 복호화 된 데이터를 전달한다면 어떻게 될까? 
```mermaid
flowchart LR
    Clinet --TLS Packet --> Gateway(Terminate) -- Decrypted Packet  --> Server
```
Gateway가 TLS 복호화를 진행하고, Gateway는 복호화 된 데이터를 열람 할 수 있다. 이로써 Request의 path, header와 같은 정보를 보고
Server로의 경로를 바꾸거나, 여러가지 로직을 넣을 수 있게 된다.
복호화 된 데이터는 그대로 Server로 전달하게 되어 Server에서도 복호화 된 데이터를 그대로 받는다.
이러한 방식이 TLS terminate이다. 중간 Gateway에서 TLS를 종료시켜서 Gateway도 메세지를 사용하고, Server도 메세지를 그대로 사용할 수 있다.  

Gateway가 메세지를 확인해야 하는데, Gateway와 Server와의 통신도 암호화를 해야 한다면 어떤 구조가 가능할까?
```mermaid
flowchart LR
    Clinet --TLS Packet --> Gateway(Decrypt & Encrypt) -- TLS Packet  --> Server
```
위와 같이 Gateway에서 Decrypt를 진행하여 TLS Request 정보를 확인하고, Server로 보내기 전 TLS Encrypt를 다시 진행하는 것이다.
그렇게 되면 Gateway는 메세지를 확인 할 수 있으면서, Server로 암호화 된 데이터를 보낼 수 있다. 단, Request를 다시 암호화 하기 위해 
Gateway는 TLS 인증서를 가지고 있어야 할 것이다.


## Conclusion
이 글에서 OSI 7계층 중 L4 - Transport 계층, L7 - Application 계층을 알아보았고, TCP와 HTTP도 간략하게 알아보았다.
또한, L4 LB / L7 LB의 DSR 모드와 Proxy 모드, TLS termination과 관련 된 내용도 확인했다.

각각의 개념을 따로 보았지만, 이는 한가지로 연결되는 개념일 수 있다.

시나리오를 가정하여, Client의 요청이 LB에서 메세지의 분석 없이 Server로의 전달만 목표로 한다면 어떤 아키텍처를 사용하는 게 좋을까?

메세지의 분석이 필요 없다면 LB는 L4 Layer 역할만 하면 되므로 L4 LB를 선택할 가능성이 높다. 그렇다면 자연스럽게 L4 LB DSR 모드를 사용하여
Server에서는 응답을 Client로 직접 내려준다.

TLS는 어떻게 될까? TLS를 확인할 필요가 없으므로 LB에서는 Passthrough를 선택할 수도 있고, 인증서 관리를 Server가 아닌 LB로 위임하기 위해
TLS Terminate 전략을 사용할 수도 있다.

전략을 정리하면 아래와 같다.
- L4 LB 사용
  - DSR 모드
  - 요청: Client → LB → Server (TCP 정보 유지)
  - 응답: Server → Client 직접 (LB 우회)
- TLS Passthrough 사용
  - LB에서 요청의 메세지를 확인 할 필요가 없으므로 TLS와 무관하게 데이터를 전달한다.

- TCP
```mermaid
flowchart LR
    Client -- "요청: TCP" --> LB("L4 LB - DSR")  -- "요청: TCP (src: Client, dst: Server)" --> Server
    Server -- "응답: TCP (LB 우회)" --> Client
```

- TLS
```mermaid
flowchart LR
  Client2["Client"] -- TLS --> LB2("L4 LB - Passthrough") -- TLS --> Server2["Server"]
```
<br/>
만약 LB에서 메세지를 보고 path 별, Request header별 데이터를 분기해서 전달하는 조건이라면 어떻게 될까?
LB에서 메세지를 보고 분기를 해야 하므로 L7 LB를 사용해야 한다. 그러면 LB는 Proxy 모드로 LB는 Client와 Server와 각각 TCP 연결을 수립한다.
TLS는 어떻게 될까? 암호화 된 정보를 확인할 수는 없으므로 LB에서 복호화를 해야 하고, 이후 Server로
암호화 된 요청이 가야 하는지에 따라 TLS Termination으로 일반 패킷을 보낼지, TLS Re-encrypt를 통해 다시 패킷을 암호화할지 결정한다.

- L7 LB 사용
  - proxy 모드
  - TCP는 LB에서 Client와 Server에 각각 연결하게 됨.
  - Server는 응답을 LB를 거쳐 LB가 Client로 응답을 전달함.
- TLS Terminate 사용
  - LB에서 요청의 메세지를 확인해야 하므로 TLS를 복호화해서 확인하고, Server로 일반 패킷을 전달한다.

- TCP
```mermaid
flowchart LR
   Client -- TCP (src: Client, dst: LB)--> LB("L7 LB - proxy")  -- TCP (src: LB, dst: Server) --> Server
   Server -- 응답 --> LB -- 응답 --> Client
```

- TLS
```mermaid
flowchart LR
  Client2["Client"] -- TLS --> LB2("L7 LB - Terminate") -- HTTP --> Server2["Server"]
```



## Reference
- [L4 Layer LB and L7 Layer LB](https://www.a10networks.com/glossary/how-do-layer-4-and-layer-7-load-balancing-differ)
