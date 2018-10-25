import Auth from './Auth/routes';
import Dashboard from './Dashboard/routes';
import Formio from './Formio/routes';
import PageManager from './PageManager/routes';
// Pages routes
// const routes = [{ path: '', component: () => import('./Main') }, ...Auth, ...Dashboard, ...Formio];
const routes = [
  { path: '', component: () => import('./Main') },
  ...Auth,
  ...Dashboard,
  ...Formio,
  ...PageManager
];

// Layout
export default [
  {
    path: '/',
    component: () => import('./Layout'),
    children: routes
  }
];
