import { useId, useEffect, useState, ReactNode, MouseEvent } from 'react';
import cx from 'classnames';
import style from './EventPlayground.module.scss';
import { reactEventController, vanillaEventController, timeout, DELAY } from './utils';

interface EventPlaygroundProps {
  label?: string;
  children?: ReactNode;
  reset?: boolean;
  onReactClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onVanillaClick?: (e: Event) => void;
  onReactClickCapture?: (e: MouseEvent<HTMLDivElement>) => void;
  onVanillaClickCapture?: (e: Event) => void;
}

export const EventPlayground = ({ label, children, reset }: EventPlaygroundProps) => {
  const id = useId();
  const [reactEvent, setReactEvent] = useState(false);
  const [vanillaEvent, setVanillaEvent] = useState(false);

  const handleReactClick = () => {
    reactEventController.register(() => {
      setReactEvent(true);
    });
    reactEventController.register(async () => {
      await timeout(DELAY);
    });
    reactEventController.register(() => {
      setReactEvent(false);
    });
  };

  const handleReactClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (reset) {
      reactEventController.clear();
    }
    handleReactClick();
  };

  const handleReactClickBubble = (e: MouseEvent<HTMLDivElement>) => {
    handleReactClick();
  };

  useEffect(() => {
    const handleVanillaClick = () => {
      vanillaEventController.register(() => {
        setVanillaEvent(true);
      });
      vanillaEventController.register(async () => {
        await timeout(DELAY);
      });
      vanillaEventController.register(() => {
        setVanillaEvent(false);
      });
    };
    const handleVanillaClickBubble = () => {
      handleVanillaClick();
    };

    const handleVanillaClickCapture = () => {
      if (reset) {
        vanillaEventController.clear();
      }
      handleVanillaClick();
    };

    const button = document.getElementById(id);

    button.addEventListener('click', handleVanillaClickCapture, { capture: true });
    button.addEventListener('click', handleVanillaClickBubble, { capture: false });
    return () => {
      button.removeEventListener('click', handleVanillaClickCapture, {
        capture: true,
      });
      button.removeEventListener('click', handleVanillaClickBubble, {
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
      onClick={handleReactClickBubble}
      onClickCapture={handleReactClickCapture}
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
      {children}
    </div>
  );
};
