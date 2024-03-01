import { useState, useEffect } from 'react';
import { extractUniqueZipCodesAndModes } from '../utility/helper';

interface LiveRoutesObject {
  [zipCodes: string]: any;
}

function useGeoJson(url: string) {
  const [uploadedData, setUploadedData] = useState({ data: [], errors: [], meta: [] });
  const [liveRoutesObject, setLiveRoutesObject] = useState({} as LiveRoutesObject);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // check if object is empty first
    if (uploadedData.data.length === 0) return;

    setLoading(true);
    let table = (uploadedData as { data: any[]; errors: any[]; meta: any[] }).data;

    const zipCodesAndModes: any = extractUniqueZipCodesAndModes(table);

    const getRoutes = async (zipCodes: any) => {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(zipCodes),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const res = await response.json();
      setLiveRoutesObject(res.data);
    };

    // function call to server
    getRoutes(zipCodesAndModes)
      .then(() => setLoading(false))
      .catch((err) => setError(err));
  }, [uploadedData]);

  return { loading, error, liveRoutesObject, setUploadedData };
}

export default useGeoJson;
