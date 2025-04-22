import './App.css';
import axios from 'axios';
import HomePage from './Pages/homePage';

axios.defaults.baseURL = import.meta.env.VITE_SERVER
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

const App = () => {
 return (
  <>
    <HomePage></HomePage>
  </>
 )
};

export default App;
