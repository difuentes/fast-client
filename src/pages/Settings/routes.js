const routes = [
  {
    name: 'translations',
    path: '/settings/translations',
    component: () => import('./Translations'),
    meta: { requiresAuth: true }
  }
  /*   {
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
  } */
];

export default [
  {
    path: '',
    component: () => import('layouts/MainLayout'),
    children: routes
  }
];
