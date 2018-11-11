<template>
  <div class="fastform-container">
    <div class="header">
      <h4 v-if="form" class="title">{{$t(form.title)}}</h4>
    </div>
    <slot/>
    <Footer v-if="childrenFormio && footer" :childrenFormio="childrenFormio"/>
  </div>
</template>

<script>
import Footer from './Footer';

export default {
  name: 'FormContainer',
  components: {
    Footer
  },
  props: ['form', 'formio', 'footer'],
  data() {
    return {
      childrenFormio: ''
    };
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
