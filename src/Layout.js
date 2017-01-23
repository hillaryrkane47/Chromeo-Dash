import React, { Component } from 'react';
import MapboxClient from 'mapbox';
import { MAPBOX_ACCESS_TOKEN } from './Keys';
import Weather from './Weather';
import Clock from './Clock';
import './Layout.css';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.mapboxClient = new MapboxClient(MAPBOX_ACCESS_TOKEN);
    this.state = {
      location: props.location,
      address: ''
    }
  };

  componentWillReceiveProps = (newProps) => {
    this.setState({
      location: newProps.location
    }, this.updateAddress.bind(this));
  };

  render() {
    return (
      <div className='Layout'>
        <Clock />
        <Weather location={this.state.location} />
        <div className="add">
          <h3 className='Address'>{this.state.address}</h3>
        </div>
      </div>
    );
  }

  updateAddress = () => {
    let address = '';

    const location = {
      latitude: this.state.location[0],
      longitude: this.state.location[1]
    };

    this.mapboxClient.geocodeReverse(location, function (err, resp) {
      if (err) {
        return console.log('Geocode Error: ', err);
      }

      if (resp.features && resp.features.length > 0) {
        address = resp.features[0].place_name;
      }

      this.setState({ address });
    }.bind(this));
  }
}

export default Layout;
