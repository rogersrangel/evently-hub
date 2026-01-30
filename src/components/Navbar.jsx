import { Link } from 'react-router-dom';
// framer-motion não usado aqui
import { Sparkles, Compass, PlusCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      {/* O container da Navbar com efeito de vidro real */}
      <div className="max-w-7xl mx-auto glass-card border-white/20 px-6 py-3 flex justify-between items-center rounded-2xl shadow-lg">
        
        {/* Logo Estilizada */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Sparkles className="text-white" size={20} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">
            Evently<span className="text-primary">Hub</span>
          </span>
        </Link>

        {/* Links de Navegação */}
        <div className="flex items-center gap-8">
          <Link 
            to="/explorar" 
            className="flex items-center gap-2 text-slate-600 hover:text-primary font-bold text-sm transition-colors"
          >
            <Compass size={18} />
            Explorar
          </Link>
          
          <Link 
            to="/registrar" 
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-700 hover:scale-105 transition-all shadow-md shadow-primary-200"
          >
            <PlusCircle size={18} />
            Anunciar Espaço
          </Link>
        </div>
      </div>
    </nav>
  );
}