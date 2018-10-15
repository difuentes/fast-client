<template>
  <div class="col-xl-6 col-lg-6 col-md-9 col-sm-12 col-xs-12" style="margin:auto">
    <div class="box">
      <div class="wrap">
        <div class="form-title">
          <h3>{{$t($FAST_CONFIG.APP_FANTACY_NAME)}}</h3>
          <h5>{{$t($FAST_CONFIG.APP_PHRASE)}}</h5>
        </div>
        <div class="form-login">
          <Formio
            :form="form"
            :language="language"
            v-on:submit="handleLogin"
            v-if="form "
            :key="error" />
        </div>
        </div>
      </div>
  </div>
</template>

<script>
import { Form as Formio } from 'vue-formio';
import { Form, Translation, Auth } from 'fast-fastjs';

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
        return Form.local()
          .where('data.path', '=', 'user/login')
          .first();
      },
      transform({ data }) {
        return data;
      }
    },
    options: {
      async get() {
        const i18n = await Translation.local().first();
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
      this.credentials.username = event.data.username
        ? event.data.username.trim()
        : event.data.email.trim();
      this.credentials.email = this.credentials.username;
      try {
        /* eslint-disable */
        console.log(this.credentials);
        await Auth.attempt(
          this.credentials,
          this.isAdminLogin ? 'admin' : undefined
        );
        this.$router.push({
          name: 'dashboard'
        });
      } catch (error) {
        this.error = Math.random();
        // eslint-disable-next-line
        console.log('Could not login', error);
      }
    }
  }
};
</script>
