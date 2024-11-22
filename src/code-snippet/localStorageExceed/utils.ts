export const LOCAL_STORAGE_EXCEED = 'LOCAL_STORAGE_EXCEED';
export const getLocalStorageExceed = (key: string) => {
  try {
    return localStorage.getItem(key) || '';
  } catch (error) {
    return '';
  }
};

export const setLocalStorageExceed = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const cleanLocalStorageExceed = (key: string) => {
  localStorage.removeItem(key);
};

const KB_SIZE = 1024;
const MB_SIZE = 1024 * KB_SIZE;

export const getDataSize = (key: string) => {
  const data = getLocalStorageExceed(key);

  dataSize(data);
};

export const dataSize = (data: string) => {
  const byte = data?.length || 0;

  if (MB_SIZE < byte) {
    return `${(byte / MB_SIZE).toFixed(2)} MB`;
  }

  if (KB_SIZE < byte) {
    return `${(byte / KB_SIZE).toFixed(2)} KB`;
  }

  return `${byte.toFixed(2)} bytes`;
};
