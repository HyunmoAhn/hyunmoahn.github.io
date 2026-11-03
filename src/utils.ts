import type { BlogSidebar } from '@docusaurus/plugin-content-blog';
import { usePluginData } from '@docusaurus/useGlobalData';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type PostsByTag = Record<string, string[]>;

export const usePostsByTag = () => usePluginData('posts-by-tag') as PostsByTag;

export const useTaggedSidebar = (
  sidebar: BlogSidebar,
  tag: { label: string; permalink: string } | undefined,
): BlogSidebar => {
  const postsByTag = usePostsByTag();
  if (!tag) {
    return sidebar;
  }
  const taggedPermalinks = postsByTag[tag.permalink] ?? [];

  return {
    ...sidebar,
    title: `"${tag.label}" posts`,
    items: sidebar.items.filter((item) => taggedPermalinks.includes(item.permalink)),
  };
};

export const useIsGameRoute = () => {
  const { pathname } = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const gamePath = `${siteConfig.baseUrl}${siteConfig.customFields?.gameRouteBasePath}`;

  return pathname === gamePath || pathname.startsWith(`${gamePath}/`);
};
