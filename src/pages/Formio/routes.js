export default [
  {
    path: '/forms/:path*/submission',
    component: () => import('./Create.vue'),
    name: 'formio_form_submission',
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/forms/:path*/submission/:idSubmission/update',
    component: () => import('./Create.vue'),
    name: 'profile',
    meta: { requiresAuth: true }
  },
  {
    path: '/forms/:path*/submission/:idSubmission/update',
    component: () => import('./Create.vue'),
    name: 'formio_submission_update',
    meta: { requiresAuth: true }
  },
  {
    path: '/forms/:path*/submission/:idSubmission/report',
    component: () => import('./Report.vue'),
    name: 'formio_submission_report',
    meta: { requiresAuth: true }
  },
  {
    path: '/forms/:path*',
    component: () => import('./Show.vue'),
    name: 'formio_form_show',
    meta: { requiresAuth: true }
  }
];
