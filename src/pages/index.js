import Auth from './Auth';
import Dashboard from './Dashboard';

// Pages routes
const routes = [{ path: '', component: () => import('./Main') }, ...Auth, ...Dashboard];

// Layout
export default [
  {
    path: '/',
    component: () => import('./Layout'),
    children: routes
  }
];
