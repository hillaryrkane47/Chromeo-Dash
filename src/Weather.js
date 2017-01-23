import React, { Component } from 'react';
import distance from 'turf-distance';
import { Glyphicon } from 'react-bootstrap';
import DarkSky from './DarkSky';
import { DARKSKY_KEY } from './Keys';
import './Weather.css';

const MIN_DISTANCE_FOR_UPDATE = 5;  // in kilometers!

class Weather extends Component {
  constructor(props) {
    super(props);
    this.initialFetch = false;
    this.darkSkyClient = new DarkSky(DARKSKY_KEY);
    this.state = {
      temperature: null,
      summary: '',
      location: props.location
    };

    this.updateTheWeather();
  }

  componentGetsNewProps = (newProps) => {
    const gottaUpdateWeather = this.gottaFetchNewWeather(newProps.location);

    if (gottaUpdateWeather) {
      this.setState({
        location: newProps.location
      }, function () {
        this.updateTheWeather();
      }.bind(this));
    }
  }

  gottaFetchNewWeather = (otherLocation) => {
    if (!this.initialFetch) {
      return true;
    }

    const point1 = {
      type: 'Feature',
      properties: null,
      geometry: {
        type: 'Point',
        coordinates: [this.state.location[1], this.state.location[0]]
      }
    };

    const point2 = {
      type: 'Feature',
      properties: null,
      geometry: {
        type: 'Point',
        coordinates: [otherLocation[1], otherLocation[0]]
      }
    };

    const dist = distance(point1, point2);  // in kilometers!
    return dist > MIN_DISTANCE_FOR_UPDATE;
  }

  render() {
    const temp = this.renderTemp();

    return (
      <div className='Weather'>
        <div className='Temperature'>{temp}°</div>
        <div className='Summary'>{this.state.summary}</div>
      </div>
    );
  }

  renderTemp = () => {
    if (this.state.temperature) {
      return this.state.temperature;
    } else {
      return (
        <Glyphicon
          glyph='refresh'
          className='fa-spin' />
      );
    }
  }

  updateTheWeather =() => {
    this.initialFetch = true;

    this.darkSkyClient.forecast(this.state.location[0], this.state.location[1], {}, function (err, resp) {
      if (err) {
        return console.log('Forecast err: ', err);
      }

      let temp, summary = '';

      if (resp.currently) {
        if (resp.currently.temperature) {
          temp = parseInt(resp.currently.temperature, 10);
        }
        if (resp.currently.summary) {
          summary = resp.currently.summary;
        }
      }

      this.setState({
        temperature: temp,
        summary: summary
      });
    }.bind(this))
  }
}

export default Weather;
