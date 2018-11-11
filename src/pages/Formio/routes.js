const routes = [
  {
    path: '/forms/:path*/submission',
    component: () => import('./Create.vue'),
    meta: { requiresAuth: true }
  },
  {
    name: 'profile',
    path: '/profile/forms/:path*/submission/:idSubmission/update',
    component: () => import('./Create.vue'),
    meta: { requiresAuth: true }
  },
  {
    name: 'formio_submission_update',
    path: '/forms/:path*/submission/:idSubmission/update',
    component: () => import('./Create.vue'),
    meta: { requiresAuth: true }
  },
  {
    name: 'formio_submission_report',
    path: '/forms/:path*/submission/:idSubmission/report',
    component: () => import('./Report.vue'),
    meta: { requiresAuth: true }
  },
  {
    name: 'formio_form_show',
    path: '/forms/:path*',
    component: () => import('./Show.vue'),
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
