<template>
  <QItem @click.native="goToTranslations()" class="drawer-item">
    <QItemSide icon="translate"/>
    <QItemMain :label="$t('Translations')"/>
  </QItem>
</template>

<script>
import { Auth } from 'fast-fastjs';

export default {
  name: 'Translate',
  data() {
    return {
      isAdmin: this.checkRole()
    };
  },
  methods: {
    checkRole() {
      return Auth.hasRole('Administrator');
    },
    goToTranslations() {
      this.$router.push('/settings/translations');
    }
  }
};
</script>
