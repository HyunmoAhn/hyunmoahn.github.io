import { useCallback, useEffect } from 'react';
import { useCallbackRef } from './useCallbackRef';
import { useAsyncData } from './useAsyncData';

export default function App() {
  const data = useAsyncData();
  const handleCallback = useCallback(() => {
    if (data.length !== 0) {
      console.log(`handle callback: ${data}`);
    }
  }, [data]);

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
  const handleCallback = useCallbackRef(onCallback);

  useEffect(() => {
    handleCallback();
  }, [handleCallback]);

  return <>Child</>;
};
