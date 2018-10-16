<template>
<QLayout view="lHh Lpr lFf">
  <!-- Header -->
  <QLayoutHeader class="header">
    <!-- First row of header is a QToolbar -->
    <QToolbar>
      <!-- showLeft is a model attached to left side drawer below -->
      <QBtn
        class="btn-primary"
        flat round dense
        @click="showLeft = !showLeft"
        icon="menu"/>
      <QToolbarTitle class="secondary-font breadcrumbs">
        <q-breadcrumbs>
          <q-breadcrumbs-el label="Home" />
          <q-breadcrumbs-el label="Components" />
          <q-breadcrumbs-el label="Breadcrumbs" />
        </q-breadcrumbs>
      </QToolbarTitle>
      <!-- <QBtn
        flat round dense
        icon="person" >
      <q-popover self="top middle">
     
      <q-list separator link>
        <q-item v-close-overlay @click.native="doSomething">
          ...
        </q-item>
      </q-list>
    </q-popover>
    </QBtn> -->
      
    </QToolbar>
  </QLayoutHeader>

  <!-- Left Side Drawer -->
  <QLayoutDrawer class="sidebar" side="left" v-model="showLeft">
    <QList no-border link>
      <div class="drawer-header">
        <Logo padding="15px" width="270px"/>
      </div>
      <QItem class="drawer-item current" to="/docs">
        <QItemSide icon="dashboard" />
        <QItemMain label="Dashboard"/>
      </QItem>
      <QItem class="drawer-item" to="/forum">
        <QItemSide icon="swap_vert" />
        <QItemMain label="Sync App"/>
      </QItem>
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
    </QList>
  </QLayoutDrawer>
  <!-- sub-routes get injected here: -->
  <q-page-container>
    <router-view />
  </q-page-container>
</QLayout>
</template>

<script>
import Logo from 'components/Logo';

export default {
  components: {
    Logo
  },
  data() {
    return {
      showLeft: this.$q.platform.is.desktop
    };
  },
  name: 'AppLayout'
};
</script>

<style>
</style>
