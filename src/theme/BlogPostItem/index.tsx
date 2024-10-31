import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';
import type BlogPostItemType from '@theme/BlogPostItem';
import type { WrapperProps } from '@docusaurus/types';
import { useColorMode } from '@docusaurus/theme-common';
import { Theme } from '@radix-ui/themes';

type Props = WrapperProps<typeof BlogPostItemType>;

export default function BlogPostItemWrapper(props: Props): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <Theme hasBackground={false} appearance={colorMode}>
      <BlogPostItem {...props} />
    </Theme>
  );
}
