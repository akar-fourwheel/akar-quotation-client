import './App.css';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import muiTheme from './theme/muiTheme';
import HomePage from './Pages/homePage';

axios.defaults.baseURL = import.meta.env.VITE_SERVER + '/api/v1'
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

const App = () => {
 return (
  <ThemeProvider theme={muiTheme}>
    <CssBaseline />
    <HomePage></HomePage>
  </ThemeProvider>
 )
};

export default App;
