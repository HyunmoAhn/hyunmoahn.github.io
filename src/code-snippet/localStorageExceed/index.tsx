import { useEffect, useState, ReactNode } from 'react';
import {
  LogSection,
  ButtonSet,
  useSaveLocalStorage,
  ExceedLog,
  SavedLog,
  ResizeLog,
} from './LocalStorage';
import {
  LOCAL_STORAGE_EXCEED,
  cleanLocalStorageExceed,
  getLocalStorageExceed,
  dataSize,
} from './utils';
import style from './index.module.scss';

export const LocalStorageExceed = () => {
  const [play, setPlay] = useState(false);
  const [logs, setLogs] = useState<ReactNode[]>([]);
  const storageData = getLocalStorageExceed(LOCAL_STORAGE_EXCEED);

  const { size, store, status } = useSaveLocalStorage(LOCAL_STORAGE_EXCEED);

  useEffect(() => {
    if (play) {
      const tick = setTimeout(() => {
        const result = store();

        if (result) {
          setLogs((prev) => [
            ...prev,
            <SavedLog data={result.data} size={result.size} time={+new Date()} />,
          ]);
        }
      }, 300);

      return () => clearTimeout(tick);
    }

    return () => {};
  }, [logs, play, store, setLogs]);

  useEffect(() => {
    if (status === 'exceed' && play) {
      setPlay(false);
      setLogs((prev) => [...prev, <ExceedLog />]);
      return;
    }

    if (status === 'resize') {
      setLogs((prev) => [...prev, <ResizeLog size={size} />]);
    }
  }, [play, size, status]);

  useEffect(() => () => cleanLocalStorageExceed(LOCAL_STORAGE_EXCEED), []);

  return (
    <div className={style.container}>
      <h3>Fill `{LOCAL_STORAGE_EXCEED}` Storage</h3>
      <div className={style.size}>
        <ButtonSet
          isPlay={play}
          onPlay={() => setPlay(!play)}
          onReset={() => cleanLocalStorageExceed(LOCAL_STORAGE_EXCEED)}
        />
        <div>Saved Size: {dataSize(storageData)}</div>
      </div>
      <LogSection logs={logs} />
    </div>
  );
};
