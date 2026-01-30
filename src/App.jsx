import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Details from './pages/Details';
import Dashboard from './pages/Dashboard';
import RegisterService from './pages/RegisterService';
import Auth from './pages/Auth';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Router>
      {/* Navbar fica fixa no topo */}
      <Navbar />
      
      {/* Container principal com recuo para não sumir atrás da Navbar */}
      <div className="pt-24 min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorar" element={<Explore />} />
          <Route path="/detalhes/:id" element={<Details />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registrar" element={<RegisterService />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/perfil" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}