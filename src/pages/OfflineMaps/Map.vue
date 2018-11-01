<template>
  <QPage>
    <sweet-modal ref="dialogModal">
      {{ modalMessage }}
      <QBtn small slot="button" color="primary" @click="dialogConfirmed()">Yes</QBtn>
    </sweet-modal>
    <LMap
      ref="map"
      id="map"
      :zoom="zoom"
      :options="mapOptions"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <!-- <l-tile-layer :url="url" :attribution="attribution"/> -->
    </LMap>
  </QPage>
</template>
<style>
body {
  padding: 0;
  margin: 0;
}

html,
body,
#map {
  height: 100vh;
  width: 100vw;
  z-index: 1;
}

.q-page-sticky.q-layout-transition.row.flex-center.fixed-bottom-right.q-page-sticky-shrink {
  z-index: 2;
}

.q-page-sticky.q-layout-transition.row.flex-center.fixed-bottom-left.q-page-sticky-shrink {
  z-index: 2;
}

.asd__inner-wrapper {
  margin-left: 0 !important;
}
</style>
<script>
import { LMap, LTileLayer, LMarker, LPopup, LControlZoom } from 'vue2-leaflet';
import { SweetModal } from 'sweet-modal-vue';
import L from 'leaflet';
// eslint-disable-next-line
import LOffline from 'leaflet-offline';
import moment from 'moment';
import 'leaflet/dist/leaflet.css';
import fullLoading from '../../components/fullLoading';
import tilesDB from './tilesDB';

export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LControlZoom,
    SweetModal
  },
  data() {
    return {
      zoom: 18,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 18,
      zoomValues: {
        min: 8,
        max: 18
      },
      mapOptions: { zoomControl: false, attributionControl: false },
      me: null,
      map: null,
      tilesToSave: 0,
      modalMessage: '',
      modalType: '',
      modalButtonCallback: null
    };
  },
  methods: {
    closeModal() {
      this.$refs.dialogModal.close();
    },
    dialogConfirmed() {
      this.modalButtonCallback();
      this.closeModal();
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    time() {
      this.currentDate = moment().format('LLLL');
      setTimeout(this.time, 1000);
    },
    setToCurrentLocation() {
      fullLoading.show(this.$t('Getting GPS position'));
      if (this.me) {
        this.map.removeLayer(this.me);
        this.map.removeLayer(this.myRadius);
      }
      this.map.locate({ setView: true, maxZoom: 18, timeout: 7000, enableHighAccuracy: true });
    },
    async onLocationFound(e) {
      fullLoading.hide();
      const radius = e.accuracy / 2;
      // eslint-disable-next-line
      this.me = new L.marker(e.latlng, {
        icon: L.AwesomeMarkers.icon({
          icon: 'fas fa-male',
          markerColor: 'black',
          prefix: 'fa',
          spin: false
        }),
        draggable: 'true'
      });
      // eslint-disable-next-line
      this.myRadius = new L.circle(e.latlng, radius);

      this.myRadius.addTo(this.map);

      this.me.on('dragend', event => {
        const mark = event.target;
        const position = this.me.getLatLng();
        mark.setLatLng(new L.LatLng(position.lat, position.lng), { draggable: 'true' });
        this.myRadius.setLatLng(new L.LatLng(position.lat, position.lng), { draggable: 'true' });
        this.map.panTo(new L.LatLng(position.lat, position.lng));
      });
      this.map.addLayer(this.me);
    },
    onLocationError(e) {
      fullLoading.hide();
      // eslint-disable-next-line
      console.log(e);
    }
  },
  async mounted() {
    this.time();

    this.$nextTick(() => {
      this.$refs.map.mapObject._onResize();
      this.map = this.$refs.map.mapObject;

      const offlineLayer = L.tileLayer.offline(this.url, tilesDB, {
        attribution: this.attribution,
        minZoom: this.zoomValues.min,
        maxZoom: this.zoomValues.max,
        crossOrigin: true
      });

      const offlineControl = L.control.offline(offlineLayer, tilesDB, {
        position: 'bottomleft',
        saveButtonHtml: '<i class="fa fa-download" aria-hidden="true"></i>',
        removeButtonHtml: '<i class="fa fa-trash" aria-hidden="true"></i>',
        confirmSavingCallback: async (nTilesToSave, continueSaveTiles) => {
          this.tilesToSave = nTilesToSave;
          this.modalMessage = `Save ${nTilesToSave} tiles?`;
          this.modalButtonCallback = continueSaveTiles;
          this.$refs.dialogModal.open();
        },
        confirmRemovalCallback: async continueRemoveTiles => {
          this.modalMessage = 'Delete all tiles?';
          this.modalButtonCallback = continueRemoveTiles;
          this.$refs.dialogModal.open();
        },
        minZoom: this.zoomValues.min,
        maxZoom: this.zoomValues.max
      });

      offlineLayer.addTo(this.map);
      offlineControl.addTo(this.map);

      offlineLayer.on('offline:below-min-zoom-error', () => {
        this.modalMessage = 'Cannot save tiles below minimum zoom level.';
        this.$refs.dialogModal.open();
      });

      offlineLayer.on('offline:save-start', data => {
        // eslint-disable-next-line
        console.log(`Saving ${data.nTilesToSave} tiles.`);
      });

      offlineLayer.on('offline:save-end', () => {
        // eslint-disable-next-line
        console.log('All the tiles were saved');
      });

      offlineLayer.on('offline:save-error', err => {
        // eslint-disable-next-line
        console.error(`Error when saving tiles: ${err}`);
      });

      offlineLayer.on('offline:remove-start', () => {
        // eslint-disable-next-line
        console.log('Removing tiles.');
      });

      offlineLayer.on('offline:remove-end', () => {
        this.modalMessage = 'All the tiles were removed';
        this.modalButtonCallback = this.closeModal;
        this.$refs.dialogModal.open();
      });

      offlineLayer.on('offline:remove-error', err => {
        // eslint-disable-next-line
        console.error(`Error when removing tiles: ${err}`);
      });

      this.setToCurrentLocation();
      this.map.on('locationfound', this.onLocationFound);
      this.map.on('locationerror', this.onLocationError);
    });
  }
};
</script>
