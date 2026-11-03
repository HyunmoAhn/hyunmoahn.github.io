import React from 'react';
import SearchBar from '@theme-original/SearchBar';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useIsGameRoute } from '../../utils';

// The original SearchBar merges its props over themeConfig.algolia, but its type declares no props.
const SearchBarWithProps = SearchBar as React.ComponentType<{
  indexName?: string;
  searchPagePath?: string | false;
}>;

export default function SearchBarWrapper(): React.JSX.Element {
  const { customFields } = useDocusaurusContext().siteConfig;
  const isGameRoute = useIsGameRoute();

  if (isGameRoute) {
    // The search page only queries the blog index, so game results don't link to it.
    return (
      <SearchBarWithProps
        indexName={customFields?.gameSearchIndexName as string}
        searchPagePath={false}
      />
    );
  }

  return <SearchBarWithProps />;
}
