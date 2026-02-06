// src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { User, Mail, Phone, MapPin, Calendar, Save, Camera, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPhone, validatePhone, formatCPF, validateCPF, formatCEP } from '../utils/formatters';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [userData, setUserData] = useState({
    email: '',
    created_at: '',
  });

  const [profileData, setProfileData] = useState({
    nome: '',
    sobrenome: '',
    telefone: '',
    cpf: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    avatar_url: '',
    bio: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      // Pega dados do usuário autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate('/login');
        return;
      }

      // Preenche dados do usuário
      setUserData({
        email: user.email,
        created_at: new Date(user.created_at).toLocaleDateString('pt-BR')
      });

      // Busca perfil no banco
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profileError && profile) {

        // Se o banco tem nome completo, separa em nome/sobrenome
        const nomeCompleto = profile.nome || '';
        const partesNome = nomeCompleto.split(' ');

        setProfileData({
          nome: partesNome[0] || '',
          sobrenome: partesNome.slice(1).join(' ') || profile.sobrenome || '',
          telefone: profile.telefone || '',
          cpf: profile.cpf || '',
          endereco: profile.endereco || '',
          cidade: profile.cidade || '',
          estado: profile.estado || '',
          cep: profile.cep || '',
          avatar_url: profile.avatar_url || '',
          bio: profile.bio || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar dados' });
    } finally {
      setLoading(false);
    }
  }

  // Função para upload de avatar
  async function handleAvatarUpload(e) {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      // Verifica tamanho (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Imagem muito grande. Máximo 2MB.' });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar_${Date.now()}.${fileExt}`;

      // Upload para storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Pega URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Atualiza estado
      setProfileData(prev => ({ ...prev, avatar_url: publicUrl }));
      setMessage({ type: 'success', text: 'Avatar atualizado!' });

    } catch (error) {
      console.error('Erro upload avatar:', error);
      setMessage({ type: 'error', text: 'Erro ao enviar imagem' });
    } finally {
      setUploading(false);
    }
  }

  // Função para salvar perfil
  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Validações
      if (profileData.telefone && !validatePhone(profileData.telefone)) {
        throw new Error('Telefone inválido. Digite DDD + número.');
      }

      if (profileData.cpf && !validateCPF(profileData.cpf)) {
        throw new Error('CPF inválido. Digite 11 números.');
      }

      // Pega usuário atual
      const { data: { user } } = await supabase.auth.getUser();

      // Prepara dados (remove máscaras para salvar)
      // Prepara dados (remove máscaras para salvar)
      const dataToSave = {
        nome: `${profileData.nome.trim()} ${profileData.sobrenome.trim()}`.trim(),
        sobrenome: profileData.sobrenome.trim(),
        telefone: profileData.telefone.replace(/\D/g, ''),
        cpf: profileData.cpf.replace(/\D/g, ''),
        endereco: profileData.endereco.trim(),
        cidade: profileData.cidade.trim(),
        estado: profileData.estado.toUpperCase(),
        cep: profileData.cep.replace(/\D/g, ''),
        avatar_url: profileData.avatar_url,
        bio: profileData.bio.trim(),
        updated_at: new Date().toISOString()
      };

      // Salva no banco
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...dataToSave
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });

      // Atualiza nome no auth do Supabase (opcional)
      if (profileData.nome) {
        await supabase.auth.updateUser({
          data: { nome: profileData.nome }
        });
      }

    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setMessage({ type: 'error', text: error.message || 'Erro ao salvar' });
    } finally {
      setSaving(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-600 mx-auto" size={48} />
          <p className="mt-4 text-lg font-bold text-slate-700">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Meu Perfil</h1>
          <p className="text-slate-500">Gerencie suas informações pessoais</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna 1: Avatar e Info Básica */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {profileData.avatar_url ? (
                      <img
                        src={profileData.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={48} className="text-indigo-500" />
                    )}
                  </div>

                  <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                    {uploading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Camera size={20} />
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {`${profileData.nome} ${profileData.sobrenome}`.trim() || 'Sem nome'}

                </h2>
                <p className="text-slate-500 text-sm">{userData.email}</p>

                <div className="mt-4 text-sm text-slate-400">
                  <Calendar size={14} className="inline mr-1" />
                  Membro desde {userData.created_at}
                </div>
              </div>

              {/* Info rápida */}
              <div className="space-y-3">
                <div className="flex items-center text-slate-600">
                  <Mail size={16} className="mr-3 text-slate-400" />
                  <span className="text-sm">{userData.email}</span>
                </div>

                {profileData.telefone && (
                  <div className="flex items-center text-slate-600">
                    <Phone size={16} className="mr-3 text-slate-400" />
                    <span className="text-sm">{formatPhone(profileData.telefone)}</span>
                  </div>
                )}

                {profileData.cidade && (
                  <div className="flex items-center text-slate-600">
                    <MapPin size={16} className="mr-3 text-slate-400" />
                    <span className="text-sm">{profileData.cidade}, {profileData.estado}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Coluna 2 e 3: Formulário */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Mensagens */}
              {message.text && (
                <div className={`p-4 rounded-xl ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                  {message.text}
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Informações Pessoais</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome e Sobrenome */}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nome Completo *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          required
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                          value={profileData.nome}
                          onChange={(e) => setProfileData({ ...profileData, nome: e.target.value })}
                          placeholder="Seu nome"
                        />
                        <p className="text-xs text-slate-400 mt-1 ml-1">Nome</p>
                      </div>

                      <div>
                        <input
                          type="text"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                          value={profileData.sobrenome}
                          onChange={(e) => setProfileData({ ...profileData, sobrenome: e.target.value })}
                          placeholder="Seu sobrenome"
                        />
                        <p className="text-xs text-slate-400 mt-1 ml-1">Sobrenome (opcional)</p>
                      </div>
                    </div>
                  </div>

                  {/* CPF */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      CPF
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      value={profileData.cpf}
                      onChange={(e) => setProfileData({ ...profileData, cpf: formatCPF(e.target.value) })}
                      placeholder="999.999.999-99"
                      maxLength={14}
                    />
                  </div>

                  {/* Telefone */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      value={profileData.telefone}
                      onChange={(e) => setProfileData({ ...profileData, telefone: formatPhone(e.target.value) })}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                  </div>

                  {/* Email (readonly) */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      readOnly
                      className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500"
                      value={userData.email}
                    />
                    <p className="text-xs text-slate-400 mt-1">Para alterar o e-mail, entre em contato</p>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Endereço</h3>

                <div className="space-y-6">
                  {/* CEP */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      CEP
                    </label>
                    <input
                      type="text"
                      className="w-full md:w-48 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      value={profileData.cep}
                      onChange={(e) => setProfileData({ ...profileData, cep: formatCEP(e.target.value) })}
                      placeholder="99999-999"
                      maxLength={9}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Estado */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Estado
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        value={profileData.estado}
                        onChange={(e) => setProfileData({ ...profileData, estado: e.target.value.toUpperCase() })}
                        placeholder="SP"
                        maxLength={2}
                      />
                    </div>

                    {/* Cidade */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        value={profileData.cidade}
                        onChange={(e) => setProfileData({ ...profileData, cidade: e.target.value })}
                        placeholder="Sua cidade"
                      />
                    </div>
                  </div>

                  {/* Endereço Completo */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Endereço Completo
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      value={profileData.endereco}
                      onChange={(e) => setProfileData({ ...profileData, endereco: e.target.value })}
                      placeholder="Rua, número, complemento"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Sobre Você</h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Bio (opcional)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Conte um pouco sobre você..."
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-slate-400 mt-1">
                    {profileData.bio.length}/500 caracteres
                  </div>
                </div>
              </div>

              {/* Botão Salvar */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}