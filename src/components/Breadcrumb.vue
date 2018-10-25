<template>
  <QToolbarTitle class="secondary-text breadcrumbs">
    <QBreadcrumbs>
      <QBreadcrumbs-el :label="$t('Dashboard')"/>
      <QBreadcrumbs-el :label="form.title"/>
      <QBreadcrumbs-el label="Breadcrumbs"/>
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
      submission: ''
    };
  },
  asyncData: {
    async form() {
      const { data } = await Form.local()
        .where('data.path', '=', this.$route.params.path)
        .first();
      return data;
    }
  }
};
</script>
