<template>
  <div>
    <div
      class="initials"
    >{{`${userProfile.name} ${userProfile.surname}`.split(" ").map((n)=>n[0]).join("")}}</div>
    <div style="margin-top: 20px; text-align: center;">
      <h3 v-if="userProfile.name" style="color: #fff;">{{userProfile.name}} {{userProfile.surname}}</h3>
      <h3 v-if="!userProfile.name" style="color: #fff;">{{userProfile.email}}</h3>
    </div>
    <div style="text-align: center;">
      <QBtn @click.native="toProfile()" class="btn-sm btn-primary-inverted">{{ $t('Edit Profile') }}</QBtn>
      <QBtn
        style="margin-left: 20px"
        @click.native="changeLanguage()"
        class="btn-sm btn-primary-inverted"
      >{{ $t('Language') }}</QBtn>
    </div>
  </div>
</template>

<script>
import { Auth, Translation, Moment } from 'fast-fastjs';
/* eslint-disable */

export default {
  name: 'ProfileInfo',
  data() {
    return {
      userProfile: {
        name: ''
      },
      lenguage: localStorage.getItem('defaultLenguage')
        ? localStorage.getItem('defaultLenguage')
        : 'en',
      languages: []
    };
  },
  computed: {
    currentLanguage() {
      let language = this.languages.find(lang => {
        return lang.code === this.lenguage;
      });
      if (language && language.label) {
        return language.label;
      }
      return '';
    }
  },
  async beforeMount() {
    this.languages = await Translation.supportedLanguages();
  },
  asyncData: {
    userProfile: {
      async get() {
        const result = await Auth.user();
        return result;
      },
      transform({ data }) {
        return data;
      }
    }
  },
  methods: {
    toProfile() {
      this.$router.push({
        name: 'pageManager',
        params: {
          path: 'user-profile'
        }
      });
    },
    async changeLanguage() {
      const options = await Translation.supportedLanguages();
      let customOptions = {};

      options.forEach(option => {
        customOptions[option.code] = option.label;
      });

      const language = await this.$swal({
        title: this.$t('Select language'),
        input: 'select',
        inputOptions: customOptions,
        inputPlaceholder: this.$t('Select a language'),
        showCancelButton: true,
        inputValidator: value => {
          return new Promise(resolve => {
            if (value === '') {
              resolve(this.$t('You need to select a language'));
            }
            resolve();
          });
        }
      });

      if (language) {
        const selectedLanguage = options.find(lang => {
          return lang.code === language.value;
        });

        this.setLanguage(selectedLanguage);
      }
    },
    setLanguage(language) {
      this.$i18n.locale = language.code;
      this.lenguage = language.code;
      Moment.changeLanguage(language.code);
      localStorage.setItem('defaultLenguage', language.code);
      localStorage.setItem('textDirection', language.direction);
      // this.$eventHub.$emit('FAST:LANGUAGE:CHANGED', language);
      this.$swal({
        title: this.$t('Language Changed'),
        text: this.$t('The language was changed.'),
        type: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    }
  }
};
</script>
