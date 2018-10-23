import L from 'leaflet';
// This contain a set of tools of leafletLibrary

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

const createCircle = event => {
  const radius = event.accuracy / 2;
  // eslint-disable-next-line
  const circle = new L.circle(event.latlng, radius);
  return circle;
};

export { createMarker, createCircle };
