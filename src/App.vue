<template>
  <div id="q-app" v-bind:style="appDynamicStyles">
    <router-view/>
  </div>
</template>

<script>
import FastClick from 'fastclick';
import phonePermissions from 'components/phonePermissions';

export default {
  name: 'App',
  created() {
    phonePermissions.get();
    window.addEventListener(
      'load',
      () => {
        if (document) {
          FastClick(document.body);
        }
      },
      false
    );
  },
  data() {
    return {
      appDynamicStyles: {
        direction: localStorage.getItem('textDirection') || 'ltr'
      }
    };
  }
};
</script>
