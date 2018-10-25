const routes = [
  {
    name: 'pageManager',
    path: '/page/:pageId*',
    meta: { requiresAuth: true },
    component: () => import('./Main')
  },
  {
    name: 'newSurvey',
    path: '/page/:pageId*',
    meta: { requiresAuth: true },
    component: () => import('./Main')
  },
  {
    name: 'collectedData',
    path: '/page/:pageId*',
    meta: { requiresAuth: true },
    component: () => import('./Main')
  }
];

export default [
  {
    path: '',
    component: () => import('layouts/MainLayout'),
    children: routes
  }
];
