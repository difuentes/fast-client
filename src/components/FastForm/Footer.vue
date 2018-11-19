<template>
  <div class="footer">
    <ul class="nav-pills">
      <li
        v-for="(page, index) in childrenFormio.pages"
        :key="page.key"
        :class="childrenFormio.page === index ? 'nav-item current' : 'nav-item'"
      >
        <a class="nav-link" @click="setPage(page.key)">
          <QIcon name="thumb_up"/>
          {{page.title}}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  props: ['childrenFormio'],
  data() {
    return {};
  },
  methods: {
    isCurrent() {},
    setPage(key) {
      this.childrenFormio.setPage(this.childrenFormio.getPageIndexByKey(key));
    }
  },
  watch: {
    // eslint-disable-next-line
    childrenFormio: function(newValue) {}
  },
  async mounted() {
    // console.log(this.childrenFormio);
  }
};
</script>
