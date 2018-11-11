<template>
  <actionCards :page="JSON.stringify(page)" v-bind:key="$route.path"></actionCards>
  <!-- <div class="pageTitle">{{page && page.title ? $t(page.title) : ''}}</div>
  <Breadcrumb :parent="$route.query.parent" :currentPageTitle="pageTitle"/>-->
</template>

<script>
import { Pages, Auth, Utilities } from 'fast-fastjs';
import Breadcrumb from 'components/Breadcrumb';
import Promise from 'bluebird';
import _cloneDeep from 'lodash/cloneDeep';
import actionCards from 'components/actionCards';

export default {
  components: {
    actionCards,
    Breadcrumb
  },
  asyncData: {
    page: {
      async get() {
        let result = await Pages.local().first();
        result = _cloneDeep(result);
        const page = this.filterPage(result.pages, this.$route.params.path);
        page.shouldDisplay = await Auth.hasRoleIdIn(page.access);
        await Promise.map(page.cards, async card => {
          card.shouldDisplay = await Auth.hasRoleIdIn(card.access);

          await Promise.map(card.actions, async action => {
            action.shouldDisplay = await Auth.hasRoleIdIn(action.access);
            return action;
          });
          return card;
        });

        return page;
      },
      transform(result) {
        return result;
      }
    }
  },
  data() {
    return {
      breadCrumbTitle: Utilities.get(
        () => `/${JSON.parse(atob(this.$route.query.parent)).title}`,
        ''
      )
    };
  },
  methods: {
    breadCrumbClick() {
      this.$router.push({
        name: 'pageManager',
        params: { path: JSON.parse(atob(this.$route.query.parent)).url }
      });
    },
    filterPage(pages, path) {
      return pages.filter(page => page.url === path)[0];
    }
  },
  computed: {
    pageTitle() {
      return this.page && this.page.title ? this.$t(this.page.title) : '';
    }
  }
};
</script>
