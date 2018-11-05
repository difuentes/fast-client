import Auth from './Auth/routes';
import Dashboard from './Dashboard/routes';
import PageManager from './PageManager/routes';
import OfflineMaps from './OfflineMaps/routes';
import PageBuilder from './PageBuilder/routes';

const routes = [
  { path: '', component: () => import('./Main') },
  ...Auth,
  ...Dashboard,
  ...PageManager,
  ...OfflineMaps,
  ...PageBuilder
];

// Layout
export default [
  {
    path: '/',
    component: () => import('./Layout'),
    children: routes
  }
];
