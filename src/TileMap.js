const mapBoxToken = 'pk.eyJ1IjoiaGlsbGFyeXJrYW5lNDciLCJhIjoiY2l5MzF1aTR3MDA1NDMzbjRtaW1jYmpiYiJ9.ODQA_RRmPEkA736PI1O8mQ';

const maps = [
  {
    id: 1,
    name: 'Streets',
    mapboxId: 'mapbox/streets-v8',
    token: mapBoxToken
  }, {
    id: 2,
    name: 'Light',
    mapboxId: 'mapbox/light-v9',
    token: mapBoxToken
  }, {
    id: 3,
    name: 'Outdoors',
    mapboxId: 'mapbox/outdoors-v10',
    token: mapBoxToken
  }, {
    id: 4,
    name: 'Satellite',
    mapboxId: 'mapbox/satellite-streets-v9',
    token: mapBoxToken
  }, {
    id: 5,
    name: 'Dark',
    mapboxId: 'mapbox/dark-v9',
    token: mapBoxToken
  }
];

export class TileMap {
  static byId(id) {
    let map;

    for (let _map of maps) {
      if (_map.id === id) {
        map = _map;
        break;
      }
    }

    return map;
  }

  static random() {
    return maps[Math.floor(Math.random() * maps.length)];
  }

  static all() {
    return maps;
  }
}
