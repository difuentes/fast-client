<template>
  <QLayout view="lHh Lpr lFf">
    <!-- Left Side Drawer -->
    <Drawer :show="showLeft"/>
    <MapSearch :show="showRight"/>
    <QPageSticky class="btn-map-corner" position="top-right" :offset="[18, 18]">
      <QBtn
        class="btn-primary"
        flat
        round
        dense
        size="lg"
        @click="showRight = !showRight"
        icon="search"
      />
    </QPageSticky>
    <QPageSticky class="btn-map-corner" position="top-left" :offset="[18, 18]">
      <QBtn
        class="btn-primary"
        flat
        round
        dense
        size="lg"
        @click="showLeft = !showLeft"
        icon="menu"
      />
    </QPageSticky>
    <QPageContainer>
      <router-view/>
    </QPageContainer>
  </QLayout>
</template>

<script>
import Drawer from 'components/Drawer/Drawer';
import MapSearch from 'components/MapSearch';

export default {
  components: {
    Drawer,
    MapSearch
  },
  data() {
    return {
      showLeft: this.$q.platform.is.desktop,
      showRight: false
    };
  },

  name: 'MapLayout'
};
</script>
