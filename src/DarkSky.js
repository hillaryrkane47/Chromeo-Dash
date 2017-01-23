import fetchJsonp from 'fetch-jsonp';

export default class DarkSky {
  constructor(key) {
    this.url = 'https://api.darksky.net/';
    this.key = key;
  };

  forecast = (latitude, longitude, options, callback) => {
    const url = `${this.url}forecast/${this.key}/${latitude},${longitude}`;

    fetchJsonp(url)
      .then(function(resp) {
        return resp.json();
      }).then(function(data) {
        callback(null, data);
      }).catch(function(x) {
        callback(x);
      });
  };

};
