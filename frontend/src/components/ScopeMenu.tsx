import { useState } from 'react';
// import UploadWrapper from './UploadWrapper';

const ScopeMenu = ({
  //Commented out certain props for uploading csv/xlsx files such as animation and useState variables
  // setUploadedData,
  // loading,
  // error = null,
  setModeFilter,
  availableModes,
  setDatasetFilter, // Add setDatasetFilter prop
  setMapModeFilter // Add setMapModeFilter prop
}: {
  // setUploadedData: Function;
  // loading: boolean;
  // error: any;
  setModeFilter: Function;
  availableModes: string[];
  setDatasetFilter: Function; // Add setDatasetFilter prop
  setMapModeFilter: Function; // Add setMapModeFilter prop
}) => {
  const [selected, setSelected] = useState('all');
  const [selectedMapMode, setSelectedMapMode] = useState('all'); // State for selected map mode [polylines, dots
  const [selectedDataset, setSelectedDataset] = useState('Student'); // State for selected dataset

  const handleModeSelection = (mode: string) => {
    setSelected(mode);
    setModeFilter(mode);
  };

  const handleMapModeSelection = (mapMode: string) => {
    setSelectedMapMode(mapMode);
    setMapModeFilter(mapMode);
  }

  const handleDatasetSelection = (dataset: string) => {
    setSelectedDataset(dataset);
    setDatasetFilter(dataset); // Call setDatasetFilter with the selected dataset
  };

  return (
    <div className="md:w-96 md:h-76 z-10 md:left-2 left-0 md:top-2 top-0 p-4 md:mb-0 mb-1 flex-col bg-slate-50 rounded-xl md:absolute border-4 border-slate-400 blur-none">
      {/* <div className="mb-1 flex justify-between font-bold text-md">
        Select Data File
        <span className="text-sm text-gray-500 font-light">csv, xlsx</span>
      </div>
      <UploadWrapper setUploadedData={setUploadedData} /> */}
      
      {/* Commented out the loading and error handling for upload since there is no upload for expo*/}
      {/* {loading && !error && (
        <>
          <div className="flex justify-center items-center italics text-primary text-[11pt]">
            <span className="loading loading-spinner loading-md text-primary mr-2"></span>
            Creating Visualization...
          </div>
        </>
      )}
      {error && (
        <div className="font-bold text-red-800">
          Error: There was an error uploading your file
        </div>
      )} */}
      <div className="mb-1 font-bold text-md">Travel mode:</div>
      <select
        className="select select-bordered select-sm w-full"
        value={selected}
        onChange={(e) => handleModeSelection(e.target.value)}
      >
        <option value="all">Show All</option>
        {availableModes.map((mode) => (
          <option key={mode} value={mode}>
            {mode === 'DRIVE'
              ? 'Car'
              : mode === 'TRAIN'
              ? 'Train'
              : mode === 'SUBWAY'
              ? 'Subway'
              : mode === 'LIGHT_RAIL'
              ? 'Light Rail'
              : mode === 'BUS'
              ? 'Bus'
              : mode === 'WALK'
              ? 'Walk'
              : mode === 'BICYCLE'
              ? 'Bicycle'
              : mode}
          </option>
        ))}
      </select>
      <div className="mt-3 mb-1 font-bold text-md">Map mode:</div>
      <select
        className="select select-bordered select-sm w-full"
        value={selectedMapMode}
        onChange={(e) => handleMapModeSelection(e.target.value)}
      >
        <option value="polylines">View Routes</option>
        <option value="density">View Density Map</option>
      </select>
      <div className="mt-2 mb-1 font-bold text-md">Choose a dataset:</div>
      <div className="flex justify-between">
        <button
          className={`btn ${
            selectedDataset === 'Student' ? 'bg-blue-500' : 'bg-gray-200'
          } hover:bg-blue-600`}
          onClick={() => handleDatasetSelection('Student')}
        >
          Student
        </button>
        <button
          className={`btn ${
            selectedDataset === 'Employee' ? 'bg-blue-500' : 'bg-gray-200'
          } hover:bg-blue-600`}
          onClick={() => handleDatasetSelection('Employee')}
        >
          Employee
        </button>
        <button
          className={`btn ${
            selectedDataset === 'Both' ? 'bg-blue-500' : 'bg-gray-200'
          } hover:bg-blue-600`}
          onClick={() => handleDatasetSelection('Both')}
        >
          Both
        </button>
      </div>
    </div>
  );
};

export default ScopeMenu;
