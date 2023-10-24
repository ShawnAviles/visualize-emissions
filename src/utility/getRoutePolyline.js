import polyline from 'polyline';

// Set up your Google Maps API key
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_DIRECTIONS_TOKEN;

function formatRouteData(polylineData) {
  const route = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: {},
    },
  };

  route.geometry.coordinates = polyline.decode(polylineData);
  return route;
}

async function getPolylineFromZipCode(zipCode) {
  try {
    // Build the request URL
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${zipCode}&destination=1+Castle+Point+Terrace,+Hoboken+NJ+07030&key=${API_KEY}`;

    // Make the API call
    const response = await fetch(url);

    // Check if we got a successful response with a route
    if (response.data && response.data.routes && response.data.routes.length > 0) {
      const polylineData = response.data.routes[0].overview_polyline.points;
      return polylineData;
    }
    throw new Error('No route found.');
  } catch (error) {
    console.error('Error fetching polyline:', error);
    return 'Error fetching polyline';
  }
}

function getRouteData () {
  // loop over all zipcode data from a specified JSON file
  // for each zipcode, get the polyline data
  // format the polyline data into a GeoJSON object (Route object) using the formatRouteData function
  // return an array of Route objects OR we save it all to a JSON file (dependent on if we use an express server here, which we should)
}
// Example usage:
// const zipCode = '10024'; // Replace this with the desired zip code
// getPolylineFromZipCode(zipCode).then((polyline) => {
//   console.log('Polyline data:', polyline);
// });


// testing that decoder works
const pl = 'knjmEnjunUbKCfEA?_@]@kMBeE@qIIoF@wH@eFFk@WOUI_@?u@j@k@`@EXLTZHh@Y`AgApAaCrCUd@cDpDuAtAoApA{YlZiBdBaIhGkFrDeCtBuFxFmIdJmOjPaChDeBlDiAdD}ApGcDxU}@hEmAxD}[tt@yNb\\yBdEqFnJqB~DeFxMgK~VsMr[uKzVoCxEsEtG}BzCkHhKWh@]t@{AxEcClLkCjLi@`CwBfHaEzJuBdEyEhIaBnCiF|K_Oz{MdZwAbDaKbUiB|CgCnDkDbEiE|FqBlDsLdXqQra@kX|m@aF|KcHtLm@pAaE~JcTxh@w\\`v@gQv`@}F`MqK`PeGzIyGfJiG~GeLhLgIpIcE~FsDrHcFfLqDzH{CxEwAbBgC|B}F|DiQzKsbBdeA{k@~\\oc@bWoKjGaEzCoEzEwDxFsUh^wJfOySx[uBnCgCbCoFlDmDvAiCr@eRzDuNxC_EvAiFpCaC|AqGpEwHzFoQnQoTrTqBlCyDnGmCfEmDpDyGzGsIzHuZzYwBpBsC`CqBlAsBbAqCxAoBrAqDdDcNfMgHbHiPtReBtCkD|GqAhBwBzBsG~FoAhAaCbDeBvD_BlEyM``@uBvKiA~DmAlCkA|B}@lBcChHoJnXcB`GoAnIS~CIjFDd]A|QMlD{@jH[vAk@`CoGxRgPzf@aBbHoB~HeMx^eDtJ}BnG{DhJU`@mBzCoCjDaAx@mAnAgCnBmAp@uAj@{Cr@wBPkB@kBSsEW{GV}BEeCWyAWwHs@qH?cIHkDXuDn@mCt@mE`BsH|CyAp@}AdAaAtAy@lBg@pCa@jE]fEcBhRq@pJKlCk@hLFrB@lD_@xCeA`DoBxDaHvM_FzImDzFeCpDeC|CkExDiJrHcBtAkDpDwObVuCpFeCdHoIluBjIuClJsEvMyDbMqAhEoDlJ{C|J}FlZuBfLyDlXwB~QkArG_AnDiAxC{G|OgEdLaE`LkBbEwG~KgHnLoEjGgDxCaC`BuJdFkFtCgCnBuClD_HdMqEzHcBpB_C|BuEzCmPlIuE|B_EtDeBhCgAdCw@rCi@|DSfECrCAdCS~Di@jDYhA_AlC{AxCcL`U{GvM_DjFkBzBsB`BqDhBaEfAsTvEmEr@iCr@qDrAiFnCcEzCaE~D_@JmFdGQDwBvCeErEoD|BcFjC}DbEuD~D`@Zr@h@?d@Wr@}@vAgCbEaHfMqA`Cy@dAg@bAO`@gCi@w@W"';
const route = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: {},
  },
};

route.geometry.coordinates = polyline.decode(pl);

console.log(route);
