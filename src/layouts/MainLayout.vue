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
      <QToolbarTitle class="secondary-text breadcrumbs">
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
  <Drawer :show="showLeft"/>
  <!-- sub-routes get injected here: -->
  <q-page-container>
    <router-view />
  </q-page-container>
</QLayout>
</template>

<script>
import Drawer from 'components/Drawer/Drawer';

export default {
  components: {
    Drawer
  },
  data() {
    return {
      showLeft: this.$q.platform.is.desktop
    };
  },
  name: 'MainLayout'
};
</script>

<style>
</style>
