import { useState, useEffect } from 'react';
// import { extractUniqueZipCodesAndModes } from '../utility/helper';
import student from '../utility/sampleData/api/metrics/sample_students_74/output.json';
import employee from '../utility/sampleData/api/metrics/sample_employee_258/output.json';

function useMetrics(filter: any) {
  const [metrics, setMetrics] = useState<{ name: string; value: number }[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // check if object is empty first
    // if (uploadedData.data.length === 0) return;
    // let test = data;
    setLoading(true);
    // let table = (uploadedData as { data: any[]; errors: any[]; meta: any[] }).data;

    // const zipCodesAndModes: any = extractUniqueZipCodesAndModes(table);

    // const zipCodesAndTable: object = {
    //   zipCodesAndModes: zipCodesAndModes,
    //   table: table
    // };

    const getMetrics = async (filter: string) => {
      if (filter === 'none') return;
      let response : {name : string; value : number }[] = []  ; // Initialize response with a default value
      if (filter === 'Student') {
        response = student.data[0].map((item: { name: string; value: number | null }) => ({
          name: item.name,
          value: item.value ?? 0,
        }));
      } else if (filter === "Employee") {
        response = employee.data[0].map((item: { name: string; value: number | null }) => ({
          name: item.name,
          value: item.value ?? 0,
        }));
      } else if (filter === "Both") {
        let combinedData = [
					{
							"name": "Cars",
							"value": 0
					},
					{
							"name": "Bus",
							"value": 0
					},
					{
							"name": "Trains",
							"value": 0
					},
					{
							"name": "Light Rail",
							"value": 0
					},
					{
							"name": "Subway",
							"value": 0
					}
			];
        for (let i = 0; i < combinedData.length; i++) {
          if (student.data[0][i].value != null)  {
            combinedData[i].value += Math.round(student.data[0][i].value / 12 * 100) / 100;
          }
          if (employee.data[0][i].value != null) {
            combinedData[i].value += Math.round((employee.data[0][i].value ?? 0) / 12 * 100) / 100;
          }
        }
        console.log(combinedData);
        setMetrics(combinedData);
        return;
      }
      let finalMetrics = response;
      for (let i = 0; i < finalMetrics.length; i++) {
        finalMetrics[i].value = Math.round((finalMetrics[i].value / 12) * 100) / 100;
      }
      console.log(finalMetrics);
      setMetrics(finalMetrics);
    };

    // function call to server
    getMetrics(filter)
      .then(() => setLoading(false))
      .catch((err) => setError(err));
  }, [filter]);

  return { loading, error, metrics };
}

export default useMetrics;
