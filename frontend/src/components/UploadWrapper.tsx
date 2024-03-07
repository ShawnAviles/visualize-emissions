import { useCSVReader } from 'react-papaparse';

function UploadWrapper({ setUploadedData }: { setUploadedData: Function }) {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        setUploadedData(results);
      }}
    >
      {({ getRootProps, acceptedFile, getRemoveFileProps }: any) => (
        <>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
              <button 
                type="button" 
                className="btn btn-info btn-sm btn-outline"
                {...getRootProps()}
              >
                Upload
              </button>
              <div className="block p-2 w-full text-sm text-gray-900">
                {(acceptedFile && acceptedFile.name) || 'No file selected'}
              </div>
              <button
                className="p-2 text-red-900 font-lg rounded-md hover:bg-red-300 hover:text-red-900 cursor-pointer"
                {...getRemoveFileProps()}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          {/* <ProgressBar className="bg-green-500" /> */}
        </>
      )}
    </CSVReader>
  );
}

export default UploadWrapper;
