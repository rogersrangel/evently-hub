import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Camera, Loader2 } from 'lucide-react';

export default function RegisterService() {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({ nome: '', preco: '', localizacao: '', descricao: '' });
  const navigate = useNavigate();

  const handleUpload = async (file, userId) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('imagens')
      .upload(filePath, file);

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
        imagem_url: url,
        user_id: user.id 
      }]);

      if (error) throw error;
      alert("🎉 Sucesso! Seu espaço já está disponível para o mundo.");
      navigate('/explorar');
    } catch (err) {
      alert("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pt-24">
      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
        <h1 className="text-3xl font-black">Anunciar Espaço</h1>
        
        {/* BOTÃO DE UPLOAD VISUAL */}
        <div className="relative h-48 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden">
          {imageFile ? (
            <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover" />
          ) : (
            <Camera className="text-slate-400" size={40} />
          )}
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <input required className="w-full p-4 bg-slate-50 rounded-2xl" placeholder="Nome do Local" onChange={e => setForm({...form, nome: e.target.value})} />
        <input required type="number" className="w-full p-4 bg-slate-50 rounded-2xl" placeholder="Preço (R$)" onChange={e => setForm({...form, preco: e.target.value})} />
        <input required className="w-full p-4 bg-slate-50 rounded-2xl" placeholder="Localização" onChange={e => setForm({...form, localizacao: e.target.value})} />
        <textarea required className="w-full p-4 bg-slate-50 rounded-2xl" placeholder="Descrição" onChange={e => setForm({...form, descricao: e.target.value})} />
        
        <button disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-lg">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Publicar Agora'}
        </button>
      </form>
    </div>
  );
}