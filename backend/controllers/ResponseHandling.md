# Route Computation API Documentation

## Introduction

This document describes the structure of the response from the Route Computation API, which calculates routes between a ZIP code and a fixed destination address.

## Request Format

The API accepts POST requests with the following parameters:

- `origin`: The starting point of the route, specified by a ZIP code.
- `destination`: The fixed ending point of the route ("1 Castle Point Terrace, Hoboken, NJ 07030").
- `travelMode`: Mode of travel. Options include "DRIVE", "BICYCLE", "TRANSIT".
- `computeAlternativeRoutes`: Boolean to compute alternative routes (true/false).
- `routeModifiers`: Includes modifiers like `avoidTolls`, `avoidHighways`, and `avoidFerries`.
- `languageCode`: Language for the response (e.g., "en-US").
- `units`: Unit system for the response (e.g., "IMPERIAL").

## Response Structure
s
The response includes the following key information:

- `legs`: Array of route segments. Each leg contains an array of `steps`.
- `distanceMeters`: Distance of the route in meters.
- `duration`: Estimated travel time in seconds.
- `polyline`: Encoded polyline data for the route.
  - `encodedPolyline`: A string representing the encoded polyline.

## Example Response

```json
{
  "legs": [
    { "steps": [/* Array of steps */] }
  ],
  "distanceMeters": 8471,
  "duration": "2853s",
  "polyline": {
    "encodedPolyline": "ymuwFbfpbMy@lCdBjAAB[`ADB]bA@?LJoB~FiE~MyGpS...[truncated for brevity]"
  }
}
```

**Note**: Isolating Distances for Transit typed Routes (Bus, Subway, Train, Light Rail, Raile) can be done by filtering the legs.steps arrays
