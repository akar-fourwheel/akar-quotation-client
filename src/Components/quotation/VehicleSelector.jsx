import React from "react";

const VehicleSelector = ({
  getYear, dataBasedOnYear,
  currModelList, dataBasedOnYearAndModel,
  getFuel, dataBasedOnYearModelAndFuel,
  getVariant, setVariant, handleNewAllot
}) => (
  <>
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
      <div>
            <label className="block text-lg">Model:</label>
            <div className="flex gap-2">
              <select
                name="selectedModel"
                onChange={dataBasedOnYearAndModel}
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Choose model</option>
                {currModelList.map((m) => (
                  <option value={m} key={m}>
                    {m}
                  </option>
                ))}
              </select>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  onChange={handleNewAllot}
                />
                <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">Add New Car</span>
              </label>
            </div>

          </div>
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
  </>
);

export default VehicleSelector;