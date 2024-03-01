import { useState } from 'react';
import UploadWrapper from './UploadWrapper';

const ScopeMenu = ({
  setUploadedData,
  loading,
  error = null
}: {
  setUploadedData: Function;
  loading: boolean;
  error: any;
}) => {
  const [selected, setSelected] = useState(true);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
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
      <div className="flex items-center">
        <div
          className={
            selected
              ? 'px-4 py-[2px] bg-gray-500 rounded-full text-slate-50 mr-5 hover:cursor-pointer text-sm'
              : 'px-2 mr-5 text-gray-500 hover:cursor-pointer text-sm'
          }
          onClick={() => setSelected(!selected)}
        >
          Driving
        </div>
        <div
          className={
            !selected
              ? 'px-4 py-[2px] bg-gray-500 rounded-full text-slate-50 hover:cursor-pointer text-sm'
              : ' px-2 text-gray-500 hover:cursor-pointer text-sm'
          }
          onClick={() => setSelected(!selected)}
        >
          Driving Traffic
        </div>
      </div>
    </div>
  );
};

export default ScopeMenu;
