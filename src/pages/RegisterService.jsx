import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Image as ImageIcon, UploadCloud, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function RegisterService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ nome: '', preco: '', localizacao: '', whatsapp: '', instagram_handle: '', imagem_url: '' });

  // FUNÇÃO DE UPLOAD REAL
  const handleUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `capas/${fileName}`;

      // Envia para o bucket que já criamos
      const { error: uploadError } = await supabase.storage
        .from('imagens-servicos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('imagens-servicos')
        .getPublicUrl(filePath);

      setForm({ ...form, imagem_url: publicUrl });
    } catch (error) {
      alert('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCadastrar = async (e) => {
    e.preventDefault();
    if (!form.imagem_url) return alert("Por favor, faça o upload de uma foto antes de publicar.");
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from('fornecedores')
        .insert([{
          nome: form.nome,
          preco: parseFloat(form.preco),
          localizacao: form.localizacao,
          whatsapp: form.whatsapp,
          instagram_handle: form.instagram_handle.replace('@', ''),
          imagem_url: form.imagem_url,
          user_id: user.id
        }]);

      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      alert("Erro ao cadastrar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase mb-6 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} /> Voltar ao Painel
        </button>

        <form onSubmit={handleCadastrar} className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 text-left">
          <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
            <h1 className="text-2xl font-black tracking-tighter uppercase">Novo Anúncio</h1>
            <ImageIcon size={24} className="opacity-50" />
          </div>

          <div className="p-8 space-y-6">
            {/* ÁREA DE UPLOAD */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Foto Principal</label>
              <div className="relative h-48 bg-slate-50 rounded-[2rem] border-4 border-dashed border-slate-100 flex items-center justify-center overflow-hidden group">
                {form.imagem_url ? (
                  <>
                    <img src={form.imagem_url} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full"><CheckCircle2 size={16}/></div>
                  </>
                ) : (
                  <div className="text-center">
                    <UploadCloud size={40} className="mx-auto text-slate-200 mb-2" />
                    <p className="text-xs font-bold text-slate-300 italic">Clique para selecionar</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
                {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="Nome do Espaço" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600" onChange={e => setForm({...form, nome: e.target.value})} />
              <input required type="number" placeholder="Valor p/ Dia (R$)" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600" onChange={e => setForm({...form, preco: e.target.value})} />
            </div>

            <input required placeholder="Localização (Cidade - Estado)" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600" onChange={e => setForm({...form, localizacao: e.target.value})} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-slate-50 rounded-[2rem]">
              <input required placeholder="WhatsApp" className="w-full p-4 bg-white rounded-xl font-bold border-none shadow-sm" onChange={e => setForm({...form, whatsapp: e.target.value})} />
              <input placeholder="Instagram" className="w-full p-4 bg-white rounded-xl font-bold border-none shadow-sm" onChange={e => setForm({...form, instagram_handle: e.target.value})} />
            </div>

            <button disabled={loading || uploading} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50">
              {loading ? 'CADASTRANDO...' : 'PUBLICAR ANÚNCIO'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}