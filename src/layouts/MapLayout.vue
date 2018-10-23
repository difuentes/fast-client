<template>
  <QLayout view="lHh Lpr lFf">
    <!-- Left Side Drawer -->
    <Drawer :show="showLeft"/>
    <QPageSticky
      position="top-left"
      :offset="[18, 18]">  
      <QBtn
        dense flat
        aria-label="Menu"
        color="black"
        size="lg"
        @click="showLeft = !showLeft">
          <QIcon name="menu" />
      </QBtn>
    </QPageSticky>
    <q-page-container>
      <router-view />
    </q-page-container>
  </QLayout>
</template>

<script>
import Drawer from 'components/Drawer';

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
