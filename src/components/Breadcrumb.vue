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
    return {
      isSubmission: this.currentRoute ? this.currentRoute.path.includes('submission') : false,
      formTitle: undefined,
      currentRoute: ''
    };
  },
  watch: {
    async $route(to) {
      this.currentRoute = to;
      const result = await Form.local()
        .where('data.path', '=', to.params.path)
        .first();

      this.formTitle = !result ? to.params.path : result.data.title;
    }
  }
};
</script>
