<template>
  <div>
    <QItem
      class="drawer-item"
      v-for="page in pages"
      v-if="page.SHOW_LD && page.shouldDisplay"
      :key="page.url"
      @click.native="to(page)"
    >
      <QItemSide :icon="icon(page.icon)"/>
      <QItemMain :label="$t(page.title)"/>
    </QItem>
  </div>
</template>

<script>
import { Auth, Submission } from 'fast-fastjs';

export default {
  name: 'PageLinks',
  props: ['pages'],
  watch: {
    pages: () => {}
  },
  methods: {
    async to(page) {
      let to = { name: 'pageManager', params: { path: page.url } };
      if (page.internal) to = { name: page.internalUrl };
      if (page.internalUrl === 'CollectedData') to = this.goToCollectedData();
      if (page.internalUrl === 'newSurvey') to = await this.goToFormSubmission();
      this.$router.push(to);
    },
    icon(pageIcon) {
      const iconName = pageIcon.split('-');
      if (iconName[0] === 'fa') return `fa ${pageIcon}`;
      return pageIcon;
    },
    // TODO: transform this into a helper
    async goToFormSubmission() {
      const formSubmission = {
        data: {},
        draft: true,
        sync: false,
        trigger: 'createLocalDraft',
        user_email: Auth.email(),
        path: 'scoutingtraps',
        baseUrl: this.$FAST_CONFIG.APP_URL,
        created: new Date(),
        modified: new Date()
      };
      const submission = await Submission({ path: 'Scoutingtraps' })
        .local()
        .insert(formSubmission);
      const route = {
        name: 'formio_submission_update',
        params: {
          path: 'scoutingtraps',
          idSubmission: submission._id
        },
        query: {
          parent: this.$route.query.parent
        }
      };
      return route;
    },
    goToCollectedData() {
      const route = {
        name: 'formio_form_show',
        params: {
          path: 'scoutingtraps'
        }
      };
      return route;
    }
  }
};
</script>
