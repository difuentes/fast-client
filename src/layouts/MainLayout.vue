<template>
  <QLayout view="lHh Lpr lFf">
    <!-- Header -->
    <QBtn
      class="btn-primary mobile-drawer"
      flat
      round
      dense
      @click.native="showLeft = !showLeft"
      icon="menu"
    />
    <Drawer :show="showLeft"/>
    <QLayoutHeader class="layout-header">
      <!-- First row of header is a QToolbar -->
      <QToolbar>
        <!-- showLeft is a model attached to left side drawer below -->
        <QBtn
          class="btn-primary"
          flat
          round
          dense
          @click.native="showLeft = !showLeft"
          icon="menu"
        />
        <Breadcrumb/>
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
        </QBtn>-->
      </QToolbar>
    </QLayoutHeader>
    <!-- Left Side Drawer -->
    <!-- sub-routes get injected here: -->
    <q-page-container>
      <router-view/>
    </q-page-container>
  </QLayout>
</template>

<script>
import Drawer from 'components/Drawer/Drawer';
import Breadcrumb from 'components/Breadcrumb';

export default {
  components: {
    Drawer,
    Breadcrumb
  },
  data() {
    return {
      showLeft: false
    };
  },
  name: 'MainLayout'
};
</script>

<style>
</style>
