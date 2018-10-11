import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import { Auth } from 'fast-fastjs';
import routes from './routes';

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function(/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes,
    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  Router.beforeEach((to, from, next) => {
    // If user is logged in and route dont require auth
    if (Auth.user() && !to.meta.requiresAuth) {
      Router.push({ name: 'dashboard' });
    }
    // If user is NOT logged in and route require auth
    if (!Auth.user() && to.meta.requiresAuth) {
      // eslint-disable-next-line
      console.log('not auth');
      next(false);
      Router.push({ name: 'login' });
    }
    window.scrollTo(0, 0);
    next();
  });

  return Router;
}
