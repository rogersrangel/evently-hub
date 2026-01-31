# 📚 Referência Rápida de Componentes

**EventlyHub - Guia de Componentes**  
**Atualizado em:** 31 de janeiro de 2026

---

## 🗂️ Índice

1. [Páginas Principais](#páginas-principais)
2. [Componentes SaaS](#componentes-saas)
3. [Componentes Comuns](#componentes-comuns)
4. [Hooks Customizados](#hooks-customizados)
5. [Utilitários](#utilitários)

---

## 📄 Páginas Principais

### **Auth.jsx** - Autenticação
**Caminho:** `/src/pages/Auth.jsx`  
**Rotas:** `/login`

**Props:** Nenhuma

**Estado:**
```javascript
loading      // boolean - carregando
isSignUp     // boolean - toggle signup/login
email        // string
password     // string
message      // { type: 'error'|'success', text: string }
```

**Funções:**
- `handleAuth()` - Autentica usuário
- `checkUser()` - Verifica se está logado (redireciona)

**Integração Supabase:**
```javascript
supabase.auth.signUp()
supabase.auth.signInWithPassword()
supabase.auth.getSession()
```

**Exemplo de uso:**
```jsx
import Auth from './pages/Auth'
<Route path="/login" element={<Auth />} />
```

---

### **Home.jsx** - Página Inicial
**Caminho:** `/src/pages/Home.jsx`  
**Rotas:** `/`

**Funcionalidades:**
- Hero section com animações
- 3 cards de features
- Botões de CTA

**Componentes Usados:**
- Framer Motion (AnimatePresence, motion.div)
- React Router (Link)
- Lucide Icons

**Exemplo:**
```jsx
import Home from './pages/Home'
<Route path="/" element={<Home />} />
```

---

### **Explore.jsx** - Catálogo
**Caminho:** `/src/pages/Explore.jsx`  
**Rotas:** `/explorar`

**Props:** Nenhuma

**Estado:**
```javascript
servicos              // array de fornecedores
loading               // boolean
busca                 // string - termo de busca
filtroComodidade      // string | null - filtro selecionado
```

**Funções:**
```javascript
fetchServicos()       // Busca fornecedores no Supabase
```

**Filtros Disponíveis:**
- Piscina
- Churrasco
- Ar Condicionado
- Wi-Fi

**Integração Supabase:**
```javascript
supabase.from('fornecedores').select('*')
```

**Exemplo:**
```jsx
<Route path="/explorar" element={<Explore />} />
```

---

### **Details.jsx** - Detalhes do Espaço
**Caminho:** `/src/pages/Details.jsx`  
**Rotas:** `/detalhes/:id`

**Props:**
```javascript
{ id }  // de useParams()
```

**Estado:**
```javascript
item      // objeto do fornecedor
loading   // boolean
```

**Campos Exibidos:**
- nome, imagem_url, localizacao
- capacidade_max, preco, comodidades
- rating (fixo em 4.9)

**Integração Supabase:**
```javascript
supabase.from('fornecedores').select('*').eq('id', id).single()
```

**Exemplo:**
```jsx
<Route path="/detalhes/:id" element={<Details />} />
```

---

### **Dashboard.jsx** - Painel do Fornecedor 🚀
**Caminho:** `/src/pages/Dashboard.jsx`  
**Rotas:** `/dashboard` (PRIVADA)

**Props:** Nenhuma

**Estado:**
```javascript
loading                      // boolean
user                        // object - usuário logado
fornecedor                  // object - dados do fornecedor
agendamentosComoCliente     // array - reservas do usuário
pedidosComoAnunciante       // array - agendamentos recebidos
```

**Funções:**
```javascript
fetchDashboardData()  // Carrega todos os dados
handleLogout()        // Desloga usuário
```

**Componentes SaaS Integrados:**
```jsx
<CalendarView fornecedorId={fornecedor.id} />
<FinanceiroStats agendamentos={pedidosComoAnunciante} />
<UserSettings />
```

**Integração Supabase:**
```javascript
supabase.auth.getUser()
supabase.from('fornecedores').select('*').eq('user_id', id)
supabase.from('agendamentos').select('*').eq('user_id', id)
supabase.from('agendamentos').select('*').eq('fornecedor_id', id)
```

**Exemplo:**
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

### **RegisterService.jsx** - Cadastrar Espaço
**Caminho:** `/src/pages/RegisterService.jsx`  
**Rotas:** `/registrar` (PRIVADA)

**Props:** Nenhuma

**Estado:**
```javascript
loading      // boolean
uploading    // boolean - upload em andamento
form         // {
  //   nome: string,
  //   preco: string,
  //   localizacao: string,
  //   whatsapp: string,
  //   instagram_handle: string,
  //   imagem_url: string (URL do Supabase)
  // }
```

**Funções:**
```javascript
handleUpload(e)      // Faz upload de imagem
handleCadastrar(e)   // Cadastra fornecedor
```

**Validações:**
- Obrigatório: nome, preco, localizacao, whatsapp, imagem
- Instagram: opcional

**Integração Supabase:**
```javascript
supabase.storage.from('imagens-servicos').upload()
supabase.storage.from('imagens-servicos').getPublicUrl()
supabase.from('fornecedores').insert()
supabase.auth.getUser()
```

**Exemplo:**
```jsx
<Route path="/registrar" element={
  <ProtectedRoute>
    <RegisterService />
  </ProtectedRoute>
} />
```

---

### **EditService.jsx** - Editar Espaço
**Caminho:** `/src/pages/EditService.jsx`  
**Rotas:** `/editar/:id` (PRIVADA)

**Props:**
```javascript
{ id }  // de useParams()
```

**Estado:**
```javascript
loading       // boolean
saving        // boolean
uploading     // boolean
formData      // {
  //   nome, preco, endereco, descricao, imagem_url
  // }
```

**Funções:**
```javascript
fetchServico()        // Carrega dados do espaço
handleImageUpload()   // Upload de nova imagem
handleUpdate()        // Atualiza fornecedor
```

**⚠️ FALTA:** Comodidades não são editáveis (TODO)

**Integração Supabase:**
```javascript
supabase.from('fornecedores').select('*').eq('id', id)
supabase.storage.from('imagens-servicos').upload()
supabase.from('fornecedores').update()
supabase.auth.getUser()
```

**Exemplo:**
```jsx
<Route path="/editar/:id" element={
  <ProtectedRoute>
    <EditService />
  </ProtectedRoute>
} />
```

---

### **Profile.jsx** - Perfil do Usuário
**Caminho:** `/src/pages/Profile.jsx`  
**Rotas:** `/profile` (PRIVADA)

**Props:** Nenhuma

**Estado:**
```javascript
loading      // boolean
updating     // boolean
message      // { type, text }
perfil       // { nome, sobrenome, email }
novaSenha    // string
```

**Funções:**
```javascript
carregarDados()  // Carrega perfil do usuário
handleSalvar()   // Salva alterações
```

**Integração Supabase:**
```javascript
supabase.auth.getUser()
supabase.from('profiles').select('*').eq('id', id)
supabase.from('profiles').upsert()
supabase.auth.updateUser({ password })
```

**Exemplo:**
```jsx
<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />
```

---

### **PublicProfile.jsx** - Vitrine do Fornecedor
**Caminho:** `/src/pages/PublicProfile.jsx`  
**Rotas:** `/p/:id`

**Props:**
```javascript
{ id }  // de useParams()
```

**Estado:**
```javascript
perfil         // object - dados do fornecedor
enviado        // boolean - orçamento enviado
form           // { nome, zap, data, detalhes }
```

**Funcionalidades:**
- Banner com imagem
- Links para Instagram e WhatsApp
- Formulário de orçamento

**Integração Supabase:**
```javascript
supabase.from('fornecedores').select('*').eq('id', id)
supabase.from('agendamentos').insert() // ao enviar orçamento
```

---

### **PublicView.jsx** - Visualização Alternativa
**Caminho:** `/src/pages/PublicView.jsx`  
**Rotas:** `/detalhes/:id` (alternativa)

**⚠️ Nota:** Duplica funcionalidade de Details.jsx

---

### **NotFound.jsx** - 404
**Caminho:** `/src/pages/NotFound.jsx`  
**Rotas:** `*` (fallback)

---

## 🎨 Componentes SaaS

### **CalendarView.jsx**
**Caminho:** `/src/components/SaaS/CalendarView.jsx`

**Props:**
```javascript
fornecedorId: uuid (obrigatório)
```

**Estado:**
```javascript
currentMonth         // Date
agendamentos         // array
selectedDate         // Date
isModalOpen          // boolean
```

**Funcionalidades:**
- Calendário com navegação de meses
- Visualização de agendamentos por dia
- Cores por status (confirmado/pendente)
- Integração com modal de novo agendamento

**Dependências:**
```javascript
date-fns
date-fns/locale (ptBR)
AddAgendamentoModal
```

**Integração Supabase:**
```javascript
supabase.from('agendamentos')
  .select('*')
  .eq('fornecedor_id', fornecedorId)
  .gte('data_evento', startOfMonth)
  .lte('data_evento', endOfMonth)
```

**Exemplo de Uso:**
```jsx
<CalendarView fornecedorId={fornecedor.id} />
```

---

### **AddAgendamentoModal.jsx**
**Caminho:** `/src/components/SaaS/AddAgendamentoModal.jsx`

**Props:**
```javascript
isOpen: boolean (obrigatório)
onClose: function (obrigatório)
selectedDate: string (YYYY-MM-DD) (obrigatório)
fornecedorId: uuid (obrigatório)
onRefresh: function (callback após salvar)
```

**Estado:**
```javascript
loading  // boolean
form     // {
  //   cliente_nome: string,
  //   cliente_zap: string (com máscara),
  //   valor_total: string (com máscara R$),
  //   status: 'confirmado' | 'pendente',
  //   notas: string
  // }
```

**Máscaras Aplicadas:**
- Telefone: `(11) 99999-9999`
- Moeda: `R$ 1.234,56`

**Funções:**
```javascript
formatarTelefone()  // Aplica máscara de telefone
formatarMoeda()     // Aplica máscara de moeda
handleSubmit()      // Salva agendamento
```

**Integração Supabase:**
```javascript
supabase.from('agendamentos').insert()
```

**Exemplo de Uso:**
```jsx
<AddAgendamentoModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  selectedDate={format(selectedDate, 'yyyy-MM-dd')}
  fornecedorId={fornecedor.id}
  onRefresh={fetchAgendamentos}
/>
```

---

### **FinanceiroStats.jsx**
**Caminho:** `/src/components/SaaS/FinanceiroStats.jsx`

**Props:**
```javascript
agendamentos: array (obrigatório)
  // Cada item deve ter: status, valor_total
```

**Calcula:**
```javascript
faturamento   // SUM(valor_total) onde status === 'confirmado'
quantidade    // COUNT(*)
ticketMedio   // faturamento / quantidade
```

**Cards Exibidos:**
1. Faturamento Mensal
2. Total de Eventos
3. Ticket Médio

**Exemplo de Uso:**
```jsx
<FinanceiroStats agendamentos={pedidosComoAnunciante} />
```

---

### **UserSettings.jsx**
**Caminho:** `/src/components/SaaS/UserSettings.jsx`

**Props:** Nenhuma

**Estado:**
```javascript
loading       // boolean
updating      // boolean
perfil        // { nome, sobrenome, email }
novaSenha     // string
message       // { type, text }
```

**Funcionalidades:**
- Editar nome e sobrenome
- Email em apenas leitura
- Alterar senha (mínimo 6 caracteres)

**Integração Supabase:**
```javascript
supabase.auth.getUser()
supabase.from('profiles').select('*')
supabase.from('profiles').upsert()
supabase.auth.updateUser({ password })
```

**Exemplo de Uso:**
```jsx
<UserSettings />
```

---

## 🧩 Componentes Comuns

### **Navbar.jsx**
**Props:** Nenhuma  
**Função:** Navegação principal  
**Links:** Home, Explorar, Login, Dashboard (se logado)

### **Footer.jsx**
**Props:** Nenhuma  
**Função:** Rodapé com links e info

---

## 🔧 Hooks Customizados

**Nota:** Não há hooks customizados ainda. Sugestões:

```javascript
// useAuth.js
export function useAuth() {
  const [user, setUser] = useState(null);
  useEffect(() => { /* verificar auth */ }, []);
  return { user, loading };
}

// useFornecedor.js
export function useFornecedor(userId) {
  const [fornecedor, setFornecedor] = useState(null);
  // Buscar fornecedor do user
  return { fornecedor, loading };
}
```

---

## 📚 Utilitários

### **supabaseClient.js**
**Caminho:** `/src/lib/supabaseClient.js`

**Exports:**
```javascript
const supabase = createClient(url, key)
```

**Funções Principais:**
```javascript
// Auth
supabase.auth.getUser()
supabase.auth.getSession()
supabase.auth.signUp()
supabase.auth.signInWithPassword()
supabase.auth.signOut()
supabase.auth.updateUser()

// Database
supabase.from('table').select()
supabase.from('table').insert()
supabase.from('table').update()
supabase.from('table').delete()

// Storage
supabase.storage.from('bucket').upload()
supabase.storage.from('bucket').getPublicUrl()
```

---

## 🎨 Estilo e Design

### **Tailwind CSS**
- **Framework:** Tailwind CSS 4.1.18
- **Arquivo de Configuração:** `/tailwind.config.js`

### **Cores Principais**
```css
indigo-600   /* Cor primária */
slate-900    /* Preto/escuro */
slate-50     /* Branco/claro */
emerald-500  /* Verde (sucesso) */
red-500      /* Vermelho (erro) */
amber-500    /* Amarelo (aviso) */
```

### **Componentes UI Padrão**
```jsx
/* Botão primário */
<button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-indigo-700 transition-all">
  Ação
</button>

/* Input */
<input className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none focus:ring-2 focus:ring-indigo-600" />

/* Card */
<div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
  Conteúdo
</div>

/* Badge */
<span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">
  Label
</span>
```

---

## 🚀 Como Reutilizar Componentes

### **Exemplo 1: Usar CalendarView em outra página**
```jsx
import CalendarView from '../components/SaaS/CalendarView';

export default function MyPage() {
  const [fornecedorId] = useState('uuid-aqui');
  
  return (
    <div>
      <CalendarView fornecedorId={fornecedorId} />
    </div>
  );
}
```

### **Exemplo 2: Criar novo componente SaaS**
```jsx
// src/components/SaaS/MyComponent.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function MyComponent({ fornecedorId }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, [fornecedorId]);
  
  async function fetchData() {
    const { data } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('fornecedor_id', fornecedorId);
    setData(data);
  }
  
  return (
    <div>
      {/* seu conteúdo */}
    </div>
  );
}
```

---

**Documento criado para referência rápida do EventlyHub**

