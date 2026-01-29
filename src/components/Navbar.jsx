import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md border-b border-gray-100 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo que leva para a Home */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          EventlyHub
        </Link>

        {/* Links da Direita */}
        <div className="space-x-6 flex items-center">
          <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium">
            Explorar
          </Link>
          <Link 
            to="/registrar" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
          >
            Anunciar Buffet/Espaço
          </Link>
        </div>
      </div>
    </nav>
  );
}