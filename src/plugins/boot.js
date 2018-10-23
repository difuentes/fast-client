import VueI18n from 'vue-i18n';
import { Moment, FAST } from 'fast-fastjs';
import initialConfig from '../../.fast/config';

// leave the export, even if you don't use it
export default async ({ app, Vue }) => {
  Moment.setLocales();
  /* eslint-disable-next-line */
  console.log(initialConfig);
  const { config, translations } = await FAST.start({ appConf: initialConfig });
  Vue.prototype.$FAST_CONFIG = config;
  Vue.prototype.$appConf = initialConfig;

  Vue.use(VueI18n);
  app.i18n = new VueI18n({
    locale: localStorage.getItem('defaultLenguage') || 'en',
    messages: translations
  });
  /* eslint-disable-next-line no-new */
  new Vue(app);
};
