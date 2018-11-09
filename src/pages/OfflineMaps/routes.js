const routes = [
  {
    name: 'maps',
    path: '/maps',
    component: () => import('./Map.vue'),
    meta: { requiresAuth: true },
    props: true
  }
];

export default [
  {
    path: '',
    component: () => import('layouts/MapLayout'),
    children: routes
  }
];
