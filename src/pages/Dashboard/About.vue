<template>
  <div class="col-xs-12">
    <div class="wrap">
      <FastMap/>
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

export default {
  components: {
    FastMap
  },
  name: 'About'
};
</script>
