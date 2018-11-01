<template>
  <div class="fastform-container">
    <button v-on:click="nextPage">next page</button>
    <div class="header">
      <h4 v-if="form" class="title">{{form.title}}</h4>
    </div>
    <slot/>
  </div>
</template>
<script>
export default {
  name: 'FormContainer',
  props: ['form', 'formio'],
  data() {
    console.log(this, 'formContainer');
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
