import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import RegisterService from './pages/RegisterService';
import Details from './pages/Details';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import EditService from './pages/EditService'; // <--- ESTA LINHA FALTAVA!
import PublicProfile from './pages/PublicProfile';

// Criamos um componente interno para acessar o useLocation, 
// pois ele precisa estar dentro do <Router>
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/explorar" element={<Explore />} />
        <Route path="/registrar" element={<RegisterService />} />
        <Route path="/editar/:id" element={<EditService />} />
        <Route path="/detalhes/:id" element={<Details />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/editar/:id" element={<EditService />} />
        <Route path="/p/:id" element={<PublicProfile />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        {/* O flex-grow garante que o Footer sempre fique no fundo da tela */}
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>

        <Footer />
      </div>
    </Router>
  );
}