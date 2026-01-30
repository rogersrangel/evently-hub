import { motion } from 'framer-motion';

export default function Explore() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-black mb-10">Espaços em Destaque</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-6 h-64 flex items-end">
           <span className="font-black text-xl italic text-slate-800 tracking-tight">Mansão Jardins</span>
        </div>
        {/* Repita o card conforme necessário */}
      </div>
    </div>
  );
}