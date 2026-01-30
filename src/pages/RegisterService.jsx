// src/pages/RegisterService.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Camera } from 'lucide-react';

export default function RegisterService() {
  const [form, setForm] = useState({ nome: '', preco: '', localizacao: '', descricao: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    // Link de imagem aleatória para o site não ficar vazio
    const randomImage = `https://loremflickr.com/800/600/mansion,party?lock=${Math.floor(Math.random() * 1000)}`;

    const { error } = await supabase
      .from('fornecedores')
      .insert([{ 
        ...form, 
        preco: Number(form.preco), 
        imagem_url: randomImage,
        user_id: user.id 
      }]);

    if (!error) navigate('/explorar');
    else alert(error.message);
  };

  return (
    <div className="max-w-2xl mx-auto py-20 px-6">
      <div className="glass-card p-10">
        <h1 className="text-3xl font-black mb-8">Novo Anúncio</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input className="w-full p-4 bg-slate-50 rounded-2xl" placeholder="Nome do Espaço" onChange={e => setForm({...form, nome: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" className="p-4 bg-slate-50 rounded-2xl" placeholder="Preço" onChange={e => setForm({...form, preco: e.target.value})} required />
            <input className="p-4 bg-slate-50 rounded-2xl" placeholder="Localização" onChange={e => setForm({...form, localizacao: e.target.value})} required />
          </div>
          <textarea className="w-full p-4 bg-slate-50 rounded-2xl" placeholder="Descrição" onChange={e => setForm({...form, descricao: e.target.value})} required />
          <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black">Publicar Agora</button>
        </form>
      </div>
    </div>
  );
}