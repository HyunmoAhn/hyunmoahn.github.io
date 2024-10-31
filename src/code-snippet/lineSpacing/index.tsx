import cx from 'classnames';
import { useState, useId } from 'react';
import { Select } from '@radix-ui/themes';
import * as Label from '@radix-ui/react-label';
import style from './lineSpacing.module.scss';

const TEXT_SAMPLE =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.';

export const LineSpacingGuide = () => {
  return (
    <div className={style.guideWrapper}>
      <h4>Line Spacing</h4>
      <div className={cx(style.lineSpacingGuideContainer, style.guideContainer)}>
        <p>Line Gap</p>
        <p className={style.lineSpacingGuide} style={{ backgroundColor: 'red' }} />
        <p>Line Gap</p>
        <p className={style.lineSpacingGuide} style={{ backgroundColor: 'green' }} />
        <p>Line Gap</p>
      </div>
      <p className={style.caption}>Line Spacing (5px)</p>
    </div>
  );
};

export const LineHeightGuide = () => {
  return (
    <div className={style.guideWrapper}>
      <h4>Line Height</h4>
      <div className={cx(style.lineHeightGuideContainer, style.guideContainer)}>
        <p className={style.lineHeightGuide} style={{ backgroundColor: 'red' }} />
        <p>Line Gap</p>
        <p className={style.lineHeightGuide} style={{ backgroundColor: 'red' }} />
        <p className={style.lineHeightGuide} style={{ backgroundColor: 'green' }} />
        <p>Line Gap</p>
        <p className={style.lineHeightGuide} style={{ backgroundColor: 'green' }} />
        <p className={style.lineHeightGuide} style={{ backgroundColor: 'blue' }} />
        <p>Line Gap</p>
        <p className={style.lineHeightGuide} style={{ backgroundColor: 'blue' }} />
      </div>
      <p className={style.caption}>Line Height (5px)</p>
    </div>
  );
};

export const LinePaddingExample = () => {
  return (
    <div className={style.container}>
      <LineSpacingGuide />
      <LineHeightGuide />
    </div>
  );
};

export const LineSpacingPlayground = ({ lineSpacing }: { lineSpacing: number }) => {
  const paddingGap = lineSpacing / 2;

  return (
    <div>
      <div className={style.playgroundBorder}>
        <p
          className={style.playground}
          style={{
            lineHeight: `${lineSpacing + 26}px`,
            marginTop: `-${paddingGap}px`,
            marginBottom: `-${paddingGap}px`,
          }}
        >
          {TEXT_SAMPLE}
        </p>
      </div>
      <p className={style.caption}>Line Spacing ({lineSpacing}px)</p>
    </div>
  );
};

export const LineHeightPlayground = ({ lineHeight }: { lineHeight: number }) => {
  return (
    <div>
      <div className={style.playgroundBorder}>
        <p className={style.playground} style={{ lineHeight: `${lineHeight + 26}px` }}>
          {TEXT_SAMPLE}
        </p>
      </div>
      <p className={style.caption}>Line Height ({lineHeight}px + fontSize)</p>
    </div>
  );
};

export const SpacingSelect = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: string) => void;
}) => {
  const id = useId();

  return (
    <div>
      <Label.Root htmlFor={id}>Spacing</Label.Root>
      <Select.Root value={String(value)} onValueChange={onChange}>
        <Select.Trigger id={id} />
        <Select.Content>
          <Select.Item value="0">0</Select.Item>
          <Select.Item value="5">5</Select.Item>
          <Select.Item value="10">10</Select.Item>
          <Select.Item value="15">15</Select.Item>
          <Select.Item value="25">25</Select.Item>
          <Select.Item value="30">30</Select.Item>
          <Select.Item value="40">40</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
};

export const LinePlayground = () => {
  const [value, setState] = useState(0);

  return (
    <div className={style.linePlaygroundWrapper}>
      <SpacingSelect value={value} onChange={(selected) => setState(Number(selected))} />
      <div className={style.linePlayground}>
        <LineSpacingPlayground lineSpacing={value} />
        <LineHeightPlayground lineHeight={value} />
      </div>
    </div>
  );
};
