const routes = [
  { path: '/', redirect: '/login' },
  { name: 'login', path: '/login', component: () => import('./Login') },
  { name: 'register', path: '/register', component: () => import('./Register') }
];

export default [
  {
    path: '',
    component: () => import('layouts/AuthLayout'),
    children: routes
  }
];
