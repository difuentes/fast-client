<template>
  <div class="container-fluid col-lg-offset-1 col-lg-10" style="padding-bottom:50px">
    <QCard inline class="pageBuilderCard" v-for="page in pages" v-bind:key="page._id">
      <div v-on="page.data.staticPage ? { click: () => pushTo(page._id) } : {}">
        <QCardTitle>{{ page.data.title || ($t('No title')) }}</QCardTitle>
        <div v-if="page.data.staticPage">
          <QCardSeparator/>
          <QCardMain>
            <p>Static Page!</p>
          </QCardMain>
        </div>
      </div>
    </QCard>
    <QPageSticky>
      <QBtn round color="primary" icon="add" @click="createStaticPage"/>
    </QPageSticky>
  </div>
</template>
<style>
.q-page-sticky {
  margin: 30px !important;
}
</style>
<script>
import { Pages } from 'fast-fastjs';
import fullLoading from '../../components/fullLoading';

export default {
  name: 'ShowPages',
  data() {
    return {
      pages: null
    };
  },
  async mounted() {
    this.updatePages();
  },
  methods: {
    async createStaticPage() {
      fullLoading.show();
      const submission = await Pages.remote().insert({ data: { staticPage: true } });
      this.updatePages();
      fullLoading.hide();
      this.pushTo(submission._id);
    },
    async updatePages() {
      this.pages = await Pages.remote().get();
    },
    pushTo(submissionId) {
      this.$router.push({
        name: 'pageBuilder',
        params: {
          id: submissionId
        }
      });
    }
  }
};
</script>
