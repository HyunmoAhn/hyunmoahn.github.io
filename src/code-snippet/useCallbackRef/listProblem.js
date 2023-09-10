import { useCallback, useEffect } from 'react';
import { useAsyncData } from './useAsyncData';

export default function App() {
  const list = ['Hello', 'World'];
  const data = useAsyncData();
  const handleCallback = useCallback((index) => {
    console.log(`handle callback: ${index}`);
  }, []);

  return (
    <>
      {list.map((item, index) => (
        <ChildComponent key={index} onCallback={() => handleCallback(index)} />
      ))}
      {data.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </>
  );
}

const ChildComponent = ({ onCallback }) => {
  useEffect(() => {
    onCallback();
  }, [onCallback]);

  return <>Child</>;
};
