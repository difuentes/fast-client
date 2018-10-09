export default [
  { name: 'login', path: '/login', component: () => import('./Login') },
  { name: 'register', path: '/register', component: () => import('./Register') }
];
