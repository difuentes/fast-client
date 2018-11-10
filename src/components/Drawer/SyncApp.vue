<template>
  <QItem @click.native="syncApp()" class="drawer-item">
    <QItemSide icon="swap_vert"/>
    <QItemMain :label="$t('Sync App')"/>
  </QItem>
</template>
<script>
import { FAST } from 'fast-fastjs';

export default {
  name: 'SyncApp',
  methods: {
    async syncApp() {
      this.$swal({
        title: this.$t('Updating...'),
        text: this.$t('Wait until the App is Updated. This can take a couple minutes...'),
        showCancelButton: false,
        onOpen: async () => {
          this.$swal.showLoading();
          await FAST.sync({ appConf: this.$appConf });
          this.$swal.close();
          this.$swal({
            title: this.$t('Updated'),
            text: this.$t('You need to reload the page to see the changes. Want to do it now?'),
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonClass: 'modalCancel',
            confirmButtonText: this.$t('Yes'),
            cancelButtonText: this.$t('No')
          }).then(async () => {
            window.location.reload(true);
          });
        }
      });
    }
  }
};
</script>
