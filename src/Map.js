import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';

function Map() {
  const [places, setPlaces] = useState([]);
  const [showPopUp, setShowPopUp] = useState({});

  useEffect(() => {
    const getPlaces = async () => {
      const { data } = await axios.get('http://localhost:1337/api/v1/places');
      setPlaces(data);
    };

    getPlaces();
  }, []);

  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 3
  });

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/alejandro170999/ckhv3oqzu00p919o7kcctkaui"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={nextViewport => setViewport(nextViewport)}
    >
      {places.map(place => (
        <>
          <Marker
            key={place._id}
            latitude={place.latitude}
            longitude={place.longitude}
          >
            <div
              onClick={() =>
                setShowPopUp({
                  // ...showPopUp,
                  [place._id]: true
                })
              }
            >
              <svg
                className="marker"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </Marker>
          {showPopUp[place._id] ? (
            <Popup
              latitude={place.latitude}
              longitude={place.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setShowPopUp({})}
              anchor="top"
            >
              <div className="popup">
                <h3>{place.title}</h3>
                <p>{place.description}</p>
                <small>
                  Created on: {new Date(place.date).toLocaleDateString()}
                </small>
              </div>
            </Popup>
          ) : null}
        </>
      ))}
    </ReactMapGL>
  );
}

export default Map;
