---
slug: avoid-inline-component
title: inline component를 피해야 하는 이유
description: React에서 inline component를 사용하는 것을 피해야 하는 이유에 대해서 설명한다.
keywords:
  - react
  - inline component
  - component
  - re-render
  - web
authors: HyunmoAhn
tags: [react, web, inline-component, re-render]
---

## Introduction

프로젝트를 진행하면서 불필요하게 re-render가 발생하는 문제를 만났다.

단순히 render를 하는 것 뿐 아니라 매 render시마다 DOM을 새롭게 다시 그리고 있던 것이 문제였는데, 
원인은 inline component로 사용한 코드였다.

따라서 이 글에서는 inline component를 사용하는 것을 피해야 하는 이유를 설명하고자 한다.

## Cheat Sheet

```tsx
// error-next-line
// Bad
const List = ({ hasWrapper, borderStyle, children }) => {
  // highlight-start
  const Border = () => {
    return <p style={borderStyle}>{children}</p>;
  }
  // highlight-end
  
  if (hasWrapper) {
    return (
      <Wrapper>
        <Border />
      </Wrapper>
    );
  }
  
  return <Border/>;
};
```

```tsx
// good-next-line
// Good
const List = ({ hasWrapper, borderStyle, children }) => {
  if (hasWrapper) {
    return (
      <Wrapper>
        // highlight-start
        <Border borderStyle={borderStyle}>
          {children}
        </Border>
        // highlight-end
      </Wrapper>
    );
  }

  return (
    // highlight-start
    <Border borderStyle={borderStyle}>
      {children}
    </Border>
    // highlight-end
  );
};

// highlight-start
const Border = ({ borderStyle, children }) => {
  return <p style={borderStyle}>{children}</p>;
}
// highlight-end

```

위와 같이 `Border`의 코드를 재사용하고, `List`의 props를 재사용하기 위해 inline component를 사용하게 될 수 있다.
하지만 이런 경우 children은 불필요하게 매 render시마다 새롭게 DOM이 그려지게 된다.

<!--truncate-->
