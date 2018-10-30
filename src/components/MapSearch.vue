<template>
  <QLayoutDrawer side="right" v-model="showRight">
    <q-list-header>Right Panel</q-list-header>
    <div style="padding: 25px 16px 16px;">
      <p class="caption" v-for="n in 50" :key="`right-${n}`">
        <em>Right Panel has intended scroll</em>
      </p>
    </div>
  </QLayoutDrawer>
</template>
<script>
export default {
  name: 'MapSearch',
  props: {
    show: Boolean
  },
  data() {
    return {
      showRight: this.show
    };
  },
  watch: {
    show() {
      this.showRight = this.show;
    }
  }
};
</script>
