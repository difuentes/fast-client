<template>
  <q-layout view="lHh Lpr lFf">

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>
          FAMEWS
        </q-list-header>
        <q-item :to="{name: 'dashboard', exact: true}">
          <q-item-side icon="pin_drop" />
          <q-item-main :label="$t('Home')" />
        </q-item>

        <q-item-separator />


        <q-item  style="cursor:pointer" @click.native="syncApp()" >
        <q-tooltip anchor="center right" self="center left">
          <strong>{{ $t("Sync app") }}</strong>
        </q-tooltip>
        <q-item-side icon="cloud_download" left/>
        <q-item-main :label="$t('Sync Application')" />
      </q-item>

      <q-item-separator  />

      <pagelinks :pages="PAGES"></pagelinks>


     <q-item-separator  />
      <q-item @click.native="handleLogout()">
          <q-item-side icon="ion-log-out" color="red" />
          <q-item-main :label="$t('Logout')" />
        </q-item>

      </q-list>
    </q-layout-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { Pages, Auth, Utilities, FAST, Event } from 'fast-fastjs';
import pagelinks from '../components/pageLinks';
import fullLoading from '../components/fullLoading';

export default {
  components: {
    pagelinks
  },
  name: 'Layout',
  created() {
    Event.listen({ name: 'FAST:LEFTDRAWER:TOGGLE', callback: this.toggleLeftDrawer });
  },
  beforeDestroy() {
    Event.remove({ name: 'FAST:LEFTDRAWER:TOGGLE', callback: this.toggleLeftDrawer });
  },
  data() {
    return {
      leftDrawerOpen: false
    };
  },
  asyncData: {
    PAGES: {
      async get() {
        const result = await Pages.local().first();
        const pages = await result.pages.map(async page => {
          page.cards.map(async card => {
            card.shouldDisplay = await Auth.hasRoleIdIn(card.access);
            card.actions.map(async action => {
              action.shouldDisplay = await Auth.hasRoleIdIn(action.access);
            });
          });
          page.shouldDisplay = await Auth.hasRoleIdIn(page.access);
          return page;
        });
        return Promise.all(pages);
      },
      transform(result) {
        return result.sort((a, b) => {
          const A = Utilities.getFromPath(a, 'index', undefined).value;
          const B = Utilities.getFromPath(b, 'index', undefined).value;
          return A > B ? 1 : -1;
        });
      }
    }
  },
  methods: {
    async syncApp() {
      fullLoading.show(this.$t('Wait until the App is Updated. This can take a couple minutes...'));
      await FAST.sync({ appConf: this.$appConf });
      this.leftDrawerOpen = false;
      window.location.reload(true);
      fullLoading.hide();
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    async handleLogout() {
      await Auth.logOut();
      this.$router.push({
        path: '/login'
      });
    }
  }
};
</script>

<style>
.q-page-sticky.q-layout-transition.row.flex-center.fixed-top-left.q-page-sticky-shrink {
  z-index: 2;
}
</style>
<style lang="scss">
@import '~bootswatch/dist/materia/bootstrap.min.css';
@import '~formiojs/dist/formio.full.min.css';
</style>
