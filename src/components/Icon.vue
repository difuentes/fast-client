<template>
  <div class="icon">
    <q-icon :name="`fas ${name}`"/>
  </div>
</template>

<script>
export default {
  name: 'Icon',
  props: ['name']
};
</script>

<style>
.icon {
  height: 55px;
  width: 55px;
  align-items: center;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  padding: 12px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
  border-radius: 50% !important;
  background: #027be375;
  color: #027be3;
  font-size: 24px;
  vertical-align: text-top;
}
</style>
