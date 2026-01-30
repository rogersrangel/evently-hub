import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Search, Map } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-[12rem] font-black text-indigo-600 leading-none tracking-tighter opacity-20 absolute left-1/2 -translate-x-1/2 -top-10 select-none">
            404
          </h1>
          <div className="relative">
             <Map size={120} className="mx-auto text-slate-900 mb-6 drop-shadow-2xl" />
          </div>
        </motion.div>

        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Espaço não encontrado.</h2>
        <p className="text-slate-500 font-medium mb-12 text-lg">
          Parece que este local ainda não foi mapeado ou o evento já mudou de endereço.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100"
          >
            <Home size={20} /> Voltar ao Início
          </Link>
          <Link 
            to="/explorar" 
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all"
          >
            <Search size={20} /> Ver outros locais
          </Link>
        </div>
      </div>
    </div>
  );
}