import React from 'react';
import { useState, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // The Mapbox CSS

import Navbar from './Navbar';
import Footer from './Footer';
import '../App.css';

// Import images for your cafe locations
import cafeImg1 from '../images/banner1.png';
import cafeImg2 from '../images/banner5.jpeg';
import cafeImg3 from '../images/banner3.png';

// --- Dummy Cafe Locations ---
const locations = [
  {
    id: 1,
    name: 'The Tangy Leaf - Downtown',
    address: 'The Cascade Avenue, Gandhipuram',
    latitude: 11.0168,
    longitude: 76.9558,
    image: cafeImg1,
  },
  {
    id: 2,
    name: 'The Tangy Leaf - Mallside',
    address: 'Next to Brooksfields Mall, R S Puram',
    latitude: 11.0046,
    longitude: 76.9616,
    image: cafeImg2,
  },
  {
    id: 3,
    name: 'The Tangy Leaf - Beach Road',
    address: '137, East Avinashi Road, Papanaickenpalayam',
    latitude: 10.9977,
    longitude: 76.9469,
    image: cafeImg3,
  },
];

// Your Mapbox Access Token
const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3dhdGh5MDkiLCJhIjoiY21kYzI1NTBwMHp0cDJpcHNzYmxrNnZqcyJ9.9EIffF7wTqHhJYu3PFWuwg'; 

const CafeFinder = ({ user, onLogout, onLoginClick }) => {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [viewState, setViewState] = useState({
    latitude: locations[0].latitude,
    longitude: locations[0].longitude,
    zoom: 13,
    pitch: 30, // Add a slight tilt for a more dynamic view
  });

  // Effect to pan the map when a new location is selected
  useEffect(() => {
    setViewState(v => ({
      ...v,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    }));
  }, [selectedLocation]);

  return (
    <>
      <Navbar user={user} onLogout={onLogout} onLoginClick={onLoginClick} />
      <div className="finder-container">
        <div className="finder-header">
          <h1>Find Your Nearest Tangy Leaf</h1>
          <p>Get directions to our fresh and zesty locations.</p>
        </div>
        <div className="finder-content">
          {/* Left Column: Location List */}
          <div className="location-list">
            {locations.map(location => (
              <div
                key={location.id}
                className={`location-card ${selectedLocation.id === location.id ? 'active' : ''}`}
                onClick={() => setSelectedLocation(location)}
              >
                <img src={location.image} alt={location.name} className="location-image" />
                <div className="location-info">
                  <h3>{location.name}</h3>
                  <p>{location.address}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Interactive Mapbox Map */}
          <div className="map-container">
            <Map
              {...viewState}
              onMove={evt => setViewState(evt.viewState)}
              mapboxAccessToken={MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/streets-v11" // You can choose different styles
              style={{ width: '100%', height: '100%' }}
            >
              {locations.map(loc => {
                // --- FIX: Conditionally set the marker color ---
                const isSelected = selectedLocation && selectedLocation.id === loc.id;
                const markerColor = isSelected ? '#388E3C' : '#f17743ff'; 

                return (
                  <Marker key={loc.id} longitude={loc.longitude} latitude={loc.latitude}>
                    <div className="map-marker" onClick={() => setSelectedLocation(loc)}>
                      <svg height="30" viewBox="0 0 24 24" fill={markerColor} stroke="#FFFFFF" strokeWidth="1.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3" fill="#FFFFFF"></circle>
                      </svg>
                    </div>
                  </Marker>
                );
              })}
            </Map>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CafeFinder;
