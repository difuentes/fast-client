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
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}
</style>
