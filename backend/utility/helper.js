// Utility Function used by Server Routes
import "dotenv/config.js";
// const dotenv = require("dotenv").config();
const MAPS_TOKEN = process.env.GOOGLE_MAPS_DIRECTIONS_TOKEN;

/**
 * Fetches a compressed/coded polyline in string format from Google Maps Directions API for a given zipcode.
 * You can read more in /controllers/ResponseHandling.md
 *
 * @param {string} zipCode - The zipcode to get the polyline route for.
 * @param {string} travelMode - ENUM "DRIVE", "TRAIN", "SUBWAY", "LIGHT_RAIL", "BUS" for the mode of transport.
 * @returns {Promise<string>} A promise that resolves to the polyline data string.
 * @throws {Error} If there is an error with the fetch request or if the response does not contain a route.
 */
async function getPolylineRouteFromZipCode(zipCode, travelMode = "DRIVE") {
	// handle different types of transportation
	let [enumTravelMode, transitPreferences] = modeOfTransportToEnum(travelMode);
	travelMode = enumTravelMode;

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
				"X-Goog-FieldMask": "routes.polyline.geoJsonLinestring",
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

async function getMetricsFromZipCode(zipCode, travelMode = "DRIVE") {
	// handle different types of transportation
	let [enumTravelMode, transitPreferences] = modeOfTransportToEnum(travelMode);
	travelMode = enumTravelMode;

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
					"routes.duration,routes.distanceMeters,routes.legs.steps",
			},
			body: JSON.stringify(data),
		};

		// Make the API call
		const routeData = await fetch(url, request);
		const response = await routeData.json();

		// Check if we got a successful response with a route
		if (response.routes && Object.keys(response.routes[0]).length === 3)
			return response.routes[0];
		throw new Error("No route data found.");
	} catch (error) {
		// console.error('Error fetching polyline:', error);
		return "Error fetching route data";
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

	for (let zipCode in zipCodesWithModes) {
		// handle all types of MODES and STRICTLY convert them to "DRIVE", "TRAIN", "SUBWAY", "LIGHT_RAIL", or "BUS"
		const modesOfTransport = zipCodesWithModes[zipCode].modeOfTransport;
		for (let mode of modesOfTransport) {
			mode = getModeOfTransportation(mode);
			const polylineDataString = await getPolylineRouteFromZipCode(
				zipCode,
				mode
			);
			if (polylineDataString === "Error fetching polyline") {
				invalidZipcodes.push(zipCode);
				continue;
			}

			// append if it exists
			if (polylineData[zipCode]) {
				polylineData[zipCode][mode] = polylineDataString;
			} else {
				polylineData[zipCode] = {};
				polylineData[zipCode][mode] = polylineDataString;
			}
		}
	}
	// return both the zipcode with polyline data for each mode of transportation and the
	// invalid zipcodes that didn't return a polyline (invalidZipcodes are not used rn)
	return [polylineData, invalidZipcodes];
}

/**
 * Returns object with all the calculation data
 * (distance in meters, duration in seconds, legs which can be used to determine which steps require a vehicle and which don't)
 * for each mode of transport within each zipcode
 *
 * @param {array} zipCodesWithModes - object of all zipcodes {strings} passed in POST with their respective modes of transport array of {strings}
 */
async function getAllMetricsData(zipCodesWithModes) {
	/* metricsData: {
		[
			"zipCode1": {
				"DRIVE": {
					"distanceMeters": 1287,
					"duration": 300,
					"legs": [steps...]
				}
    		...
			},
			...
		]
  },
	*/
	const metricsData = {};
	const invalidZipcodes = [];

	for (let zipCode in zipCodesWithModes) {
		// handle all types of MODES and STRICTLY convert them to "DRIVE", "TRAIN", "SUBWAY", "LIGHT_RAIL", or "BUS"
		const modesOfTransport = zipCodesWithModes[zipCode].modeOfTransport;
		for (let mode of modesOfTransport) {
			mode = getModeOfTransportation(mode);
			/* 
			requestData: {
				distanceMeters: number,
				duration: number,
				legs: [steps...]
			}
			*/
			const requestData = await getMetricsFromZipCode(zipCode, mode);
			if (requestData === "Error fetching route data") {
				invalidZipcodes.push(zipCode);
				continue;
			}

			// append if it exists
			if (!metricsData[zipCode]) metricsData[zipCode] = {};

			metricsData[zipCode][mode] = requestData;
		}
	}
	// return both the zipcode with polyline data for each mode of transportation and the
	// invalid zipcodes that didn't return a polyline (invalidZipcodes are not used rn)
	return [metricsData, invalidZipcodes];
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
function formatToMasterRouteObject(masterPolylineData) {
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
 * Returns the mode of transport that is strictly used our the API call: "DRIVE", "TRAIN", "SUBWAY", "LIGHT_RAIL", "BUS"
 *
 * @param {string} mode - mode of transport
 * @returns {string} "DRIVE", "TRAIN", "SUBWAY", "LIGHT_RAIL", "BUS", "WALK", "BICYCLE", "DRIVE"
 */
function getModeOfTransportation(mode) {
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
 * Returns an array with the mode of transport and the transit preferences if it is a transit mode
 *
 * @param {string} travelMode - mode of transport
 */
function modeOfTransportToEnum(travelMode) {
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
	return [travelMode, transitPreferences];
}

// Format of return data (array):
// [
//   "zipCode1": {
//     "DRIVE": {
//       "totalVehicleMiles": 80.23,
//       "totalMilesTraveled": 80.23,
//       "totalSeconds": 300,
//     }
//     "BUS": {
//       "totalVehicleMiles": 23.03,
//       "totalMilesTraveled": 25.12,
//       "totalSeconds": 600,
//     }
//     ...
//   },
//   "zipCode2": {
//     "DRIVE": {
//       "totalVehicleMiles": 80.23,
//       "totalMilesTraveled": 80.23,
//       "totalSeconds": 300,
//     }
//     "WALK": {
//       "totalVehicleMiles": 0,
//       "totalMilesTraveled": 0.82,
//       "totalSeconds": 600,
//     ...
//   },
//   ...
// ]
function formatMasterMetricsDataObject(masterMetricsData, table) {
	const formattedData = {};
	// these modes require us to parse the legs to get vehicle miles
	const publicModesOfTransportation = new Set([
		"TRAIN",
		"SUBWAY",
		"LIGHT_RAIL",
		"BUS",
	]);
	// Green Modes of Transporation ("WALK", "BICYCLE") will have vehicle miles set to 0
	const greenModesOfTransporation = new Set(["WALK", "BICYCLE"]);

	// iterate over the masterMetricsData and format the data
	for (let zipCode in masterMetricsData) {
		const modesOfTransport = masterMetricsData[zipCode];
		for (let mode in modesOfTransport) {
			const format = {
				totalVehicleMiles: 0,
				totalMilesTraveled: 0,
				totalSeconds: 0,
			};

			if (!formattedData[zipCode]) {
				formattedData[zipCode] = {};
			}
			formattedData[zipCode][mode] = format;

			let curr = formattedData[zipCode][mode];
			const miles = modesOfTransport[mode].distanceMeters * 0.000621371;

			// if the mode of transport is public, add the vehicle miles to the total vehicle miles
			if (publicModesOfTransportation.has(mode)) {
				const stepsArray = modesOfTransport[mode].legs[0].steps;
				let totalVehicleMiles =
					getVehicleMetersTraveledFromSteps(stepsArray) * 0.000621371;
				curr.totalVehicleMiles = totalVehicleMiles;
				curr.totalMilesTraveled = miles;
			} else if (!greenModesOfTransporation.has(mode)) {
				curr.totalVehicleMiles = miles;
			}

			curr.totalMilesTraveled = miles;
			curr.totalSeconds = Number(modesOfTransport[mode].duration.slice(0, -1));
		}
	}

	// Do the same and add commutesPerWeek from the table data to the formattedData object
	// Note: this is iterating over the uploaded table from user on fronted not GCP data, so it is handled separately
	const commutesPerWeek = extractCommutesPerWeek(table);
	for (let zipCode in formattedData) {
		for (let mode in formattedData[zipCode]) {
			if (commutesPerWeek[zipCode] && commutesPerWeek[zipCode][mode]) {
				formattedData[zipCode][mode].commutesPerWeek =
					commutesPerWeek[zipCode][mode].commutesPerWeek;
			} else {
				console.log("No commutes per week data found for:", zipCode, mode);
			}
		}
	}

	return formattedData;
}

// Helper function to get the total vehicle miles from the steps array
function getVehicleMetersTraveledFromSteps(steps) {
	// iterate over steps' elements and add all the distanceMeters values when the object's key travelMode has the value of "TRANSIT"
	let vehicleMeters = 0;

	for (let step of steps) {
		if (step.travelMode === "TRANSIT") {
			vehicleMeters += step.distanceMeters;
		}
	}
	return vehicleMeters;
}

const extractCommutesPerWeek = (table) => {
	let resultCommuteCountObj = {};

	const zipCodeColumnIndex = table[0].indexOf("ZIP Code");
	const modeColumnIndex = table[0].indexOf("Mode of Transport");
	const peopleColumnIndex = table[0].indexOf("Frequency of Commuting Days");

	// Error Handling
	if (zipCodeColumnIndex === undefined) {
		console.log("No zip code column found in the uploaded data.");
		// will need to throw error to user about missing Zip code column
		return;
	}
	if (modeColumnIndex === undefined) {
		console.log("No mode of transport column found in the uploaded data.");
		// will need to throw error to user about missing mode of transport column
		return;
	}

	if (peopleColumnIndex === undefined) {
		console.log(
			"No frequency of commute count column found in the uploaded data."
		);
		// will need to throw error to user about missing people count column
		return;
	}

	table = table.slice(1); // remove the header row

	// get array of values in column
	table.map((row) => {
		const zipCode = row[zipCodeColumnIndex];
		const modeOfTransport = getModeOfTransportation(row[modeColumnIndex]);
		const currentFreqPerWeek = parseInt(row[peopleColumnIndex]);

		if (!resultCommuteCountObj[zipCode]) resultCommuteCountObj[zipCode] = {};
		if (!resultCommuteCountObj[zipCode][modeOfTransport])
			resultCommuteCountObj[zipCode][modeOfTransport] = { commutesPerWeek: 0 };

		resultCommuteCountObj[zipCode][modeOfTransport].commutesPerWeek +=
			currentFreqPerWeek;
	});

	return resultCommuteCountObj;
};

export {
	getAllPolylineRoutes,
	formatToMasterRouteObject,
	getAllMetricsData,
	formatMasterMetricsDataObject,
};
