import { ReactNode, useCallback, useEffect, useId, useState } from 'react';
import { RadioGroup } from '@radix-ui/themes';
import style from './index.module.scss';

export interface EventPropagationPanelProps {
  label?: string;
  type: 'bubble' | 'capture';
  children?: ReactNode;
}

export const EventPropagationPanel = ({ label, type, children }: EventPropagationPanelProps) => {
  const id = useId();
  const handleReactClick = useCallback(() => {
    console.log('React clicked');
  }, []);

  useEffect(() => {
    const handleVanillaClick = () => {
      console.log('Vanilla clicked');
    };

    const button = document.getElementById(id);

    button.addEventListener('click', handleVanillaClick, { capture: type === 'capture' });
    return () => {
      button.removeEventListener('click', handleVanillaClick, { capture: type === 'capture' });
    };
  }, [id, type]);

  return (
    <button
      className={style.eventPanel}
      type="button"
      id={id}
      onClick={type === 'bubble' ? handleReactClick : () => {}}
      onClickCapture={type === 'capture' ? handleReactClick : () => {}}
    >
      <h3>Event Propagation({label})</h3>
      {children}
    </button>
  );
};

export const DisplayEventPropagation = () => {
  const [eventType, setEventType] = useState<'bubble' | 'capture'>('bubble');

  return (
    <div>
      <RadioGroup.Root
        className={style.radioRoot}
        value={eventType}
        onValueChange={(value) => setEventType(value as 'bubble' | 'capture')}
      >
        <RadioGroup.Item value="bubble">Bubble</RadioGroup.Item>
        <RadioGroup.Item value="capture">Capture</RadioGroup.Item>
      </RadioGroup.Root>
      <EventPropagationPanel type={eventType} label="First">
        <EventPropagationPanel type={eventType} label="Second">
          <EventPropagationPanel type={eventType} label="Third" />
        </EventPropagationPanel>
      </EventPropagationPanel>
    </div>
  );
};
