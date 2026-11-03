import type { ClientModule } from '@docusaurus/types';
import siteConfig from '@generated/docusaurus.config';

const mainListPattern = new RegExp(`^${siteConfig.baseUrl}(page/\\d+/?)?$`);
const tagListPattern = new RegExp(`^${siteConfig.baseUrl}tags/`);

// Whether the last post list the reader visited was the main list (`/`, `/page/N`).
// Kept in memory only, so the first render after a full page load always matches SSR.
let fromMainList = false;

export const isFromMainList = () => fromMainList;

const clientModule: ClientModule = {
  onRouteDidUpdate({ location }) {
    if (mainListPattern.test(location.pathname)) {
      fromMainList = true;
    } else if (tagListPattern.test(location.pathname)) {
      fromMainList = false;
    }
  },
};

export default clientModule;
