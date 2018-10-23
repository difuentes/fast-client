<template>
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
</template>

<script>
import Logo from 'components/Logo';

export default {
  name: 'Drawer',
  props: {
    show: Boolean
  },
  components: {
    Logo
  },
  data() {
    return {
      showLeft: this.show
    };
  },
  watch: {
    show() {
      this.showLeft = this.show;
    }
  }
};
</script>
