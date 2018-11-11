<template>
  <div class="form-login">
    <span v-if="!form">
    Loading form...
    </span>
    <Formio
      :form="form"
      :language="language"
      :key="error"
      :options="options"
      v-on:submit="handleSubmit"
      v-else
    />
  </div>
</template>
<script>
import { Form as Formio } from 'vue-formio';
import { Form, Translation, Utilities } from 'fast-fastjs';

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
      async get() {
        return Form.local()
          .where('data.path', '=', this.path)
          .first();
      },
      transform(form) {
        return Utilities.get(() => form.data, undefined);
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
