import Auth from './Auth/routes';
import Dashboard from './Dashboard/routes';
<<<<<<< HEAD
import PageManager from './PageManager/routes';
// import Formio from './Formio/routes';

// Pages routes
// const routes = [{ path: '', component: () => import('./Main') }, ...Auth, ...Dashboard, ...Formio];
const routes = [
  { path: '', component: () => import('./Main') },
  ...Auth,
  ...Dashboard,
  ...PageManager
];
=======
import Formio from './Formio/routes';

// Pages routes
// const routes = [{ path: '', component: () => import('./Main') }, ...Auth, ...Dashboard, ...Formio];
const routes = [{ path: '', component: () => import('./Main') }, ...Auth, ...Dashboard, ...Formio];
>>>>>>> 7bde54171a8165a757539aab95f811fda309485a

// Layout
export default [
  {
    path: '/',
    component: () => import('./Layout'),
    children: routes
  }
];
