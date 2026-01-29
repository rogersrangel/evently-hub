import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Importamos a nova Navbar
import RegisterService from './pages/RegisterService';
import Dashboard from './pages/Dashboard';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
        O lugar onde seu <span className="text-indigo-600">evento</span> começa.
      </h1>
      <p className="text-xl text-gray-600 mt-4 max-w-2xl">
        Conectamos você aos melhores buffets e espaços de eventos em um só lugar. 
        Simples, rápido e seguro.
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar /> {/* Ela fica aqui para aparecer em todas as rotas */}
        
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/registrar" element={<RegisterService />} />
  <Route path="/dashboard" element={<Dashboard />} /> {/* Nova linha */}
</Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;