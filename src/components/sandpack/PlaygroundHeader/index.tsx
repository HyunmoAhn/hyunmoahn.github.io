import React from 'react';
import styled, { css } from 'styled-components';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { useSandpack, UnstyledOpenInCodeSandboxButton } from '@codesandbox/sandpack-react';

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 14px;
`;

const Title = styled.div`
  flex: 1;
  font-size: 1.25em;

  align-self: center;

  color: var(--ifm-color-primary-dark);
`;

const buttonCss = css`
  width: 24px;
  height: 24px;

  color: var(--ifm-color-emphasis-700);
  background-color: transparent;
  border: none;
`;

const Button = styled.button`
  ${buttonCss}
`;

const CodeSandboxButton = styled(UnstyledOpenInCodeSandboxButton)`
  ${buttonCss}
`;

export interface PlaygroundHeaderProps {
  title?: string;
}

export const PlaygroundHeader = ({ title }: PlaygroundHeaderProps) => {
  const { sandpack, dispatch } = useSandpack();

  const reloadCode = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Reset All files')) {
      sandpack.resetAllFiles();
      dispatch({ type: 'refresh' });
    }
  };

  return (
    <Container>
      <Title>{title}</Title>
      <Button onClick={reloadCode}>
        <RefreshCw height={16} width={16} />
      </Button>
      <CodeSandboxButton>
        <ExternalLink height={16} width={16} />
      </CodeSandboxButton>
    </Container>
  );
};
