<template>
  <div style="color:black">
    <q-side-link
      multiline
      highlight
      item
      v-if="page.SHOW_LD && page.shouldDisplay"
      :to="to(page)"
      :key="page.url"
      v-for="page in pages"
    >
      <q-item-side :icon="page.icon"/>
      <q-item-main :label="$t(page.title)"/>
    </q-side-link>
  </div>
</template>
<script>
export default {
  name: 'PageLinks',
  props: ['pages'],
  watch: {
    pages: function(val) {}
  },
  methods: {
    to(page) {
      var to;
      to = { name: 'pageManager', params: { path: page.url } };
      if (page.internal) {
        to = { name: page.internalUrl };
      }

      console.log('to', to);
      return to;
    }
  }
};
</script>
