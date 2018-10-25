<template>
  <QLayout view="lHh Lpr lFf">
    <!-- Left Side Drawer -->
    <Drawer :show="showLeft"/>
    <QPageSticky
      class='btn-map-corner'
      position="top-left"
      :offset="[18, 18]">  
      <QBtn
        class="btn-primary"
        flat round dense
        size="lg"
        @click="showLeft = !showLeft"
        icon="menu"/>
      </QPageSticky>
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

  name: 'MapLayout'
};
</script>
