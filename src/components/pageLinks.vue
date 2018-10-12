<template>
<div style="color:black">
   <q-item  v-if="page.SHOW_LD && page.shouldDisplay" :to='to(page)' :key="page.url" v-for="page in pages">
      <q-item-side :icon="page.icon" />
      <q-item-main :label="$t(page.title)"/>
    </q-item>
</div>
</template>
<script>
export default {
  name: 'pagelinks',
  props: ['pages'],
  watch: {
    pages: () => {}
  },
  methods: {
    to(page) {
      let to;
      to = { name: 'pageManager', params: { pageId: page.url } };
      if (page.internal) {
        to = { name: page.internalUrl };
      }
      return to;
    }
  }
};
</script>
