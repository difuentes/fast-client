<template>
  <QToolbarTitle class="secondary-text breadcrumbs">
    <QBreadcrumbs>
      <QBreadcrumbs-el :label="$t('Dashboard')"/>
      <QBreadcrumbs-el :label="formTitle"/>
      <QBreadcrumbs-el v-if="isSubmission" label="Submission"/>
    </QBreadcrumbs>
  </QToolbarTitle>
</template>

<script>
import { Form } from 'fast-fastjs';
// import { Base64 } from 'js-base64';

export default {
  name: 'Breadcrumb',
  data() {
    console.log(this);
    return {
      isSubmission: this.$route.path.includes('submission'),
      formTitle: ''
    };
  },
  asyncData: {
    formTitle: {
      async get() {
        const result = await Form.local()
          .where('data.path', '=', this.$route.params.path)
          .first();
        if (!result) return 'Form Title';
        return result.data.title;
      },
      transform(result) {
        return result;
      }
    }
  }
};
</script>
