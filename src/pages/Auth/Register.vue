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
        <FastForm @onSubmit="handleRegister" path="userregister"/>
      </div>
    </div>
    <SweetModal hide-close-button blocking ref="errorModal" icon="error">
      <h2>{{ $t('Email already taken') }}</h2>
      <p>{{ $t('That email is already taken. Try a different one') }}</p>
      <QBtn slot="button" color="primary" v-on:click="closeModal('errorModal')">{{ $t('Close') }}</QBtn>
    </SweetModal>
    <SweetModal hide-close-button blocking ref="successModal" icon="success">
      <h2>{{ $t('Success!') }}</h2>
      <QBtn
        slot="button"
        color="primary"
        v-on:click="$router.push({ path: 'login' })"
      >{{ $t('Close') }}</QBtn>
    </SweetModal>
  </div>
</template>

<script>
import FastForm from 'components/FastForm/FastForm';
import { SweetModal } from 'sweet-modal-vue';
import to from 'await-to-js';
import { Hash, User } from 'fast-fastjs';

export default {
  name: 'Register',
  components: {
    FastForm,
    SweetModal
  },
  data() {
    return {
      formUrl: `${this.$FAST_CONFIG.APP_URL}/userregister`
    };
  },
  methods: {
    async handleRegister({ data }) {
      const formData = data;
      formData.hashedPassword = await Hash.string(data.password);

      const [error, user] = await to(
        User.storeLocally({
          data: formData,
          sync: false,
          path: 'userregister'
        })
      );

      if (error) {
        // eslint-disable-next-line
        console.error(error);
        this.$refs.errorModal.open();
      }

      if (user) {
        this.$refs.successModal.open();
      }
    },
    changeLanguage(language) {
      this.language = language.code;
    },
    closeModal(name) {
      this.$refs[name].close();
    }
  }
};
</script>
