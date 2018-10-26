<template>
  <div>
    <QItem
      class="drawer-item"
      v-for="page in pages"
      v-if="page.SHOW_LD && page.shouldDisplay"
      :key="page.url"
      :to="to(page)"
    >
      <QItemSide :icon="icon(page.icon)"/>
      <QItemMain :label="$t(page.title)"/>
    </QItem>
  </div>
</template>

<script>
export default {
  name: 'PageLinks',
  props: ['pages'],
  watch: {
    pages: () => {}
  },
  methods: {
    to(page) {
      let to = { name: 'pageManager', params: { path: page.url } };
      if (page.internal) to = { name: page.internalUrl };
      return to;
    },
    icon(pageIcon) {
      const iconName = pageIcon.split('-');
      if (iconName[0] === 'fa') return `fa ${pageIcon}`;
      return pageIcon;
    }
  }
};
</script>
