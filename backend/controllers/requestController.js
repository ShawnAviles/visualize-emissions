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
async function getMetrics(zipCodesWithModes) {
	const [metrics, invalidZipcodes] = await getAllMetricsData(zipCodesWithModes);
	const formattedMetrics = formatMasterMetricsDataObject(metrics);
	return formattedMetrics;
}

export { getRoutes, getMetrics };
