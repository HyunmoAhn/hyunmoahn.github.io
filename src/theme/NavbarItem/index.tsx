import React from 'react';
import NavbarItem from '@theme-original/NavbarItem';
import type NavbarItemType from '@theme/NavbarItem';
import type { WrapperProps } from '@docusaurus/types';
import { useIsGameRoute } from '../../utils';

type Props = WrapperProps<typeof NavbarItemType>;

export default function NavbarItemWrapper(props: Props): React.JSX.Element | null {
  if (useIsGameRoute()) {
    return null;
  }

  return <NavbarItem {...props} />;
}
