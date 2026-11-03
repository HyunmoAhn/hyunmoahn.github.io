import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';
import type BlogPostItemType from '@theme/BlogPostItem';
import type { WrapperProps } from '@docusaurus/types';
import { useColorMode } from '@docusaurus/theme-common';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import { Theme } from '@radix-ui/themes';
import { Giscus } from '../../components/common/Giscus';
import { useIsGameRoute } from '../../utils';

type Props = WrapperProps<typeof BlogPostItemType>;

export default function BlogPostItemWrapper(props: Props): React.JSX.Element {
  const { colorMode } = useColorMode();
  const { isBlogPostPage, metadata } = useBlogPost();
  const isGameRoute = useIsGameRoute();

  return (
    <Theme hasBackground={false} appearance={colorMode}>
      <BlogPostItem {...props} />
      {isBlogPostPage && isGameRoute && <Giscus key={metadata.permalink} />}
    </Theme>
  );
}
