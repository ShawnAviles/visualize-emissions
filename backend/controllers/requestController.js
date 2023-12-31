const polyline = require('polyline');
const dotenv = require("dotenv").config();
const MAPS_TOKEN = process.env.GOOGLE_MAPS_DIRECTIONS_TOKEN;

/**
 * Fetches a compressed/coded polyline in string format from Google Maps Directions API for a given zipcode.
 *
 * @param {string} zipCode - The zipcode to get the polyline route for.
 * @returns {Promise<string>} A promise that resolves to the polyline data string.
 * @throws {Error} If there is an error with the fetch request or if the response does not contain a route.
 */
async function getPolylineRouteFromZipCode(zipCode) {
  try {
    // Build request URL: https://developers.google.com/maps/documentation/routes/migrate-routes
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

    // Different Transit Modes: https://developers.google.com/maps/documentation/routes/transit-route#transit-route-example
    const data = {
      origin: {
        address: String(zipCode),
      },
      destination:{
        address: "1 Castle Point Terrace, Hoboken, NJ 07030",
      },
      travelMode: "DRIVE", // "DRIVE", "BICYCLE", "TRANSIT"
      computeAlternativeRoutes: false,
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false
      },
      languageCode: "en-US",
      units: "IMPERIAL"
    }

    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": MAPS_TOKEN,
        "X-Goog-FieldMask" : "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.steps"
      },
      body: JSON.stringify(data)
    }

    // Make the API call
    const routeData = await fetch(url, request);
    const response = await routeData.json();

    // Check if we got a successful response with a route
    if (response.routes && response.routes[0].polyline) {
      const polylineDataString = response.routes[0].polyline.encodedPolyline;
      return polylineDataString;
    }
    throw new Error('No route found.');
  } catch (error) {
    console.error('Error fetching polyline:', error);
    return 'Error fetching polyline';
  }
}

/**
 * Returns object with all decoded polyline data for all zipcodes in the array
 *
 * @param {array} zipCodes - The ZIP Codes to find path for
 */
async function getAllPolylineRoutes(zipCodes) {
  const polylineData = {};
  const promises = zipCodes.map(async zipCode => {
    const polylineDataString = await getPolylineRouteFromZipCode(zipCode);
    const decodedPolyline = polyline.decode(polylineDataString);
    polylineData[zipCode] = decodedPolyline;
  });
  await Promise.all(promises);
  return polylineData;
}

/**
 * Returns array of formated route object that is readable by the Mapbox viewer
 *
 * @param {object} polylineData - Object mapping zipcodes to decoded polyline data
 */
function formatToRouteObjects(polylineData) {
  formattedRoutes = [];
  for (zipCode in polylineData) {
    formattedRoutes.push({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: polylineData[zipCode],
      },
    });
  };
  return formattedRoutes;
}

/**
 * returns formated array of route objects for the frontend
 *
 * @param {array} zipCodes - list of all zipcodes {strings} passed in POST
 */
async function getRoutes(zipCodes) {
  const polylineData = await getAllPolylineRoutes(zipCodes);
  const formattedRoutes = formatToRouteObjects(polylineData);
  return formattedRoutes;
}

// const testZipCodes = [
//   '10016',
//   '10017',
//   '10020',
// ]

// getRoutes(testZipCodes).then(routes => console.log("Outputted Route Data: ", routes));

module.exports = { getRoutes };