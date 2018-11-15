<template>
  <QPage>
    <sweet-modal ref="noTilesModal">
      {{ $t('You must select an offline area to start using the app!') }}
      <QBtn
        small
        slot="button"
        color="primary"
        @click="$refs.noTilesModal.close()"
      >{{ $t('I understand') }}</QBtn>
    </sweet-modal>
    <sweet-modal icon="warning" ref="noLocationModal">{{ $t('No location was found!') }}</sweet-modal>
    <sweet-modal ref="dialogModal">
      {{ modalMessage }}
      <QBtn small slot="button" color="primary" @click="dialogConfirmed()">Yes</QBtn>
    </sweet-modal>
    <sweet-modal
      icon="warning"
      ref="belowZoomModal"
    >{{ $t('Cannot save a map this big. Try zooming in.') }}</sweet-modal>
    <LMap
      ref="map"
      id="map"
      :zoom="zoom"
      :options="mapOptions"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <QPageSticky
        position="bottom-right"
        :offset="[18, 18]"
        style="margin-right: 18px !important;"
      >
        <QBtn round color="black" class="fab" icon="fa fa-download" @click="saveTiles()"/>
        <QBtn round color="black" class="fab" icon="fa fa-trash" @click="removeTiles()"/>
      </QPageSticky>
      <QPageSticky position="bottom-left" :offset="[18, 18]" style="margin-left: 18px !important;">
        <QBtn
          round
          class="fab"
          color="white"
          text-color="black"
          icon="my_location"
          size="md"
          @click="setToCurrentLocation"
        />
      </QPageSticky>
      <!-- <l-tile-layer :url="url" :attribution="attribution"/> -->
    </LMap>
  </QPage>
</template>
<script>
import { LMap, LTileLayer, LMarker, LPopup, LControlZoom } from 'vue2-leaflet';
import { SweetModal } from 'sweet-modal-vue';
import * as turf from '@turf/turf';
import L from 'leaflet';
import 'leaflet-offline';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers';
import { Fluent } from 'fast-fluent';
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
      zoom: 1,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 1,
      zoomValues: {
        min: 1,
        max: 18
      },
      minZoom: 13,
      mapOptions: { zoomControl: false, attributionControl: false },
      me: null,
      map: null,
      modalMessage: '',
      modalType: '',
      modalButtonCallback: null,
      myRadius: null,
      offlineTiles: null,
      offlineControl: null,
      selection: null,
      overlay: null
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
    async drawOfflineTiles() {
      const rects = await this.offlineTiles.local().get();

      rects.map(rect => {
        const bounds = [
          [rect._bounds._northEast.lat, rect._bounds._northEast.lng],
          [rect._bounds._southWest.lat, rect._bounds._southWest.lng]
        ];
        L.rectangle(bounds, rect.options).addTo(this.map);
        return rect;
      });
    },
    setToCurrentLocation() {
      fullLoading.show(this.$t('Getting GPS position'));
      if (this.me) {
        this.map.removeLayer(this.me);
      }
      this.map.locate({ setView: true, maxZoom: 18, timeout: 10000, enableHighAccuracy: true });
    },
    async onLocationFound(e) {
      fullLoading.hide();

      // eslint-disable-next-line
      this.me = new L.marker(e.latlng, {
        icon: L.AwesomeMarkers.icon({
          icon: 'fas fa-male',
          markerColor: 'black',
          prefix: 'fa',
          spin: false
        }),
        draggable: true,
        autoPan: true
      }).addTo(this.map);
    },
    onLocationError(e) {
      fullLoading.hide();
      this.$refs.noLocationModal.open();
      // eslint-disable-next-line
      console.log('location error', e);

      let location = null;
      if (this.me) {
        location = this.me.getLatLng();
        this.map.panTo(location);
      } else {
        location = this.map.getCenter();
      }

      // eslint-disable-next-line
      this.me = new L.marker(location, {
        icon: L.AwesomeMarkers.icon({
          icon: 'fas fa-male',
          markerColor: 'black',
          prefix: 'fa',
          spin: false
        }),
        draggable: true,
        autoPan: true
      }).addTo(this.map);
    },
    saveTiles() {
      let bounds = null;
      const zoomLevels = [];
      let tileUrls = [];
      const currentZoom = this.map.getZoom();
      const latlngBounds = this.selection.getBounds();

      if (currentZoom < this.minZoom) {
        this.offlineControl._baseLayer.fire('offline:below-min-zoom-error');

        return;
      }

      for (let zoom = currentZoom; zoom <= this.zoomValues.max; zoom += 1) {
        zoomLevels.push(zoom);
      }

      for (let i = 0; i < zoomLevels.length; i += 1) {
        bounds = L.bounds(
          this.map.project(latlngBounds.getNorthWest(), zoomLevels[i]),
          this.map.project(latlngBounds.getSouthEast(), zoomLevels[i])
        );

        tileUrls = tileUrls.concat(
          this.offlineControl._baseLayer.getTileUrls(bounds, zoomLevels[i])
        );
      }

      const continueSaveTiles = () => {
        this.offlineControl._baseLayer.fire('offline:save-start', {
          nTilesToSave: tileUrls.length
        });

        this.offlineControl._tilesDb
          .saveTiles(tileUrls)
          .then(() => {
            this.offlineControl._baseLayer.fire('offline:save-end');
          })
          .catch(err => {
            this.offlineControl._baseLayer.fire('offline:save-error', {
              error: err
            });
          });
      };

      this.modalMessage = this.$t('Save selected area?');
      this.modalButtonCallback = continueSaveTiles;
      this.$refs.dialogModal.open();
    },
    removeTiles() {
      const continueRemoveTiles = () => {
        this.offlineControl._baseLayer.fire('offline:remove-start');

        this.offlineControl._tilesDb
          .clear()
          .then(() => {
            this.offlineControl._baseLayer.fire('offline:remove-end');
          })
          .catch(err => {
            this.offlineControl._baseLayer.fire('offline:remove-error', {
              error: err
            });
          });
      };

      this.modalMessage = 'Delete all tiles?';
      this.modalButtonCallback = continueRemoveTiles;
      this.$refs.dialogModal.open();
    }
  },
  async mounted() {
    this.time();

    if (this.$route.params.noTiles) {
      this.$refs.noTilesModal.open();
    }
    this.offlineTiles = Fluent.extend({
      properties: {
        name: 'offlineTiles',
        remoteConnection: undefined
      }
    })();
    this.$nextTick(async () => {
      this.$refs.map.mapObject._onResize();
      this.map = this.$refs.map.mapObject;

      const offlineLayer = L.tileLayer.offline(this.url, tilesDB, {
        attribution: this.attribution,
        minZoom: this.zoomValues.min,
        maxZoom: this.zoomValues.max,
        crossOrigin: true
      });

      await this.drawOfflineTiles();

      this.offlineControl = L.control.offline(offlineLayer, tilesDB, {
        position: 'bottomleft'
      });

      offlineLayer.addTo(this.map);
      this.offlineControl.addTo(this.map);

      this.map.on('move', () => {
        if (this.selection) {
          this.map.removeLayer(this.selection);
        }

        if (this.overlay) {
          this.map.removeLayer(this.overlay);
        }
        const screenB = this.map.getBounds();
        const rectB = screenB.pad(-0.2);
        const rectD = [
          [rectB._northEast.lat, rectB._northEast.lng],
          [rectB._southWest.lat, rectB._southWest.lng]
        ];
        this.selection = L.rectangle(rectD, {
          fillOpacity: 0,
          weight: 3,
          color: '#41b8eb'
        }).addTo(this.map);

        const screenD = [
          [screenB._northEast.lat, screenB._northEast.lng],
          [screenB._southWest.lat, screenB._southWest.lng]
        ];

        const fullOverlay = L.rectangle(screenD);

        const difference = turf.difference(fullOverlay.toGeoJSON(), this.selection.toGeoJSON());
        difference.properties.style = {
          fillColor: 'black',
          fillOpacity: 0.4
        };

        this.overlay = new L.GeoJSON(difference, {
          style: feature => feature.properties.style
        });

        this.overlay.addTo(this.map);
      });

      offlineLayer.on('offline:below-min-zoom-error', () => {
        this.$refs.belowZoomModal.open();
      });

      offlineLayer.on('offline:save-start', data => {
        fullLoading.show('Saving tiles...');
        // eslint-disable-next-line
        console.log(`Saving ${data.nTilesToSave} tiles.`);
      });

      offlineLayer.on('offline:save-end', async () => {
        const bounds = this.selection.getBounds();
        const rectBounds = [
          [bounds._northEast.lat, bounds._northEast.lng],
          [bounds._southWest.lat, bounds._southWest.lng]
        ];

        const rect = L.rectangle(rectBounds, {
          color: '#34dbb9',
          weight: 3,
          fillOpacity: 0.6,
          type: 'rect'
        });
        await this.offlineTiles.local().insert(rect);
        rect.addTo(this.map);
        this.map.fitBounds(rectBounds);

        fullLoading.hide();
        // eslint-disable-next-line
        console.log('All the tiles were saved');
      });

      offlineLayer.on('offline:save-error', err => {
        // eslint-disable-next-line
        console.error(`Error when saving tiles: ${err}`);
      });

      offlineLayer.on('offline:remove-start', () => {
        fullLoading.show('Removing areas...');
        // eslint-disable-next-line
        console.log('Removing tiles.');
      });

      offlineLayer.on('offline:remove-end', async () => {
        // eslint-disable-next-line
        for (const i of Object.keys(this.map._layers)) {
          if (this.map._layers[i].options.type === 'rect') {
            this.map.removeLayer(this.map._layers[i]);
          }
        }

        await this.offlineTiles.local().clear();
        fullLoading.hide();
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
