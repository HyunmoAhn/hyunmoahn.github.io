import type { PropBlogPostContent, BlogSidebar } from '@docusaurus/plugin-content-blog';

export interface TaggedSideBarParams {
  items: readonly { readonly content: PropBlogPostContent }[];
  sidebar: BlogSidebar;
  selectTag: string;
}

export const getTaggedSideBar = ({ items, selectTag, sidebar }: TaggedSideBarParams) => {
  const taggedContents = items.filter((item) =>
    item.content.metadata.tags.some((tag) => {
      return tag.label === selectTag;
    }),
  );

  return {
    ...sidebar,
    title: `"${selectTag}" posts`,
    items: sidebar.items.filter((item) => {
      return taggedContents.some((taggedContent) => {
        return item.permalink === taggedContent.content.metadata.permalink;
      });
    }),
  };
};
