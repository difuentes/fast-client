<template>
<div class="container">
    <slot></slot>
</div>  
</template>
<script>
export default {
  name: 'Container'
};
</script>
<style>
.container {
  padding: 20px;
  padding-top: 0px;
  padding-bottom: 0;
  margin: 0 auto;
}
</style>
