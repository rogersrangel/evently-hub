import RegisterService from './pages/RegisterService'; // Importando nossa nova página

function App() {
  return (
    // Esse fundo cinza (bg-gray-100) serve para testar se o Tailwind está ativo
    <div className="min-h-screen bg-gray-100">
      <RegisterService />
    </div>
  )
}

export default App