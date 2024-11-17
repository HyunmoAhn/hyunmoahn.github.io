import { Figure } from '../../components/common/Figure';
import { EventPlayground, EventPlaygroundProvider } from './EventPlayground';
import style from './index.module.scss';

export { EventPlayground } from './EventPlayground';

export const BasicEventPlayground = () => {
  return (
    <div className={style.basicEventPlayground}>
      <Figure index={1} title="Vanilla Click Only">
        <EventPlaygroundProvider>
          <EventPlayground label="#1" reset skipReact>
            <EventPlayground label="#2" skipReact>
              <EventPlayground label="#3" skipReact />
            </EventPlayground>
          </EventPlayground>
        </EventPlaygroundProvider>
      </Figure>

      <Figure index={2} title="React Click Only">
        <EventPlaygroundProvider>
          <EventPlayground label="#1" reset skipVanilla>
            <EventPlayground label="#2" skipVanilla>
              <EventPlayground label="#3" skipVanilla />
            </EventPlayground>
          </EventPlayground>
        </EventPlaygroundProvider>
      </Figure>
    </div>
  );
};

export const BothEventPlayground = () => {
  return (
    <Figure index={3} title="Vanilla & React Click">
      <EventPlaygroundProvider>
        <EventPlayground label="#1" reset>
          <EventPlayground label="#2">
            <EventPlayground label="#3" />
          </EventPlayground>
        </EventPlayground>
      </EventPlaygroundProvider>
    </Figure>
  );
};

export const BothStopEventPlayground = () => {
  return (
    <div className={style.basicEventPlayground}>
      <Figure index={4} title="#2 Stop Propagation Bubbling by React">
        <EventPlaygroundProvider>
          <EventPlayground label="#1" reset>
            <EventPlayground label="#2" reactStopBubble>
              <EventPlayground label="#3" />
            </EventPlayground>
          </EventPlayground>
        </EventPlaygroundProvider>
      </Figure>

      <Figure index={5} title="#2 Stop Propagation Bubbling by Vanilla">
        <EventPlaygroundProvider>
          <EventPlayground label="#1" reset>
            <EventPlayground label="#2" vanillaStopBubble>
              <EventPlayground label="#3" />
            </EventPlayground>
          </EventPlayground>
        </EventPlaygroundProvider>
      </Figure>
    </div>
  );
};

export const BothStopCapturingEventPlayground = () => {
  return (
    <div className={style.basicEventPlayground}>
      <Figure index={7} title="#2 Stop Propagation Capturing by React">
        <EventPlaygroundProvider>
          <EventPlayground label="#1" reset>
            <EventPlayground label="#2" reactStopCapture>
              <EventPlayground label="#3" />
            </EventPlayground>
          </EventPlayground>
        </EventPlaygroundProvider>
      </Figure>

      <Figure index={8} title="#2 Stop Propagation Capturing by Vanilla">
        <EventPlaygroundProvider>
          <EventPlayground label="#1" reset>
            <EventPlayground label="#2" vanillaStopCapture>
              <EventPlayground label="#3" />
            </EventPlayground>
          </EventPlayground>
        </EventPlaygroundProvider>
      </Figure>
    </div>
  );
};
