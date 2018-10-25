<template>
<!-- Left Side Drawer -->
  <QLayoutDrawer class="sidebar" side="left" v-model="showLeft">
    <QList no-border link>
      <div class="drawer-header">
        <Logo padding="15px" width="270px"/>
      </div>
      <QItem class="drawer-item current" to="/dashboard">
        <QItemSide icon="dashboard" />
        <QItemMain label="Dashboard"/>
      </QItem>
      <SyncApp />
      <SendData />
      <QItem class="drawer-item" to="/chat">
        <QItemSide icon="assignment" />
        <QItemMain label="Start Survey" />
      </QItem>
      <QItem class="drawer-item" to="/twitter">
        <QItemSide icon="all inbox" />
        <QItemMain label="Collected Data" />
      </QItem>
      <QItem class="drawer-item" to="/twitter">
        <QItemSide icon="info" />
        <QItemMain label="About" />
      </QItem>
      <QItem @click.native="handleLogout" class="drawer-item">
        <QItemSide color='red' icon="power_settings_new" />
        <QItemMain label="Log Out" />
      </QItem>
    </QList>
  </QLayoutDrawer>
</template>

<script>
import { Auth } from 'fast-fastjs';
import Logo from 'components/Logo';
import SendData from './SendData';
import SyncApp from './SyncApp';

export default {
  name: 'Drawer',
  props: {
    show: Boolean
  },
  components: {
    Logo,
    SendData,
    SyncApp
  },
  data() {
    return {
      showLeft: this.show
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
