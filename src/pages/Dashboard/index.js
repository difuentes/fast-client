export default [
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
