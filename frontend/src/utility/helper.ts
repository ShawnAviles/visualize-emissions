// Utility functions that are used to help with data manipulation and other tasks

/* 
_Structure of request body_
[
  "zipCode" : {
    "modeOfTransport": ["bus", "PATH", "ferry", "car"]
  },
  ...
]
*/
interface ZipCodeData {
  modeOfTransport: string[];
}
interface extractedData {
  [key: string]: ZipCodeData;
}

const extractUniqueZipCodesAndModes = (table: string[][]) => {
  let resultZipCodesWithModes: extractedData = {};

  const zipCodeColumnIndex: number = table[0].indexOf('ZIP Code');
  const modeColumnIndex: number = table[0].indexOf('Mode of Transport');

  // Error Handling
  if (zipCodeColumnIndex === undefined) {
    console.log('No zip code column found in the uploaded data.');
    // will need to throw error to user about missing Zip code column
    return;
  }
  if (modeColumnIndex === undefined) {
    console.log('No mode of transport column found in the uploaded data.');
    // will need to throw error to user about missing mode of transport column
    return;
  }

  table = table.slice(1); // remove the header row

  // get array of values in column
  table.map((row: string[]) => {
    const zipCode: string = row[zipCodeColumnIndex];
    const modeOfTransport: string = row[modeColumnIndex];

    // if exists
    if (resultZipCodesWithModes[zipCode]) {
      resultZipCodesWithModes[zipCode].modeOfTransport.push(modeOfTransport);
    } else {
      resultZipCodesWithModes[zipCode] = { modeOfTransport: [modeOfTransport] };
    }
  });

  // get unique zip codes and modes of transport
  for (let zipCode in resultZipCodesWithModes) {
    resultZipCodesWithModes[zipCode].modeOfTransport = Array.from(
      new Set(resultZipCodesWithModes[zipCode].modeOfTransport)
    );
  }

  return resultZipCodesWithModes;
};

// can add more to this interface as we customize the layers
interface layerOptions {
  color?: string;
  width?: number;
  opacity?: number;
  modeOfTransport: string;
  zipCode?: string;
}

interface modeColorsObject {
  [key: string]: string;
}

// Creates custom layer object based on the final polyelines data object that was passed
// Takes `opt` as an object to pass in the color, line thickness of routeof the route
const generateRouteLayer = (finalRoutePolyline: any, opt: layerOptions) => {
  let finalLayers = [];

  // have specific colors for different modes of transport
  // valid modes are: return "DRIVE"."TRAIN","SUBWAY","LIGHT_RAIL","BUS","WALK","DRIVE","BICYCLE";
  const modeColors: modeColorsObject = {
    bus: '#FFA500',
    subway: '#7B5343',
    light_rail: '#C4A484',
    train: '#272B2E',
    drive: '#FF0000',
    walk: '#90EE90',
    bicycle: '#00FF00'
  };

  // default values if not based
  let color = opt.color || 'black';
  let width = opt.width || 2;
  let opacity = opt.opacity || 1;

  if (opt.modeOfTransport) {
    color = modeColors[opt.modeOfTransport.toLowerCase()];
  }

  // @juchen3637
  // animation properties: https://www.mapbox.com/blog/building-cinematic-route-animations-with-mapboxgl
  // let startTime;
  // const duration = 3000;

  // const frame = (time) => {
  //   if (!startTime) startTime = time;
  //   const animationPhase = (time - startTime) / duration;
  //   const animationPhaseDisplay = animationPhase.toFixed(2);
  //   $("#animation-phase").text(animationPhaseDisplay);

  for (let i = 0; i < finalRoutePolyline.length; i++) {
    // this need to be unique for every route layer we have so we can't rely on index
    const id = `route-${opt.modeOfTransport}-${i + 1}`;
    finalLayers.push({
      id: id,
      type: 'line',
      source: id,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': color,
        'line-width': width,
        'line-opacity': opacity,
        'line-gradient': [
          'step',
          ['line-progress'],
          'yellow',
          //animationPhase,
          'rgba(0, 0, 0, 0)'
        ]
      }
    });
  }

  return finalLayers;
};

// Data that may be helpful later for grouping data in graphs and informational purposes
// Jersey City, NJ: https://www.zip-codes.com/city/nj-jersey-city.asp
// Manhattan, NY: https://www.bizzarroagency.com/manhattan-zip-codes/
const cityZipCodes = {
  Hoboken: new Set(['07030']),
  JerseyCity: new Set([
    '07097',
    '07302',
    '07303',
    '07304',
    '07305',
    '07306',
    '07307',
    '07308',
    '07310',
    '07311',
    '07395',
    '07399'
  ]),
  Weehawken: new Set(['07086']),
  UnionCity: new Set(['07087']),
  WestNewYork: new Set(['07093']),
  Manhattan: new Set([
    '10001',
    '10002',
    '10003',
    '10004',
    '10005',
    '10006',
    '10007',
    '10009',
    '10010',
    '10011',
    '10012',
    '10013',
    '10014',
    '10016',
    '10017',
    '10018',
    '10019',
    '10021',
    '10022',
    '10023',
    '10024',
    '10025',
    '10026',
    '10027',
    '10028',
    '10029',
    '10030',
    '10031',
    '10032',
    '10033',
    '10034',
    '10035',
    '10036',
    '10037',
    '10038',
    '10039',
    '10040',
    '10044',
    '10069',
    '10103',
    '10119',
    '10128',
    '10162',
    '10165',
    '10170',
    '10173',
    '10199',
    '10279',
    '10280',
    '10282'
  ]),
  Brooklyn: new Set([
    '11201',
    '11206',
    '11207',
    '11208',
    '11209',
    '11202',
    '11203',
    '11204',
    '11205',
    '11210',
    '11211',
    '11212',
    '11213',
    '11218',
    '11219',
    '11220',
    '11221',
    '11222',
    '11223',
    '11224',
    '11225',
    '11214',
    '11215',
    '11216',
    '11217',
    '11226',
    '11228',
    '11229',
    '11230',
    '11235',
    '11236',
    '11237',
    '11238',
    '11245',
    '11247',
    '11249',
    '11256',
    '11231',
    '11232',
    '11233',
    '11234',
    '11239',
    '11241',
    '11242',
    '11243',
    '11251',
    '11252'
  ])
};

export { extractUniqueZipCodesAndModes, generateRouteLayer, cityZipCodes };
