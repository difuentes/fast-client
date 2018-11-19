import Auth from './Auth/routes';
import Dashboard from './Dashboard/routes';
import PageManager from './PageManager/routes';
import OfflineMaps from './OfflineMaps/routes';
import Formio from './Formio/routes';
import Settings from './Settings/routes';
import PageBuilder from './PageBuilder/routes';

const routes = [
  ...Dashboard,
  ...PageManager,
  ...OfflineMaps,
  ...Formio,
  ...Settings,
  ...PageBuilder
];

// Layout
export default [
  ...Auth,
  {
    path: '/app',
    component: () => import('./Layout'),
    children: routes
  }
];
