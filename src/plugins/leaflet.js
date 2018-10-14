import L from 'leaflet';
import 'leaflet.icon.glyph';

// leave the export, even if you don't use it
export default () => {
  // eslint-disable-next-line global-require
  require('leaflet.awesome-markers/dist/leaflet.awesome-markers.css');
  // eslint-disable-next-line global-require
  require('leaflet.awesome-markers/dist/leaflet.awesome-markers.min.js');
  // eslint-disable-next-line no-underscore-dangle
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    // eslint-disable-next-line global-require
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    // eslint-disable-next-line global-require
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    // eslint-disable-next-line global-require
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
  });
};
