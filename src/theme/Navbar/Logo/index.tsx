import React from 'react';
import NavbarLogo from '@theme-original/Navbar/Logo';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useThemeConfig } from '@docusaurus/theme-common';
import { useIsGameRoute } from '../../../utils';

function GameNavbarLogo(): React.JSX.Element {
  const { customFields } = useDocusaurusContext().siteConfig;
  const { logo } = useThemeConfig().navbar;
  const gameHome = useBaseUrl(customFields?.gameRouteBasePath as string);
  const logoSrc = useBaseUrl(logo?.src ?? '');

  return (
    <Link to={gameHome} className="navbar__brand">
      {logo && (
        <div className="navbar__logo">
          <img src={logoSrc} alt="" />
        </div>
      )}
      <b className="navbar__title text--truncate">{customFields?.gameTitle as string}</b>
    </Link>
  );
}

export default function NavbarLogoWrapper(): React.JSX.Element {
  return useIsGameRoute() ? <GameNavbarLogo /> : <NavbarLogo />;
}
