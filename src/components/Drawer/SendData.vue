<template>
  <QItem v-if="shouldDisplay" @click.native="sendData()" class="drawer-item" >
    <QItemSide icon="swap_vert" />
    <QItemMain :label="$t('Send Offline Data')"/>
  </QItem>         
</template>

<script>
import { Submission, Sync } from 'fast-fastjs';

export default {
  name: 'SendData',
  data() {
    return {
      shouldDisplay: false
    };
  },
  methods: {
    async sendData() {
      this.$swal({
        title: this.$t('Sending Data...'),
        text: this.$t('We are uploading your data. This can take a couple minutes...'),
        showCancelButton: false,
        onOpen: async () => {
          this.$swal.showLoading();
          const unsyncSubmissions = await Submission.local().getUnsync();
          if (unsyncSubmissions.length > 0) {
            await Sync.now();
            this.$swal.close();
            this.$swal({
              title: this.$t('Uploaded'),
              text: this.$t('Your data was uploaded'),
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonClass: 'modalCancel',
              confirmButtonText: this.$t('Ok')
            });
          } else {
            this.$swal({
              title: this.$t('Nothing to upload'),
              text: this.$t('Your data was already uploaded'),
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonClass: 'modalCancel',
              confirmButtonText: this.$t('Ok')
            });
          }
        }
      });
    }
  }
};
</script>
