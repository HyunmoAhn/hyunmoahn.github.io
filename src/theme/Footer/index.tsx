import React from 'react';
import Footer from '@theme-original/Footer';
import FooterLayout from '@theme/Footer/Layout';
import FooterCopyright from '@theme/Footer/Copyright';
import { useThemeConfig } from '@docusaurus/theme-common';
import { useIsGameRoute } from '../../utils';

function GameFooter(): React.JSX.Element | null {
  const { footer } = useThemeConfig();
  if (!footer) {
    return null;
  }

  return (
    <FooterLayout
      style={footer.style}
      links={null}
      logo={null}
      copyright={footer.copyright && <FooterCopyright copyright={footer.copyright} />}
    />
  );
}

export default function FooterWrapper(): React.JSX.Element | null {
  return useIsGameRoute() ? <GameFooter /> : <Footer />;
}
