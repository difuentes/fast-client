import Auth from './Auth';

// Pages routes
const routes = [{ path: '', component: () => import('./Main') }, ...Auth];

// Layout
export default [
  {
    path: '/',
    component: () => import('./Layout'),
    children: routes
  }
];
