import { useEffect, useRef } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const GISCUS_ORIGIN = 'https://giscus.app';

export interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

export const Giscus = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();
  const config = useDocusaurusContext().siteConfig.customFields?.giscus as GiscusConfig | undefined;
  const isConfigured = Boolean(config?.repoId && config?.categoryId);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !config || !isConfigured) {
      return;
    }
    const script = document.createElement('script');
    Object.entries({
      src: `${GISCUS_ORIGIN}/client.js`,
      'data-repo': config.repo,
      'data-repo-id': config.repoId,
      'data-category': config.category,
      'data-category-id': config.categoryId,
      'data-mapping': 'pathname',
      'data-strict': '1',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'top',
      'data-theme': colorMode,
      'data-lang': 'ko',
      'data-loading': 'lazy',
      crossorigin: 'anonymous',
    }).forEach(([key, value]) => script.setAttribute(key, value));
    script.async = true;
    container.appendChild(script);

    return () => {
      container.replaceChildren();
    };
    // The initial theme is set on the script; later changes are sent to the iframe below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, isConfigured]);

  useEffect(() => {
    const iframe = containerRef.current?.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: colorMode } } },
      GISCUS_ORIGIN,
    );
  }, [colorMode]);

  if (!isConfigured) {
    return null;
  }

  return <div ref={containerRef} className="margin-top--xl" />;
};
