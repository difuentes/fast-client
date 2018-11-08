<template>
  <div class="col-xs-12">
    <div class="wrap">
      <FastMap ref="fastMap"/>
      <QPageSticky class="btn-map-corner" position="bottom-right" :offset="[18, 18]">
        <QFab text-color="white" color="primary" icon="add" direction="up">
          <QFabAction
            class="btn-primary-inverted"
            icon="fab fa-wpforms"
            @click.native="goToCreateView({dataCollected: {scouting: true, traps: true}})"
          />
          <QFabAction
            class="btn-primary-inverted"
            icon="fa fa-binoculars"
            @click.native="goToCreateView({dataCollected: {scouting: true, traps: false}})"
          />
          <QFabAction
            class="btn-primary-inverted"
            icon="fas fa-archive"
            @click.native="goToCreateView({dataCollected: {scouting: false, traps: true}})"
          />
        </QFab>
      </QPageSticky>
    </div>
  </div>
</template>

<script>
import FastMap from 'components/FastMap';
import { createCollectionMarker } from 'components/FastMap/leafletHelpers';
// import fastNotify from 'helpers/fastNotify';
// import moment from 'moment';
// import { Auth, Submission, Utilities } from 'fast-fastjs';

export default {
  components: {
    FastMap
  },
  name: 'About',
  data() {
    return {
      fastMap: null,
      remoteMarkerLayer: null,
      currentMarker: null,
      currentPosition: null
    };
  },
  methods: {
    updateMarkerPosition() {
      this.currentMarker.setLatLng(this.fastMap.map.getCenter());
    },
    goToCreateView() {
      const currentLocation = this.fastMap.me;
      this.currentMarker = createCollectionMarker(currentLocation);
      this.fastMap.map.addLayer(this.currentMarker);
      this.fastMap.onMove(this.updateMarkerPosition);
    },
    startSurvey() {
      console.log('starting survey');
    },
    cancelCollection() {
      console.log('cancelling survey');
    }
  },
  async mounted() {
    setTimeout(this.time, 1000);
    this.$nextTick(() => {
      this.fastMap = this.$refs.fastMap;
    });
  }
};
</script>
