import { useState } from 'react';

export default function App() {
  const [lineSpacing, setLineSpacing] = useState(0);

  return (
    <>
      <h3>
        Line Spacing:{' '}
        <input type="text" value={lineSpacing} onChange={(e) => setLineSpacing(e.target.value)} />
        px
      </h3>
      <LineSpacingPlayground lineSpacing={Number(lineSpacing)} />
    </>
  );
}

export const LineSpacingPlayground = ({ lineSpacing }) => {
  const paddingGap = lineSpacing / 2;

  return (
    <div>
      <p
        style={{
          width: '200px',
          fontSize: '26px',
          lineHeight: `${lineSpacing + 26}px`,
          marginTop: `-${paddingGap}px`,
          marginBottom: `-${paddingGap}px`,
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
        Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
      </p>
    </div>
  );
};
