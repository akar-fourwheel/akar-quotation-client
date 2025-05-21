import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth/AuthProvider';
import axios from 'axios';

const Header = ({ toggleSidebar }) => {
  const user = useContext(AuthContext);
  const [target,setTarget] = useState(0);
  const [remainingTarget,setRemainingTarget] = useState('');

  const col =Number(remainingTarget.split(" ")[1]) <= target;

  useEffect(()=> {
    axios.get('/teamLead/tl-target',{
      params:{
        id:'TES_01'
      }
    })
    .then(res =>{
      setTarget(res.data[0]);
      const tg = res.data[0]-res.data[1];
      if(tg<0){
        setRemainingTarget("Achieved: "+ res.data[1]);
      }
      else{
        setRemainingTarget("Target: "+tg)
      }
      
    })
  },[])

  return (
    <header className="bg-white shadow">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Sidebar Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="pr-3 border-r border-white text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex-shrink-0 flex items-center">
              <h1 className="sm:text-xl sm:font-bold text-lg font-light text-gray-900">{user?.username}</h1>
            </div>
          </div>
          { localStorage.role == "teamLead" &&  <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className={`py-2 px-3 text-lg font-semibold rounded-lg border border-transparent ${col ? 'bg-amber-400': 'bg-emerald-600'} text-white`}>
                  <p className="sm:text-xl sm:font-medium text-lg font-lighter">{remainingTarget}</p>
                </div>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    </header>
  );
};

export default Header; 