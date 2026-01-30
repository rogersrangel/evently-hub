import { Link } from 'react-router-dom';
import { Sparkles, Compass, PlusCircle, User } from 'lucide-react';

export default function Navbar() {
  return (
    // Removida a repetição de classe e adicionado backdrop-blur para o vidro ficar perfeito
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto glass-card border-white/40 px-6 py-3 flex justify-between items-center shadow-2xl">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-200">
            <Sparkles className="text-white" size={20} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">
            Evently<span className="text-indigo-600">Hub</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link 
            to="/explorar" 
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold text-sm transition-colors"
          >
            <Compass size={18} />
            <span className="hidden sm:inline">Explorar</span>
          </Link>
          
          <Link 
            to="/registrar" 
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:scale-105 transition-all shadow-xl"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Anunciar</span>
          </Link>

          {/* Adicionei o Perfil aqui para facilitar o acesso */}
          <Link 
            to="/perfil" 
            className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
          >
            <User size={18} />
          </Link>
        </div>
      </div>
    </nav>
  );
}