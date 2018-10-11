// import something here
// // import something here
import { Moment, FAST } from 'fast-fastjs';
import initialConfig from '../../.fast/config';

// leave the export, even if you don't use it
export default async ({ app, Vue }) => {
  Moment.setLocales();
  const { config } = await FAST.start({ appConf: initialConfig });
  Vue.prototype.$FAST_CONFIG = config;
  /* eslint-disable-next-line no-new */
  new Vue(app);
};
