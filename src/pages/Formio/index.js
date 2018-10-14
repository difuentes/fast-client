export default [
  {
    path: '/forms/:path*/submission',
    component: () => import('./Create'),
    name: 'formio_form_submission',
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/forms/:path*/submission/:idSubmission/update',
    component: () => import('./Create'),
    name: 'profile',
    meta: { requiresAuth: true }
  },
  {
    path: '/forms/:path*/submission/:idSubmission/update',
    component: () => import('./Create'),
    name: 'formio_submission_update',
    meta: { requiresAuth: true }
  },
  {
    path: '/forms/:path*/submission/:idSubmission/report',
    component: () => import('./Report'),
    name: 'formio_submission_report',
    meta: { requiresAuth: true }
  },
  {
    path: '/forms/:path*',
    component: () => import('./Show'),
    name: 'formio_form_show',
    meta: { requiresAuth: true }
  }
];
