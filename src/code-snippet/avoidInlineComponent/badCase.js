import { useEffect, useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCount(count + 1);
      console.log('update count: ', count + 1);
    }, 5000);
  }, [count]);

  return (
    <List count={count}>
      <img src="https://picsum.photos/200/200" />
    </List>
  );
}

export const List = ({ count, children }) => {
  const Border = () => {
    return <div>{children}</div>;
  };

  return (
    <ul>
      <p>count: {count}</p>
      <Border>{children}</Border>
    </ul>
  );
};
