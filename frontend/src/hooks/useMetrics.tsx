import { useState, useEffect } from 'react';
import { extractUniqueZipCodesAndModes } from '../utility/helper';

function useMetrics(url: string, uploadedData: any) {
  const [metrics, setMetrics] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // check if object is empty first
    if (uploadedData.data.length === 0) return;

    setLoading(true);
    let table = (uploadedData as { data: any[]; errors: any[]; meta: any[] }).data;

    const zipCodesAndModes: any = extractUniqueZipCodesAndModes(table);

    const zipCodesAndTable: object = {
      zipCodesAndModes: zipCodesAndModes,
      table: table
    };

    const getMetrics = async (requestBody: object) => {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const res = await response.json();
      let finalMetrics = res.data;

      // add commutesPerWeek key to each element based on zipcode data on frontend
      setMetrics(finalMetrics);
    };

    // function call to server
    getMetrics(zipCodesAndTable)
      .then(() => setLoading(false))
      .catch((err) => setError(err));
  }, [uploadedData]);

  return { loading, error, metrics };
}

export default useMetrics;
