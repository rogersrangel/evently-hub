import { Link, NavLink } from 'react-router-dom';
import { Sparkles, Compass, PlusCircle, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-md border border-white/40 px-6 py-3 flex justify-between items-center shadow-2xl rounded-[2rem]">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-200">
            <Sparkles className="text-white" size={20} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">
            Evently<span className="text-indigo-600">Hub</span>
          </span>
        </Link>

        {/* Links de Navegação */}
        <div className="flex items-center gap-2 md:gap-4">
          
          <NavLink
            to="/explorar"
            className={({ isActive }) => 
              `flex items-center gap-2 font-bold text-sm transition-colors px-3 py-2 rounded-xl ${
                isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`
            }
          >
            <Compass size={18} />
            <span className="hidden lg:inline">Explorar</span>
          </NavLink>

          {/* NOVO: Link para o Painel (Dashboard) */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) => 
              `flex items-center gap-2 font-bold text-sm transition-colors px-3 py-2 rounded-xl ${
                isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span className="hidden lg:inline">Painel</span>
          </NavLink>

          {/* Botão Anunciar */}
          <NavLink
            to="/registrar"
            className={({ isActive }) => 
              `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                isActive 
                ? 'bg-indigo-600 text-white scale-105' 
                : 'bg-slate-900 text-white hover:bg-indigo-600 hover:scale-105'
              }`
            }
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Anunciar</span>
          </NavLink>

          {/* Link Perfil (Fica ao lado do Painel) */}
          <NavLink
            to="/perfil"
            className={({ isActive }) => 
              `p-2.5 rounded-xl transition-all border ${
                isActive 
                ? 'bg-white border-indigo-200 text-indigo-600 shadow-sm' 
                : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'
              }`
            }
          >
            <User size={18} />
          </NavLink>
        </div>
      </div>
    </nav>
  );
}