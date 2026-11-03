import React from 'react';
import SearchBar from '@theme-original/SearchBar';
import { useIsGameRoute } from '../../utils';

export default function SearchBarWrapper(): React.JSX.Element | null {
  return useIsGameRoute() ? null : <SearchBar />;
}
