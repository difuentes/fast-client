<template>
  <q-page>
    <QPageSticky position="bottom-right" :offset="[18, 18]" style="margin-right: 18px !important;">
      <QFab icon="add" direction="up" color="black">
        <QFabAction
          color="white"
          textColor="faded"
          class="white"
          icon="fab fa-wpforms"
          @click.native="goToCreateView({dataCollected: {scouting: true, traps: true}})"
        />
        <QFabAction
          color="white"
          textColor="faded"
          class="white"
          icon="fa fa-binoculars"
          @click.native="goToCreateView({dataCollected: {scouting: true, traps: false}})"
        />
        <QFabAction
          color="white"
          textColor="faded"
          class="white"
          icon="fas fa-archive"
          @click.native="goToCreateView({dataCollected: {scouting: false, traps: true}})"
        />
      </QFab>
    </QPageSticky>
    <QPageSticky position="bottom-left" :offset="[18, 18]" style="margin-left: 18px !important;">
      <QBtn
        round
        color="white"
        text-color="black"
        icon="my_location"
        size="md"
        @click="setToCurrentLocation"
      />
    </QPageSticky>
    <div class="datepicker-trigger" style="z-index:3">
      <button style="display:none" id="datepicker-button-trigger" ref="calendar">'Select dates'</button>
      <AirbnbStyleDatepicker
        :trigger-element-id="'datepicker-button-trigger'"
        :mode="'range'"
        :fullscreen-mobile="true"
        :date-one="dateOne"
        :date-two="dateTwo"
        @date-one-selected="val => { dateOne = val }"
        @date-two-selected="val => { dateTwo = val }"
      />
    </div>
    <l-map
      ref="map"
      id="map"
      :zoom="zoom"
      :options="mapOptions"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-control-zoom position="topright"/>
      <l-tile-layer :url="url" :attribution="attribution"/>
      <!--
        <l-marker :lat-lng="marker.latlng" v-for="marker in markers" v-bind:key="marker.latlng.long">
          <l-popup>
            <div @click="popupClick">
              I am a tooltip
            id: {{marker._id}}  {{marker.latlng}}
              <p v-show="showParagraph">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi. Donec finibus semper metus id malesuada.
              </p>
            </div>
          </l-popup>
      </l-marker>
      -->
    </l-map>
    <q-layout-footer>
      <q-toolbar color="white" class="q-py-none">
        <q-toggle unchecked-icon="far fa-calendar-alt" checked-icon="pin_drop" v-model="today"/>
        <q-btn
          v-if="!today"
          dense
          flat
          aria-label="Menu"
          color="faded"
          size="lg"
          @click.stop="triggerCalendar"
        >
          <q-icon name="far fa-calendar-alt"/>
        </q-btn>
        <q-toolbar-title position="center">
          <span style="color:black" v-if="today">Today</span>
          <span slot="subtitle" style="color:black" v-if="today">{{currentDate}}</span>
          <!--
           <q-tabs
        align="center"
        position="center"
        v-model="tab"
        color="white"
        text-color="black"
        >

          <q-tab
            icon="fas male"
            slot="title"
            key="key"
            name="(index + 1).toString()"
            label="records"
            color="grey"
            >

          </q-tab>

          <q-tab
            icon="fas male"
            slot="title"
            key="key"
            name="(index + 1).toString()"
            label="% FAW"
            color="grey"
            >
          </q-tab>

      </q-tabs>
          -->
        </q-toolbar-title>
        <q-toggle
          v-model="checked"
          unchecked-icon="fas fa-male"
          checked-icon="fas fa-globe-africa"
          color="primary"
        />
      </q-toolbar>
    </q-layout-footer>
  </q-page>
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

.awesome-marker i {
  font-size: 20px;
  margin-top: 10px;
}
</style>
<script>
import moment from 'moment';
import { LMap, LTileLayer, LMarker, LPopup, LControlZoom } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import format from 'date-fns/format';
import { Form, Submission, Auth, Utilities } from 'fast-fastjs';
import fullLoading from '../../../components/fullLoading';

export default {
  name: 'Main',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LControlZoom
  },
  data() {
    return {
      tab: null,
      zoom: 18,
      url: 'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 18,
      showParagraph: false,
      map: null,
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
      dateOne: '',
      dateTwo: '',
      today: false,
      me: null,
      myRadius: null,
      currentDate: moment().format('LLLL'),
      remoteMarkers: null,
      localMarkers: null,
      collectionMarker: null,
      collectNotifyAction: undefined,
      createPreLoadedData: undefined
    };
  },
  methods: {
    async startSurvey() {
      const data = this.createPreLoadedData;
      data.latitude = this.collectionMarker._latlng.lat;
      data.longitude = this.collectionMarker._latlng.lng;

      const date = Utilities.unixDate();
      const formSubmission = {
        data: data || {},
        draft: true,
        sync: false,
        trigger: 'createLocalDraft',
        user_email: Auth.email(),
        path: 'scoutingtraps',
        baseUrl: this.$FAST_CONFIG.APP_URL,
        created: date,
        modified: date
      };
      const submission = await Submission.local().insert(formSubmission);
      const route = {
        name: 'formio_submission_update',
        params: {
          path: 'scoutingtraps',
          idSubmission: submission._id
        },
        query: {
          parent: this.$route.query.parent
        }
      };
      this.$router.push(route);
    },
    cancelCollection() {
      this.map.off('move', this.mapMoveAction);

      this.map.off('dragend', this.mapDragEndAction);

      this.map.off('dragstart', this.mapDragStartAction);
      this.map.addLayer(this.remoteMarkers);
      this.map.addLayer(this.localMarkers);
      this.map.addLayer(this.me);
      this.map.addLayer(this.myRadius);
      this.map.removeLayer(this.collectionMarker);
      this.collectNotifyAction();
    },
    collectNotification() {
      return this.$q.notify({
        message: 'Start here?',
        color: 'black',
        textColor: 'white',
        timeout: 0,
        actions: [
          {
            label: '',
            icon: 'far fa-thumbs-up', // optional
            handler: this.startSurvey
          },
          {
            icon: 'fas fa-ban',
            handler: this.cancelCollection
          }
        ]
      });
    },
    createCollectionMarker() {
      const latLng = this.me._latlng;
      // eslint-disable-next-line
      const collectionMarker = new L.marker(latLng, {
        icon: L.AwesomeMarkers.icon({
          icon: 'fas fa-map-pin',
          markerColor: 'black',
          prefix: 'fa',
          spin: false
        })
      });
      return collectionMarker;
    },
    mapMoveAction() {
      this.collectionMarker.setLatLng(this.map.getCenter());
    },
    mapDragEndAction() {
      if (this.collectNotifyAction && this.collectNotifyAction !== null) {
        this.collectNotifyAction();
      }
      this.collectNotifyAction = this.collectNotification();
    },
    mapDragStartAction() {
      if (this.collectNotifyAction && this.collectNotifyAction !== null) {
        this.collectNotifyAction();
      }
    },
    async goToCreateView(data) {
      this.createPreLoadedData = data;
      this.collectionMarker = this.createCollectionMarker();
      this.map.addLayer(this.collectionMarker);
      this.createCollectionMarker();
      this.map.on('move', this.mapMoveAction);

      this.map.on('dragend', this.mapDragEndAction);

      this.map.on('dragstart', this.mapDragStartAction);

      this.collectNotifyAction = this.collectNotification();

      this.map.removeLayer(this.remoteMarkers);
      this.map.removeLayer(this.localMarkers);
      this.map.removeLayer(this.me);
      this.map.removeLayer(this.myRadius);
    },
    time() {
      this.currentDate = moment().format('LLLL');
      setTimeout(this.time, 1000);
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    popupClick() {
      // eslint-disable-next-line
      alert('Popup Click!');
    },
    formatDates(dateOne, dateTwo) {
      let formattedDates = '';
      if (dateOne) {
        formattedDates = format(dateOne, this.dateFormat);
      }
      if (dateTwo) {
        formattedDates += ` -  ${format(dateTwo, this.dateFormat)}`;
      }
      return formattedDates;
    },
    triggerCalendar() {
      this.$refs.calendar.click();
    },
    async getRemoteMarkers() {
      const marks = [];
      const data = await Form.getModel({ path: 'scoutingtraps' })
        .remote()
        .limit(6000)
        .select('data.latitude as lat', 'data.longitude as lng', '_id')
        .get();
      this.remoteMarkers = L.markerClusterGroup({
        chunkedLoading: true
      });
      data.forEach(e => {
        const latlng = new L.LatLng(e.lat, e.lng);
        marks.push({ latlng, _id: e._id });
        const mark = L.marker(latlng);
        mark.bindPopup(e._id);
        this.remoteMarkers.addLayer(mark);
      });

      this.map.addLayer(this.remoteMarkers);
      return marks;
    },
    async getLocalMarkers() {
      const marks = [];
      const data = await Submission.local()
        .where(['path', '=', 'scoutingtraps'])
        .andWhere('user_email', '=', Auth.email())
        .limit(4000)
        .select(
          'data.latitude as lat',
          'data.longitude as lng',
          '_id',
          'draft',
          'data.dataCollected as dataCollected'
        )
        .get();
      this.localMarkers = L.markerClusterGroup({
        chunkedLoading: true
      });
      data.forEach(e => {
        let color = 'cadetblue';
        let icon = 'description';
        const prefix = 'fa';
        if (e.draft === true) {
          color = 'cadetblue';
        }

        if (e.dataCollected && e.dataCollected.scouting && e.dataCollected.straps) {
          icon = 'wpforms';
        } else if (e.dataCollected && e.dataCollected.scouting && !e.dataCollected.straps) {
          icon = 'binoculars';
        } else {
          icon = 'archive';
        }

        const latlng = new L.LatLng(e.lat, e.lng);
        marks.push({ latlng, _id: e._id });
        const mark = L.marker(latlng, {
          icon: L.AwesomeMarkers.icon({
            icon,
            markerColor: color,
            prefix
          })
        });
        mark.bindPopup(e._id);
        this.localMarkers.addLayer(mark);
      });

      this.map.addLayer(this.localMarkers);
      return marks;
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
      this.markers = await this.getRemoteMarkers();
      await this.getLocalMarkers();
    },
    onLocationError(e) {
      fullLoading.hide();
      // eslint-disable-next-line
      console.log(e);
    },
    startCollection(type) {
      if (type === 'scouting') {
        // console.log('starting scouting');
      } else if (type === 'scoutingAndTraps') {
        // console.log('starting both');
      } else if (type === 'traps') {
        // console.log('starting traps');
      }
    }
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
  }
};
</script>
