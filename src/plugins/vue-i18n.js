import VueI18n from 'vue-i18n';

export default ({ Vue }) => {
  Vue.use(VueI18n);
  const i18n = new VueI18n({
    locale: localStorage.getItem('defaultLenguage') || 'en', // set locale
    messages // set locale messages
  });
};
