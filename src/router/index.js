import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import { Auth } from 'fast-fastjs';
import { Fluent } from 'fast-fluent';
import fullLoading from 'components/fullLoading';
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

  Router.beforeEach(async (to, from, next) => {
    fullLoading.show('Loading...');

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

    // Offline map check
    const Tile = Fluent.extend({
      properties: {
        name: 'MapTiles',
        remoteConnection: undefined
      }
    })();

    const tile = await Tile.local().first();

    if (Auth.user() && !tile && to.name !== 'maps') {
      next(false);
      Router.push({ name: 'maps', params: { noTiles: true } });
      // next(false);
    }

    window.scrollTo(0, 0);
    next();
  });

  Router.afterEach(() => {
    fullLoading.hide();
  });

  return Router;
}
