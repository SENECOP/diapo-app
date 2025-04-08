import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from "./pages/Home";
import CreerDon from './pages/CreerDon';
import './index.css'; 
import "./styles/tailwind.css";






const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/creer-don" element={<CreerDon />} />
        
          
          {/* Autres routes */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
