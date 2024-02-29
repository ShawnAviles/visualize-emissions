const extractUniqueZipCodes = (table: string[][]) => {
  const zipCodeColumnIndex = table[0].indexOf('ZIP Code');
  if (zipCodeColumnIndex === undefined) {
    console.log('No zip code column found in the uploaded data.');
    // will need to throw error to user about missing Zip code column
    return;
  }

  table = table.slice(1); // remove the header row
  // get array of all unique zip codes for whole array in the zip code column
  let zipCodes: string[] = table.map(
    (row: { [x: string]: any }) => row[zipCodeColumnIndex]
  );

  // remove duplicates, convert set to list
  zipCodes = Array.from(new Set(zipCodes));

  return zipCodes;
};

// can add more to this interface as we customize the layers
interface layerOptions {
  color: string;
  width?: number;
  opacity?: number;
}

// Creates custom layer object based on the final polyelines data object that was passed
// Takes `opt` as an object to pass in the color, line thickness of routeof the route
const generateRouteLayer = (finalRoutePolyline: any, opt: layerOptions) => {
  let finalLayers = [];

  // default values if not based
  const color = opt.color || 'black';
  const width = opt.width || 2;
  const opacity = opt.opacity || 1;

  for (let i = 0; i < finalRoutePolyline.length; i++) {
    finalLayers.push({
      id: `route-${i + 1}`,
      type: 'line',
      source: `route-${i + 1}`,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': color,
        'line-width': width,
        'line-opacity': opacity
      }
    });
  }

  return finalLayers;
};

export { extractUniqueZipCodes, generateRouteLayer };
