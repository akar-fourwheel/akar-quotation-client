import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router";
import Select from "react-select";
import { Fragment } from 'react';

import salesPersonList from '../../salesPerson.json'

const quotationPage = () => {
  const [getYear, setGetYear] = useState([]);
  const [year, setYear] = useState('');
  const [getModel, setGetModel] = useState([]);
  const [model, setModel] = useState('');
  const [getFuel, setGetFuel] = useState([]);
  const [fuel, setFuel] = useState('');
  const [getVariant, setGetVariant] = useState([]);
  const [variant, setVariant] = useState('');
  const [finalData,setFinalData] = useState({});
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
  const [currentDate, setCurrentDate] = useState("");
  const [selectedSalesPerson, setSelectedSalesPerson] = useState(localStorage.getItem("username"));
  const [pdfUrl,setPdfUrl] = useState('');
  const [cod, setCod] = useState(0);
  const [hpn, setHpn] = useState("");
  const [whatsAppUrl,setWhatsAppUrl] = useState('');
  const [ins, setIns] = useState(0);
  const [insType, setInsType] = useState("Dealer")
  const [showWarning, setShowWarning] = useState(false);
  const [maxAddDisc, setMaxAddDisc] = useState(0);
  const [inhouse, setInhouse] = useState(true);
  const [errors, setErrors] = useState({
      name: false,
      address: false,
      phoneNo: false,
      email: false,
      selectedSalesPerson: false,
    });
  const [loading, setLoading] = useState(false);
  const  navigate = useNavigate();
  
  let tcs, totalESP;

  const discounts = [
    { value: 'CONSUMER', label: 'Consumer' },
    { value: 'INTERVENTION', label: 'Intervention' },
    { value: 'CORPORATE_TOP_10', label: 'Corporate Top 10' },
    { value: 'CORPORATE_TOP_20', label: 'Corporate Top 20' },
    { value: 'GRID', label: 'Grid' },
  ];

  const corpOfferOptions = [
    { value: 'MSME', label: 'MSME' },
    { value: 'SOLER', label: 'Solar' },
  ];

  const rtoOptions = [
    { value: 'RTO', label: 'Normal RTO' },
    { value: 'BH RTO', label: 'BH RTO' },
    { value: 'Scrap RTO', label: 'Scrap RTO'},
  ];

  const ewOptions = [
    { value: 'EW 1 Year', label: '1 Year' },
    { value: 'EW 2 Year', label: '2 Years' },
    { value: 'EW 3 Year', label: '3 Years'},
  ];

  const vasOptions = [
    { label: 'Ceramic Coating', value: 25000 },
    { label: 'Teflon Coating', value: 15000 }
  ];

  const hpnOptions = [
    { label: "Axis Bank", value: "Axis Bank" },
    { label: "Bandhan Bank", value: "Bandhan Bank" },
    { label: "Bank of Baroda", value: "Bank of Baroda" },
    { label: "Bank of India", value: "Bank of India" },
    { label: "Canara Bank", value: "Canara Bank" },
    { label: "Central Bank of India", value: "Central Bank of India" },
    { label: "Federal Bank", value: "Federal Bank" },
    { label: "HDFC Bank", value: "HDFC Bank" },
    { label: "ICICI Bank", value: "ICICI Bank" },
    { label: "IDBI Bank", value: "IDBI Bank" },
    { label: "IDFC First Bank", value: "IDFC First Bank" },
    { label: "IndusInd Bank", value: "IndusInd Bank" },
    { label: "Kotak Mahindra Bank", value: "Kotak Mahindra Bank" },
    { label: "Kotak Mahindra Prime Limited", value: "Kotak Mahindra Prime Limited" },
    { label: "Punjab National Bank", value: "Punjab National Bank" },
    { label: "RBL Bank", value: "RBL Bank" },
    { label: "State Bank of India", value: "State Bank of India" },
    { label: "UCO Bank", value: "UCO Bank" },
    { label: "Union Bank of India", value: "Union Bank of India" },
    { label: "Yes Bank", value: "Yes Bank" },
    { label: "Mahindra & Mahindra Financial Services Ltd.", value: "Mahindra & Mahindra Financial Services Ltd." },
    { label: "Rajasthan Marudhar Gramin Bank", value: "Rajasthan Marudhar Gramin Bank" },
    { label: "Sundaram Finance", value: "Sundaram Finance" },
    { label: "Sriram Finance", value: "Sriram Finance" },
    { label: "SK Finance", value: "SK Finance" },
    { label: "Cholamandalam Investment and Finance Company", value: "Cholamandalam Investment and Finance Company" },
    { label: "Not for Loan Use", value: "N/A" },
    { label: "Cash", value: "Cash" }
  ];

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
  

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.get(`/quotation-data`, {
      params: {
        year: year,
        model: model,
        fuel: fuel,
        variant: variant
      },
    })
    .then((response) => {      
      const data = JSON.parse(response.data[0]);
      const data1 = JSON.parse(response.data[1]);
      const data2 = JSON.parse(response.data[2]);
      setColor(data2);
      setAccessories(data1)
      setFinalData(data);
      restState(data.Insurance, data.YEAR, data.AddDiscLim);      
    });
  };

  const dataBasedOnYear = (e) => {
    const selectedYear = e.target.value;
    setYear(selectedYear);
    
    setGetModel([]);
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
        setGetModel(data);
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
        if(response.data=="data not found") return;
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
        if(response.data === "data not found") return;
        const data = response.data.flat();
        setGetVariant(data); // Correctly updating variants
      });
  };

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
    }, 0) + addExc + loyalty + (finalData[corpOffer] || 0) + Number(addDisc) + Number(sss);

    setTotalDisc(newTotal);
  }, [selectedDiscounts, addExc, loyalty, corpOffer, addDisc, sss]);

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

  const handleInsurance = (selected) => {
    setSelectedInsurance(selected);
  };

  const handleDiscount = (selected) => {
    setSelectedDiscounts(selected);
    
    if (!selected.some((opt) => opt.value === "EXCHANGE")) {setLoyalty(0); setAddExc(0);}
    if (!selected.some((opt) => opt.value === "CORPORATE OFFER")) {setCorpOffer("");}
  };

  const handleAddExch = (selected) => {
    if (selected.value) {setAddExc(finalData["ADDITIONAL EXCHANGE"])}
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
  
    if (finalData.YEAR == 2025 && finalData.Fuel == "Electric") {
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
    if (finalData.YEAR == 2025 && finalData.Fuel == "Electric" &&addDisc > maxAmount) {
      setAddDisc(maxAmount);
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

  const handleEw = (selected) => {
    selected ? setEw(selected.value) : setEw()
  }

  const handleAccessories = (selected) => {
    setSelectedAcc(selected)
  }

  const handleColor = (selected) => {
    selected ? setSelectedColor(selected.value) : setSelectedColor("N/A")
  }

  const handleVas = (selected) => {
    selected ? setSelectedVas(selected) : setSelectedVas()
  }

  const handleHpn = (selected) => {
    setSelectedHpn(selected)
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
    console.log(addDisc, maxAddDisc);
    
    if (maxAddDisc && (addDisc > maxAddDisc)) {
      setShowWarning(true);
      validationErrors.addDisc = true;
      isValid = false;
    }

    setErrors(validationErrors);
    if (!isValid) {
      window.scrollTo(0, 0);
    }
    
    return isValid;
  };

  const handleGeneratePDF = async () => {

    if (!validateForm()) {
      return; // Don't proceed if there are validation errors
    }

    const cameraOption = selectedAcc.find(
      (opt) => opt.label == "Camera" || opt.label == "TFT Display Camera"
    )
    var Qdata = {
      date: currentDate,
      name: name.toUpperCase(),
      mobile: phoneNo,
      email: email,
      address: address, 
      salesPerson: selectedSalesPerson, 
      HPN: (inhouse ? selectedHpn.label + ": In-House" : hpn + ": Out-House"),
      year: finalData.YEAR, 
      model: finalData.PPL, 
      fuel: finalData.Fuel, 
      varient: finalData.Variant,
      color: selectedColor ? selectedColor : "N/A", 
      ESP: finalData.ESP, 
      consumerDisc: (selectedDiscounts.some((opt) => opt.value === "CONSUMER") ? finalData.CONSUMER : 0), 
      interventionDisc: (selectedDiscounts.some((opt) => opt.value === "INTERVENTION") ? finalData.INTERVENTION : 0), 
      exchangeScrap: (selectedDiscounts.some((opt) => opt.value === "EXCHANGE") ? finalData.EXCHANGE : 0), 
      addExcDisc: addExc,
      loyalty: (!loyalty || loyalty == 0 ? false : true),
      ICEtoEV: (loyaltyType == 'ICE to EV' && finalData[loyaltyType]), 
      EVtoEV: (loyaltyType == 'EV to EV' && finalData[loyaltyType]),  
      corpTop10Disc: (selectedDiscounts.some((opt) => opt.value === "CORPORATE TOP 10") ? finalData["CORPORATE TOP 10"] : 0), 
      corpTop20Disc: (selectedDiscounts.some((opt) => opt.value === "CORPORATE TOP 20") ? finalData["CORPORATE TOP 20"] : 0), 
      corpOfferToggle: (finalData[corpOffer] > 0 ? true : false),
      solarDisc:((corpOffer === "SOLER") ? finalData.SOLER : 0), 
      MSMEDisc: ((corpOffer === "MSME") ? finalData.MSME : 0), 
      gridDisc: (selectedDiscounts.some((opt) => opt.value === "GRID") ? finalData.GRID : 0), 
      addDisc: addDisc,
      SSS: sss,
      totalDisc: totalDisc,  
      billingPrice: finalData.ESP - totalDisc, 
      tcs: tcs, 
      rtoType: rto.value, 
      rtoAmt: finalData[rto.value].toFixed(2),
      scrapBy: (scrap ? "Dealer" : rto.value == "Scrap RTO" ? "Self" : "N/A"), 
      cod: cod, 
      mudflap: (selectedAcc.some((opt) => opt.label === "Mudflap") ? selectedAcc.find((opt) => opt.label === "Mudflap").value : 0), 
      uniMatting: (selectedAcc.some((opt) => opt.label === "Universal Matting") ? selectedAcc.find((opt) => opt.label === "Universal Matting").value : 0), 
      seatCover: (selectedAcc.some((opt) => opt.label === "Seat Cover") ? selectedAcc.find((opt) => opt.label === "Seat Cover").value : 0), 
      doorVisor: (selectedAcc.some((opt) => opt.label === "Door Visor") ? selectedAcc.find((opt) => opt.label === "Door Visor").value : 0), 
      doorEdge: (selectedAcc.some((opt) => opt.label === "Door Edge Guard") ? selectedAcc.find((opt) => opt.label === "Door Edge Guard").value : 0), 
      bsm: (selectedAcc.some((opt) => opt.label === "BSM") ? selectedAcc.find((opt) => opt.label === "BSM").value : 0), 
      scuffPlate: (selectedAcc.some((opt) => opt.label === "Scuff Plate") ? selectedAcc.find((opt) => opt.label === "Scuff Plate").value : 0), 
      sideStep: (selectedAcc.some((opt) => opt.label === "Side Step") ? selectedAcc.find((opt) => opt.label === "Side Step").value : 0), 
      mat7D:(selectedAcc.some((opt) => opt.label === "7 D Mat") ? selectedAcc.find((opt) => opt.label === "7 D Mat").value : 0), 
      trunkMat: (selectedAcc.some((opt) => opt.label === "Trunk Mat") ? selectedAcc.find((opt) => opt.label === "Trunk Mat").value : 0), 
      perfume: (selectedAcc.some((opt) => opt.label === "Perfume") ? selectedAcc.find((opt) => opt.label === "Perfume").value : 0), 
      ganeshji: (selectedAcc.some((opt) => opt.label === "Ganesh Ji") ? selectedAcc.find((opt) => opt.label === "Ganesh Ji").value : 0), 
      camera: (cameraOption ? cameraOption.label : " "),
      cameraVal: (cameraOption ? cameraOption.value : 0),
      bodyCover: (selectedAcc.some((opt) => opt.label === "Car Cover") ? selectedAcc.find((opt) => opt.label === "Car Cover").value : 0),
      accTotal: accTotal, 
      inc: ins, 
      rsa: (selectedInsurance.some((opt) => opt.value === "RSA") ? finalData["RSA"] : 0), 
      keyRep: (selectedInsurance.some((opt) => opt.value === "Key Replacement") ? finalData["Key Replacement"] : 0), 
      engineProtect: (selectedInsurance.some((opt) => opt.value === "Engine Protection") ? finalData["Engine Protection"] : 0), 
      rti: (selectedInsurance.some((opt) => opt.value === "RTI") ? finalData["RTI"] : 0), 
      tyreNcover: (selectedInsurance.some((opt) => opt.value === "Tyre and Alloy Cover") ? finalData["Tyre and Alloy Cover"] : 0), 
      consumables: (selectedInsurance.some((opt) => opt.value === "Consumables") ? finalData["Consumables"] : 0), 
      personalBelong: (selectedInsurance.some((opt) => opt.value === "Personal Belongings") ? finalData["Personal Belongings"] : 0), 
      batteryP: (selectedInsurance.some((opt) => opt.value === "Battery Protection") ? finalData["Battery Protection"] : 0), 
      incTotal: totalAddOns + ins, 
      ewType: ew ? ew : " ", 
      ew: ew ? finalData[ew] : " ", 
      vasType: selectedVas ? selectedVas.label : " ", 
      vas: selectedVas ? selectedVas.value : " ", 
      fasttag: finalData.FastTag, 
      grandTotal: totalESP, };
      
      try {
        setLoading(true);
      
        const response = await axios.post(`/generate-pdf`, Qdata);
        const {whatsAppUrl,publicUrl} = response.data;
        
        setWhatsAppUrl(whatsAppUrl);
        setPdfUrl(publicUrl);

      } catch (error) {
        console.error("Error generating PDF", error);
      } finally {
        setLoading(false);
      }  
    };

    // const filteredSalesPersons = salesPersonList.filter(person =>
    //   person.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    useEffect(() => {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      setCurrentDate(today);
    }, []);

    useEffect(() => {
      setPdfUrl('');
    }, [
      getYear,year,getModel,model,getFuel,fuel,getVariant,variant,finalData,selectedInsurance,selectedDiscounts,addExc,loyalty,corpOffer,addDisc,sss,rto,totalDisc,ew,accessories,selectedAcc,
      color,selectedColor,selectedVas,selectedHpn,totalAddOns,accTotal,loyaltyType,scrap,name,phoneNo,email,address,currentDate,selectedSalesPerson]);

  return (
    <div className="m-auto w-full max-w-4xl p-4">
  <h2 className="text-2xl font-semibold text-center mb-6">Test form for Quotation</h2>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-2">
        <label className="block text-lg">Customer Name:</label>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
        />
      </div>

      <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-2">
        <label className="block text-lg">Address:</label>
        <input
          type="text"
          onChange={(e) => setAddress(e.target.value)}
          className={`w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
        />
      </div>

      <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-2">
        <label className="block text-lg">Phone Number:</label>
        <input
          type="text"
          onChange={(e) => setPhoneNo(e.target.value)}
          className={`w-full p-2 border ${errors.phoneNo ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
        />
      </div>

      <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-2">
        <label className="block text-lg">Email:</label>
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Optional'
          className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
        />
      </div>

      {/* <div className="col-span-1 sm:col-span-2 lg:col-span-1 space-y-2"> */}
        {/* <select
          value={selectedSalesPerson}
          onChange={(e) => setSelectedSalesPerson(e.target.value)}
          className={`w-full p-2 border ${errors.selectedSalesPerson ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
          isSearchable={true}
        >
          <option value="">Select a Sales Person</option>
          {salesPersonList.map((salesPerson, index) => (
            <option key={index} value={salesPerson}>
              {salesPerson}
            </option>
          ))}
        </select> */}
      {/* </div> */}
        <input
          type="text"
          value={selectedSalesPerson}
          disabled hidden
        />
      </div>

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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 overflow-y-hidden">
          {Object.keys(finalData).map((key, i) => (
            <Fragment key={i}>
              {(i >= 19 && i<= 26) ?
                i == 19 &&
                  <>
                    <div>Insurance Type:</div>
                    <Select
                        options={[{value: 'Dealer', label: 'Dealer' }, { value: 'Self', label: 'Self' }]}
                        onChange={(selected) => {setInsType(selected && selected.value);
                          selected.value === 'Self' ? setIns(0) : setIns(finalData.Insurance)
                        }}
                        className="w-full p-1 rounded-lg"
                        defaultValue={{value: 'Dealer', label: 'Dealer' }}
                      />
                    {insType === 'Dealer' && <>
                    <div>Insurance Amount:</div>
                    <div className="w-full p-2 border border-gray-300 rounded-lg">
                        {ins}
                      </div>
                    <div>Select Insurance Add-ons:</div>
                    <Select
                      options={Object.keys(finalData)
                        .filter((key, i) => (i >= 20 && i <= 26 && finalData[key] > 0))
                        .map((key) => ({ value: key, label: key }))}
                      isMulti
                      value={selectedInsurance}
                      onChange={handleInsurance}
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
                        {totalAddOns + ins}
                      </div>
                      <div>TCS:</div>
                      <div className="w-full p-2 border border-gray-300 rounded-lg">
                        {tcs = (finalData.ESP - totalDisc) > 1000000 ? parseFloat(((finalData.ESP - totalDisc) * 0.01).toFixed(2)) : 0}
                      </div>
                  </>
                :
                (i >=5 && i<= 15) ?
                i == 5 &&
                  <>
                    {(color.length > 0) && 
                    <>
                    <div>Color:</div>
                      <Select
                      options={color}
                      isClearable
                      placeholder='Optional'
                      onChange={handleColor}
                      className="w-full p-1 rounded-lg"
                      isSearchable={false}
                      classNamePrefix="react-select"
                      />
                      <div>Finance Type: </div>
                      <Select
                        options={[{value: true, label: 'In-House' }, { value: false, label: 'Out-House' }]}
                        value={inhouse && {value: true, label: 'In-House' }}
                        onChange={(selected) => {selected && setInhouse(selected.value); setSelectedHpn({ label: "Not for Loan Use", value: "N/A" })}}
                        className="w-full p-1 rounded-lg"
                      />
                      <div>HPN: </div>
                      {inhouse ? <>
                      <Select
                      isSearchable={false}
                      options={hpnOptions}
                      onChange={handleHpn}
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
                      onChange={(e) => {setHpn(e.target.value)}}
                      />
                      </>}
                      </>}
                    <div>Select Discount Type:</div>
                    <Select
                      options={[...discounts.filter(x => finalData[x.value] > 0), (finalData['MSME'] || finalData['SOLER']) ? { value: 'CORPORATE OFFER', label: 'Corporate Offer' } : { value: 'None', label: 'None' }, (finalData['EXCHANGE']+finalData['ADDITIONAL EXCHANGE']+finalData['ICE to EV']+finalData['EV to EV'] > 0 ) ? { value: 'EXCHANGE', label: 'Exchange' } : { value: 'None', label: 'None' }].filter(x => x.value != "None")}
                      isMulti
                      value={selectedDiscounts}
                      onChange={handleDiscount}
                      className="w-full p-1 rounded-lg"
                      isSearchable={false}
                      closeMenuOnSelect={false}
                      menuIsOpen={undefined}
                      maxMenuHeight={200}
                      classNamePrefix="react-select"
                    />
                    {(selectedDiscounts.some((opt) => opt.value === "EXCHANGE") && fuel == 'Electric') &&
                  <>
                    <div>Additional Exchange: </div>
                    <Select
                      options={[{value: true, label: 'Yes' }, { value: false, label: 'No' }]}
                      onChange={handleAddExch}
                      className="w-full p-1 rounded-lg"
                    />
                    <div>Loyalty Bonus: </div>
                    <Select
                      options={[{value: "ICE to EV", label: 'ICE to EV' }, { value: "EV to EV", label: 'EV to EV' }, { value: "N/A", label: 'N/A'}]}
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
                  (i >=16 && i<= 18) ?
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
                    {(rto.value == "Scrap RTO") &&
                    <>
                      <div>Scrap by: </div>
                      <Select
                      isClearable
                        options={[{value: true, label: 'Dealer' }, { value: false, label: 'Self' }]}
                        onChange={(selected) => {setScrap(selected && selected.value); setCod((selected && selected.value) ? finalData.COD : 0)}}
                        className="w-full p-1 rounded-lg"
                      />
                    </>
                    }
                  </>
                  :
                  (i >=27 && i<= 29) ?
                  i ==27 &&
                  <>
                  <div>EW Type: </div>
                    <Select
                      isClearable
                      options={ewOptions.filter(x => finalData[x.value] > 0)}
                      onChange={handleEw}
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
                      onChange={handleAccessories}
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
                      onChange={handleVas}
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
                        { i === 31 && <>
                          <div>Total Price:</div>
                          <div className="w-full p-2 border border-gray-300 rounded-lg">
                            { totalESP = finalData.ESP - totalDisc + (finalData[rto.value] ? finalData[rto.value] : 0) + totalAddOns + ins + tcs + (finalData[ew] ? finalData[ew] : 0) + accTotal + (selectedVas ? selectedVas.value : 0) + finalData.FastTag + cod}
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
        window.open(pdfUrl,"_blank")
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
         onClick={()=> {
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

export default quotationPage;
