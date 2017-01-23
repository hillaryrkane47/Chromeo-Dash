import React, { Component } from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { Button, Glyphicon, Modal } from 'react-bootstrap';
import Radio from 'rc-radio';
import classNames from 'classnames';
import Leaflet from 'leaflet';
import './App.css';
import { backgrounds } from './Backgrounds';
import Layout from './Layout';
import { TileMap } from './TileMap';
import * as storage from './LocalStorage';
import * as Keys from './Keys'

//setting randooo backgrounds if map is set to none
const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];

class App extends Component {
  constructor() {
    super();
    this.userPinDrop = Leaflet.divIcon({
      className: 'LocationIcon',
      iconSize: [20, 20]
    });

    const mapId = storage.getItem('mapId', 'random');
    const location = storage.getItem('lastLocation', Keys.HOME);
    const zoom = storage.getItem('zoom', 15);
    const showMap = (mapId !== 0);
    const mapTileUrl = this.getMapTileUrl(mapId);

    this.state = {
      showMap,
      location,
      zoom,
      mapTileUrl,
      mapId,
      userLocation: null,
      showModal: false,
      settingsButtonHovered: false
    };

    this.updateLocation();
  }

  getMapTileUrl = (mapId) => {
    if (mapId === 0) {
      return null;
    }

    const map = (mapId === 'random') ? TileMap.random() : TileMap.byId(mapId);

    //original
    return `https://api.mapbox.com/styles/v1/${map.mapboxId}/tiles/256/{z}/{x}/{y}@2x?access_token=${map.token}`

  };

  updateLocation = () => {
    const positionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 1000 * 60 * 10
    };

    window.navigator.geolocation.getCurrentPosition(this.positionFound,
                                                    this.positionNotFound,
                                                    positionOptions)
  };

  positionFound = (pos) => {
    let location = [pos.coords.latitude, pos.coords.longitude];
    let userLocation = location;
    this.setState({ location, userLocation });
  };

  positionNotFound = (err) => {
    console.log('Geolocation error! PositionNotFound:');
    console.log(err);
  };

  mouseOverSettingsButton = () => {
    this.setState({
      settingsButtonHovered: true
    });
  };

  mouseOutSettingsButton = () => {
    this.setState({
      settingsButtonHovered: false
    });
  };

  mapMoveEnd = (e) => {
    const center = e.target.getCenter();
    const lastLocation = [center.lat, center.lng];
    const location = lastLocation;
    const zoom = e.target.getZoom();

    storage.setItem('lastLocation', lastLocation);
    storage.setItem('zoom', zoom);

    this.setState({ location, lastLocation, zoom });
  };

  openSettings = (e) => {
    e.preventDefault();
    this.setState({showModal: true});
  };

  closeSettings = () => {
    this.setState({showModal: false});
  };

  mapChange = (e) => {
    const mapId = e.target.value;
    const showMap = (mapId !== 0);
    const mapTileUrl = this.getMapTileUrl(mapId);

    storage.setItem('mapId', mapId);

    this.setState({ mapId, mapTileUrl, showMap });
  }

  render() {
    let settingsButtonClassName = classNames({
      'SettingsButton': true,
      'fa-spin': this.state.settingsButtonHovered
    });

    const map = this.renderMap();

    return (
      <div className='App' style={{backgroundImage: randomBackground, backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
        <Glyphicon
          glyph='th'
          className={settingsButtonClassName}
          onMouseOver={this.mouseOverSettingsButton}
          onMouseOut={this.mouseOutSettingsButton}
          onClick={this.openSettings} />
        {map}
        <Modal
          className='Settings'
          show={this.state.showModal}
          onHide={this.closeSettings}>
          <Modal.Body>
            <h2>Base Map</h2>
            <div className='row'>
              <div className='col-md-4 col-md-offset-4 Setting'>
                <div className='well'>
                  <label key={'random'}>
                    <Radio
                      value={'random'}
                      checked={this.state.mapId === 'random'}
                      onChange={this.mapChange.bind(this)} />
                    Random
                  </label>
                  {
                    TileMap.all().map(function (tileMap) {
                      return (
                        <label key={tileMap.id}>
                          <Radio
                            value={tileMap.id}
                            checked={this.state.mapId === tileMap.id}
                            onChange={this.mapChange.bind(this)} />
                          {tileMap.name}
                        </label>
                      );
                    }.bind(this))
                  }
                  <label key={'0'}>
                    <Radio
                      value={0}
                      checked={this.state.mapId === 0}
                      onChange={this.mapChange.bind(this)} />
                    None
                  </label>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeSettings}>
              <Glyphicon glyph='remove' />
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Layout location={this.state.location} />
      </div>
    );
  }

  renderMap() {
    if (this.state.showMap) {
      let marker;

      if (this.state.userLocation) {
        marker = (
          <Marker
            position={this.state.userLocation}
            icon={this.userPinDrop}
            clickable={false} />
        );
      }

      return (
        <Map
          center={this.state.location}
          zoom={this.state.zoom}
          zoomControl={false}
          className='WeatherMap'
          onMoveEnd={this.mapMoveEnd}>
          <TileLayer
            url={this.state.mapTileUrl}
          />
          {marker}
        </Map>
      );
    }
  }
}

export default App;
