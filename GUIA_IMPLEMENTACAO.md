# 🚀 Guia de Implementação - EventlyHub

**Última Atualização:** 31 de janeiro de 2026

---

## 📋 Sumário Executivo

Este documento fornece um roadmap completo para garantir que o **EventlyHub** funcione perfeitamente do frontend ao backend, com todas as integrações do Supabase configuradas corretamente.

---

## 🔧 Configuração Inicial

### 1. **Preparar Variáveis de Ambiente**

Crie o arquivo `.env.local` na raiz do projeto:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

Onde encontrar:
1. Acesse [supabase.com](https://supabase.com)
2. Acesse seu projeto → Settings → API
3. Copie `Project URL` e `anon public`

---

## 🗄️ Configuração do Banco de Dados

### **Passo 1: Criar Storage Bucket para Imagens**

1. No Supabase Dashboard → Storage
2. Click em "New Bucket"
3. Nome: `imagens-servicos`
4. Marque como **Public**
5. Clique "Create Bucket"

### **Passo 2: Executar SQL para Criar Tabelas**

Vá para SQL Editor no Supabase e execute o script abaixo:

```sql
-- ===================================
-- CRIAR TABELA PROFILES
-- ===================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  nome varchar,
  sobrenome varchar,
  email varchar,
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ===================================
-- CRIAR TABELA FORNECEDORES
-- ===================================
CREATE TABLE IF NOT EXISTS public.fornecedores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome varchar NOT NULL,
  preco numeric(10, 2) NOT NULL,
  localizacao varchar,
  endereco varchar,
  whatsapp varchar,
  instagram_handle varchar,
  imagem_url varchar,
  descricao text,
  capacidade_max integer,
  comodidades jsonb DEFAULT '{"piscina": false, "churrasqueira": false, "ar_condicionado": false, "wifi": false, "cozinha": false, "estacionamento": false}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_fornecedores_user_id ON public.fornecedores(user_id);
CREATE INDEX IF NOT EXISTS idx_fornecedores_created_at ON public.fornecedores(created_at);

ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;

-- ===================================
-- CRIAR TABELA AGENDAMENTOS
-- ===================================
CREATE TABLE IF NOT EXISTS public.agendamentos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  fornecedor_id uuid NOT NULL REFERENCES public.fornecedores(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  cliente_nome varchar NOT NULL,
  cliente_zap varchar,
  cliente_telefone varchar,
  data_evento date NOT NULL,
  valor_total numeric(10, 2),
  status varchar DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
  notas text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_agendamentos_fornecedor_id ON public.agendamentos(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_user_id ON public.agendamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data_evento ON public.agendamentos(data_evento);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON public.agendamentos(status);

ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
```

### **Passo 3: Configurar Row Level Security (RLS)**

Execute no SQL Editor:

```sql
-- ===================================
-- RLS POLICIES - FORNECEDORES
-- ===================================

-- Todos podem ver fornecedores
CREATE POLICY "fornecedores_select_public" ON public.fornecedores
FOR SELECT USING (true);

-- Apenas o proprietário pode editar
CREATE POLICY "fornecedores_update_owner" ON public.fornecedores
FOR UPDATE USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Apenas o proprietário pode deletar
CREATE POLICY "fornecedores_delete_owner" ON public.fornecedores
FOR DELETE USING (auth.uid() = user_id);

-- Usuário autenticado pode inserir (cria para si mesmo)
CREATE POLICY "fornecedores_insert_auth" ON public.fornecedores
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===================================
-- RLS POLICIES - AGENDAMENTOS
-- ===================================

-- Todos podem ver agendamentos
CREATE POLICY "agendamentos_select_public" ON public.agendamentos
FOR SELECT USING (true);

-- Fornecedor pode editar seus agendamentos
CREATE POLICY "agendamentos_update_provider" ON public.agendamentos
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.fornecedores
    WHERE fornecedores.id = agendamentos.fornecedor_id
    AND fornecedores.user_id = auth.uid()
  )
);

-- Qualquer pessoa pode criar agendamento
CREATE POLICY "agendamentos_insert_public" ON public.agendamentos
FOR INSERT WITH CHECK (true);

-- ===================================
-- RLS POLICIES - PROFILES
-- ===================================

-- Usuário vê apenas seu perfil
CREATE POLICY "profiles_select_own" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Usuário edita apenas seu perfil
CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Usuário cria seu próprio perfil
CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);
```

---

## 🔐 Configurar Autenticação

### **Email/Password Auth (Já está configurado no Supabase)**

No Supabase Dashboard → Authentication → Providers:
- ✅ Email deve estar habilitado por padrão
- ✅ Senha mínima: 6 caracteres (configurável)

---

## 🎯 Checklist de Completude do Frontend

### **Autenticação ✅**
- [x] Auth.jsx com login/signup
- [x] Redirecionar logado para /dashboard
- [x] Logout funcional
- [ ] Verificação de email (opcional)
- [ ] Reset de senha (adicionar feature)

### **Página Inicial ✅**
- [x] Home.jsx com hero section
- [x] Links de navegação
- [x] Responsividade mobile

### **Explorador de Espaços ✅**
- [x] Explore.jsx com listagem
- [x] Busca por nome/localização
- [x] Filtros por comodidades
- [ ] Ordenação (mais novo, mais barato, etc)
- [ ] Paginação (atualmente carrega tudo)

### **Detalhes do Espaço ✅**
- [x] Details.jsx com informações completas
- [x] Imagem em destaque
- [x] Comodidades listadas
- [x] Links para redes sociais
- [ ] Sistema de comentários/reviews
- [ ] Galeria de fotos múltiplas

### **Dashboard do Fornecedor ✅**
- [x] Dashboard.jsx como página principal
- [x] Exibir dados do fornecedor (se existente)
- [x] Botão de criar anúncio
- [x] Componentes SaaS integrados:
  - [x] CalendarView
  - [x] FinanceiroStats
  - [x] UserSettings
  - [x] AddAgendamentoModal
- [x] Lista de reservas do cliente
- [ ] Ações em massa (editar status)
- [ ] Exportar relatórios

### **Cadastro/Edição de Espaço ✅**
- [x] RegisterService.jsx funcional
- [x] Upload de imagem
- [x] Campos: nome, preço, localização, contatos
- [x] EditService.jsx com atualização
- [x] Upload de nova imagem
- [ ] Comodidades editáveis (FALTA)
- [ ] Múltiplas imagens (galeria)

### **Calendário de Agendamentos ✅**
- [x] CalendarView com navegação de meses
- [x] Visualização de agendamentos por dia
- [x] Modal para novo agendamento
- [x] Status visual (cores diferentes)
- [ ] Arrastar agendamento entre datas
- [ ] Sincronização com Google Calendar

### **Perfil do Usuário ✅**
- [x] Profile.jsx editar dados
- [x] Alterar senha
- [x] Email em apenas leitura
- [ ] Foto de perfil
- [ ] Histórico de atividades

### **Responsividade ✅**
- [x] Mobile-first design
- [x] Tailwind CSS grid responsivo
- [x] Todos os componentes testados em mobile

### **Animações & UX ✅**
- [x] Framer Motion em transições
- [x] Loading states
- [x] Mensagens de sucesso/erro
- [ ] Toast notifications (melhorar)
- [ ] Confirmação de ações destrutivas

---

## 🔴 Problemas Críticos a Resolver

### **1. Comodidades Não Editáveis** 🚨
**Status:** ❌ NÃO IMPLEMENTADO  
**Impacto:** Alto  
**Solução:**

Adicione este código em `EditService.jsx` depois da linha do campo descrição:

```jsx
// Dentro do estado do componente (após descricao)
const [comodidades, setComodidades] = useState(formData.comodidades || {
  piscina: false,
  churrasqueira: false,
  ar_condicionado: false,
  wifi: false,
  cozinha: false,
  estacionamento: false
});

// Adicionar após o textarea de descrição:
<div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
  <h3 className="text-sm font-black text-slate-900 mb-6 uppercase">Comodidades Disponíveis</h3>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {Object.keys(comodidades).map(key => (
      <label key={key} className="flex items-center gap-3 p-4 bg-white rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
        <input 
          type="checkbox" 
          checked={comodidades[key] || false}
          onChange={(e) => setComodidades({...comodidades, [key]: e.target.checked})}
          className="w-4 h-4 rounded accent-indigo-600"
        />
        <span className="font-bold text-slate-700 capitalize">{key.replace('_', ' ')}</span>
      </label>
    ))}
  </div>
</div>

// Atualizar handleUpdate para incluir comodidades:
const { error } = await supabase
  .from('fornecedores')
  .update({
    nome: formData.nome,
    descricao: formData.descricao,
    preco: formData.preco,
    endereco: formData.endereco,
    imagem_url: formData.imagem_url,
    comodidades: comodidades  // ADICIONAR ESTA LINHA
  })
  .eq('id', id);
```

### **2. Falta de Verificação de Propriedade** 🚨
**Status:** ❌ VULNERÁVEL  
**Impacto:** Crítico (segurança)  
**Solução:**

Em `EditService.jsx`, adicione verificação após `fetchServico()`:

```jsx
async function fetchServico() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    navigate('/login');
    return;
  }

  const { data, error } = await supabase
    .from('fornecedores')
    .select('*')
    .eq('id', id)
    .single();

  // VERIFICAÇÃO DE PROPRIEDADE
  if (error || !data) {
    navigate('/dashboard');
    return;
  }

  if (data.user_id !== user.id) {
    // Usuário não é o proprietário
    navigate('/dashboard');
    return;
  }

  setFormData(data);
  setLoading(false);
}
```

### **3. Dashboard Não Protegido** 🚨
**Status:** ⚠️ PARCIALMENTE IMPLEMENTADO  
**Impacto:** Alto  
**Solução:**

Criar arquivo `src/components/ProtectedRoute.jsx`:

```jsx
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setAuthenticated(!!user);
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) {
    return <div className="h-screen flex items-center justify-center font-black animate-pulse">Verificando acesso...</div>;
  }

  return authenticated ? children : <Navigate to="/login" replace />;
}
```

Depois, em `App.jsx`, altere:

```jsx
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/registrar" element={<ProtectedRoute><RegisterService /></ProtectedRoute>} />
<Route path="/editar/:id" element={<ProtectedRoute><EditService /></ProtectedRoute>} />
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
```

### **4. user_id Não Preenchido em Agendamentos** ⚠️
**Status:** ❌ BUG  
**Impacto:** Médio  
**Solução:**

Em `AddAgendamentoModal.jsx`, após `e.preventDefault()`:

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  // OBTER USER_ID DO USUÁRIO LOGADO
  const { data: { user } } = await supabase.auth.getUser();
  
  const valorNumerico = Number(form.valor_total.replace(/\D/g, '')) / 100;

  const { error } = await supabase.from('agendamentos').insert([{
    ...form,
    fornecedor_id: fornecedorId,
    data_evento: selectedDate,
    valor_total: valorNumerico,
    user_id: user?.id  // ADICIONAR ISTO
  }]);

  if (!error) {
    onRefresh();
    onClose();
  } else {
    alert("Erro ao agendar: " + error.message);
  }
  setLoading(false);
};
```

---

## 📊 Queries SQL Úteis para Testes

Copie e cole no SQL Editor do Supabase:

```sql
-- ===================================
-- 1. LISTAR TODOS OS FORNECEDORES COM STATS
-- ===================================
SELECT 
  f.id,
  f.nome,
  f.localizacao,
  f.preco,
  f.user_id,
  COUNT(a.id) as total_agendamentos,
  COUNT(CASE WHEN a.status = 'confirmado' THEN 1 END) as agendamentos_confirmados,
  COALESCE(SUM(CASE WHEN a.status = 'confirmado' THEN a.valor_total ELSE 0 END), 0) as faturamento_total,
  f.created_at
FROM fornecedores f
LEFT JOIN agendamentos a ON f.id = a.fornecedor_id
GROUP BY f.id, f.nome, f.localizacao, f.preco, f.user_id, f.created_at
ORDER BY total_agendamentos DESC;

-- ===================================
-- 2. VER AGENDAMENTOS DE UM FORNECEDOR ESPECÍFICO
-- ===================================
SELECT *
FROM agendamentos
WHERE fornecedor_id = 'id-do-fornecedor-aqui'
ORDER BY data_evento DESC;

-- ===================================
-- 3. VER FATURAMENTO MENSAL
-- ===================================
SELECT 
  DATE_TRUNC('month', data_evento)::date as mes,
  fornecedor_id,
  COUNT(*) as total_eventos,
  SUM(CASE WHEN status = 'confirmado' THEN valor_total ELSE 0 END) as faturamento
FROM agendamentos
WHERE status = 'confirmado'
GROUP BY DATE_TRUNC('month', data_evento), fornecedor_id
ORDER BY mes DESC;

-- ===================================
-- 4. USUÁRIOS COM MAIS AGENDAMENTOS
-- ===================================
SELECT 
  u.email,
  COUNT(a.id) as total_reservas_feitas,
  SUM(a.valor_total) as total_gasto
FROM auth.users u
LEFT JOIN agendamentos a ON u.id = a.user_id
GROUP BY u.id, u.email
ORDER BY total_reservas_feitas DESC;

-- ===================================
-- 5. AGENDAMENTOS PENDENTES (SEM CONFIRMAR)
-- ===================================
SELECT *
FROM agendamentos
WHERE status = 'pendente'
ORDER BY data_evento ASC;

-- ===================================
-- 6. DELETAR TODOS OS DADOS (CUIDADO!)
-- ===================================
-- DELETE FROM agendamentos;
-- DELETE FROM fornecedores;
-- DELETE FROM profiles;
-- DELETE FROM auth.users;
```

---

## 🧪 Testes Recomendados

### **Teste 1: Fluxo Completo de Usuário**
1. Criar conta em `/login`
2. Visualizar dashboard vazio
3. Ir para `/registrar` e criar um espaço
4. Editar o espaço em `/editar/:id`
5. Ver espaço em `/explorar`
6. Ver detalhes em `/detalhes/:id`
7. Verificar agendamentos em dashboard

### **Teste 2: Agendamento**
1. Um usuário A cria um espaço
2. Um usuário B acessa Explorar
3. Usuário B clica em um espaço
4. Usuário B cria um agendamento via modal
5. Usuário A vê o agendamento no calendário
6. Usuário A confirma o agendamento

### **Teste 3: Segurança**
1. Logado como Usuário A, tentar editar espaço de Usuário B
2. Logado como Usuário A, tentar acessar `/dashboard` sem estar logado
3. Verificar que images upload funciona apenas do bucket público

### **Teste 4: Performance**
1. Carregar página com 100+ fornecedores
2. Filtrar e buscar
3. Abrir calendário com 50+ agendamentos

---

## 📈 Próximas Features

### **Priority 1 (Crítico)**
- [ ] Comodidades editáveis
- [ ] RLS policies ativas
- [ ] ProtectedRoute implementado
- [ ] Verificação de propriedade em edições

### **Priority 2 (Alto)**
- [ ] Sistema de avaliações (reviews)
- [ ] Notificações por email
- [ ] Foto de perfil do usuário
- [ ] Exportação de relatórios (PDF)

### **Priority 3 (Médio)**
- [ ] Integração com Stripe (pagamentos)
- [ ] Chat entre cliente e fornecedor
- [ ] Google Calendar sync
- [ ] SMS notifications

### **Priority 4 (Baixo)**
- [ ] Dark mode
- [ ] Multilíngue
- [ ] App mobile native

---

## 🚀 Deploy

### **Preparação para Produção**

```bash
# 1. Instalar dependências
npm install

# 2. Build do projeto
npm run build

# 3. Preview do build
npm run preview

# 4. Deploy (exemplo com Vercel)
npm install -g vercel
vercel
```

### **Variáveis de Ambiente em Produção**
No seu host (Vercel, Netlify, etc), configure:
```
VITE_SUPABASE_URL = https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY = sua-chave-anonima
```

---

## 📞 Suporte e Troubleshooting

### **Erro: "Supabase não configurado"**
- Verifique `.env.local`
- Confirme que as chaves estão corretas
- Reinicie o servidor (`npm run dev`)

### **Erro: "user_id not found"**
- Verifique se o usuário está autenticado
- Confirme que `auth.getUser()` retorna um usuário válido

### **Imagens não carregam**
- Verifique se bucket `imagens-servicos` é público
- Confirme que a URL é válida
- Verificar CORS do Supabase

### **Agendamentos não salvam**
- Verificar RLS policies
- Confirmar que `fornecedor_id` é válido
- Verificar se há erros no console do navegador

---

## ✅ Checklist Final

- [ ] `.env.local` configurado
- [ ] Bucket `imagens-servicos` criado e público
- [ ] Tabelas criadas (profiles, fornecedores, agendamentos)
- [ ] RLS policies aplicadas
- [ ] ProtectedRoute implementado
- [ ] Comodidades editáveis adicionadas
- [ ] Verificação de propriedade em EditService
- [ ] user_id preenchido em agendamentos
- [ ] Testes básicos passando
- [ ] Deploy configurado

---

**Desenvolvido com ❤️ para EventlyHub**

