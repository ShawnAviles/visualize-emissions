import { useState } from 'react';
import UploadWrapper from './UploadWrapper';

const ScopeMenu = ({
  setUploadedData,
  loading,
  error = null,
  setModeFilter,
  availableModes
}: {
  setUploadedData: Function;
  loading: boolean;
  error: any;
  setModeFilter: Function;
  availableModes: string[];
}) => {
  const [selected, setSelected] = useState('all');

  const handleModeSelection = (mode: string) => {
    setSelected(mode);
    setModeFilter(mode);
  };

  return (
    <div className="w-96 h-76 z-10 left-2 top-2 p-4 flex-col bg-slate-50 rounded-xl absolute border-4 border-slate-400 blur-none">
      <div className="mb-1 flex justify-between font-bold text-md">
        Select Data File
        <span className="text-sm text-gray-500 font-light">csv, xlsx</span>
      </div>
      <UploadWrapper setUploadedData={setUploadedData} />
      {loading && !error && (
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
      )}
      <div className="mt-2 mb-1 font-bold text-md">Choose a travel mode:</div>
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
    </div>
  );
};

export default ScopeMenu;
