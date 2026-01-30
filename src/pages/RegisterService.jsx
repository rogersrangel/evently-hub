import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Camera, Loader2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RegisterService() {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    nome: '', preco: '', localizacao: '', descricao: '',
    capacidade_max: '', periodo_aluguel: 'evento',
    comodidades: {
      piscina: false, churrasqueira: false, cozinha: false,
      estacionamento: false, ar_condicionado: false, wifi: false
    }
  });
  const navigate = useNavigate();

  const handleUpload = async (file, userId) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('imagens').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('imagens').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Logue para anunciar");

      let url = "";
      if (imageFile) url = await handleUpload(imageFile, user.id);

      const { error } = await supabase.from('fornecedores').insert([{
        ...form,
        preco: Number(form.preco),
        capacidade_max: Number(form.capacidade_max), // Convertendo para número
        imagem_url: url,
        user_id: user.id
      }]);

      if (error) throw error;
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#818cf8', '#ffffff']
      });
      setTimeout(() => navigate('/explorar'), 2000); navigate('/explorar');
    } catch (err) {
      alert("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pt-24 pb-20">
      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-8 bg-white rounded-[2.5rem] shadow-xl">
        <h1 className="text-4xl font-black tracking-tighter">Anunciar Espaço</h1>

        {/* Upload de Imagem */}
        <div className="relative h-64 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group hover:border-indigo-400 transition-colors">
          {imageFile ? (
            <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <div className="text-center">
              <Camera className="text-slate-300 mx-auto mb-2" size={48} />
              <p className="text-slate-400 font-bold text-sm">Capa do Anúncio</p>
            </div>
          )}
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setImageFile(e.target.files[0])} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-2">Nome do Local</label>
            <input required className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="Ex: Chácara Recanto" onChange={e => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-2">Preço (R$)</label>
            <input required type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="0.00" onChange={e => setForm({ ...form, preco: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-2">Capacidade Máxima</label>
            <input required type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="Qtd. de pessoas" onChange={e => setForm({ ...form, capacidade_max: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-2">Período</label>
            <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold appearance-none" onChange={e => setForm({ ...form, periodo_aluguel: e.target.value })}>
              <option value="evento">Por Evento</option>
              <option value="diaria">Diária</option>
              <option value="6_horas">Pacote 6 Horas</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 ml-2">O que o espaço oferece?</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.keys(form.comodidades).map((item) => (
              <label key={item} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${form.comodidades[item] ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-white'}`}>
                <input type="checkbox" className="hidden" checked={form.comodidades[item]} onChange={() => setForm({ ...form, comodidades: { ...form.comodidades, [item]: !form.comodidades[item] } })} />
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${form.comodidades[item] ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                  {form.comodidades[item] && <Check className="text-white" size={14} />}
                </div>
                <span className="text-xs font-black uppercase text-slate-600">{item.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <textarea required className="w-full p-4 bg-slate-50 rounded-2xl font-medium min-h-[120px]" placeholder="Descrição detalhada..." onChange={e => setForm({ ...form, descricao: e.target.value })} />

        <button disabled={loading} className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : 'Publicar Agora'}
        </button>
      </form>
    </div>
  );
}