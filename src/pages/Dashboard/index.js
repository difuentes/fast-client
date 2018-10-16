const routes = [
  {
    name: 'dashboard',
    path: '/dashboard',
    component: () => import('./Main'),
    meta: { requiresAuth: true }
  },
  {
    path: '/collectedData',
    component: () => import('./CollectedData'),
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    component: () => import('./About'),
    meta: { requiresAuth: true }
  }
];

export default [
  {
    path: '',
    component: () => import('layouts/MainLayout'),
    children: routes
  }
];
