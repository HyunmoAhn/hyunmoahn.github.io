import { useId, useEffect, useState } from 'react';
import cx from 'classnames';
import style from './EventPlayground.module.scss';
import { reactEventController, vanillaEventController, timeout, DELAY } from './utils';

interface EventPlaygroundProps {
  label?: string;
}

export const EventPlayground = ({ label }: EventPlaygroundProps) => {
  const id = useId();
  const [reactEvent, setReactEvent] = useState(false);
  const [vanillaEvent, setVanillaEvent] = useState(false);

  const handleReactClick = () => {
    reactEventController.register(async () => {
      setReactEvent(true);
      await timeout(DELAY);
      setReactEvent(false);
    });
  };

  useEffect(() => {
    const handleVanillaClick = () => {
      vanillaEventController.register(async () => {
        setVanillaEvent(true);
        await timeout(DELAY);
        setVanillaEvent(false);
      });
    };

    const button = document.getElementById(id);

    button.addEventListener('click', handleVanillaClick, { capture: true });
    button.addEventListener('click', handleVanillaClick, { capture: false });
    return () => {
      button.removeEventListener('click', handleVanillaClick, {
        capture: true,
      });
      button.removeEventListener('click', handleVanillaClick, {
        capture: false,
      });
    };
  }, [id]);

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      id={id}
      className={style.container}
      onClick={handleReactClick}
      onClickCapture={handleReactClick}
    >
      <h3 className={style.text}>{label}</h3>
      <div className={style.highlightContainer}>
        {reactEvent && (
          <>
            <div className={cx(style.highlight, style.react)} />
            <span className={style.text}>React Event</span>
          </>
        )}
        {vanillaEvent && (
          <>
            <div className={cx(style.highlight, style.vanilla)} />
            <div className={style.text}>Vanilla Event</div>
          </>
        )}
      </div>
    </div>
  );
};
