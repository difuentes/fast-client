<template>
  <div class="fastform-container">
    <div class="header">
      <h4 v-if="form" class="title">{{$t(form.title)}}</h4>
      <button class="btn-sm btn-primary" v-on:click="nextPage">next page</button>
    </div>
    <slot/>
    <Footer v-if="childrenFormio" :childrenFormio="childrenFormio"/>
  </div>
</template>

<script>
import Footer from './Footer';

export default {
  name: 'FormContainer',
  components: {
    Footer
  },
  props: ['form', 'formio'],
  data() {
    return {
      childrenFormio: ''
    };
  },
  methods: {
    async nextPage() {
      await this.childrenFormio.nextPage();
    },
    async prevPage() {
      await this.childrenFormio.prevPage();
    }
  },
  watch: {
    form: () => {},
    // eslint-disable-next-line
    formio: function(newValue) {
      if (!newValue) return;
      const { formio } = newValue;
      this.childrenFormio = formio;
    }
  }
};
</script>
