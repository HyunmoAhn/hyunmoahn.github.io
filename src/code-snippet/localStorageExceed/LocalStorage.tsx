import cx from 'classnames';
import { Pause, Play, Trash2 } from 'lucide-react';
import { IconButton, Badge } from '@radix-ui/themes';
import { ReactNode, useState, useEffect } from 'react';
import { v4 } from 'uuid';
import style from './LocalStorage.module.scss';
import { setLocalStorageExceed, dataSize } from './utils';

export const LogSection = ({ logs }: { logs: ReactNode[] }) => {
  console.log(logs);
  return (
    <div className={style.logSection}>
      {(logs || []).splice(-10).map((log, index) => (
        <div key={index}>{log}</div>
      ))}
    </div>
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

export const useSaveLocalStorage = (key: string) => {
  const [log, setLog] = useState<ReactNode[]>([]);
  const [dispatch, setDispatch] = useState({});
  const [size, setSize] = useState(1000);

  const getNextData = (_size: number) => {
    return Array.from({ length: _size }, (_, index) => index).reduce(
      (acc) => {
        return {
          ...(acc as Record<string, string>),
          [v4()]: +new Date(),
        };
      },
      {} as Record<string, string>,
    );
  };

  useEffect(() => {
    if (dispatch) {
      const data = localStorage.getItem(key) || '';
      const nextData = getNextData(size);

      try {
        setLocalStorageExceed(key, data + JSON.stringify(nextData));
        setLog((prevLog) => {
          console.log('setLog');
          return [
            ...prevLog,
            <div>
              <Badge color="gray" variant="soft" highContrast>
                Saved
              </Badge>
              <span>
                Save {size} items ({dataSize(data)})
              </span>
            </div>,
          ].splice(-10);
        });
      } catch (e) {
        if (size > 1) {
          setSize((prevSize) => parseInt(String(prevSize / 2), 10));
          setLog((prevLog) => [
            ...prevLog,
            <div>
              <Badge color="gray" variant="soft" highContrast>
                Info
              </Badge>
              <span>Reduce size to {size}</span>
            </div>,
          ]);
          return;
        }

        setLog((prevLog) => [
          ...prevLog,
          <div>
            <Badge color="red" variant="soft" highContrast>
              Error
            </Badge>
            <span>Local Storage Exceed!</span>
          </div>,
        ]);
      }
    }
  }, [dispatch, key, size]);

  return {
    logs: log,
    dispatch: () => setDispatch({}),
  };
};
