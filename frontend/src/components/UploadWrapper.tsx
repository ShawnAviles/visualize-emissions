import { useCSVReader } from 'react-papaparse';

function UploadWrapper({ setUploadedData }: { setUploadedData: Function }) {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        setUploadedData(results);
      }}
    >
      {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }: any) => (
        <>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
              <button
                type="button"
                className="block font-sm p-2 bg-blue-400 text-white rounded-bl-md rounded-tl-md border-y-2 border-l-2"
                {...getRootProps()}
              >
                Upload
              </button>
              <div className="block p-2 w-full text-sm text-gray-900 bg-gray-100 border-y-2">
                {(acceptedFile && acceptedFile.name) || 'No file selected'}
              </div>
              <button
                className="p-2 text-red-900 font-lg bg-gray-100 rounded-br-md rounded-tr-md hover:bg-red-300 hover:text-red-900 cursor-pointer border-y-2 border-r-2"
                {...getRemoveFileProps()}
              >
                x
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500" id="file_input_help">
            CSV, XLSX
          </p>
          <ProgressBar className="bg-green-500" />
        </>
      )}
    </CSVReader>
  );
}

export default UploadWrapper;
