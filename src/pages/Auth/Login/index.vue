<template>
  <div class="container">
    <div class="col-xl-6 col-lg-6 col-md-9 col-sm-12 col-xs-12" style="margin:auto">
      <div class="wrap">
        <p class="form-title">
          {{$t($FAST_CONFIG.APP_FANTACY_NAME)}}
          <div class="form-subtitle"> {{$t($FAST_CONFIG.APP_PHRASE)}}</div>
        </p>
      <div class="form-login">
        <Formio
          :form="form"
          :options="options"
          :language="language"
          v-on:submit="handleLogin"
          v-if="form && options"
          :key="error" />
      </div>        
      </div>
    </div>
  </div>
</template>

<script>
import { Form as Formio } from 'vue-formio';
import { Form, OfflinePlugin, Auth } from 'fast-fastjs';

export default {
  name: 'Login',
  components: {
    Formio
  },
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      error: null,
      language: localStorage.getItem('defaultLenguage')
        ? localStorage.getItem('defaultLenguage')
        : 'en'
    };
  },
  asyncData: {
    form: {
      get() {
        return Form.remote().findOne({
          'data.path': 'user/login'
        });
      },
      transform({ data }) {
        return data;
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
    async handleLogin(event) {
      this.credentials.password = event.data.password.trim();
      this.credentials.email = event.data.username.trim();
      try {
        console.log(this.credentials);
        await Auth.attempt(
          this.credentials,
          this.$FAST_CONFIG.APP_URL,
          this.isAdminLogin ? 'admin' : undefined
        );
      } catch (error) {
        this.error = Math.random();
        // eslint-disable-next-line
        console.log('Could not login', error);
      }
    }
  }
};
</script>
