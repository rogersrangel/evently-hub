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
import EditService from './pages/EditService';
import PublicProfile from './pages/PublicProfile';
import Auth from './pages/Auth'; // <-- Adicione o import da Etapa 5
import ProtectedRoute from './components/ProtectedRoute';
import AuthCallback from './pages/AuthCallback';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/explorar" element={<Explore />} />
        <Route path="/detalhes/:id" element={<Details />} />
        <Route path="/p/:id" element={<PublicProfile />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} /> {/* ADICIONE ESTA LINHA */}


        {/* Privadas (Dono do Espaço) */}
        <Route path="/registrar" element={
          <ProtectedRoute>
            <RegisterService />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/editar/:id" element={
          <ProtectedRoute>
            <EditService />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}