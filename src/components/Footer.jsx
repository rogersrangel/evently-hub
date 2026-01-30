import { Link } from 'react-router-dom';
import { Sparkles, Instagram, Linkedin, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Coluna 1: Logo e Slogan */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-slate-900 p-1.5 rounded-lg">
                <Sparkles className="text-white" size={16} />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter">
                Evently<span className="text-indigo-600">Hub</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Transformando a forma como você encontra e reserva espaços para eventos em 2026.
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Plataforma</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link to="/explorar" className="hover:text-indigo-600 transition-colors">Explorar Espaços</Link></li>
              <li><Link to="/registrar" className="hover:text-indigo-600 transition-colors">Anunciar Local</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Meu Painel</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Suporte */}
          <div>
            <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Suporte</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li className="hover:text-indigo-600 cursor-pointer">Termos de Uso</li>
              <li className="hover:text-indigo-600 cursor-pointer">Privacidade</li>
              <li className="hover:text-indigo-600 cursor-pointer">Ajuda & FAQ</li>
            </ul>
          </div>

          {/* Coluna 4: Social */}
          <div>
            <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Redes Sociais</h4>
            <div className="flex gap-4">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                <Instagram size={20} />
              </div>
              <div className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                <Linkedin size={20} />
              </div>
              <div className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                <Github size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Direitos Autorais */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            © 2026 EventlyHub — Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
            <Mail size={14} /> suporte@eventlyhub.com
          </div>
        </div>
      </div>
    </footer>
  );
}