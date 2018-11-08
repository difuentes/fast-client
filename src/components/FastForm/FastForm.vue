<template>
  <div class="form-login">
    <Formio
      :form="form"
      :language="language"
      :key="error"
      :options="options"
      v-on:submit="handleSubmit"
      v-if="form"
    />
  </div>
</template>
<script>
import { Form as Formio } from 'vue-formio';
import { Form, Translation } from 'fast-fastjs';

export default {
  name: 'FastForm',
  props: {
    path: String
  },
  components: {
    Formio
  },
  data() {
    const language = localStorage.getItem('defaultLenguage') || 'en';
    return {
      error: null,
      language,
      options: {
        noAlerts: true
      }
    };
  },
  asyncData: {
    form: {
      get() {
        return Form.local()
          .where('data.path', '=', this.path)
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
    async handleSubmit(event) {
      await this.$emit('onSubmit', event);
    }
  }
};
</script>
