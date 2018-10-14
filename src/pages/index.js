import Auth from './Auth';
import Dashboard from './Dashboard';
import Formio from './Formio';

// Pages routes
const routes = [{ path: '', component: () => import('./Main') }, ...Auth, ...Dashboard, ...Formio];

// Layout
export default [
  {
    path: '/',
    component: () => import('./Layout'),
    children: routes
  }
];
