import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'mapbox-gl/dist/mapbox-gl.css'; // Fixes Pin Moving on Zoom: https://github.com/visgl/react-map-gl/issues/1052

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
