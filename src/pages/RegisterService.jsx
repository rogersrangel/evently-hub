import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Image as ImageIcon, UploadCloud, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

// Funções de Formatação e Validação
const formatarTelefone = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");
  return value.substring(0, 15);
};

const formatarInstagram = (value) => {
  return value.replace(/[^a-zA-Z0-9_.]/g, '').substring(0, 30);
};

const validarEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validarTelefone = (telefone) => {
  const numeros = telefone.replace(/\D/g, '');
  return numeros.length >= 10 && numeros.length <= 11;
};

const validarPreco = (preco) => {
  return !isNaN(preco) && parseFloat(preco) > 0;
};

export default function RegisterService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ 
    nome: '', 
    preco: '', 
    localizacao: '', 
    endereco: '',
    descricao: '',
    capacidade_max: '',
    whatsapp: '', 
    instagram_handle: '', 
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
    setError('');

    // Validações
    if (!form.nome.trim()) {
      setError('Nome do espaço é obrigatório');
      return;
    }
    if (!form.localizacao.trim()) {
      setError('Localização é obrigatória');
      return;
    }
    if (!validarPreco(form.preco)) {
      setError('Preço deve ser maior que zero');
      return;
    }
    if (!validarTelefone(form.whatsapp)) {
      setError('WhatsApp deve ter 10 ou 11 dígitos');
      return;
    }
    if (!form.imagem_url) {
      setError('Foto é obrigatória');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from('fornecedores')
        .insert([{
          nome: form.nome.trim(),
          preco: parseFloat(form.preco),
          localizacao: form.localizacao.trim(),
          endereco: form.endereco.trim() || null,
          descricao: form.descricao.trim() || null,
          capacidade_max: form.capacidade_max ? parseInt(form.capacidade_max) : null,
          whatsapp: form.whatsapp.replace(/\D/g, ''),
          instagram_handle: formatarInstagram(form.instagram_handle),
          imagem_url: form.imagem_url,
          comodidades: form.comodidades,
          user_id: user.id
        }]);

      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      setError("Erro ao cadastrar: " + error.message);
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
            {/* MENSAGEM DE ERRO */}
            {error && (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                <AlertCircle className="text-red-600" size={20} />
                <p className="text-sm font-bold text-red-600">{error}</p>
              </motion.div>
            )}

            {/* ÁREA DE UPLOAD */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Foto Principal *</label>
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

            {/* INFORMAÇÕES BÁSICAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 block mb-2">Nome do Espaço *</label>
                <input 
                  required 
                  placeholder="Ex: Chácara Paraíso" 
                  value={form.nome}
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600" 
                  onChange={e => setForm({...form, nome: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 block mb-2">Valor por Dia (R$) *</label>
                <input 
                  required 
                  type="number" 
                  step="0.01"
                  min="0"
                  placeholder="0.00" 
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600" 
                  onChange={e => setForm({...form, preco: e.target.value})} 
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 block mb-2">Localização (Cidade - Estado) *</label>
              <input 
                required 
                placeholder="Ex: São Paulo - SP" 
                value={form.localizacao}
                className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600" 
                onChange={e => setForm({...form, localizacao: e.target.value})} 
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 block mb-2">Endereço Completo</label>
              <input 
                placeholder="Ex: Rua das Flores, 123" 
                value={form.endereco}
                className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600" 
                onChange={e => setForm({...form, endereco: e.target.value})} 
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 block mb-2">Descrição do Espaço</label>
              <textarea 
                placeholder="Descreva seu espaço, o que oferece, ambiente..."
                value={form.descricao}
                rows="4"
                className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600 resize-none" 
                onChange={e => setForm({...form, descricao: e.target.value})} 
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 block mb-2">Capacidade Máxima (pessoas)</label>
              <input 
                type="number"
                min="1"
                placeholder="Ex: 50" 
                value={form.capacidade_max}
                className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600" 
                onChange={e => setForm({...form, capacidade_max: e.target.value})} 
              />
            </div>

            {/* CONTATO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 block mb-2">WhatsApp *</label>
                <input 
                  required 
                  placeholder="(11) 99999-9999" 
                  value={form.whatsapp}
                  className="w-full p-4 bg-white rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600" 
                  onChange={e => setForm({...form, whatsapp: formatarTelefone(e.target.value)})} 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 block mb-2">Instagram</label>
                <input 
                  placeholder="seu_instagram" 
                  value={form.instagram_handle}
                  className="w-full p-4 bg-white rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600" 
                  onChange={e => setForm({...form, instagram_handle: formatarInstagram(e.target.value)})} 
                />
              </div>
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
                      checked={form.comodidades[item.key]}
                      onChange={(e) => setForm({...form, comodidades: {...form.comodidades, [item.key]: e.target.checked}})}
                      className="w-5 h-5 accent-indigo-600 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              disabled={loading || uploading} 
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={20} className="animate-spin" /> CADASTRANDO...</> : <><Plus size={20} /> PUBLICAR ANÚNCIO</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}