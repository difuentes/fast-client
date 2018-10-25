const routes = [
  {
    name: 'pageManager',
    path: '/page/:pageId*',
    component: () => import('./Main/index'),
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
