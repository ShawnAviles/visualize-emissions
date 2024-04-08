import { useState, useEffect } from 'react';
// import { extractUniqueZipCodesAndModes } from '../utility/helper';
// import data from '../utility/sampleData/api/metrics/sample_students_74/output.json';

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
      let response: { json: () => any; } = { json: () => {} }; // Initialize response with a default value
      if (filter === 'Students') {
        response = await fetch('./src/utility/sampleData/api/metrics/sample_students_74/output.json');
      } else if (filter === "Employees") {
        response = await fetch('./src/utility/sampleData/api/metrics/sample_employee_258/output.json');
      } else if (filter === "Total") {
        const responseStudent = await fetch('./src/utility/sampleData/api/metrics/sample_students_74/output.json');
        const responseEmployee = await fetch('./src/utility/sampleData/api/metrics/sample_employee_258/output.json');
        const studentData = await responseStudent.json();
        const employeeData = await responseEmployee.json();
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
          combinedData[i].value += Math.round(studentData.data[0][i].value / 12 * 100) / 100;
          combinedData[i].value += Math.round(employeeData.data[0][i].value / 12 * 100) / 100;
        }
        setMetrics(combinedData);
        return;
      }
      
      const res = await response.json();
      let finalMetrics = res.data;
      for (let i = 0; i < finalMetrics[0].length; i++) {
        finalMetrics[0][i].value = Math.round((finalMetrics[0][i].value / 12) * 100) / 100;
      }
      setMetrics(finalMetrics[0]);
    };

    // function call to server
    getMetrics(filter)
      .then(() => setLoading(false))
      .catch((err) => setError(err));
  }, [filter]);

  return { loading, error, metrics };
}

export default useMetrics;
