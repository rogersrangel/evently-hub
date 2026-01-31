import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Save, ArrowLeft, Loader2, Camera, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const formatarTelefone = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");
  return value.substring(0, 15);
};

const validarPreco = (preco) => {
  return !isNaN(preco) && parseFloat(preco) > 0;
};

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    endereco: '',
    capacidade_max: '',
    whatsapp: '',
    imagem_url: '',
    comodidades: {
      piscina: false,
      churrasqueira: false,
      ar_condicionado: false,
      wifi: false,
      cozinha: false,
      estacionamento: false
    }
  });

  useEffect(() => {
    fetchServico();
  }, [id]);

  async function fetchServico() {
    const { data, error } = await supabase.from('fornecedores').select('*').eq('id', id).single();
    if (error) {
      setError('Espaço não encontrado');
      navigate('/dashboard');
    } else {
      setFormData(data);
    }
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
    setError('');

    // Validações
    if (!formData.nome.trim()) {
      setError('Nome do espaço é obrigatório');
      return;
    }
    if (!validarPreco(formData.preco)) {
      setError('Preço deve ser maior que zero');
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('fornecedores')
      .update({
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim() || null,
        preco: parseFloat(formData.preco),
        endereco: formData.endereco.trim() || null,
        capacidade_max: formData.capacidade_max ? parseInt(formData.capacidade_max) : null,
        whatsapp: formData.whatsapp ? formData.whatsapp.replace(/\D/g, '') : null,
        imagem_url: formData.imagem_url,
        comodidades: formData.comodidades,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (!error) {
      navigate('/dashboard');
    } else {
      setError('Erro ao atualizar: ' + error.message);
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
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Configurar Espaço</h1>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6 text-left">
          
          {/* MENSAGEM DE ERRO */}
          {error && (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-sm font-bold text-red-600">{error}</p>
            </motion.div>
          )}

          {/* SEÇÃO DE IMAGEM */}
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
            {/* Nome */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">Nome do Espaço *</label>
              <input 
                type="text" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-600" 
                value={formData.nome} 
                onChange={(e) => setFormData({...formData, nome: e.target.value})} 
              />
            </div>

            {/* Preço e Capacidade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">Preço (R$) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-600" 
                  value={formData.preco} 
                  onChange={(e) => setFormData({...formData, preco: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">Capacidade Máxima (pessoas)</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-600" 
                  value={formData.capacidade_max || ''} 
                  onChange={(e) => setFormData({...formData, capacidade_max: e.target.value})} 
                />
              </div>
            </div>

            {/* Endereço */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">Endereço Completo</label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-600" 
                value={formData.endereco || ''} 
                onChange={(e) => setFormData({...formData, endereco: e.target.value})} 
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">WhatsApp</label>
              <input 
                type="text" 
                placeholder="(11) 99999-9999"
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-600" 
                value={formData.whatsapp || ''} 
                onChange={(e) => setFormData({...formData, whatsapp: formatarTelefone(e.target.value)})} 
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block px-1">Descrição</label>
              <textarea 
                rows="4" 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold resize-none outline-none focus:ring-2 focus:ring-indigo-600" 
                value={formData.descricao || ''} 
                onChange={(e) => setFormData({...formData, descricao: e.target.value})} 
              />
            </div>

            {/* COMODIDADES */}
            <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100">
              <label className="text-[10px] font-black text-indigo-600 uppercase ml-2 block mb-4">Comodidades Disponíveis</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: 'piscina', label: '🏊 Piscina' },
                  { key: 'churrasqueira', label: '🔥 Churrasqueira' },
                  { key: 'ar_condicionado', label: '❄️ Ar Condicionado' },
                  { key: 'wifi', label: '📡 Wi-Fi' },
                  { key: 'cozinha', label: '👨‍🍳 Cozinha' },
                  { key: 'estacionamento', label: '🅿️ Estacionamento' }
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-xl hover:bg-indigo-50 transition-colors border border-indigo-100">
                    <input 
                      type="checkbox" 
                      checked={formData.comodidades?.[item.key] || false}
                      onChange={(e) => setFormData({...formData, comodidades: {...(formData.comodidades || {}), [item.key]: e.target.checked}})}
                      className="w-5 h-5 accent-indigo-600 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving || uploading}
            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saving ? <><Loader2 className="animate-spin" size={20} /> Salvando...</> : <><Save size={20} /> Atualizar Anúncio</>}
          </button>
        </form>
      </div>
    </div>
  );
}