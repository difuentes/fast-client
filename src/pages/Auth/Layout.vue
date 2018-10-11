<template>
  <Container> 
    <router-view />
  </Container>
</template>

<script>
import Container from 'components/Container';

export default {
  name: 'AuthLayout',
  components: {
    Container
  }
};
</script>

<style>
</style>
