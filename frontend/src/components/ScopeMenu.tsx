import { useState } from 'react';
import UploadWrapper from './UploadWrapper';

const ScopeMenu = ({
  setUploadedData,
  loading,
  error = null,
  setModeFilter
}: {
  setUploadedData: Function;
  loading: boolean;
  error: any;
  setModeFilter: Function;
}) => {
  const [selected, setSelected] = useState('all');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  const handleModeSelection = (mode: string) => {
    setSelected(mode);
    setModeFilter(mode);
  };

  const transportationModes = [
    'all',
    'DRIVE',
    'TRAIN',
    'SUBWAY',
    'LIGHT_RAIL',
    'BUS',
    'WALK',
    'BICYCLE'
  ];

  return (
    <div className="w-80 h-76 left-2 top-2 p-4 flex-col bg-slate-50 rounded-xl absolute">
      <div className="mb-4 font-bold">Select Excel File</div>
      <UploadWrapper setUploadedData={setUploadedData} />
      {loading && !error && (
        <div className="italics text-purple-500">Creating Visualization...</div>
      )}
      {error && (
        <div className="font-bold text-red-800">
          Error: There was an error uploading your file
        </div>
      )}
      <div>
        <div className="font-bold mb-4">
          Driving time range is {min} to {max} minutes.
        </div>
        <div className="ml-4 mb-4">
          <div className="font-bold">Choose a minimum duration</div>
          <input
            type="range"
            value={min}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMin(e.target.value)}
          />
        </div>
        <div className="ml-4 mb-4">
          <div className="font-bold">Choose a maximum duration</div>
          <input
            type="range"
            value={max}
            min={min}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMax(e.target.value)}
          />
        </div>
      </div>
      <div className="font-bold mb-2">Choose a travel mode:</div>
      <select
        className="p-2 mb-4"
        value={selected}
        onChange={(e) => handleModeSelection(e.target.value)}
      >
        {transportationModes.map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ScopeMenu;
