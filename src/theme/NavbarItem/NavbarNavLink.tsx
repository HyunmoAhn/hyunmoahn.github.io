import React from 'react';
import NavbarNavLink from '@theme-original/NavbarItem/NavbarNavLink';
import type { Props } from '@theme/NavbarItem/NavbarNavLink';
import { useLocation } from '@docusaurus/router';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import { usePostsByTag } from '../../utils';
import { isFromMainList } from '../../postListOrigin';

export default function NavbarNavLinkWrapper(props: Props): React.JSX.Element {
  const { pathname } = useLocation();
  const { withBaseUrl } = useBaseUrlUtils();
  const postsByTag = usePostsByTag();
  const isTaggedPost =
    !isFromMainList() && !!props.to && !!postsByTag[withBaseUrl(props.to)]?.includes(pathname);

  return <NavbarNavLink {...props} {...(isTaggedPost && { isActive: () => true })} />;
}
