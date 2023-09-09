import React from 'react';
import { SandpackProvider, SandpackCodeEditor } from '@codesandbox/sandpack-react';
import { useColorMode } from '@docusaurus/theme-common';
import { SandpackBundlerFiles } from '@codesandbox/sandpack-client';
import styled from 'styled-components';
import { PlaygroundOutput } from './PlaygroundOutput';
import { PlaygroundHeader } from './PlaygroundHeader';

const CodeEditorContainer = styled.div`
  display: flex;
  flex-direction: column;

  border: 3px solid var(--ifm-color-emphasis-200);
  border-radius: 5px;
  height: 600px;
`;

export interface PlaygroundProps {
  title?: string;
  files: SandpackBundlerFiles;
}

export const Playground = ({ files, title }: PlaygroundProps) => {
  const { colorMode } = useColorMode();

  return (
    <SandpackProvider
      files={files}
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
        <PlaygroundOutput />
      </CodeEditorContainer>
    </SandpackProvider>
  );
};
