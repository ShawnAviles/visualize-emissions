import Map, { Source, Layer, Marker, ScaleControl } from 'react-map-gl';
import type { Feature, Geometry, GeoJsonProperties } from 'geojson';
import type { LayerProps } from 'react-map-gl';

import { useState, useEffect } from 'react';
import ScopeMenu from './ScopeMenu';
// import routes from '../utility/sampleData/routePolylines/simple_routes_5.json';
// import routeLayers from '../utility/sampleData/routeLayers/simple_routes_5_layers.json';
// import useGeoJson from '../hooks/useGeoJson.tsx';
import useMetrics from '../hooks/useMetrics.tsx';
import { generateRouteLayer } from '../utility/helper';
import {  BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Label, PieChart, Pie } from 'recharts';

// Used this to test the liveRoutes data as it is saved locally, atp it is just an extra sample data file:
// import liveRoutesStatic from '../utility/sampleData/routePolylines/routes_gcp_28.json';
// import liveRoutesLayersStatic from '../utility/sampleData/routeLayers/routes_gcp_28_layers.json';

import studentDataset from '../utility/sampleData/api/routes/sample_students_74/output.json';
import employeeDataset from '../utility/sampleData/api/routes/sample_employee_258/output.json';

type TransportationModes =
  | 'DRIVE'
  | 'TRAIN'
  | 'SUBWAY'
  | 'LIGHT_RAIL'
  | 'BUS'
  | 'WALK'
  | 'BICYCLE';

function MenuWrapper() {
  const mapboxToken: string = import.meta.env.VITE_MAPBOX_TOKEN;
  const StevensLongitude: number = -74.02414311907891;
  const StevensLatitude: number = 40.74509007605575;
  // const [uploadedData, setUploadedData] = useState({ data: [], errors: [], meta: [] });
  const [sources, setSources] = useState([] as React.ReactElement[]);
  const [modeFilter, setModeFilter] = useState('all');
  const [availableModes, setAvailableModes] = useState([] as string[]);
  const [datasetFilter, setDatasetFilter] = useState('Student'); // State for dataset filter

  const studentData = studentDataset.data;
  const employeeData = employeeDataset.data;
  const [metricFilter, setMetricFilter] = useState('none');
  
  // Constants for the charts
  const colors = ["#FF0000", "#FFA500", "#272B2E", "#C4A484", "#7B5343"];
  const modeColors: { [key: string]: string } = {
    "Car": "#FF0000",
    "Bus": "#FFA500",
    "Trains": "#272B2E",
    "Light Rail": "#C4A484",
    "Subway": "#7B5343"
  };
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius + 100) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.01) return null; //Check if the percentage is 0% and shouldn't be rendered
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  //Commented out liveRoutes call to backend since we are turning off uploading for expo
  // const {
  //   loading: geoJsonLoading,
  //   error: geoJsonError,
  //   // liveRoutesObject
  // } = useGeoJson('http://localhost:3000/routes', uploadedData);

  const {
    loading: metricsLoading,
    metrics,
  } = useMetrics(metricFilter);

  //Geting percentages of public transport vs cars
  let publicTransport = 0;
  let nonPublicTransport = 0;
  let total = 0;
  for (let mode of metrics) {
    total += mode.value;
    if (mode.name === "Cars") {
      nonPublicTransport += mode.value;
    } else {
      publicTransport += mode.value;
    }
  }
  publicTransport = Math.round(publicTransport / total * 10000) / 100;
  nonPublicTransport = Math.round(nonPublicTransport / total * 10000) / 100;

  const handleMetricSelection = (metric: string) => {
    setMetricFilter(metric);
  };

  // useEffect(() => {
  //   if (Object.keys(liveRoutesObject).length > 0) {
  //     const modes = Object.keys(liveRoutesObject);
  //     setAvailableModes(modes);
  //   }
  // }, [liveRoutesObject]);

  // useEffect(() => {
  //   const renderPolyline = () => {
  //     // conditional render of the polylines based on liveRoutes variable, else render using routesLayers.json
  //     console.log('start of renderPolyline');
  //     console.log(liveRoutesObject);
  //     console.log(liveRoutesObject['DRIVE']);
  //     if (Object.keys(liveRoutesObject).length === 0) {
  //       setSources([
  //         <Source
  //           id="my-data"
  //           key="my-data"
  //           type="geojson"
  //           data={{
  //             type: 'FeatureCollection',
  //             features: routes as Feature<Geometry, GeoJsonProperties>[]
  //           }}
  //         >
  //           {routeLayers.map((layer, index) => (
  //             <Layer key={index} {...(layer as LayerProps)} />
  //           ))}
  //         </Source>
  //       ]);
  //       return;
  //     }
  //     // create custom layer object based on liveRoutes data, this must be unique for each set of route data uploaded
  //     const sources: React.ReactElement[] = [];
  //     const existingModesOfTransport = Object.keys(liveRoutesObject);

  //     for (let mode of existingModesOfTransport) {
  //       if (modeFilter !== 'all' && modeFilter !== mode) {
  //         // Skip if modeFilter is set and the current mode is not the selected one
  //         continue;
  //       }

  //       let liveRoutes: object[] = liveRoutesObject[mode];
  //       let liveRoutesLayers = generateRouteLayer(liveRoutes, {
  //         modeOfTransport: mode as TransportationModes
  //       });

  //       sources.push(
  //         <Source
  //           id={mode}
  //           key={mode}
  //           type="geojson"
  //           data={{
  //             type: 'FeatureCollection',
  //             features: liveRoutes as Feature<Geometry, GeoJsonProperties>[]
  //           }}
  //           lineMetrics={true}
  //         >
  //           {liveRoutesLayers.map((layer, index) => (
  //             <Layer key={index} {...(layer as LayerProps)} />
  //           ))}
  //         </Source>
  //       );
  //     }
  //     // TODO: Remove later
  //     console.log('CREATED', sources);
  //     setSources(sources);
  //   };

  //   renderPolyline();
  // }, [liveRoutesObject, modeFilter]);

  useEffect(() => {
    const renderPolyline = () => {
      let currentData = {};
      let modes = [];
      console.log(datasetFilter);
      if (datasetFilter === 'Student') {
        currentData = studentData;
        modes = Object.keys(currentData);
        setAvailableModes(modes);
      } else if (datasetFilter === 'Employee') {
        currentData = employeeData;
        modes = Object.keys(currentData);
        setAvailableModes(modes);
      } else {
        // Combine data from both datasets
        modes = [...new Set([...Object.keys(studentData), ...Object.keys(employeeData)])];
        const combinedData: { [key: string]: object[] } = {}; // Add index signature to allow indexing with a string

        for (let mode of modes) {
          // Combine routes for each mode
          combinedData[mode] = [
            ...(studentData[mode as keyof typeof studentData] || []),
            ...(employeeData[mode as keyof typeof employeeData] || [])
          ];
        }
        currentData = combinedData;
        setAvailableModes(modes);
      }
      const sources: React.ReactElement[] = [];
      const existingModesOfTransport = Object.keys(currentData);

      for (let mode of existingModesOfTransport) {
        if (modeFilter !== 'all' && modeFilter !== mode) {
          continue;
        }

        let currentRoutes: object[] = currentData[mode as keyof typeof currentData];
        let currentLayers = generateRouteLayer(currentRoutes, {
          modeOfTransport: mode as TransportationModes
        });

        sources.push(
          <Source
            id={mode}
            key={mode}
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: currentRoutes as Feature<Geometry, GeoJsonProperties>[]
            }}
            lineMetrics={true}
          >
            {currentLayers.map((layer, index) => (
              <Layer key={index} {...(layer as LayerProps)} />
            ))}
          </Source>
        );
      }
      setSources(sources);
      console.log(currentData);
    };
    renderPolyline();
  }, [studentData, modeFilter, datasetFilter, employeeData]);

  return (
    <>
      <div className="md:h-[80vh] h-[100vh] w-screen flex justify-center items-center md:px-16 px-4">
        <div className="h-full w-full rounded-lg border-sky-400 bg-gradient-to-r to-emerald-600 from-sky-400 p-1">
          <div className="md:relative flex flex-col h-full w-full">
            <ScopeMenu
              //Commented out liveRoutes call to backend since we are turning off uploading for expo
              // setUploadedData={setUploadedData}
              // loading={geoJsonLoading}
              // error={geoJsonError}
              setModeFilter={setModeFilter} // Pass the setModeFilter function to ScopeMenu
              availableModes={availableModes} // Pass availableModes to ScopeMenu
              setDatasetFilter={setDatasetFilter} // Pass setDatasetFilter to ScopeMenu
            />
            <Map
              mapboxAccessToken={mapboxToken}
              initialViewState={{
                longitude: StevensLongitude,
                latitude: StevensLatitude,
                zoom: 10
              }}
              style={{
                width: '100%',
                height: '100%', 
                borderRadius:"0.5rem",
                // filter: geoJsonLoading ? 'blur(4px)' : 'none'
              }}
              mapStyle="mapbox://styles/mapbox/light-v11"
            >
              <Marker
                longitude={StevensLongitude}
                latitude={StevensLatitude}
                color="#b30538"
                anchor="center"
              />
              <ScaleControl unit="imperial" />
              {sources.length > 0 && sources}
            </Map>
          </div>
        </div>
      </div>
      {/* // Creating toggle between student, employee, and all */}
      <div className='flex flex-col my-5 items-center'>
        <div className='text-center font-bold text-xl underline underline-offset-3 mb-2'>Metrics Data Analysis</div>
        <select
          className = "select select-bordered select-sm w-64 "
          value={metricFilter}
          onChange={(e) => handleMetricSelection(e.target.value)}
          defaultValue={"none"}
          >
          <option value="none">Select Metric</option>
          <option value="Students">Students</option>
          <option value="Employees">Employees</option>
          <option value="Total">Total</option>
        </select>
      </div>

      {metricsLoading  ? 
        <>
          <div className="p-8 flex flex-col justify-center items-center italics text-primary text-[11pt]">
            Loading Metrics...
            <span className="loading loading-spinner loading-lg mt-2"></span>
          </div>
        </>
       :
        <>
          <div className='grid md:grid-cols-2 place-items-center grid-cols-1'> 
            {metrics[0] && 
              <div className='md:h-[70vh] md:w-[50vw] h-[70vh] w-[100vw] mt-10'>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={metrics}
                    margin={{
                      top: 45,
                      left: 15,
                      right: 10,
                      bottom: 20,
                    }}
                  >
                    <text x={500 / 2} y={20} fill="black" className='font-bold text-lg' textAnchor="middle" dominantBaseline="central">
                      <tspan x="50%" dy={-10} lengthAdjust="spacingAndGlyphs">Monthly CO2(kg) Emissions</tspan>
                      <tspan x="50%" dy={17} lengthAdjust="spacingAndGlyphs">From Each Mode of Transportation</tspan>
                    </text>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tickMargin={25} height={60} angle={-45} dx={-20} interval={0}> 
                      <Label value="Modes of Transportation" offset={-18} position="insideBottom" fill='black' className='font-medium'/>
                    </XAxis>
                    <YAxis >
                      <Label value="Amount of CO2 Emitted (kg)" dy={-30} position="insideBottomLeft" offset={10} angle={-90} fill='black' className='font-medium'/>
                    </YAxis>
                    <Tooltip labelClassName='text-black' />
                    <Bar dataKey="value" fill="#8884d8" activeBar={<Rectangle className='opacity-75' stroke="black" />}>
                      {metrics.map((_entry: { name: string; value: number }, index: number) => (
                        <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                      ))}
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
              </div>
            }
            {metrics[0] && 
              <div className='flex flex-col justify-items-center mt-10 ml-12 mr-12'>
                  <div className='text-center text-lg font-bold'>Bar Chart Analysis</div>
                  <div className='md:px-6 px-0 indent-5'>
                    This bar chart displays the amount of CO2 emitted by each mode of transportation for each month based on the provided data.
                    The calculation was done by taking each mode of transportation's total mileage and dividing it by the PMPG values for each type of vehicle to get total gallons.
                    Then, multiply by a constant, which represents the amount of CO2 emitted per gallon of gasoline, to get the total CO2 emitted in kgs.
                  </div>
              </div>
            }
            {metrics[0] &&
              <div className='md:h-[60vh] md:w-[50vw] h-[70vh] w-[100vw] mt-20'>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={500} height={400} margin={{top: 50, bottom: 20}}>
                      <text x={500 / 2} y={20} fill="black" className='font-bold text-lg' textAnchor="middle" dominantBaseline="central">
                        <tspan x="50%" dy={-10} lengthAdjust="spacingAndGlyphs">Percentage of Emissions</tspan>
                        <tspan x="50%" dy={17} lengthAdjust="spacingAndGlyphs">Generated by Each Mode</tspan>
                      </text>
                      <Pie
                        data={metrics}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={175}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {metrics.map((_entry: { name: string; value: number }, index: number) => (
                          <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                        ))}
                      </Pie>
                      <Legend
                        payload={Object.keys(modeColors).map((mode: string) => ({
                          value: mode,
                          type: 'square',
                          color: modeColors[mode] 
                        }))}
                        layout="horizontal" 
                        verticalAlign="bottom"
                        align='center'
                      />
                    </PieChart>
                  </ResponsiveContainer>
              </div>
            }
            {metrics[0] && 
              <div className='flex flex-col justify-items-center mt-10 ml-12 mb-12 mr-12'>
                  <div className='text-center text-lg font-bold'>Pie Chart Analysis</div>
                  <div className='md:px-6 px-0 indent-5'>
                    This chart utilizes the same calculated data as the bar chart finds the total CO2 emitted by the different modes of transportation.
                    Then, using this total, it calculates the percentage of CO2 emitted by each mode of transportation. 
                    <br/>
                    <span className='font-medium'>
                      Public Transportation: {publicTransport}% | Non-Public Transportation: {nonPublicTransport}%
                    </span>
                  </div>
              </div>
            }
          </div> 
        </>
      }
    </>
  );
}

export default MenuWrapper;
