import React from 'react';
import BlogPostPage from '@theme-original/BlogPostPage';
import type BlogPostPageType from '@theme/BlogPostPage';
import type { WrapperProps } from '@docusaurus/types';
import { useThemeConfig } from '@docusaurus/theme-common';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import { useTaggedSidebar } from '../../utils';

type Props = WrapperProps<typeof BlogPostPageType>;

export default function BlogPostPageWrapper(props: Props): React.JSX.Element {
  const { withBaseUrl } = useBaseUrlUtils();
  const navbarPaths = useThemeConfig()
    .navbar.items.filter((item) => typeof item.to === 'string')
    .map((item) => withBaseUrl(item.to as string));
  const navbarTag = props.content.metadata.tags.find((tag) => navbarPaths.includes(tag.permalink));
  const sidebar = useTaggedSidebar(props.sidebar, navbarTag);

  return <BlogPostPage {...props} sidebar={sidebar} />;
}
