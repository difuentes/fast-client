<template>
  <div class="col-xl-6 col-lg-6 col-md-9 col-sm-12 col-xs-12" style="margin:auto">
    <div class="box">
      <div class="wrap">
        <div class="form-title">
          <h3>{{$t($FAST_CONFIG.APP_FANTACY_NAME)}}</h3>
          <h5>{{$t($FAST_CONFIG.APP_PHRASE)}}</h5>
        </div>
        <p class="text-center" v-if="$FAST_CONFIG.ENABLE_REGISTER">
          <router-link :to="{ path: 'login' }">
            <h5>{{$t('Back to login')}}?</h5>
          </router-link>
        </p>
        <FastForm 
          @onSubmit="handleRegister"
          path='userregister' />
        </div>
      </div>
  </div>
</template>

<script>
// import { Form as Formio } from 'vue-formio';
import FastForm from 'components/FastForm';
import Formio from 'formiojs/Formio';
import { OfflinePlugin } from 'fast-fastjs';

export default {
  name: 'Register',
  components: {
    FastForm
  },
  data() {
    return {
      formUrl: `${this.$FAST_CONFIG.APP_URL}/userregister`
    };
  },
  methods: {
    async handleRegister({ data }) {
      const formSubmission = data;
      const formio = new Formio(this.formUrl);
      this.registerOfflinePlugin();
      formio
        .saveSubmission(formSubmission)
        .then(() => {
          this.$router.push({ path: 'login' });
        })
        .catch(error => {
          console.log(error);
          this.$forceUpdate();
        });
    },
    changeLanguage(language) {
      this.language = language.code;
    },
    registerOfflinePlugin() {
      // De register if there was a previous registration
      Formio.deregisterPlugin('offline');
      // Register the plugin for offline mode
      Formio.registerPlugin(
        OfflinePlugin.getPlugin({
          formio: new Formio(this.formUrl),
          hashField: true
        }),
        'offline'
      );
    }
  }
};
</script>
