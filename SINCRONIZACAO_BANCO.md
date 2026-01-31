# 🔄 Sincronização Código ↔ Banco de Dados

**Verificação de Compatibilidade**  
**Data:** 31 de janeiro de 2026

---

## ✅ Campos Verificados

Este documento lista **todos os campos** usados no código e verifica se estão corretos no banco de dados.

---

## 📋 Tabela: `profiles`

### Campos no Banco:
- `id` (UUID, PRIMARY KEY, FK auth.users)
- `nome` (varchar)
- `sobrenome` (varchar)
- `email` (varchar)
- `updated_at` (timestamp)

### Usado No Código:
```javascript
// Profile.jsx
perfil = {
  nome: string,
  sobrenome: string,
  email: string  // ✅ SYNC
}

// UserSettings.jsx
perfil = {
  nome: string,
  sobrenome: string,
  email: string  // ✅ SYNC
}
```

### Status: ✅ SINCRONIZADO

---

## 📋 Tabela: `fornecedores`

### Campos no Banco:
- `id` (UUID, PRIMARY KEY)
- `user_id` (UUID, FK auth.users) ⭐
- `nome` (varchar)
- `preco` (numeric 10,2)
- `localizacao` (varchar)
- `endereco` (varchar)
- `whatsapp` (varchar)
- `instagram_handle` (varchar)
- `imagem_url` (varchar)
- `descricao` (text)
- `capacidade_max` (integer)
- `comodidades` (jsonb)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Usado No Código:

**RegisterService.jsx:**
```javascript
// INSERT
{
  nome: ✅ SYNC,
  preco: ✅ SYNC,
  localizacao: ✅ SYNC,
  whatsapp: ✅ SYNC,
  instagram_handle: ✅ SYNC,
  imagem_url: ✅ SYNC,
  user_id: ✅ SYNC
}
```

**EditService.jsx:**
```javascript
// SELECT all
data = {
  nome: ✅ SYNC,
  preco: ✅ SYNC,
  endereco: ✅ SYNC,
  descricao: ✅ SYNC,
  imagem_url: ✅ SYNC
}

// UPDATE
{
  nome: ✅ SYNC,
  descricao: ✅ SYNC,
  preco: ✅ SYNC,
  endereco: ✅ SYNC,
  imagem_url: ✅ SYNC
}
```

**Dashboard.jsx:**
```javascript
// SELECT fields used
fornecedor = {
  nome: ✅ SYNC,
  localizacao: ✅ SYNC,
  preco: ✅ SYNC,
  imagem_url: ✅ SYNC,
  id: ✅ SYNC
}
```

**Details.jsx:**
```javascript
// SELECT all, fields used
item = {
  nome: ✅ SYNC,
  imagem_url: ✅ SYNC,
  localizacao: ✅ SYNC,
  capacidade_max: ✅ SYNC,
  preco: ✅ SYNC,
  comodidades: ✅ SYNC
}
```

**Explore.jsx:**
```javascript
// SELECT all, filter by
servicos = {
  nome: ✅ SYNC (busca),
  localizacao: ✅ SYNC (busca),
  comodidades: ✅ SYNC (filtro)
}
```

**PublicProfile.jsx:**
```javascript
// SELECT single
perfil = {
  nome: ✅ SYNC,
  localizacao: ✅ SYNC,
  preco: ✅ SYNC,
  whatsapp: ✅ SYNC,
  instagram_handle: ✅ SYNC
}
```

**PublicView.jsx:**
```javascript
// SELECT single
local = {
  nome: ✅ SYNC,
  imagem_url: ✅ SYNC,
  endereco: ✅ SYNC,
  descricao: ✅ SYNC,
  preco: ✅ SYNC
}
```

### Status: ✅ SINCRONIZADO

---

## 📋 Tabela: `agendamentos`

### Campos no Banco:
- `id` (UUID, PRIMARY KEY)
- `fornecedor_id` (UUID, FK fornecedores) ⭐
- `user_id` (UUID, FK auth.users)
- `cliente_nome` (varchar)
- `cliente_zap` (varchar)
- `cliente_telefone` (varchar)
- `data_evento` (date) ⭐
- `valor_total` (numeric 10,2)
- `status` (varchar: 'pendente', 'confirmado', 'cancelado') ⭐
- `notas` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Usado No Código:

**AddAgendamentoModal.jsx:**
```javascript
// INSERT
{
  cliente_nome: ✅ SYNC,
  cliente_zap: ✅ SYNC,
  valor_total: ✅ SYNC (numeric),
  data_evento: ✅ SYNC (date format),
  fornecedor_id: ✅ SYNC,
  status: ✅ SYNC (default 'confirmado'),
  notas: ✅ SYNC
}

// Fields used
form = {
  cliente_nome: ✅ SYNC,
  cliente_zap: ✅ SYNC,
  valor_total: ✅ SYNC,
  status: ✅ SYNC,
  notas: ✅ SYNC
}
```

**CalendarView.jsx:**
```javascript
// SELECT with filters
agendamentos = {
  id: ✅ SYNC,
  data_evento: ✅ SYNC (usado em isSameDay),
  cliente_nome: ✅ SYNC (exibido),
  status: ✅ SYNC (cor do badge),
  fornecedor_id: ✅ SYNC (filtro)
}
```

**FinanceiroStats.jsx:**
```javascript
// Calcula stats
agendamentos = {
  status: ✅ SYNC (filtra 'confirmado'),
  valor_total: ✅ SYNC (SUM)
}
```

**Dashboard.jsx:**
```javascript
// SELECT relacionado
agendamentos = {
  data_evento: ✅ SYNC (exibição),
  status: ✅ SYNC (badge),
  id: ✅ SYNC,
  cliente_nome: ✅ SYNC
}

// Relacionado com fornecedores
agendamentos.fornecedor_id = ✅ SYNC (FK)
```

**PublicProfile.jsx:**
```javascript
// INSERT
{
  fornecedor_id: ✅ SYNC (id do espaço),
  cliente_nome: ✅ SYNC (form.nome),
  cliente_zap: ✅ SYNC (form.zap),
  data_evento: ✅ SYNC (form.data),
  notas: ✅ SYNC (form.detalhes),
  status: ✅ SYNC (default 'pendente')
}
```

**PublicView.jsx:**
```javascript
// INSERT
{
  fornecedor_id: ✅ SYNC (id),
  cliente_nome: ✅ SYNC,
  cliente_telefone: ✅ SYNC,
  data_evento: ✅ SYNC (reserva.data),
  status: ✅ SYNC (default 'pendente')
}
```

### Status: ✅ SINCRONIZADO

---

## 🔑 Campos Críticos (com ⭐)

### `fornecedores.user_id`
- **Descrição:** Identifica o proprietário do espaço
- **Tipo:** UUID (FK auth.users)
- **Usado em:**
  - ✅ RegisterService.jsx (INSERT)
  - ✅ EditService.jsx (verificação de ownership)
  - ✅ Dashboard.jsx (filtro WHERE user_id = auth.uid())
  - ✅ RLS policies (WHERE fornecedores.user_id = auth.uid())

---

### `agendamentos.fornecedor_id`
- **Descrição:** Liga agendamento ao espaço
- **Tipo:** UUID (FK fornecedores)
- **Usado em:**
  - ✅ AddAgendamentoModal.jsx (INSERT)
  - ✅ CalendarView.jsx (SELECT WHERE fornecedor_id = ?)
  - ✅ Dashboard.jsx (SELECT WHERE fornecedor_id = ?)
  - ✅ RLS policies (verificação de ownership)

---

### `agendamentos.data_evento`
- **Descrição:** Data do evento
- **Tipo:** DATE (YYYY-MM-DD)
- **Usado em:**
  - ✅ AddAgendamentoModal.jsx (INSERT, format = 'yyyy-MM-dd')
  - ✅ CalendarView.jsx (SELECT com gte/lte, usado em isSameDay)
  - ✅ PublicProfile.jsx (INSERT, form.data)
  - ✅ PublicView.jsx (INSERT, reserva.data)

---

### `agendamentos.status`
- **Descrição:** Status do agendamento
- **Tipo:** VARCHAR com CHECK ('pendente', 'confirmado', 'cancelado')
- **Default:** 'pendente'
- **Usado em:**
  - ✅ AddAgendamentoModal.jsx (default 'confirmado')
  - ✅ CalendarView.jsx (filtro de cor)
  - ✅ FinanceiroStats.jsx (filtra WHERE status = 'confirmado')
  - ✅ Dashboard.jsx (exibição de status)

---

## 🗂️ Índices Criados

Estes índices melhoram performance:

| Índice | Tabela | Campo | Usado Em |
|--------|--------|-------|---------|
| `idx_fornecedores_user_id` | fornecedores | user_id | Dashboard, RLS |
| `idx_fornecedores_created_at` | fornecedores | created_at | Explore (ORDER BY) |
| `idx_agendamentos_fornecedor_id` | agendamentos | fornecedor_id | CalendarView, Dashboard |
| `idx_agendamentos_user_id` | agendamentos | user_id | Dashboard (cliente) |
| `idx_agendamentos_data_evento` | agendamentos | data_evento | CalendarView (gte/lte) |
| `idx_agendamentos_status` | agendamentos | status | FinanceiroStats (WHERE) |

### Status: ✅ CRIADOS NO SQL

---

## 🔐 RLS Policies Verificadas

### fornecedores

| Policy | Tipo | Condição | Usado Em |
|--------|------|----------|---------|
| `fornecedores_select_public` | SELECT | true | Explore, Details, etc |
| `fornecedores_insert_auth` | INSERT | auth.uid() = user_id | RegisterService |
| `fornecedores_update_owner` | UPDATE | auth.uid() = user_id | EditService |
| `fornecedores_delete_owner` | DELETE | auth.uid() = user_id | (não implementado) |

### agendamentos

| Policy | Tipo | Condição | Usado Em |
|--------|------|----------|---------|
| `agendamentos_select_public` | SELECT | true | CalendarView, Dashboard |
| `agendamentos_insert_public` | INSERT | true | Modal, PublicProfile |
| `agendamentos_update_provider` | UPDATE | provider owner | Dashboard (status) |

### profiles

| Policy | Tipo | Condição | Usado Em |
|--------|------|----------|---------|
| `profiles_select_own` | SELECT | auth.uid() = id | Profile |
| `profiles_insert_own` | INSERT | auth.uid() = id | Auth (auto) |
| `profiles_update_own` | UPDATE | auth.uid() = id | Profile |

### Status: ✅ ESPECIFICADAS NO SQL

---

## ✅ Checklist de Sincronização

- [x] Todos campos de `profiles` sincronizados
- [x] Todos campos de `fornecedores` sincronizados
- [x] Todos campos de `agendamentos` sincronizados
- [x] Campos críticos verificados (user_id, fornecedor_id, data_evento, status)
- [x] Índices criados no SQL
- [x] RLS policies definidas
- [x] Tipos de dados corretos (numeric, date, varchar, etc)
- [x] Foreign keys corretos
- [x] Default values corretos

---

## 🚀 Próximos Passos

1. **Executar SQL do `SETUP_BANCO_DADOS.md`**
   - Cria todas as tabelas
   - Cria índices
   - Cria RLS policies

2. **Testar Conexão**
   - npm run dev
   - Login/Cadastro
   - Criar espaço
   - Ver em explorar

3. **Se houver erro:**
   - Procure o campo específico neste arquivo
   - Verifique se está correto no banco
   - Compare tipo de dado

---

## 📞 Troubleshooting por Erro

### Erro: "column does not exist"
**Solução:** Procure o nome do campo neste arquivo (Ctrl+F) e verifique se está correto

### Erro: "violates foreign key constraint"
**Solução:** Verифique se o valor de user_id/fornecedor_id é válido (INSERT ou UPDATE com IDs inválidos)

### Erro: "violates check constraint"
**Solução:** Para status, use apenas: 'pendente', 'confirmado' ou 'cancelado'

### Erro: "RLS policy violates"
**Solução:** Verifique se está autenticado e se user_id/fornecedor_id está correto

---

**Sincronização Código ↔ Banco de Dados**  
**Status:** ✅ 100% Sincronizado  
**Última Verificação:** 31 de janeiro de 2026

