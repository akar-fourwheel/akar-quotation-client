import React, {useEffect, useState,Fragment,useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router";
import Select from "react-select";
import { buildQuotationData } from '../Components/quotation/BuildQuotationData';
import CustomerDetailsForm from '../Components/quotation/CustomerDetailsForm';
import VehicleSelector from '../Components/quotation/VehicleSelector';
import { discounts, corpOfferOptions, rtoOptions, ewOptions, vasOptions, hpnOptions } from '../Components/quotation/staticQuotOptions';
import { showSuccess, showError, showInfo } from '../utils/toast';
import Loader from '../Components/Loader/Loader'

const QuotationPage = ()=>{
  const [getYear, setGetYear] = useState([]);
  const [year, setYear] = useState('');
  const [getModel, setGetModel] = useState([]);
  const [currModelList, setCurrModelList] = useState([]);
  const [model, setModel] = useState('');
  const [getFuel, setGetFuel] = useState([]);
  const [fuel, setFuel] = useState('');
  const [getVariant, setGetVariant] = useState([]);
  const [variant, setVariant] = useState('');
  const [finalData, setFinalData] = useState({});
  const [selectedInsurance, setSelectedInsurance] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [addExc, setAddExc] = useState(0);
  const [loyalty, setLoyalty] = useState(0);
  const [corpOffer, setCorpOffer] = useState("");
  const [addDisc, setAddDisc] = useState(0);
  const [sss, setSss] = useState(0);
  const [rto, setRto] = useState({ value: 'RTO', label: 'Normal RTO' });
  const [totalDisc, setTotalDisc] = useState(0);
  const [ew, setEw] = useState();
  const [accessories, setAccessories] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState([]);
  const [color, setColor] = useState([]);
  const [selectedColor, setSelectedColor] = useState();
  const [selectedVas, setSelectedVas] = useState();
  const [selectedHpn, setSelectedHpn] = useState({ label: "Not for Loan Use", value: "N/A" });
  const [totalAddOns, setTotalAddOns] = useState(0);
  const [accTotal, setAccTotal] = useState(0);
  const [loyaltyType, setLoyaltyType] = useState();
  const [scrap, setScrap] = useState();
  const [name,setName] = useState('');
  const [phoneNo,setPhoneNo] = useState('');
  const [email,setEmail] = useState('');
  const [address,setAddress] = useState('');
  const [selectedSalesPerson, setSelectedSalesPerson] = useState(localStorage.getItem("username"));
  const [pdfUrl, setPdfUrl] = useState('');
  const [cod, setCod] = useState(0);
  const [hpn, setHpn] = useState("");
  const [whatsAppUrl, setWhatsAppUrl] = useState('');
  const [ins, setIns] = useState(0);
  const [insType, setInsType] = useState("Dealer")
  const [showWarning, setShowWarning] = useState(false);
  const [maxAddDisc, setMaxAddDisc] = useState(0);
  const [inhouse, setInhouse] = useState(true);
  const [gender,setGender] = useState('');
  const [newCx,setNewCx] = useState(false);
  const [newAllot,setNewAllot] = useState(false);
  const [cxId,setCxId] = useState();
  const [cxAllot,setcxAllot] = useState();
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [mdmrDisc, setMdmrDisc] = useState(0);
  const isManagerRole = ['admin', 'audit'].includes(localStorage.getItem('role'));
  const [errors, setErrors] = useState({
    name: false,
    address: false,
    phoneNo: false,
    email: false,
    selectedSalesPerson: false,
  });
  const [loading, setLoading] = useState(false);
  const  navigate = useNavigate();

  const filteredCustomers = customerList.filter(customer => {
  if (!customerSearchQuery) return true;
  
  const query = customerSearchQuery.toLowerCase();
  const name = (customer[1] || '').toLowerCase();
  const phone = (customer[2] || '').toLowerCase();
  const email = (customer[4] || '').toLowerCase();
  const model = (customer[6] || '').toLowerCase();
  
  return name.includes(query) || 
         phone.includes(query) || 
         email.includes(query) || 
         model.includes(query);
});

const handleCustomerSelect = (customer) => {
  setSelectedCustomer(customer);
  setNewAllot(false); // Reset new allotment state when a customer is selected
  
  // Reset all form fields
  setYear('');
  setModel('');
  setFuel('');
  setVariant('');
  setCurrModelList([]);
  setGetFuel([]);
  setGetVariant([]);
  setFinalData({});
  
  // Reset discounts and other dependent fields
  restState(0, '', 0);
  
  // Fill form data (excluding car model which is at index 6)
  setCxId(customer[0]); // customer ID
  setName(customer[1] || ''); // customer name
  setPhoneNo(customer[2] || ''); // phone number
  setGender(customer[3] || ''); // gender
  setEmail(customer[4] || ''); // email
  setAddress(customer[5] || ''); // address
  setcxAllot(customer[7] || ''); // allotment ID, assuming it's at index 7
  // Index 6 is car model which we don't set in the form

  // Re-fetch the years to ensure dropdown is populated
  axios.get(`/quotation`)
    .then((response) => {
      const fetchedYears = response.data.flat();
      setGetYear(fetchedYears);
    })
    .catch((error) => {
      console.error('Error fetching years:', error);
    });
};
  
  let tcs, totalESP;

  const restState = (insAmount, year, maxDisc) => {
    setSelectedInsurance([]);
    setSelectedDiscounts([]);
    setAddExc(0);
    setLoyalty(0);
    setCorpOffer("");
    setAddDisc(0);
    setSss(0);
    setRto({ value: 'RTO', label: 'Normal RTO' });
    setTotalDisc(0);
    setEw();
    setSelectedAcc([]);
    setSelectedColor();
    setSelectedVas();
    setSelectedHpn({ label: "Not for Loan Use", value: "N/A" });
    setHpn("");
    setTotalAddOns(0);
    setAccTotal(0);
    setLoyaltyType();
    setScrap();
    setCod(0);
    setShowWarning(false);
    setIns(insAmount);
    setInsType("Dealer");
    if (year == 2025) {
      setMaxAddDisc(maxDisc);
    }
  }


  // Fetch customer list
  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/customer-info', {
        params: {
          role: localStorage.role,
          name: localStorage.userId
        }
      });
      setCustomerList(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // Handle form submit
  const handleSubmit = async(e) => {
    e.preventDefault();
    let customerId=null;
    
    if (newCx === true) {

      const cxData = {
        name: name.toUpperCase(),
        gender,
        mobile: phoneNo,
        email: email || null,
        address: address
      }

      try {
        const response = await axios.post(`/create-cx`, cxData)
        customerId= response.data.insertedId;
        setCxId(customerId);

      } catch (e) {
        console.log(e);
        showError("Failed to create new customer. Please try again.");
      }
    }

    if (customerId || newAllot) {
      if(customerId) createNewAllotment(customerId);
      else createNewAllotment(cxId);
    }

    axios.get(`/quotation-data`, {
      params: {
        year: year,
        model: model,
        fuel: fuel,
        variant: variant
      },
    })
      .then((response) => {
        const data = response.data[0]
        const data1 = response.data[1]
        const data2 = response.data[2]
        setColor(data2);
        setAccessories(data1)
        setFinalData(data);
        restState(data.Insurance, data.YEAR, data.AddDiscLim);
        showSuccess("Quotation data fetched!");
      })
      .catch((error) => {
        console.error('Error fetching quotation data:', error);
        showError("Failed to load vehicle data. Please check your selection.");
      });
  };

  const createNewAllotment = async(cxIxd) => {
      const cxAll = {
        cx_id: cxIxd,
        lead_type: 'outside',
        exe_name: 'self',
        ca_name : localStorage.userId,
        model,
      }
        try {
          const response = await axios.post(`/create-allot`, cxAll)
          setcxAllot(response.data.insertedId);
        } catch (e) {
          console.log(e);
        }
  }

const dataBasedOnYear = (e) => {
  const selectedYear = e.target.value;
  setYear(selectedYear);
  
  setCurrModelList([]);
  setModel('');
  setFuel('')
  setGetFuel([]); // Clear fuel options when the year is changed
  setVariant('');
  setGetVariant([]);

  // Fetch models based on selected year
  axios
    .get(`/quotation-data`, {
      params: { year: selectedYear },
    })
    .then((response) => {
      const data = response.data.flat();
      setGetModel(data); // Assuming models are returned based on year
      // If it's a new customer OR adding new car (newAllot is true), show all models
      if (newCx || newAllot) {
        setCurrModelList(data);
      } else {
        // For existing customers, filter to show only their specific model
        setCurrModelList(data?.filter((model) => model == selectedCustomer[6]));
      }
    });
};

  // Fetch fuel based on year and model
  const dataBasedOnYearAndModel = (e) => {
    const selectedModel = e.target.value;
    setModel(selectedModel);
    setFuel('')
    setGetFuel([]); // Clear fuel options when the year is changed
    setVariant('');
    setGetVariant([]);

    axios
      .get(`/quotation-data`, {
        params: {
          year: year,
          model: selectedModel,
        },
      })
      .then((response) => {
        if (response.data == "data not found") return;
        const data = response.data.flat();
        setGetFuel(data); // Assuming fuel types are returned based on year and model
      });
  };

  // Fetch variant based on year, model and fuel
  const dataBasedOnYearModelAndFuel = (e) => {
    const selectedFuel = e.target.value;
    setFuel(selectedFuel);


    axios
      .get(`/quotation-data`, {
        params: {
          year: year,
          model: model,
          fuel: selectedFuel
        },
      })
      .then((response) => {
        if (response.data === "data not found") return;
        const data = response.data.flat();
        setGetVariant(data); // Correctly updating variants
      });
  };

  const discountOptions = useMemo(() => {
    if (!finalData || Object.keys(finalData).length === 0) return [];

    const opts = discounts
      .filter((d) => Number(finalData[d.value] ?? 0) > 0)
      .map((d) => ({ value: d.value, label: d.label || d.value.replace(/_/g, ' ') }));

    if (finalData.MSME || finalData.SOLER) opts.push({ value: 'CORPORATE OFFER', label: 'Corporate Offer' });
    if ((finalData.EXCHANGE ?? 0) + (finalData.ADDITIONAL_EXCHANGE ?? 0) > 0)
      opts.push({ value: 'EXCHANGE', label: 'Exchange' });
    if ((finalData.ICE_to_EV ?? 0) + (finalData.EV_to_EV ?? 0) > 0)
      opts.push({ value: 'LOYALTY', label: 'Loyalty' });
    if (isManagerRole) opts.push({ value: 'MDMR', label: 'MD/MR' });

    return opts;
  }, [finalData, isManagerRole]);  

  // Fetch data when the year or model or fuel is selected

  useEffect(() => {
    // Fetch years initially
    axios
      .get(`/quotation`)
      .then((response) => {
        const fetchedYears = response.data.flat();
        setGetYear(fetchedYears);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const newTotal = selectedDiscounts.reduce((accumulator, item) => {
      if (item.value === "CORPORATE OFFER") return accumulator;
      return accumulator + (finalData[item.value] || 0);
    }, 0) + addExc + loyalty + (finalData[corpOffer] || 0) + Number(addDisc) + Number(sss) + Number(mdmrDisc);

    setTotalDisc(newTotal);
  }, [selectedDiscounts, addExc, loyalty, corpOffer, addDisc, sss, mdmrDisc]);

  useEffect(() => {
    const newInsuranceTotal = selectedInsurance.reduce((accumulator, item) => {
      return accumulator + (finalData[item.value] || 0);
    }, 0);

    setTotalAddOns(newInsuranceTotal);
  }, [selectedInsurance]);

  useEffect(() => {
    const newAccTotal = selectedAcc.reduce((accumulator, item) => {
      return accumulator + (item.value || 0);
    }, 0);

  setAccTotal(newAccTotal);
}, [selectedAcc]);

  // Fetch customers when component mounts and when toggle changes
  useEffect(() => {
    if (!newCx) {
      fetchCustomers();
    }
  }, [newCx]);

  const handleInsurance = (selected) => {
    setSelectedInsurance(selected);
  };

  const handleDiscount = (selected) => {
    setSelectedDiscounts(selected);

    if (!selected.some((opt) => opt.value === 'MDMR')) {
      setMdmrDisc(0);
    }
    
    if (!selected.some((opt) => opt.value === "EXCHANGE")) { setLoyalty(0); setAddExc(0); }
    if (!selected.some((opt) => opt.value === "CORPORATE OFFER")) { setCorpOffer(""); }
  };

  const handleAddExch = (selected) => {
    if (selected.value) { setAddExc(finalData["ADDITIONAL_EXCHANGE"]) }
    else setAddExc(0);
  }

  const handleLoyalty = (selected) => {
    finalData[selected.value] ? setLoyalty(finalData[selected.value]) : setLoyalty(0);
    setLoyaltyType(selected.value);
  }

  const handleCorpOffer = (selected) => {
    if (finalData[selected.value]) {
      setCorpOffer(selected.value);
      if (2025 == finalData.YEAR && fuel == 'Electric') {
        setAddDisc(0);
        setShowWarning(false);
      }
    }
    else setCorpOffer("")
  }

  const handleAddDisc = (e) => {
    const val = e.target.value.replace(/^0+(?!$)/, '');

    if (isNaN(val) || val == 0) {
      setAddDisc(0);
      setShowWarning(false);
      return;
    }

    if (!(localStorage.role === "md" || localStorage.role === "admin") && finalData.YEAR == 2025) {
      let max = finalData.AddDiscLim;

      const pplUpper = finalData.PPL?.toUpperCase();
      if (pplUpper == "SAFARI" || pplUpper == "HARRIER") {
        max -= cod;
      }

      if (finalData.Fuel == "Electric") {
        max -= finalData[corpOffer] || 0;
      }

      if (val <= max) {
        setAddDisc(val);
        setShowWarning(false);
      } else {
        setShowWarning(true);
      }

      setMaxAddDisc(max);

    } else {
      setAddDisc(val);
      setShowWarning(false);
    }
  };

  useEffect(() => {
    const maxAmount = finalData.AddDiscLim;
    if (!(localStorage.role === "md" || localStorage.role === "admin")) {
      if (finalData.YEAR == 2025 && finalData.Fuel == "Electric" && addDisc > maxAmount) {
        setAddDisc(maxAmount);
      }
    }
  }, [addDisc, rto]);

  const handleSss = (e) => {
    const trimmed = e.target.value.replace(/^0+(?!$)/, '');
    setSss(trimmed);
  }

  const handleRto = (selected) => {
    setRto(selected)
    setShowWarning(false)

    if (finalData.YEAR == 2025) {
      setMaxAddDisc(finalData.AddDiscLim);
    }

    if ("Scrap RTO" == selected.value) {
      scrap ? setCod(finalData.COD) : setCod(0)
      const pplUpper = finalData.PPL?.toUpperCase();
      if (2025 == finalData.YEAR && (pplUpper == "SAFARI" || pplUpper == "HARRIER")) {
        setAddDisc(0);
        setShowWarning(false);
      }
    }
    else { setCod(0) }
  }

  const validateForm = () => {
    let isValid = true;
    let validationErrors = {
      name: false,
      address: false,
      phoneNo: false,
      email: false,
      selectedSalesPerson: false,
      addDisc: false
    };

    if (!name.trim() || !/^[A-Za-z\s]+$/.test(name)) {
      validationErrors.name = true;
      isValid = false;
    }
    if (!address.trim()) {
      validationErrors.address = true;
      isValid = false;
    }
    if (!phoneNo.trim() || !/^[6789]\d{9}$/.test(phoneNo)) {
      validationErrors.phoneNo = true;
      isValid = false;
    }
    if (email && email.trim() && !/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = true;
      isValid = false;
    }
    if (!selectedSalesPerson) {
      validationErrors.selectedSalesPerson = true;
      isValid = false;
    }

    // if (maxAddDisc && (addDisc > maxAddDisc)) {
    //   setShowWarning(true);
    //   validationErrors.addDisc = true;
    //   isValid = false;
    // }

    setErrors(validationErrors);
    if (!isValid) {
      window.scrollTo(0, 0);
    }

    return isValid;
  };

  const handleNewAllot = () => {
    setNewAllot(!newAllot);
    if(!newAllot) {
    setCurrModelList(getModel);
    }
    else {
      setCurrModelList(getModel.filter((model) => model == selectedCustomer[6])); // Assuming car model is at index 6
    }
  }

  const handleGeneratePDF = async () => {

    if (!validateForm()) {
      showError("Kindly Recheck field entries!");
      return; // Don't proceed if there are validation errors
    }
    
    const Qdata = buildQuotationData({
      name, phoneNo, email, address, selectedSalesPerson, cxId, cxAllot, inhouse, selectedHpn, hpn,
      finalData, selectedColor, selectedDiscounts, addExc, loyalty, loyaltyType, corpOffer, addDisc, mdmrDisc, sss,
      totalDisc, tcs, rto, scrap, cod, selectedAcc, accTotal, ins, selectedInsurance, totalAddOns, ew,
      selectedVas, totalESP
    });
      
      try {
        setLoading(true);
        showInfo("Generating PDF... Please wait.");
      
        const response = await axios.post(`/generate-pdf`, Qdata);
        const {whatsAppUrl,publicUrl} = response.data;
        
        setWhatsAppUrl(whatsAppUrl);
        setPdfUrl(publicUrl);
        
        showSuccess("PDF generated successfully! You can now view and share the quotation.");

    } catch (error) {
      console.error("Error generating PDF", error);
      showError("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }

  };

    // const filteredSalesPersons = salesPersonList.filter(person =>
    //   person.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    useEffect(() => {
      setPdfUrl('');
    }, [
      getYear, year, getModel, model, getFuel, fuel, getVariant, variant, finalData, selectedInsurance, selectedDiscounts, addExc, loyalty, corpOffer, addDisc, mdmrDisc, sss,rto,totalDisc,ew,accessories,selectedAcc,
      color,selectedColor,selectedVas,selectedHpn,totalAddOns,accTotal,loyaltyType,scrap,name,phoneNo,email,address,selectedSalesPerson]);

  return (
    <div className="m-auto w-full max-w-4xl p-4">
  <h2 className="text-2xl font-semibold text-center mb-6">Test form for Quotation</h2>

  {/* <div className="mb-6 flex items-center space-x-3">
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        checked={newCx}
onChange={(e) => {
  setNewCx(e.target.checked);
  // Clear form when switching to new customer
  if (e.target.checked) {
    setNewAllot(true);
    setSelectedCustomer(null);
    setName('');
    setPhoneNo('');
    setEmail('');
    setAddress('');
    setGender('');
    setCustomerSearchQuery(''); // Clear search query
  }
}}
        className="sr-only"
      />
      <div className={`block w-14 h-8 rounded-full ${newCx ? 'bg-blue-500' : 'bg-gray-300'} transition-colors duration-200`}></div>
      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ${newCx ? 'transform translate-x-6' : ''}`}></div>
    </div>
    <span className="ml-3 text-lg font-medium text-gray-700">
      {newCx ? 'New Customer' : 'Listed Customer'}
    </span>
  </label>
</div> */}
  
    <CustomerDetailsForm
      newCx={newCx}
      setNewCx={setNewCx}
      setNewAllot={setNewAllot}
      selectedCustomer={selectedCustomer}
      setSelectedCustomer={setSelectedCustomer}
      name={name}
      setName={setName}
      address={address}
      setAddress={setAddress}
      phoneNo={phoneNo}
      setPhoneNo={setPhoneNo}
      email={email}
      setEmail={setEmail}
      errors={errors}
      gender={gender}
      setGender={setGender}
      customerSearchQuery={customerSearchQuery}
      setCustomerSearchQuery={setCustomerSearchQuery}
      filteredCustomers={filteredCustomers}
      handleCustomerSelect={handleCustomerSelect}
    />

        <input
          type="text"
          value={selectedSalesPerson}
          disabled hidden
        />

  <form onSubmit={handleSubmit} className="space-y-4">
    <VehicleSelector 
      getYear={getYear}
      dataBasedOnYear={dataBasedOnYear}
      currModelList= {currModelList}
      dataBasedOnYearAndModel={dataBasedOnYearAndModel}
      getFuel= {getFuel}
      dataBasedOnYearModelAndFuel={dataBasedOnYearModelAndFuel}
      getVariant={getVariant}
      setVariant={setVariant}
      handleNewAllot={handleNewAllot} />
    <button
      type="submit"
      className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
    >
      Submit
    </button>
  </form>
  

      <div className="overflow-x-auto mt-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 overflow-y-hidden">
          {loading && <Loader/>}
          {Object.keys(finalData).map((key, i) => (
            <Fragment key={i}>
              {(i >= 19 && i <= 26) ?
                i == 19 &&
                <>
                  <div>Insurance Type:</div>
                  <Select
                    options={[{ value: 'Dealer', label: 'Dealer' }, { value: 'Self', label: 'Self' }]}
                    onChange={(selected) => {
                      setInsType(selected && selected.value);
                      selected.value === 'Self' ? setIns(0) : setIns(finalData.Insurance);
                      setSelectedInsurance([])
                    }}
                    className="w-full p-1 rounded-lg"
                    defaultValue={{ value: 'Dealer', label: 'Dealer' }}
                  />
                  {insType === 'Dealer' && <>
                    <div>Insurance Amount:</div>
                    {!isManagerRole ? <div className="w-full p-2 border border-gray-300 rounded-lg">
                      {ins}
                    </div> :
                    <input className="w-full p-2 border border-gray-300 rounded-lg"
                      type="number"
                      value={ins}
                      onChange={(e) => { setIns(e.target.value) }}
                    />}
                    <div>Select Insurance Add-ons:</div>
                    <Select
                      options={Object.keys(finalData)
                        .filter((key, i) => (i >= 20 && i <= 26 && finalData[key] > 0))
                        .map((key) => ({ value: key, label: key.replace(/_/g, " ") }))}
                      isMulti
                      value={selectedInsurance}
                      onChange={(selected) => { setSelectedInsurance(selected) }}
                      className="w-full p-1 rounded-lg"
                      isSearchable={false}
                      closeMenuOnSelect={false}
                      menuIsOpen={undefined}
                      maxMenuHeight={200}
                      classNamePrefix="react-select"
                    /> 
                  </>}
                  <div>Insurance Total:</div>
                  <div className="w-full p-2 border border-gray-300 rounded-lg">
                    {totalAddOns + Number(ins)}
                  </div>
                  <div>TCS:</div>
                  <div className="w-full p-2 border border-gray-300 rounded-lg">
                    {tcs = (finalData.ESP - totalDisc) > 1000000 ? parseFloat(((finalData.ESP - totalDisc) * 0.01).toFixed(2)) : 0}
                  </div>
                </>
                :
                (i >= 5 && i <= 15) ?
                  i == 5 &&
                  <>
                    {(color.length > 0) &&
                      <>
                        <div>Color:</div>
                        <Select
                          options={color}
                          isClearable
                          placeholder='Optional'
                          onChange={(selected) => { selected ? setSelectedColor(selected.value) : setSelectedColor("N/A") }}
                          className="w-full p-1 rounded-lg"
                          isSearchable={false}
                          classNamePrefix="react-select"
                        />
                      </>}
                    <div>Finance Type: </div>
                    <Select
                      options={[{ value: true, label: 'In-House' }, { value: false, label: 'Out-House' }]}
                      value={inhouse ? { value: true, label: 'In-House' } : { value: false, label: 'Out-House' }}
                      onChange={(selected) => {
                        selected && setInhouse(selected.value); setSelectedHpn({ label: "Not for Loan Use", value: "N/A" }); console.log(selectedHpn);
                      }}
                      className="w-full p-1 rounded-lg"
                    />
                    <div>HPN: </div>
                    {inhouse ? <>
                      <Select
                        isSearchable={false}
                        options={hpnOptions}
                        onChange={(selected) => { setSelectedHpn(selected) }}
                        value={selectedHpn}
                        menuPlacement="auto" // 👈 auto will try top if no space at bottom
                        menuPosition="absolute"
                        menuPortalTarget={document.body} // 👈 render dropdown at the top of the DOM
                        styles={{
                          menuPortal: base => ({ ...base, zIndex: 9999 }) // 👈 ensure it's on top
                        }}
                        className="w-full p-1 rounded-lg"
                      /></> :
                      <>
                        <input className="w-full p-2 border border-gray-300 rounded-lg"
                          type="text"
                          value={hpn}
                          onChange={(e) => { setHpn(e.target.value) }}
                        />
                      </>}
                    <div>Select Discount Type:</div>
                    {/* <Select
                      options={[...discounts.filter(x => finalData[x.value] > 0),
                      (finalData['MSME'] || finalData['SOLER']) ?
                        { value: 'CORPORATE OFFER', label: 'Corporate Offer' } :
                        { value: 'None', label: 'None' },
                      (finalData['EXCHANGE'] + finalData['ADDITIONAL_EXCHANGE'] > 0) ?
                        { value: 'EXCHANGE', label: 'Exchange' } :
                        { value: 'None', label: 'None' },
                      (finalData['ICE_to_EV'] + finalData['EV_to_EV'] > 0) ?
                        { value: 'LOYALTY', label: 'Loyalty' } :
                        { value: 'None', label: 'None' },
                        isManagerRole
                          ? { value: 'MDMR', label: 'MD/MR' }
                          : { value: 'None', label: 'None' }].filter(x => x.value != "None")}
                      isMulti
                      value={selectedDiscounts}
                      onChange={handleDiscount}
                      className="w-full p-1 rounded-lg"
                      isSearchable={false}
                      closeMenuOnSelect={false}
                      menuIsOpen={undefined}
                      maxMenuHeight={200}
                      classNamePrefix="react-select"
                    /> */}

                    <Select
                      options={discountOptions}
                      isMulti
                      value={selectedDiscounts}
                      onChange={handleDiscount}
                      className="w-full p-1 rounded-lg"
                      isSearchable={false}
                      closeMenuOnSelect={false}
                      maxMenuHeight={200}
                      menuIsOpen={undefined}
                      classNamePrefix="react-select"
                      placeholder={discountOptions.length ? 'Choose…' : 'No discounts available'}
                      isDisabled={!discountOptions.length}
                    />

                    {(selectedDiscounts.some((opt) => opt.value === "EXCHANGE") && fuel == 'Electric') &&
                      <>
                        <div>Additional Exchange: </div>
                        <Select
                          options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]}
                          onChange={handleAddExch}
                          className="w-full p-1 rounded-lg"
                        />
                      </>}
                    {(selectedDiscounts.some((opt) => opt.value === "LOYALTY") && fuel == 'Electric') &&
                      <>
                        <div>Loyalty Bonus: </div>
                        <Select
                          options={[{ value: "ICE_to_EV", label: 'ICE_to_EV' }, { value: "EV_to_EV", label: 'EV_to_EV' }]}
                          onChange={handleLoyalty}
                          className="w-full p-1 rounded-lg"
                        />
                      </>}
                    {selectedDiscounts.some((opt) => opt.value === "CORPORATE OFFER") &&
                      <>
                        <div>Corporate Offer: </div>
                        <Select
                          options={corpOfferOptions}
                          onChange={handleCorpOffer}
                          className="w-full p-1 rounded-lg"
                        />
                      </>}
                    {selectedDiscounts.some((o) => o.value === 'MDMR') && (
                      <>
                        <div>MD/MR Discount:</div>
                        <input
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          type="number"
                          min="0"
                          value={mdmrDisc}
                          onChange={(e) => setMdmrDisc(e.target.value)}
                        />
                      </>
                    )}
                    <div>Additional Discount:</div>
                    <div>
                      <input className="w-full p-2 border border-gray-300 rounded-lg"
                        type="number"
                        value={addDisc}
                        onChange={handleAddDisc}
                      />
                      {showWarning && (
                        <p style={{ color: 'red', marginTop: '0.5rem' }}>
                          Value cannot exceed {maxAddDisc || 0}.
                        </p>
                      )}
                    </div>
                    <div>SSS:</div>
                    <input className="w-full p-2 border border-gray-300 rounded-lg"
                      type="number"
                      value={sss}
                      onChange={handleSss}
                    />
                    <div>Total Discount:</div>
                    <div className="w-full p-2 border border-gray-300 rounded-lg">
                      {totalDisc}
                    </div>
                    <div>ESP after Discount:</div>
                    <div className="w-full p-2 border border-gray-300 rounded-lg">
                      {finalData.ESP - totalDisc}
                    </div>
                  </>
                  :
                  (i >= 16 && i <= 18) ?
                    i == 16 &&
                    <>
                      <div>RTO Type: </div>
                      <Select
                        options={rtoOptions.filter(x => finalData[x.value] > 0)}
                        onChange={handleRto}
                        defaultValue={{ value: 'RTO', label: 'Normal RTO' }}
                        className="w-full p-1 rounded-lg"
                        classNamePrefix="react-select"
                        isSearchable={false}
                      />
                      <div>RTO Amount: </div>
                      <div className="w-full p-2 border border-gray-300 rounded-lg">
                        {finalData[rto.value].toFixed(2)}
                      </div>
                      {(rto.value == "Scrap_RTO") &&
                        <>
                          <div>Scrap by: </div>
                          <Select
                            isClearable
                            options={[{ value: true, label: 'Dealer' }, { value: false, label: 'Self' }]}
                            onChange={(selected) => { setScrap(selected && selected.value); setCod((selected && selected.value) ? finalData.COD : 0) }}
                            className="w-full p-1 rounded-lg"
                          />
                        </>
                      }
                    </>
                    :
                    (i >= 27 && i <= 29) ?
                      i == 27 &&
                      <>
                        <div>EW Type: </div>
                        <Select
                          isClearable
                          options={ewOptions.filter(x => finalData[x.value] > 0)}
                          onChange={(selected) => { setEw(selected && selected.value) }}
                          className="w-full p-1 rounded-lg"
                          isSearchable={false}
                        />
                        <div>EW Amount: </div>
                        <div className="w-full p-2 border border-gray-300 rounded-lg">
                          {finalData[ew]}
                        </div>
                        <div>Accessories: </div>
                        <Select
                          options={accessories.filter(x => x.value > 0)}
                          isMulti
                          onChange={(selected) => { setSelectedAcc(selected) }}
                          className="w-full p-1 rounded-lg"
                          isSearchable={false}
                          closeMenuOnSelect={false}
                          menuIsOpen={undefined}
                          classNamePrefix="react-select"
                          menuPlacement="auto" // 👈 auto will try top if no space at bottom
                          menuPosition="absolute"
                          menuPortalTarget={document.body} // 👈 render dropdown at the top of the DOM
                          styles={{
                            menuPortal: base => ({ ...base, zIndex: 9999 }) // 👈 ensure it's on top
                          }}
                        />
                        <div>Accessories Amount: </div>
                        <div className="w-full p-2 border border-gray-300 rounded-lg">
                          {accTotal}
                        </div>
                        <div>VAS Type: </div>
                        <Select
                          isSearchable={false}
                          isClearable
                          options={vasOptions}
                          onChange={(selected) => { setSelectedVas(selected && selected) }}
                          className="w-full p-1 rounded-lg"
                          menuPlacement="auto" // 👈 auto will try top if no space at bottom
                          menuPosition="absolute"
                          menuPortalTarget={document.body} // 👈 render dropdown at the top of the DOM
                          styles={{
                            menuPortal: base => ({ ...base, zIndex: 9999 }) // 👈 ensure it's on top
                          }}
                        />
                        <div>VAS Amount: </div>
                        <div className="w-full p-2 border border-gray-300 rounded-lg">
                          {selectedVas ? selectedVas.value : 0}
                        </div>
                      </> :
                      <>
                        {i < 31 && <>
                          <div>{key} :</div>
                          <div className="w-full p-2 border border-gray-300 rounded-lg">{finalData[key]}</div>
                        </>}
                        {i === 31 && <>
                          <div>Total Price:</div>
                          <div className="w-full p-2 border border-gray-300 rounded-lg">
                            {totalESP = finalData.ESP - totalDisc + (finalData[rto.value] ? finalData[rto.value] : 0) + totalAddOns + ins + tcs + (finalData[ew] ? finalData[ew] : 0) + accTotal + (selectedVas ? selectedVas.value : 0) + finalData.FastTag + cod}
                          </div>
                        </>}
                      </>}
            </Fragment>
          ))}
        </div>
        {Object.keys(finalData).length > 0 && <div className='block'>
          {!pdfUrl && <button
            type="button"
            disabled={loading}
            className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
            onClick={handleGeneratePDF}>
            {loading ? 'Generating Quotation...' : 'Generate Quotation'}
          </button>}
          {pdfUrl &&
            <div className="flex-col sm:flex-row sm:items-stretch flex-wrap justify-center items-center space-x-4">
              <button
                type="button"
                disabled={loading}
                className="w-full sm:w-[32%] py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600" onClick={() => {
                  window.open(pdfUrl, "_blank")
                }}>
                Show Pdf 📄
              </button>
              <button
                type="button"
                disabled={loading}
                className="w-full sm:w-[32%] py-2 mt-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600" onClick={() => {
                  window.location.href = whatsAppUrl;
                }}>
                Share on WhatsApp &nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48" className='inline'>
                  <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <button
                type="button"
                disabled={loading}
                className="w-full sm:w-[32%] py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                onClick={() => {
                  navigate('/all-quotations')
                }}>
                All Quotation
              </button>
            </div>
          }

        </div>
        }
      </div>
    </div>
  );
};

export default QuotationPage;
