<template>
  <div class="col-xl-6 col-lg-6 col-md-9 col-sm-12 col-xs-12" style="margin:auto">
    <div class="box">
      <div class="wrap">
        <div class="form-title">
          <h3>{{$t($FAST_CONFIG.APP_FANTACY_NAME)}}</h3>
          <h5>{{$t($FAST_CONFIG.APP_PHRASE)}}</h5>
        </div>
        <FastForm @onSubmit="handleLogin" path="user/login"/>
        <p class="text-center" v-if="$FAST_CONFIG.ENABLE_REGISTER">
          <router-link :to="{ path: 'register' }">
            <h5>{{$t('New user')}}?</h5>
          </router-link>
          <router-link :to="{ path: 'sendreset' }">
            <h5>{{$t('Forgot your password?')}}</h5>
          </router-link>
        </p>
      </div>
    </div>
    <SweetModal hide-close-button blocking ref="errorModal" icon="error">
      <h2>{{ $t('Login failed') }}</h2>
      <p>{{ $t('Email and/or password are invalid. Try again.') }}</p>
      <QBtn slot="button" color="primary" v-on:click="closeModal('errorModal')">{{ $t('Close') }}</QBtn>
    </SweetModal>
  </div>
</template>

<script>
// import { Form as Formio } from 'vue-formio';
import FastForm from 'components/FastForm/FastForm';
import { SweetModal } from 'sweet-modal-vue';
import { Auth } from 'fast-fastjs';

export default {
  name: 'Login',
  components: {
    FastForm,
    SweetModal
  },
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    async handleLogin(event) {
      this.credentials.password = event.data.password.trim();
      this.credentials.username = event.data.username
        ? event.data.username.trim()
        : event.data.email.trim();
      this.credentials.email = this.credentials.username;
      try {
        await Auth.attempt(this.credentials, this.isAdminLogin ? 'admin' : undefined);
        this.$router.push({
          name: 'dashboard'
        });
      } catch (error) {
        this.$refs.errorModal.open();
        this.error = Math.random();
        // eslint-disable-next-line
        console.log('Could not login', error);
      }
    },
    closeModal(name) {
      this.$refs[name].close();
    }
  }
};
</script>
