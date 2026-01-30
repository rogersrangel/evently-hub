import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home'; // Verifique se o arquivo se chama Home.jsx
import Explore from './pages/Explore';
import RegisterService from './pages/RegisterService';
import Details from './pages/Details';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        {/* Adicionamos um padding-top para o conteúdo não ficar atrás da Navbar fixa */}
        <main className="pt-24"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explorar" element={<Explore />} />
            <Route path="/registrar" element={<RegisterService />} />
            <Route path="/detalhes/:id" element={<Details />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;