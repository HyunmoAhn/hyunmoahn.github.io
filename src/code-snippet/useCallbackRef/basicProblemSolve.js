import { useEffect, useCallback } from 'react';
import { useAsyncData } from './useAsyncData';

export default function App() {
  const data = useAsyncData();
  const handleCallback = useCallback(() => {
    console.log(`handle callback: ${new Date().toISOString()}`);
  }, []);

  return (
    <>
      {data.map((item) => (
        <li key={item}>{item}</li>
      ))}
      <ChildComponent onCallback={handleCallback} />
    </>
  );
}

const ChildComponent = ({ onCallback }) => {
  useEffect(() => {
    onCallback();
  }, [onCallback]);

  return <>Child</>;
};
