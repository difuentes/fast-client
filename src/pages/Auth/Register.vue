<template>
  <div class="container">
    <div class="row">
      <div class="col-xl-6 col-lg-6 col-md-9 col-sm-12 col-xs-12" style="margin:auto">
        <div class="wrap">
          <p class="form-title">
            {{$FAST_CONFIG.APP_FANTACY_NAME}}
            <div class="form-subtitle"> {{$FAST_CONFIG.APP_PHRASE}}</div>
          </p>
          <div class="form-login" id="registerForm">
            <p class="text-center pull-right" style="text-decoration:underline">
              <router-link :to="{ path: 'login' }">
                <h5>{{$t('Back to login')}}</h5></router-link>
            </p>
            <br />
            <formio
              :form="form"
              :options="options"
              :language="language"
              v-on:submit="submit"
              v-if="form && options"/>
            <formio :formURL="$FAST_CONFIG.APP_URL + '/userregister'" hashField="password" />
            <br />
            <p class="text-center">
              <router-link :to="{ path: 'login' }">
              <h5>{{$t('Back to login')}}</h5></router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Form as vForm } from 'vue-formio';
import { OfflinePlugin, Form } from 'fast-fastjs';
import Formio from 'formiojs/Formio';

export default {
  components: {
    formio: vForm
  },
  data() {
    const language = localStorage.getItem('defaultLenguage') || 'en';
    return {
      language,
      formUrl: `${this.$FAST_CONFIG.APP_URL}/userregister`
    };
  },
  asyncData: {
    form: {
      get() {
        return Form.local().findOne({
          'data.path': 'userregister'
        });
      },
      transform(result) {
        return result.data;
      }
    },
    options: {
      async get() {
        const i18n = await OfflinePlugin.getLocalTranslations();
        return { i18n };
      },
      transform(result) {
        return result;
      }
    }
  },
  methods: {
    submit(event) {
      const formSubmission = {
        data: event.data
      };
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
