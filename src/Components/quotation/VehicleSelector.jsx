import React from "react";

const VehicleSelector = ({
  getYear, year, setYear, dataBasedOnYear,
  getModel, model, setModel, dataBasedOnYearAndModel,
  getFuel, fuel, setFuel, dataBasedOnYearModelAndFuel,
  getVariant, variant, setVariant
}) => (
  <>
    <div className="space-y-2">
      <label className="block text-lg">Year:</label>
      <select
        name="selectedYear"
        value={year}
        onChange={dataBasedOnYear}
        className="w-full p-2 border border-gray-300 rounded-lg"
      >
        <option value="">Choose year</option>
        {getYear.map((yr) => (
          <option value={yr} key={yr}>{yr}</option>
        ))}
      </select>
    </div>
    <div className="space-y-2">
      <label className="block text-lg">Model:</label>
      <select
        name="selectedModel"
        value={model}
        onChange={dataBasedOnYearAndModel}
        className="w-full p-2 border border-gray-300 rounded-lg"
      >
        <option value="">Choose model</option>
        {getModel.map((m) => (
          <option value={m} key={m}>{m}</option>
        ))}
      </select>
    </div>
    <div className="space-y-2">
      <label className="block text-lg">Fuel:</label>
      <select
        name="selectedFuel"
        value={fuel}
        onChange={dataBasedOnYearModelAndFuel}
        className="w-full p-2 border border-gray-300 rounded-lg"
      >
        <option value="">Choose fuel type</option>
        {getFuel.map((f) => (
          <option value={f} key={f}>{f}</option>
        ))}
      </select>
    </div>
    <div className="space-y-2">
      <label className="block text-lg">Variant:</label>
      <select
        name="selectedVariant"
        value={variant}
        onChange={(e) => setVariant(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg"
      >
        <option value="">Choose Variant</option>
        {getVariant.map((f) => (
          <option value={f} key={f}>{f}</option>
        ))}
      </select>
    </div>
  </>
);

export default VehicleSelector;