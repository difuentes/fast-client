<template>
  <div class="image-container">
    <Container>
      <Logo/>
      <router-view/>
    </Container>
  </div>
</template>

<script>
import Container from 'components/Container';
import Logo from 'components/Logo';

export default {
  name: 'AuthLayout',
  components: {
    Container,
    Logo
  }
};
</script>

<style lang="scss">
@import '~bootswatch/dist/materia/bootstrap.min.css';
@import '~formiojs/dist/formio.full.min.css';
</style>
