const routes = [
  {
    name: 'showPages',
    path: '/page-builder',
    component: () => import('./Show.vue'),
    meta: { requiresAuth: true }
  },
  {
    name: 'pageBuilder',
    path: '/page-builder/:id',
    component: () => import('./PageBuilder.vue'),
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
