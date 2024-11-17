import {
  useId,
  useEffect,
  useState,
  ReactNode,
  MouseEvent,
  createContext,
  useContext,
} from 'react';
import cx from 'classnames';
import style from './EventPlayground.module.scss';
import { timeout, DELAY, createController } from './utils';

export const ReactEventPlaygroundContext = createContext(createController());
export const VanillaEventPlaygroundContext = createContext(createController());
export const EventPlaygroundProvider = ({ children }: { children: ReactNode }) => (
  <ReactEventPlaygroundContext.Provider value={createController()}>
    <VanillaEventPlaygroundContext.Provider value={createController()}>
      {children}
    </VanillaEventPlaygroundContext.Provider>
  </ReactEventPlaygroundContext.Provider>
);

interface EventPlaygroundProps {
  label?: string;
  children?: ReactNode;
  reset?: boolean;
  skipReact?: boolean;
  skipVanilla?: boolean;
  reactStopBubble?: boolean;
  reactStopCapture?: boolean;
  vanillaStopBubble?: boolean;
  vanillaStopCapture?: boolean;
}

export const EventPlayground = ({
  label,
  children,
  reset,
  skipReact,
  skipVanilla,
  reactStopBubble,
  reactStopCapture,
  vanillaStopBubble,
  vanillaStopCapture,
}: EventPlaygroundProps) => {
  const id = useId();
  const reactEventController = useContext(ReactEventPlaygroundContext);
  const vanillaEventController = useContext(VanillaEventPlaygroundContext);
  const [reactEvent, setReactEvent] = useState(false);
  const [vanillaEvent, setVanillaEvent] = useState(false);

  const handleReactClick = () => {
    if (!skipReact) {
      reactEventController.register(() => {
        setReactEvent(true);
      });
      reactEventController.register(async () => {
        await timeout(DELAY);
      });
      reactEventController.register(() => {
        setReactEvent(false);
      });
    }
  };

  const handleReactClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (reset) {
      reactEventController.clear();
    }
    reactStopCapture && e.stopPropagation();
    handleReactClick();
  };

  const handleReactClickBubble = (e: MouseEvent<HTMLDivElement>) => {
    reactStopBubble && e.stopPropagation();
    handleReactClick();
  };

  useEffect(() => {
    const handleVanillaClick = (e: Event) => {
      if (!skipVanilla) {
        vanillaEventController.register(() => {
          setVanillaEvent(true);
        });
        vanillaEventController.register(async () => {
          await timeout(DELAY);
        });
        vanillaEventController.register(() => {
          setVanillaEvent(false);
        });
      }
    };
    const handleVanillaClickBubble = (e: Event) => {
      vanillaStopBubble && e.stopPropagation();
      handleVanillaClick(e);
    };

    const handleVanillaClickCapture = (e: Event) => {
      if (reset) {
        vanillaEventController.clear();
      }
      vanillaStopCapture && e.stopPropagation();
      handleVanillaClick(e);
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
  }, [id, reset, skipVanilla, vanillaStopBubble, vanillaStopCapture]);

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
