import {
	getAllPolylineRoutes,
	formatToMasterRouteObject,
	getAllMetricsData,
	formatMasterMetricsDataObject,
} from "../utility/helper.js";

// TODO: Let user know of the invalidZipCodes that didn't return a polyline or metrics data

/**
 * Returns object with all the routes for each mode of transport for each zipcode
 *
 * @param {array} zipCodesWithModes - object of all zipcodes {strings} passed in POST with their respective modes of transport array of {strings}
 */
async function getRoutes(zipCodesWithModes) {
	const [polylineData, invalidZipcodes] = await getAllPolylineRoutes(
		zipCodesWithModes
	);
	const formattedRoutes = formatToMasterRouteObject(polylineData);
	return formattedRoutes;
}

/**
 * Returns object with all the metrics for each mode of transport for each zipcode
 *
 * @param {array} zipCodesWithModes - object of all zipcodes {strings} passed in POST with their respective modes of transport array of {strings}
 */
async function getMetrics(zipCodesAndTable) {
	const zipCodesWithModes = zipCodesAndTable.zipCodesAndModes;
	const table = zipCodesAndTable.table;

	const [metrics, invalidZipcodes] = await getAllMetricsData(zipCodesWithModes);
	const formattedMetrics = formatMasterMetricsDataObject(metrics, table);
  // pmpg values
  const carPMPG = 26.35;
  const busPMPG = 322.5;
  const trainPMPG = 8250;
  const lightPMPG = 660;
  const subwayPMPG = 3300;
  let emissions = [
    {name: "Cars", value: 0},
    {name: "Bus", value: 0},
    {name: "Trains", value: 0},
    {name: "Light Rail", value: 0},
    {name: "Subway", value: 0}
  ];
  let zipEmissions = [];
  let top5Zips = [];
  for (let zip in formattedMetrics) {
    let zipEmission = {name: zip, value: 0};
    for (let transportation in formattedMetrics[zip]) {
      if(zip != "07030") {
        zipEmission.value = Math.round(formattedMetrics[zip][transportation].totalVehicleMiles * 100) / 100;
      }
      if (transportation == "DRIVE") {
        emissions[0].value = (formattedMetrics[zip][transportation].totalVehicleMiles / carPMPG) * 8887/1000 * formattedMetrics[zip][transportation].commutesPerWeek * 52;
      }
      if (transportation == "BUS") {
        emissions[1].value += (formattedMetrics[zip][transportation].totalVehicleMiles / busPMPG) * 10180/1000 * formattedMetrics[zip][transportation].commutesPerWeek * 52;
      }
      if (transportation == "TRAIN") {
        emissions[2].value += (formattedMetrics[zip][transportation].totalVehicleMiles / trainPMPG) * 10180/1000 * formattedMetrics[zip][transportation].commutesPerWeek * 52;
      }
      if (transportation == "LIGHT_RAIL") {
        emissions[3].value += (formattedMetrics[zip][transportation].totalVehicleMiles / lightPMPG) * 8887/1000 * formattedMetrics[zip][transportation].commutesPerWeek * 52;
      }
      if (transportation == "SUBWAY") {
        emissions[4].value += (formattedMetrics[zip][transportation].totalVehicleMiles / subwayPMPG) * 8887/1000 * formattedMetrics[zip][transportation].commutesPerWeek * 52;
      }
    }
    zipEmissions.push(zipEmission);
  }
  emissions = emissions.filter(transportation => transportation.value != 0);
  emissions.forEach(transportation => transportation.value = Math.round(transportation.value * 100) / 100);
  zipEmissions = zipEmissions.sort((a, b) => b.value - a.value).slice(0, 5);
  top5Zips = zipEmissions.map(zip => zip.name);

  let violinData = [];
  for (let zip in formattedMetrics) {
    if(zip != "07030") {
      for(let transportation in formattedMetrics[zip]) {
        if (top5Zips.includes(zip)) {
          let calculatedValue;
          if (transportation == "DRIVE") {
            calculatedValue = (formattedMetrics[zip][transportation].totalVehicleMiles / carPMPG) * 8887/1000 * formattedMetrics[zip][transportation].commutesPerWeek * 52;
          }
          if (transportation == "BUS") {
            calculatedValue = (formattedMetrics[zip][transportation].totalVehicleMiles / busPMPG) * 10180/1000 * formattedMetrics[zip][transportation].commutesPerWeek * 52;
          }
          if (transportation == "TRAIN") {
            calculatedValue = (formattedMetrics[zip][transportation].totalVehicleMiles / trainPMPG) * 10180/1000 * formattedMetrics[zip][transportation].commutesPerWeek * 52;
          }
          if (transportation == "LIGHT_RAIL") {
            calculatedValue = (formattedMetrics[zip][transportation].totalVehicleMiles / lightPMPG) * 8887/1000 * formattedMetrics[zip][transportation].commutesPerWeek * 52;
          }
          if (transportation == "SUBWAY") {
            calculatedValue = (formattedMetrics[zip][transportation].totalVehicleMiles / subwayPMPG) * 8887/1000 * formattedMetrics[zip][transportation].commutesPerWeek * 52;
          }
          violinData.push({
            name: zip,
            value: Math.round(calculatedValue  * 100) / 100,
          });
        }
      }
    }
  }
	return [emissions, violinData];
}

export { getRoutes, getMetrics };
