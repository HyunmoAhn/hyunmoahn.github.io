import { ReactNode } from 'react';
import style from './Figure.module.scss';

export interface FigureProps {
  index: number;
  title: string;
  children: ReactNode;
  align?: 'center' | 'left' | 'right';
}

export const Figure = ({ index, title, children, align }: FigureProps) => {
  return (
    <div className={style.figureContainer} style={{ alignItems: align }}>
      {children}
      <div className={style.titleContainer}>
        <span className={style.indexing}>Figure {index}</span>
        <span className={style.title}>{title}</span>
      </div>
    </div>
  );
};
