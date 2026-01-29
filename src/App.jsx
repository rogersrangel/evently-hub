import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Ferramentas de navegação
import RegisterService from './pages/RegisterService';

// Vamos criar uma página simples de "Home" aqui dentro mesmo por enquanto
function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-indigo-600">EventlyHub</h1>
      <p className="text-gray-600 mt-2">Encontre o melhor buffet ou espaço para seu evento.</p>
      <a href="/registrar" className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded">
        Sou Fornecedor (Cadastrar)
      </a>
    </div>
  );
}

function App() {
  return (
    // O BrowserRouter envolve todo o app para permitir navegação
    <BrowserRouter>
      <Routes>
        {/* Quando o link for apenas '/', mostra a Home */}
        <Route path="/" element={<Home />} />
        
        {/* Quando o link for '/registrar', mostra o formulário */}
        <Route path="/registrar" element={<RegisterService />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;