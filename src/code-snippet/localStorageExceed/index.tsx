import { useEffect, useState } from 'react';
import { LogSection, ButtonSet, useSaveLocalStorage } from './LocalStorage';
import {
  LOCAL_STORAGE_EXCEED,
  cleanLocalStorageExceed,
  getLocalStorageExceed,
  dataSize,
} from './utils';
import style from './index.module.scss';

export const LocalStorageExceed = () => {
  const [play, setPlay] = useState(false);
  const storageData = getLocalStorageExceed(LOCAL_STORAGE_EXCEED);

  const { logs, dispatch } = useSaveLocalStorage(LOCAL_STORAGE_EXCEED);

  useEffect(() => {
    if (play && dispatch) {
      console.log('dispatch');
      setTimeout(() => {
        dispatch();
      }, 1000);
    }
  }, [dispatch, play]);

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
