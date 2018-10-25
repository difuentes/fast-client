const routes = [
  {
    name: 'dashboard',
    path: '/dashboard',
    component: () => import('./Main/index'),
    meta: { requiresAuth: true }
  },
  // },
  // {
  //   name: 'CollectedData',
  //   path: '/collectedData',
  //   component: () => import('./CollectedData'),
  //   meta: { requiresAuth: true }
  // },
  // {
  //   name: 'newSurvey',
  //   path: '/survey',
  //   component: () => import('./CollectedData'),
  //   meta: { requiresAuth: true }
  // },
  //
  {
    name: 'About',
    path: '/about',
    component: () => import('./About'),
    meta: { requiresAuth: true }
  }
];

export default [
  {
    path: '',
    component: () => import('layouts/MapLayout'),
    children: routes
  }
];
