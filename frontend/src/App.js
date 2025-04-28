import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from "./pages/Home";
import CreerDon from './pages/CreerDon';
import ListeDons from './pages/ListeDons';
import './index.css'; 
import "./styles/tailwind.css";
import DonCategorie from './pages/DonCategorie';
import Dashboard from './pages/Dashboard';
import { UserProvider } from './context/UserContext';
import Profil from "./pages/Profil";
import Message from './pages/Messages';
import Archives from './pages/Archives';







const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/creer-don" element={<CreerDon />} />
          <Route path="/creer-don/:id" element={<CreerDon />} />
          <Route path="/ListeDons" element={<ListeDons />} />
          <Route path="/dons/:categorie" element={<DonCategorie />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/message" element={<Message />} />
          <Route path="/archives" element={<Archives />} />



      </Routes>
        </Router>
    </UserProvider>
  );
};

export default App;
