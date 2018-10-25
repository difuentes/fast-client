<template>
  <QToolbarTitle class="secondary-text breadcrumbs">
    <QBreadcrumbs>
      <QBreadcrumbs-el label="Home"/>
      <QBreadcrumbs-el label="Components"/>
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
      formTitle: this.getFormTitle(),
      submission: ''
    };
  },
  methods: {
    async getFormTitle() {
      const {
        data: { title }
      } = await Form.local()
        .where('data.path', '=', this.$route.params.path)
        .first();
      return title;
    }
  }
};
</script>
