import { Link, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; // Importe o supabase
import { Sparkles, Compass, PlusCircle, User, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

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
        <div className="flex items-center gap-2 md:gap-3">
          
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

          {/* Divisor Visual */}
          <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block"></div>

          {/* Perfil - Link para /profile (ou /perfil, conforme sua rota) */}
          <NavLink
            to="/profile" 
            className={({ isActive }) => 
              `flex items-center gap-2 font-bold text-sm transition-all px-3 py-2 rounded-xl ${
                isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <User size={18} />
            <span className="hidden sm:inline">Minha Conta</span>
          </NavLink>

          {/* Botão Sair - Discreto e intuitivo ao lado do perfil */}
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Sair da conta"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}