import React from 'react';
import { SandpackProvider, SandpackCodeEditor } from '@codesandbox/sandpack-react';
import { useColorMode } from '@docusaurus/theme-common';
import { SandpackBundlerFiles } from '@codesandbox/sandpack-client';
import styled from 'styled-components';
import { PlaygroundOutput, OutputMode } from './PlaygroundOutput';
import { PlaygroundHeader } from './PlaygroundHeader';

const CodeEditorContainer = styled.div`
  display: flex;
  flex-direction: column;

  border: 3px solid var(--ifm-color-emphasis-200);
  border-radius: 5px;
  height: 600px;

  margin-bottom: 30px;
`;

export interface PlaygroundProps {
  title?: string;
  defaultOutput?: OutputMode;
  files: SandpackBundlerFiles;
  strict?: boolean;
  outputHeight?: number;
}

const strictOff = {
  '/index.js': {
    hidden: true,
    code: `import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";
const root = createRoot(document.getElementById("root"));
root.render(<App />);
`,
  },
};

export const Playground = ({
  files,
  title,
  strict = false,
  defaultOutput,
  outputHeight,
}: PlaygroundProps) => {
  const { colorMode } = useColorMode();

  return (
    <SandpackProvider
      files={{ ...files, ...(!strict && strictOff) }}
      theme={colorMode}
      template="react"
      options={{ autorun: true, autoReload: true }}
    >
      <CodeEditorContainer>
        <PlaygroundHeader title={title} />
        <SandpackCodeEditor
          style={{ flex: 7, overflow: 'scroll' }}
          showTabs
          showInlineErrors
          showLineNumbers
          wrapContent
        />
        <PlaygroundOutput defaultValue={defaultOutput} outputHeight={outputHeight} />
      </CodeEditorContainer>
    </SandpackProvider>
  );
};
