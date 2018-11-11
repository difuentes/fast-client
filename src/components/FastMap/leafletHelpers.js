import L from 'leaflet';
// This contains a set of tools of leafletLibrary

// Given Fastmap event create a marker
const createMarker = event => {
  // eslint-disable-next-line
  const marker = new L.marker(event.latlng, {
    icon: L.AwesomeMarkers.icon({
      icon: 'fas fa-male',
      markerColor: 'black',
      prefix: 'fa',
      spin: false
    }),
    draggable: 'true'
  });
  return marker;
};

const createCollectionMarker = me => {
  const latLng = me._latlng;
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
};

const createCircle = event => {
  const radius = event.accuracy / 2;
  // eslint-disable-next-line
  const circle = new L.circle(event.latlng, radius);
  return circle;
};

export { createMarker, createCircle, createCollectionMarker };
