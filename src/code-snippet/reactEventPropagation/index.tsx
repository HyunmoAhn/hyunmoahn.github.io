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
