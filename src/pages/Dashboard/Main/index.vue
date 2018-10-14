<template>
  <div class="container">

     <q-page-sticky
          position="top-left"
          :offset="[18, 18]"
        >

        <q-btn
          dense
          flat
          @click="$toggleLeftDrawer"
          aria-label="Menu"
          color="black"
          size="lg"
        >
          <q-icon name="menu" />
        </q-btn>
    </q-page-sticky>

    <div class="datepicker-trigger" style="z-index:3">
        <button
          style="display:none"
          id="datepicker-button-trigger"
          ref="calendar"
          > 'Select dates'
          </button>


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
        <q-page-sticky
          position="bottom-right"
          :offset="[18, 18]"
          z-index="20!important"
        >
        <q-fab
          icon="add"
          direction="up"
          color="primary"
        >
          <q-fab-action
            color="blue"
            class="white"
            icon="fab fa-wpforms"
            @click.native="startCollection('scouting')"
          />
          <q-fab-action
            color="blue"
            class="white"
            icon="fa fa-binoculars"
            @click.native="startCollection('scoutingAndTraps')"
          />
        </q-fab>
    </q-page-sticky>

      <q-page-sticky
          position="bottom-left"
          :offset="[18, 18]"
        >

        <q-btn
          round
          color="white"
          text-color="black"
          icon="my_location"
          size="md"
          @click="setToCurrentLocation"
        />

    </q-page-sticky>
    <l-map
     ref="map"
      id="map"
      :zoom="zoom"
      :options="mapOptions"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate">
      <l-control-zoom position="topright" />
      <l-tile-layer
        :url="url"
        :attribution="attribution"/>
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
      <q-toolbar
        color="white"
        style="height:7vh"
      >

      <q-btn
            dense
            flat
            aria-label="Menu"
            color="faded"
            size="lg"
            @click.stop="triggerCalendar"
          >
          <q-icon name="far fa-calendar-alt" />
        </q-btn>

        <q-range
          v-model="rangeValues"
          :min="5"
          :max="100"
          :step="5"
          label
          markers
          snap
          style="margin-right:30px"
        />

        <q-toggle
          unchecked-icon="far fa-calendar-alt"
          checked-icon="far fa-list-alt"
          v-model="today"
        />

        <q-toggle
          v-model="checked"
          unchecked-icon="fas fa-male"
          checked-icon="fas fa-globe-africa"
          size="30px"
          color="secondary"
        />

      </q-toolbar>
    </q-layout-footer>

  </div>
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
import { LMap, LTileLayer, LMarker, LPopup, LControlZoom } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import format from 'date-fns/format';
import { Form, Submission, Auth } from 'fast-fastjs';
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
      zoom: 13,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 13,
      showParagraph: false,
      map: null,
      mapOptions: { zoomControl: false, attributionControl: false },
      markers: [],
      rangeValues: {
        min: 5,
        max: 50
      },
      checked: false,
      dateOne: '',
      dateTwo: '',
      today: false,
      me: null,
      myRadius: null
    };
  },
  methods: {
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
        .limit(50)
        .select('data.latitude as lat', 'data.longitude as lng', '_id')
        .get();

      data.forEach(e => {
        marks.push({ latlng: new L.LatLng(e.lat, e.lng), _id: e._id });
        L.marker([e.lat, e.lng], {
          icon: L.AwesomeMarkers.icon({
            icon: 'fas fa-male',
            markerColor: 'red',
            prefix: 'fa',
            spin: false
          })
        }).addTo(this.map);
      });
      return marks;
    },
    async getLocalMarkers() {
      const marks = [];
      const data = await Submission.local()
        .where(['path', '=', 'scoutingtraps'])
        .andWhere('user_email', '=', Auth.email())
        .limit(50)
        .select('data.latitude as lat', 'data.longitude as lng', '_id')
        .get();
      console.log(data);
      data.forEach(e => {
        marks.push({ latlng: new L.LatLng(e.lat, e.lng), _id: e._id });
        L.marker([e.lat, e.lng], {
          icon: L.AwesomeMarkers.icon({
            icon: 'fas fa-male',
            markerColor: 'red',
            prefix: 'fa',
            spin: false
          })
        }).addTo(this.map);
      });
      return marks;
    },
    setToCurrentLocation() {
      fullLoading.show(this.$t('Getting GPS position'));
      if (this.me) {
        this.map.removeLayer(this.me);
        this.map.removeLayer(this.myRadius);
      }
      this.map.locate({ setView: true, maxZoom: 16 });
    },
    async onLocationFound(e) {
      fullLoading.hide();
      const radius = e.accuracy / 2;
      // eslint-disable-next-line
      this.me = new L.marker(e.latlng, {
        icon: L.AwesomeMarkers.icon({
          icon: 'fas fa-male',
          markerColor: 'blue',
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
      console.log(e);
    },
    startCollection(type) {
      if (type === 'scouting') {
        console.log('starting scouting');
      } else if (type === 'scoutingAndTraps') {
        console.log('starting both');
      } else if (type === 'traps') {
        console.log('starting traps');
      }
    }
  },
  async mounted() {
    this.$nextTick(() => {
      this.$refs.map.mapObject._onResize();
      this.map = this.$refs.map.mapObject;
      this.map.locate({ setView: true, maxZoom: 16 });
      fullLoading.show(this.$t('Getting GPS position'));
      this.map.on('locationfound', this.onLocationFound);
      this.map.on('locationerror', this.onLocationError);
    });
  }
};
</script>
