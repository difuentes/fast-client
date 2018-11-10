<template>
  <!-- Left Side Drawer -->
  <QLayoutDrawer class="sidebar" side="left" v-model="showLeft">
    <QList no-border link="">
      <div class="drawer-header">
        <ProfileInfo/>
      </div>
      <QItem class="drawer-item current" to="/dashboard">
        <QItemSide icon="dashboard"/>
        <QItemMain label="Dashboard"/>
      </QItem>
      <QItem class="drawer-item" to="/maps">
        <QItemSide icon="map"/>
        <QItemMain label="Offline Map"/>
      </QItem>
      <!-- <SyncApp/> -->
      <SendData/>
      <PageLinks :pages="PAGES"/>
      <QItem @click.native="handleLogout" class="drawer-item">
        <QItemSide color="red" icon="power_settings_new"/>
        <QItemMain label="Log Out"/>
      </QItem>
      <div class="drawer-footer">
        <LightLogo padding="15px" width="270px"/>
      </div>
    </QList>
  </QLayoutDrawer>
</template>

<script>
import _sortBy from 'lodash/sortBy';
import Promise from 'bluebird';
import { Auth, Pages } from 'fast-fastjs';
import Logo from 'components/Logo';
import LightLogo from 'components/LightLogo';
import ProfileInfo from 'components/ProfileInfo';
import PageLinks from './PageLinks';
import SendData from './SendData';
// import SyncApp from './SyncApp';

export default {
  name: 'Drawer',
  props: {
    show: Boolean
  },
  components: {
    Logo,
    LightLogo,
    SendData,
    // SyncApp,
    PageLinks,
    ProfileInfo
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
        return _sortBy(result, 'index');
      }
    }
  },
  data() {
    return {
      showLeft: this.show,
      PAGES: ''
    };
  },
  methods: {
    async handleLogout() {
      await Auth.logOut();
      this.$router.push({
        path: '/login'
      });
    }
  },
  watch: {
    show() {
      this.showLeft = this.show;
    }
  }
};
</script>
