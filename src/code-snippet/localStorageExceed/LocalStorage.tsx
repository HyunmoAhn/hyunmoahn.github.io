import cx from 'classnames';
import { Pause, Play, Trash2 } from 'lucide-react';
import { IconButton, Badge } from '@radix-ui/themes';
import { ReactNode, useState, useCallback } from 'react';
import { v4 } from 'uuid';
import style from './LocalStorage.module.scss';
import { setLocalStorageExceed, dataSize } from './utils';

export const LogSection = ({ logs }: { logs: ReactNode[] }) => {
  const displayLogs = [...logs].slice(-10);
  return (
    <div className={style.logSection}>
      {displayLogs.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
    </div>
  );
};

export const PlayButton = ({ isLoading, onPlay }: { isLoading: boolean; onPlay: () => void }) => {
  return (
    <IconButton
      loading={isLoading}
      type="button"
      className={style.play}
      onClick={() => onPlay()}
      disabled={isLoading}
    >
      <Play size={18} />
    </IconButton>
  );
};

export const ButtonSet = ({
  isPlay,
  onPlay,
  onReset,
}: {
  isPlay: boolean;
  onPlay: (flag: boolean) => void;
  onReset: () => void;
}) => {
  return (
    <div className={style.buttonSet}>
      <IconButton
        type="button"
        className={cx({ [style.play]: !isPlay, [style.pause]: isPlay })}
        onClick={() => onPlay(!isPlay)}
      >
        {isPlay ? <Pause size={18} /> : <Play size={18} />}
      </IconButton>
      <IconButton type="button" className={style.trash} onClick={onReset}>
        <Trash2 size={18} />
      </IconButton>
    </div>
  );
};

export const PlainLog = ({ children }: { children: ReactNode }) => {
  return (
    <div className={style.log}>
      <Badge color="gray" variant="soft" highContrast>
        Info
      </Badge>
      <span>{children}</span>
    </div>
  );
};

export const SavedLog = ({ size, data, time }: { size: number; data: string; time: number }) => {
  return (
    <div className={style.log}>
      <Badge color="gray" variant="soft" highContrast>
        Saved
      </Badge>
      <span>
        Save {size} items ({dataSize(data)}) - {new Date(time).toLocaleTimeString()}
      </span>
    </div>
  );
};

export const ResizeLog = ({ size }: { size: number }) => {
  return (
    <div className={style.log}>
      <Badge color="blue" variant="soft" highContrast>
        Info
      </Badge>
      <span>Reduce size to {size}</span>
    </div>
  );
};

export const ExceedLog = () => {
  return (
    <div className={style.log}>
      <Badge color="red">Error</Badge>
      <span className={style.error}>Local Storage Exceed!</span>
    </div>
  );
};

export type StorageStatus = 'remained' | 'exceed' | 'resize';

const uuid = v4();
let count = 0;
export const getNextData = (_size: number) => {
  let obj = {};

  for (let index = 0; index < _size; index += 1) {
    obj = {
      ...obj,
      // eslint-disable-next-line no-plusplus
      [uuid + count++]: +new Date(),
    };
  }

  return obj;
};

export const useSaveLocalStorage = (key: string) => {
  const [status, setStatus] = useState<StorageStatus>('remained');
  const [size, setSize] = useState(3000);

  const storeData = useCallback(() => {
    const data = localStorage.getItem(key) || '';
    const nextData = getNextData(size / 2);
    const nextDataStringify = JSON.stringify(nextData).repeat(2);

    try {
      setLocalStorageExceed(key, data + nextDataStringify);
      return { size, data: nextDataStringify };
    } catch (e) {
      if (size > 1) {
        setSize((prevSize) => parseInt(String(prevSize / 2), 10));
        setStatus('resize');
      } else {
        setStatus('exceed');
        console.error(e);
        console.dir(e);
      }
    }
  }, [key, size]);

  return {
    store: storeData,
    status,
    size,
  };
};
