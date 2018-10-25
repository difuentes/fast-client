import Auth from './Auth/routes';
import Dashboard from './Dashboard/routes';
import Formio from './Formio/routes';

// Pages routes
// const routes = [{ path: '', component: () => import('./Main') }, ...Auth, ...Dashboard, ...Formio];
const routes = [{ path: '', component: () => import('./Main') }, ...Auth, ...Dashboard, ...Formio];

// Layout
export default [
  {
    path: '/',
    component: () => import('./Layout'),
    children: routes
  }
];
