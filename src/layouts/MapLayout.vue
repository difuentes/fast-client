<template>
  <QLayout view="lHh Lpr lFf">
    <!-- Left Side Drawer -->
    <Drawer :show="showLeft"/>
    <QPageSticky class="btn-map-corner" position="top-left" :offset="[18, 18]">
      <QBtn class="primary" flat round size="lg" @click="showLeft = !showLeft" icon="menu"/>
    </QPageSticky>
    <QPageContainer>
      <router-view/>
    </QPageContainer>
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
      showLeft: false
    };
  },

  name: 'MapLayout'
};
</script>
