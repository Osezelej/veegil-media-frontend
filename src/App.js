
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import SignUp from './pages/signup';
import Deposit from './pages/deposite';
import Withdraw from './pages/withdraw';
import Home from './pages/home';

function App() {
  return (
    <Router>
      <Routes >
        <Route  path='/' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/:user' element={<Home/>}/>
        <Route path='/deposit/:user' element={<Deposit/>}/>
        <Route path='/withdraw/:user' element={<Withdraw/>}/>
      </Routes>
    </Router>
  );
}

export default App;
