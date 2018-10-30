<template>
  <div>
    <LMap
      ref="map"
      id="map"
      :zoom="zoom"
      :options="mapOptions"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <LControlZoom style="margin-top: 20px;" position="bottomleft"/>
      <LTileLayer :url="url" :attribution="attribution"/>
    </LMap>
    <QPageSticky class="btn-map-corner" position="bottom-left" :offset="[18, 18]">
      <QBtn
        round
        class="btn-primary-inverted"
        icon="my_location"
        size="md"
        @click="setToCurrentLocation"
      />
    </QPageSticky>
    <SearchBar/>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LControlZoom } from 'vue2-leaflet';
import moment from 'moment';
import fullLoading from 'src/helpers/fullLoading';
import { createMarker, createCircle } from './leafletHelpers';
import FastMapMixin from './FastMapMixin';
import SearchBar from './SearchBar';
import 'leaflet/dist/leaflet.css';

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LControlZoom,
    SearchBar
  },
  name: 'FastMap',
  mixins: [FastMapMixin],
  data() {
    return {
      zoom: 18,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 18,
      showParagraph: false,
      mapOptions: { zoomControl: false, attributionControl: false },
      markers: [],
      rangeValues: {
        min: 1,
        max: 12
      },
      zoomValues: {
        min: 5,
        max: 50
      },
      checked: false,
      currentDate: moment().format('LLLL')
    };
  },
  async mounted() {
    this.time();
    this.$nextTick(() => {
      this.$refs.map.mapObject._onResize();
      this.map = this.$refs.map.mapObject;
      this.setToCurrentLocation();
      this.map.on('locationfound', this.onLocationFound);
      this.map.on('locationerror', this.onLocationError);
    });
  },
  methods: {
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
      this.me = createMarker(e);
      this.myRadius = createCircle(e);
      this.myRadius.addTo(this.map);
      this.me.on('dragend', event => {
        const mark = event.target;
        const position = this.me.getLatLng();
        mark.setLatLng(new L.LatLng(position.lat, position.lng), { draggable: 'true' });
        this.myRadius.setLatLng(new L.LatLng(position.lat, position.lng), { draggable: 'true' });
        this.map.panTo(new L.LatLng(position.lat, position.lng));
      });
      this.map.addLayer(this.me);
      // this.markers = await this.getRemoteMarkers();
      // await this.getLocalMarkers();
    },
    onLocationError(e) {
      fullLoading.hide();
      // eslint-disable-next-line
      console.log(e);
    }
  }
};
</script>

<style>
#map {
  height: 100vh;
  width: 100vw;
  z-index: 1;
}

.awesome-marker i {
  font-size: 20px;
  margin-top: 10px;
}

.leaflet-control {
  margin-left: 34px !important;
  margin-bottom: 100px !important;
}
</style>
