import { useEffect, useState, ReactNode, useCallback } from 'react';
import { TextField } from '@radix-ui/themes';
import {
  LogSection,
  ButtonSet,
  useSaveLocalStorage,
  ExceedLog,
  SavedLog,
  ResizeLog,
  PlayButton,
  getNextData,
  PlainLog,
} from './LocalStorage';
import {
  LOCAL_STORAGE_EXCEED,
  cleanLocalStorageExceed,
  getLocalStorageExceed,
  dataSize,
} from './utils';
import style from './index.module.scss';

export const LocalStorageExceed = ({
  storageKey = LOCAL_STORAGE_EXCEED,
}: {
  storageKey?: string;
}) => {
  const [play, setPlay] = useState(false);
  const [logs, setLogs] = useState<ReactNode[]>([]);
  const storageData = getLocalStorageExceed(storageKey);

  const { size, store, status } = useSaveLocalStorage(storageKey);

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

  useEffect(() => () => cleanLocalStorageExceed(storageKey), []);

  return (
    <div className={style.container}>
      <h3>Fill `{storageKey}` Storage</h3>
      <div className={style.size}>
        <ButtonSet
          isPlay={play}
          onPlay={() => setPlay(!play)}
          onReset={() => cleanLocalStorageExceed(storageKey)}
        />
        <div>Saved Size: {dataSize(storageData)}</div>
      </div>
      <LogSection logs={logs} />
    </div>
  );
};

export const eventDelay = async () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    });
  });
};

export const PerformanceDisplay = () => {
  const [size, setSize] = useState(20000);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<ReactNode[]>([]);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    setLogs((prev) => [...prev, <PlainLog>Start to create data (size: {size})</PlainLog>]);
    await eventDelay();
    const createStart = performance.now();
    const data = getNextData(size);
    const createEnd = performance.now();
    setLogs((prev) => [
      ...prev,
      <PlainLog>Creation Time: {(createEnd - createStart).toFixed(3)} milliseconds</PlainLog>,
    ]);

    const stringifyStart = performance.now();
    const dataString = JSON.stringify(data);
    const stringifyEnd = performance.now();
    setLogs((prev) => [
      ...prev,
      <PlainLog>
        Stringify Time: {(stringifyEnd - stringifyStart).toFixed(3)} milliseconds
      </PlainLog>,
    ]);
    await eventDelay();
    const dataLength = dataSize(dataString);
    setLogs((prev) => [...prev, <PlainLog>Test Data Size: {dataLength}</PlainLog>]);

    const parseStart = performance.now();
    JSON.parse(dataString);
    setLogs((prev) => [
      ...prev,
      <PlainLog>Parsing Time: {(parseEnd - parseStart).toFixed(3)} milliseconds</PlainLog>,
    ]);
    const parseEnd = performance.now();
    await eventDelay();
    setIsLoading(false);
  }, [size]);

  return (
    <div className={style.container}>
      <h3>Performance Display</h3>
      <TextField.Root
        placeholder="Fill the Size"
        type="number"
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
      />
      <div className={style.size}>
        <PlayButton isLoading={isLoading} onPlay={handleClick} />
      </div>
      <LogSection logs={logs} />
    </div>
  );
};
