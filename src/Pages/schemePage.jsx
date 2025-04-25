import React, { useEffect, useState } from 'react';
import axios from 'axios';

const schemePage = (req,res) => {
const [getYear, setGetYear] = useState([]);
const [year, setYear] = useState('');
const [getModel, setGetModel] = useState([]);
const [model, setModel] = useState('');
const [getFuel, setGetFuel] = useState([]);
const [fuel, setFuel] = useState('');
const [getVariant, setGetVariant] = useState([]);
const [variant, setVariant] = useState('');
const [finalData,setFinalData] = useState([])

// Handle form submit
const handleSubmit = (e) => {
  e.preventDefault();
  axios.get(`/scheme-data`, {
    params: {
      year: year,
      model: model,
      fuel: fuel,
      variant: variant
    },
  })
  .then((response) => {
    const data = response.data.flat();
    setFinalData(data);
    
  });
};

const dataBasedOnYear = (e) => {
  const selectedYear = e.target.value;
  setYear(selectedYear);
  setModel('');
  setGetModel([]);
  setFuel('');
  setGetFuel([]);
  setVariant('');
  setGetVariant([]);
  // Fetch models based on selected year
  axios
    .get(`/scheme-data`, {
      params: { year: selectedYear },
    })
    .then((response) => {
      const data = response.data.flat();
      setGetModel(data); // Clear fuel options when the year is changed
    });
};

// Fetch fuel based on year and model
const dataBasedOnYearAndModel = (e) => {
  const selectedModel = e.target.value;
  setModel(selectedModel);
  setFuel('');
  setGetFuel([]);
  setVariant('');
  setGetVariant([]);
  axios
    .get(`/scheme-data`, {
      params: {
        year: year,
        model: selectedModel,
      },
    })
    .then((response) => {      
      if(response.data=="data not found") return;
      const data = response.data.flat();
      setGetFuel(data); // Assuming fuel types are returned based on year and model
    });
};

// Fetch variant based on year, model and fuel
const dataBasedOnYearModelAndFuel = (e) => {
  const selectedFuel = e.target.value;
  setFuel(selectedFuel);
  setVariant('');
  setGetVariant([]);

  axios
    .get(`/scheme-data`, {
      params: {
        year: year,
        model: model,
        fuel: selectedFuel
      },
    })
    .then((response) => {      
      if(response.data === "data not found") return;
      const data = response.data.flat();
      setGetVariant(data); // Correctly updating variants
    });
};

// Fetch data when the year or model or fuel is selected

useEffect(() => {
  // Fetch years initially
  axios
    .get(`/scheme`)
    .then((response) => {
      const fetchedYears = response.data.flat();
      setGetYear(fetchedYears);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}, []);

    return (
      <div className="m-auto w-full max-w-4xl p-4">
    <h2 className="text-2xl font-semibold text-center mb-6 uppercase">Available Schemes on cars</h2>
    
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-lg">Year:</label>
        <select
          name="selectedYear"
          onChange={dataBasedOnYear}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Choose year</option>
          {getYear.map((yr) => (
            <option value={yr} key={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>
  
      <div className="space-y-2">
        <label className="block text-lg">Model:</label>
        <select
          name="selectedModel"
          onChange={dataBasedOnYearAndModel}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Choose model</option>
          {getModel.map((m) => (
            <option value={m} key={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
  
      <div className="space-y-2">
        <label className="block text-lg">Fuel:</label>
          <select
            name="selectedFuel"
            onChange={dataBasedOnYearModelAndFuel}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
          <option value="">Choose fuel type</option>
          {getFuel.map((f) => (
            <option value={f} key={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
  
      <div className="space-y-2">
        <label className="block text-lg">Variant:</label>
        <select
          name="selectedVariant"
          onChange={(e) => setVariant(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          //disabled={!getFuel.length} // Disable fuel select until data is available
        >
          <option value="">Choose Variant</option>
          {getVariant.map((f) => (
            <option value={f} key={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
  
      <button
        type="submit"
        className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  
    <div className="overflow-x-auto mt-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>ESP :</div>
            <div className="w-full p-2 border border-gray-300 rounded-lg">{finalData[0] ? "Rs. " + finalData[0] : "Rs. 00"}</div>
            <div>CONSUMER :</div>
            <div className="w-full p-2 border border-gray-300 rounded-lg">{finalData[1] ? "Rs. " + finalData[1] : "Rs. 00"}</div>
            <div>EXCHANGE :</div>
            <div className="w-full p-2 border border-gray-300 rounded-lg">{finalData[2] ? "Rs. " + finalData[2] : "Rs. 00"}</div>
            <div>ADDITIONAL EXCHANGE :</div>
            <div className="w-full p-2 border border-gray-300 rounded-lg">{finalData[3] ? "Rs. " + finalData[3] : "Rs. 00"}</div>
            <div>LOYALTY PV to EV:</div>
            <div className="w-full p-2 border border-gray-300 rounded-lg">{finalData[4] ? "Rs. " + finalData[4] : "Rs. 00"}</div>
            <div>LOYALTY EV to EV:</div>
            <div className="w-full p-2 border border-gray-300 rounded-lg">{finalData[5] ? "Rs. " + finalData[5] : "Rs. 00"}</div>
            <div>INTERVENTION :</div>
            <div className="w-full p-2 border border-gray-300 rounded-lg">{finalData[6] ? "Rs. " + finalData[6] : "Rs. 00"}</div>
            <div>CORPORATE TOP 10 :</div>
            <div className="w-full p-2 border border-gray-300 rounded-lg">{finalData[7] ? "Rs. " + finalData[7] : "Rs. 00"}</div>
            <div>CORPORATE TOP 20 :</div>
            <div className="w-full p-2 border border-gray-300 rounded-lg">{finalData[8] ? "Rs. " + finalData[8] : "Rs. 00"}</div>
            <div>MSME :</div>
            <div className="w-full p-2 border border-gray-300 rounded-lg">{finalData[9] ? "Rs. " + finalData[9] : "Rs. 00"}</div>
            <div>SOLAR :</div>
            <div className="w-full p-2 border border-gray-300 rounded-lg">{finalData[10] ? "Rs. " + finalData[10] : "Rs. 00"}</div>
            <div>GRID :</div>
            <div className="w-full p-2 border border-gray-300 rounded-lg">{finalData[11] ? "Rs. " + finalData[11] : "Rs. 00"}</div>
          </div>
    </div>
  </div>
    );
}

export default schemePage;