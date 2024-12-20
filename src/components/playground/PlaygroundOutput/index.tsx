import * as Tabs from '@radix-ui/react-tabs';
import {
  SandpackPreview,
  SandpackConsole,
  useSandpackNavigation,
} from '@codesandbox/sandpack-react';
import React from 'react';
import styled from 'styled-components';
import { RefreshCw } from 'lucide-react';

export type OutputMode = 'result' | 'console';

interface PlaygroundOutputProps {
  defaultValue?: OutputMode;
  outputHeight?: number;
}

const TabRoot = styled(Tabs.Root)``;

const TabListWrapper = styled.div`
  display: flex;
  padding: 0 10px;
  border-bottom: 3px solid var(--ifm-color-emphasis-200);
`;

const TabList = styled(Tabs.List)`
  flex: 1;
`;

const TabTrigger = styled(Tabs.Trigger)`
  font-size: 1.1em;
  padding: 10px;

  color: var(--ifm-color-primary-darkest);
  background-color: transparent;
  border: none;

  &[data-state='active'] {
    color: var(--ifm-color-primary);
    font-weight: 500;
    border-bottom: 3px solid var(--ifm-color-primary);
  }
`;

const Button = styled.button`
  color: var(--ifm-color-emphasis-700);
  background-color: transparent;
  border: none;
`;

const TabContent = styled(Tabs.Content)<{ height?: number }>`
  display: none;
  height: ${(props) => (props.height ? `${props.height}px` : '160px')};
  overflow: scroll;

  &[data-state='active'] {
    display: block;
  }
`;

export const PlaygroundOutput = ({
  defaultValue = 'result',
  outputHeight,
}: PlaygroundOutputProps) => {
  const { refresh } = useSandpackNavigation();

  const refreshPage = () => refresh();

  return (
    <TabRoot defaultValue={defaultValue}>
      <TabListWrapper>
        <TabList>
          <TabTrigger value="result">Result</TabTrigger>
          <TabTrigger value="console">Console</TabTrigger>
        </TabList>
        <Button onClick={refreshPage}>
          <RefreshCw height={18} width={18} />
        </Button>
      </TabListWrapper>
      <TabContent value="result" forceMount height={outputHeight}>
        <SandpackPreview style={{ height: '100%' }} showRefreshButton={false} />
      </TabContent>
      <TabContent value="console" forceMount height={outputHeight}>
        <SandpackConsole style={{ height: '100%' }} standalone resetOnPreviewRestart />
      </TabContent>
    </TabRoot>
  );
};
