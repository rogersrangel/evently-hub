import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Save, ArrowLeft, Store, MapPin, DollarSign, AlignLeft, Camera, Loader2 } from 'lucide-react';

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    endereco: '',
    imagem_url: ''
  });

  useEffect(() => {
    fetchServico();
  }, [id]);

  async function fetchServico() {
    const { data, error } = await supabase.from('fornecedores').select('*').eq('id', id).single();
    if (error) navigate('/dashboard');
    else setFormData(data);
    setLoading(false);
  }

  // FUNÇÃO PARA UPLOAD DE IMAGEM
// ... imports (mesmos do código anterior)

  async function handleImageUpload(e) {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`; // Usando timestamp para evitar duplicados
      const filePath = `${fileName}`;

      // 1. Upload para o Storage
      const { data, error: uploadError } = await supabase.storage
        .from('imagens-servicos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Erro no Storage:", uploadError);
        throw new Error("Verifique se o bucket 'imagens-servicos' existe e é público.");
      }

      // 2. Pegar a URL pública corrigida
      const { data: { publicUrl } } = supabase.storage
        .from('imagens-servicos')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, imagem_url: publicUrl }));
      alert("Imagem enviada com sucesso!");

    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

// ... restante do componente handleUpdate (mesmo do anterior)

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from('fornecedores')
      .update({
        nome: formData.nome,
        descricao: formData.descricao,
        preco: formData.preco,
        endereco: formData.endereco,
        imagem_url: formData.imagem_url // Salva a nova URL
      })
      .eq('id', id);

    if (!error) {
      alert("Atualizado com sucesso!");
      navigate('/dashboard');
    }
    setSaving(false);
  }

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-indigo-600">CARREGANDO...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors">
            <ArrowLeft size={18} /> Voltar
          </button>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Configurações do Espaço</h1>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6 text-left">
          
          {/* SEÇÃO DE IMAGEM (NOVO) */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="relative group">
              <img 
                src={formData.imagem_url || 'https://via.placeholder.com/400x250'} 
                className="w-64 h-40 object-cover rounded-3xl shadow-lg transition-opacity group-hover:opacity-80"
              />
              <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-indigo-600 p-3 rounded-full text-white shadow-xl">
                  {uploading ? <Loader2 className="animate-spin" size={24} /> : <Camera size={24} />}
                </div>
                <input type="file" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clique na foto para alterar</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            {/* ... CAMPOS DE TEXTO (Nome, Preço, Endereço, Descrição) ... */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">Nome do Espaço</label>
              <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">Preço (R$)</label>
                <input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={formData.preco} onChange={(e) => setFormData({...formData, preco: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">Endereço</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={formData.endereco} onChange={(e) => setFormData({...formData, endereco: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">Descrição</label>
              <textarea rows="4" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold resize-none" value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving || uploading}
            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
          >
            {saving ? 'Salvando...' : <><Save size={20} /> Atualizar Anúncio</>}
          </button>
        </form>
      </div>
    </div>
  );
}