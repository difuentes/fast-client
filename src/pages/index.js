import Auth from './Auth/routes';
import Dashboard from './Dashboard/routes';
import PageManager from './PageManager/routes';

const routes = [
  { path: '', component: () => import('./Main') },
  ...Auth,
  ...Dashboard,
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
