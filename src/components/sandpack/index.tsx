import React from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from '@codesandbox/sandpack-react';
import { useColorMode } from '@docusaurus/theme-common';
import { SandpackBundlerFiles } from '@codesandbox/sandpack-client';

export interface CodeBoxProps {
  files: SandpackBundlerFiles;
}

export const CodeBox = ({ files }: CodeBoxProps) => {
  const { colorMode } = useColorMode();

  return (
    <SandpackProvider
      files={files}
      theme={colorMode}
      template="react"
      options={{ autorun: true, autoReload: true }}
    >
      <SandpackLayout>
        <SandpackCodeEditor showTabs showInlineErrors showLineNumbers wrapContent />
        <SandpackPreview />
      </SandpackLayout>
    </SandpackProvider>
  );
};
