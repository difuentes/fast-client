<template>
<div v-bind:style="logoContainerStyle">
  <img v-bind:style="logoStyle" src="statics/FAO-logo.svg" alt="FAO">
</div>  
</template>

<script>
export default {
  name: 'Logo',
  props: ['padding', 'height', 'width'],
  data() {
    return {
      logoContainerStyle: {
        padding: this.padding || '50px',
        textAlign: 'center'
      },
      logoStyle: {
        position: 'relative',
        height: this.height || 'auto',
        width: this.width || 'auto'
      }
    };
  }
};
</script>
