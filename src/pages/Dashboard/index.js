export default [
  {
    path: '/dashboard',
    component: () => import('./Main'),
    name: 'dashboard',
    meta: { requiresAuth: true }
  },
  {
    path: '/collectedData',
    component: () => import('./CollectedData'),
    name: 'CollectedData',
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    component: () => import('./About'),
    meta: { requiresAuth: true }
  }
];
