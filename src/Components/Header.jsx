import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth/AuthProvider';
import { useNavigate, useLocation } from 'react-router';

const Header = ({ toggleSidebar }) => {
  const {username} = useContext(AuthContext);
  const [target,setTarget] = useState(0);
  const [remainingTarget,setRemainingTarget] = useState('');
  const navigate = useNavigate();
  const col =Number(remainingTarget.split(" ")[1]) <= target;
  const location = useLocation();
  // useEffect(()=> {
  //   if(localStorage.role=="teamLead"){
  //     axios.get('/teamLead/tl-target',{
  //       params:{
  //         id:localStorage.userId
  //       }
  //     })
  //     .then(res =>{
  //       setTarget(res.data[0]);      
  //       const tg = Number(res.data[0])-Number(res.data[1]);
  //       if(tg<0){
  //         setRemainingTarget("Achieved: "+ res.data[1]);
  //       }
  //       else{
  //         setRemainingTarget("Target: "+tg)
  //       }
        
  //     })
  //   }
  // },[])

  return (
    <header className="bg-white shadow-md">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Sidebar Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="pr-3 border-r border-white text-gray-500 focus:outline-none cursor-pointer"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6 cursor-pointer"
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
            <div className="flex-shrink-0 flex items-center" onClick={()=>{ if(location.pathname !== '/') navigate('/') }}>
              <h1 className="cursor-pointer select-none sm:text-xl sm:font-bold text-lg font-light text-gray-900">{username[0].toUpperCase() + username.slice(1)}</h1>
            </div>
          </div>
          {/* { localStorage.role == "teamLead" &&
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className={`py-2 px-3 text-lg font-semibold rounded-lg border border-transparent ${col ? 'bg-amber-400': 'bg-emerald-600'} text-white`}>
                  <p className="sm:text-xl sm:font-medium text-lg font-lighter">{remainingTarget}</p>
                </div>
              </div>
            </div>
          </div>
          } */}
        </div>
      </div>
    </header>
  );
};

export default Header; 
