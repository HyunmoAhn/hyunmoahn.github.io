import { useId, useEffect, useState } from 'react';
import cx from 'classnames';
import style from './EventPlayground.module.scss';

interface EventPlaygroundProps {
  label?: string;
}

export const EventPlayground = ({ label }: EventPlaygroundProps) => {
  const id = useId();
  const [reactEvent, setReactEvent] = useState(false);
  const [vanillaEvent, setVanillaEvent] = useState(false);

  const handleReactClick = () => {
    console.log('React clicked');
    setReactEvent(true);
  };

  useEffect(() => {
    const handleVanillaClick = () => {
      console.log('Vanilla clicked');
      setVanillaEvent(true);
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
    <button
      type="button"
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
    </button>
  );
};
