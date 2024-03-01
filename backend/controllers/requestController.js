const polyline = require("polyline");
const { get } = require("../routes/health");
const dotenv = require("dotenv").config();
const MAPS_TOKEN = process.env.GOOGLE_MAPS_DIRECTIONS_TOKEN;

/**
 * Fetches a compressed/coded polyline in string format from Google Maps Directions API for a given zipcode.
 *
 * @param {string} zipCode - The zipcode to get the polyline route for.
 * @param {string} travelMode - ENUM "DRIVE", "TRAIN", "SUBWAY", "LIGHT_RAIL", "BUS" for the mode of transport.
 * @returns {Promise<string>} A promise that resolves to the polyline data string.
 * @throws {Error} If there is an error with the fetch request or if the response does not contain a route.
 */
async function getPolylineRouteFromZipCode(zipCode, travelMode = "DRIVE") {
	// handle different types of transportation
	let transitPreferences = {};
	switch (travelMode) {
		case "DRIVE":
			break;
		case "WALK":
			break;
		case "BICYCLE":
			break;
		case "TRAIN":
			travelMode = "TRANSIT";
			transitPreferences = {
				routingPreference: "LESS_WALKING",
				allowedTravelModes: ["TRAIN"],
			};
			break;
		case "SUBWAY":
			travelMode = "TRANSIT";
			transitPreferences = {
				routingPreference: "LESS_WALKING",
				allowedTravelModes: ["SUBWAY"],
			};
			break;
		case "LIGHT_RAIL":
			travelMode = "TRANSIT";
			transitPreferences = {
				routingPreference: "LESS_WALKING",
				allowedTravelModes: ["LIGHT_RAIL"],
			};
			break;
		case "BUS":
			travelMode = "TRANSIT";
			transitPreferences = {
				routingPreference: "LESS_WALKING",
				allowedTravelModes: ["BUS"],
			};
			break;
	}

	// Fetch the polyline from Google Maps Directions API
	try {
		// Build request URL: https://developers.google.com/maps/documentation/routes/migrate-routes
		const url = "https://routes.googleapis.com/directions/v2:computeRoutes";

		// Modes of Transport: https://developers.google.com/maps/documentation/routes/reference/rest/v2/RouteTravelMode
		const data = {
			origin: {
				address: String(zipCode),
			},
			destination: {
				address: "1 Castle Point Terrace, Hoboken, NJ 07030",
			},
			polylineEncoding: "GEO_JSON_LINESTRING",
			travelMode: travelMode, // "DRIVE", "TRANSIT", "WALK", "BICYCLE
			computeAlternativeRoutes: false,
			routeModifiers: {
				avoidTolls: false,
				avoidHighways: false,
				avoidFerries: false,
			},
			languageCode: "en-US",
			units: "IMPERIAL",
		};

		if (travelMode === "TRANSIT") {
			data.transitPreferences = transitPreferences;
		}

		const request = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": MAPS_TOKEN,
				"X-Goog-FieldMask":
					"routes.duration,routes.distanceMeters,routes.polyline.geoJsonLinestring,routes.legs.steps",
			},
			body: JSON.stringify(data),
		};

		// Make the API call
		const routeData = await fetch(url, request);
		const response = await routeData.json();

		// Check if we got a successful response with a route
		if (response.routes && response.routes[0].polyline) {
			const polylineGeojson =
				response.routes[0].polyline.geoJsonLinestring.coordinates;
			return polylineGeojson;
		}
		throw new Error("No route found.");
	} catch (error) {
		// console.error('Error fetching polyline:', error);
		return "Error fetching polyline";
	}
}

/**
 * Returns object with all decoded polyline data for all zipcodes in the array
 *
 * @param {array} zipCodesWithModes - Object with ZIP Codes as key and fields for the modes of transportation to request
 */
async function getAllPolylineRoutes(zipCodesWithModes) {
	/* polylineData: {
		"07030" : {
			"DRIVE": geoJson,
			"TRAIN": geoJson,
			...
		}
		...
	}
	*/
	const polylineData = {};
	const invalidZipcodes = [];

	const promises = [];

	for (let zipCode in zipCodesWithModes) {
		// handle all types of MODES and STRICTLY convert them to "DRIVE", "TRAIN", "SUBWAY", "LIGHT_RAIL", or "BUS"
		const modesOfTransport = zipCodesWithModes[zipCode].modeOfTransport;
		for (let mode of modesOfTransport) {
			mode = getModeOfTransport(mode);
			const polylineDataString = await getPolylineRouteFromZipCode(
				zipCode,
				mode
			);
			if (polylineDataString === "Error fetching polyline") {
				invalidZipcodes.push(zipCode);
				return;
			}

			// append if it exists
			if (polylineData[zipCode]) {
				polylineData[zipCode][mode] = polylineDataString;
			} else {
				polylineData[zipCode] = {};
				polylineData[zipCode][mode] = polylineDataString;
			}
		}
		promises.push(polylineData);
	}
	await Promise.all(promises);
	// return both the zipcode with polyline data for each mode of transportation and the
	// invalid zipcodes that didn't return a polyline (invalidZipcodes are not used rn)
	return [polylineData, invalidZipcodes];
}

/**
 * Returns array of formated route object that is readable by the Mapbox viewer
 *
 * @param {object} polylineData - Array of coordinates for the route
 * @param {string} zipCode - Zipcode of the route
 */
function formatToRouteObjects(polylineData, zipCode) {
	const formattedRoute = {
		type: "Feature",
		zipCode: zipCode,
		properties: {},
		geometry: {
			type: "LineString",
			coordinates: polylineData,
		},
	};
	return formattedRoute;
}

/**
 * Returns object with modes of transport as the key and each mode has an array of all formatted polyline data
 *
 * @param {object} masterPolylineData - Object with ZIP Codes as key and fields for geoJson for each modes of transportation
 */
function formatToMasterObject(masterPolylineData) {
	const formattedData = {};
	for (let zipCode in masterPolylineData) {
		const modesOfTransport = masterPolylineData[zipCode];
		for (let mode in modesOfTransport) {
			if (formattedData[mode]) {
				formattedData[mode].push(
					formatToRouteObjects(modesOfTransport[mode], zipCode)
				);
			} else {
				formattedData[mode] = [];
				formattedData[mode].push(
					formatToRouteObjects(modesOfTransport[mode], zipCode)
				);
			}
		}
	}
	return formattedData;
}

/**
 * Returns the mode of transport that is strictly used in the API ENUM: "DRIVE", "TRAIN", "SUBWAY", "LIGHT_RAIL", "BUS"
 *
 * @param {string} mode - mode of transport
 * @returns {string} "DRIVE", "TRAIN", "SUBWAY", "LIGHT_RAIL", "BUS"
 */
function getModeOfTransport(mode) {
	mode = mode.toLowerCase();

	// set of different modes
	const driveMode = new Set(["car", "rideshare", "stevens shuttle", "shuttle"]);
	const walkMode = new Set(["walk"]);
	const bikeMode = new Set(["bike", "bicycle", "scooter", "citibike"]);
	const trainMode = new Set(["nj transit", "path"]);
	const subwayMode = new Set(["subway"]);
	const lightRailMode = new Set(["light rail"]);
	const busMode = new Set(["bus", "nj transit bus"]);

	if (driveMode.has(mode)) {
		return "DRIVE";
	} else if (trainMode.has(mode)) {
		return "TRAIN";
	} else if (subwayMode.has(mode)) {
		return "SUBWAY";
	} else if (lightRailMode.has(mode)) {
		return "LIGHT_RAIL";
	} else if (busMode.has(mode)) {
		return "BUS";
	} else if (walkMode.has(mode)) {
		return "WALK";
	} else if (bikeMode.has(mode)) {
		return "BICYCLE";
	} else {
		return "DRIVE";
	}
}

/**
 * returns object with all the routes for each mode of transport for each zipcode
 *
 * @param {array} zipCodesWithModes - object of all zipcodes {strings} passed in POST with their respective modes of transport array of {strings}
 */
async function getRoutes(zipCodesWithModes) {
	// TODO: Let user know of the invalidZipCodes that didn't return a polyline
	const [polylineData, invalidZipcodes] = await getAllPolylineRoutes(
		zipCodesWithModes
	);
	const formattedRoutes = formatToMasterObject(polylineData);
	return formattedRoutes;
}

module.exports = { getRoutes };
