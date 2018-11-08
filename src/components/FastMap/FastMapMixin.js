import moment from 'moment';

// This mixin contains all map default data that we dont need to touch anymore
const FastMapMixin = {
  data() {
    return {
      collectNotifyAction: undefined,
      collectionMarker: null,
      createPreLoadedData: undefined,
      localMarkers: null,
      map: null,
      me: null,
      myRadius: null,
      remoteMarkers: null,
      tab: null
    };
  },
  methods: {
    // Detach registered callback assigned to specific Leaft events
    off(actions) {
      // eslint-disable-next-line
      return actions.map(action => {
        const actionName = Object.keys(action)[0];
        const func = action[actionName];
        this.map.off(actionName, func);
      });
    },
    // Attach callback to specific Leaft events
    on(actions) {
      // eslint-disable-next-line
      return actions.map(action => {
        const actionName = Object.keys(action)[0];
        const func = action[actionName];
        this.map.on(actionName, func);
      });
    },
    onMove(func) {
      // eslint-disable-next-line
      console.log(func);
      this.map.on('move', func);
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
    time() {
      this.currentDate = moment().format('LLLL');
      setTimeout(this.time, 1000);
    }
  }
};
export default FastMapMixin;
