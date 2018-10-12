export default [
  {
    path: '/forms/:idForm*/submission',
    component: () => import('./Create'),
    name: 'formio_form_submission',
    meta: { requiresAuth: false }
  },
  {
    path: '/profile/forms/:idForm*/submission/:idSubmission/update',
    component: () => import('./Create'),
    name: 'profile',
    meta: { requiresAuth: false }
  },
  {
    path: '/forms/:idForm*/submission/:idSubmission/update',
    component: () => import('./Create'),
    name: 'formio_submission_update',
    meta: { requiresAuth: false }
  },
  {
    path: '/forms/:idForm*/submission/:idSubmission/report',
    component: () => import('./Report'),
    name: 'formio_submission_report',
    meta: { requiresAuth: false }
  },
  {
    path: '/forms/:idForm*',
    component: () => import('./Show'),
    name: 'formio_form_show',
    meta: { requiresAuth: false }
  }
];
