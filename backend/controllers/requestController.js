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
  ]
  for (let zip in formattedMetrics) {
    if (formattedMetrics[zip]?.DRIVE) {
      emissions[0].value = (formattedMetrics[zip].DRIVE.totalVehicleMiles / carPMPG) * 10180 * formattedMetrics[zip].DRIVE.commutesPerWeek * 52;
    }
    if (formattedMetrics[zip]?.BUS) {
      emissions[1].value += (formattedMetrics[zip].BUS.totalVehicleMiles / busPMPG) * 10180 * formattedMetrics[zip].BUS.commutesPerWeek * 52;
    }
    if (formattedMetrics[zip]?.TRAIN) {
      emissions[2].value += (formattedMetrics[zip].TRAIN.totalVehicleMiles / trainPMPG) * 10180 * formattedMetrics[zip].TRAIN.commutesPerWeek * 52;
    }
    if (formattedMetrics[zip]?.LIGHT_RAIL) {
      emissions[3].value += (formattedMetrics[zip].LIGHT_RAIL.totalVehicleMiles / lightPMPG) * 10180 * formattedMetrics[zip].LIGHT_RAIL.commutesPerWeek * 52;
    }
    if (formattedMetrics[zip]?.SUBWAY) {
      emissions[4].value += (formattedMetrics[zip].SUBWAY.totalVehicleMiles / subwayPMPG) * 10180 * formattedMetrics[zip].SUBWAY.commutesPerWeek * 52;
    }
  }

	return emissions;
}

export { getRoutes, getMetrics };
