import { useEffect, useState } from 'react';

export const useAsyncData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setData([1, 2, 3]);
    }, 2000);
  }, []);

  return data;
};
