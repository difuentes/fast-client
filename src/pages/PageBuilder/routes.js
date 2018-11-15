const routes = [
  {
    name: 'pageBuilder',
    path: '/page-builder',
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
