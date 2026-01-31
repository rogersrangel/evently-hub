# 🗄️ Setup Banco de Dados - EventlyHub

**Instruções Passo a Passo para Configurar Supabase**  
**Versão:** 1.0  
**Data:** 31 de janeiro de 2026

---

## ⚡ Resumo Rápido

Este arquivo contém todo o SQL necessário para configurar seu banco de dados no Supabase.

**Tempo total:** 5-10 minutos  
**Dificuldade:** Fácil (copiar e colar)

---

## 🚀 PASSO 1: Acessar Supabase SQL Editor

1. Acesse [supabase.com](https://supabase.com)
2. Login na sua conta
3. Selecione seu projeto EventlyHub
4. Na esquerda, clique em **"SQL Editor"**
5. Clique em **"New Query"**

---

## 📋 PASSO 2: Copiar e Colar SQL

Abaixo estão os scripts SQL. **Copie todo o conteúdo** da seção abaixo e **cole no SQL Editor** do Supabase.

### ✂️ SCRIPT COMPLETO - COPIE TUDO:

```sql
-- ============================================
-- EVENTLYHUB - SETUP COMPLETO DO BANCO
-- ============================================

-- ===== 1. CRIAR TABELA PROFILES =====
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  nome varchar,
  sobrenome varchar,
  email varchar,
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ===== 2. CRIAR TABELA FORNECEDORES =====
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

-- ===== 3. CRIAR TABELA AGENDAMENTOS =====
CREATE TABLE IF NOT EXISTS public.agendamentos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  fornecedor_id uuid NOT NULL REFERENCES public.fornecedores(id) ON DELETE CASCADE,
  user_id uuid,
  cliente_nome varchar NOT NULL,
  cliente_zap varchar,
  cliente_telefone varchar,
  data_evento date NOT NULL,
  valor_total numeric(10, 2),
  status varchar DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
  notas text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT fk_agendamentos_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_agendamentos_fornecedor_id ON public.agendamentos(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_user_id ON public.agendamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data_evento ON public.agendamentos(data_evento);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON public.agendamentos(status);

ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- ===== 4. RLS POLICIES - FORNECEDORES =====
CREATE POLICY "fornecedores_select_public" ON public.fornecedores
FOR SELECT USING (true);

CREATE POLICY "fornecedores_update_owner" ON public.fornecedores
FOR UPDATE USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "fornecedores_delete_owner" ON public.fornecedores
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "fornecedores_insert_auth" ON public.fornecedores
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===== 5. RLS POLICIES - AGENDAMENTOS =====
CREATE POLICY "agendamentos_select_public" ON public.agendamentos
FOR SELECT USING (true);

CREATE POLICY "agendamentos_update_provider" ON public.agendamentos
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.fornecedores
    WHERE fornecedores.id = agendamentos.fornecedor_id
    AND fornecedores.user_id = auth.uid()
  )
);

CREATE POLICY "agendamentos_insert_public" ON public.agendamentos
FOR INSERT WITH CHECK (true);

-- ===== 6. RLS POLICIES - PROFILES =====
CREATE POLICY "profiles_select_own" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);
```

---

## 📍 PASSO 3: Executar o SQL

1. **Cole o SQL acima** no SQL Editor do Supabase
2. Clique em **"Run"** (botão azul no canto superior direito)
3. Aguarde a execução (deve dar sucesso)

**Resultado esperado:**
```
✅ Success. No rows returned
```

Se houver erro, verifique:
- Se a sintaxe está correta
- Se já existem tabelas com o mesmo nome

---

## 🗄️ PASSO 4: Verificar se Funcionou

Para verificar se as tabelas foram criadas:

1. Na esquerda, clique em **"Table Editor"**
2. Você deve ver 3 tabelas:
   - `profiles`
   - `fornecedores`
   - `agendamentos`

Se vir as 3 tabelas, **está tudo certo!** ✅

---

## 💾 PASSO 5: Criar Storage Bucket

Para armazenar imagens:

1. Na esquerda, clique em **"Storage"**
2. Clique em **"New Bucket"**
3. Nome: `imagens-servicos`
4. Marque: **"Public bucket"** (checkbox)
5. Clique em **"Create bucket"**

**Resultado esperado:**
```
✅ Bucket 'imagens-servicos' criado
```

---

## 🔑 PASSO 6: Verificar Autenticação

A autenticação vem **pré-configurada** no Supabase:

1. Na esquerda, clique em **"Authentication"**
2. Vá em **"Providers"**
3. Verifique se **"Email"** está habilitado (deve estar por padrão)

Se não estiver, clique em **"Email"** e habilite.

---

## ✅ PASSO 7: Configurar Variáveis de Ambiente

Crie arquivo `.env.local` na raiz do projeto:

```bash
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

**Como obter as chaves:**
1. Vá em **"Settings"** → **"API"**
2. Copie: **"Project URL"**
3. Copie: **"anon public"** (chave)

---

## 🧪 PASSO 8: Testar Conexão

No terminal, teste:

```bash
npm run dev
```

Vá para: `http://localhost:5173`

Teste:
- [ ] Homepage carrega
- [ ] Login funciona
- [ ] Consegue se cadastrar
- [ ] Dashboard aparece vazio (sem erro)

---

## 📊 Estrutura Criada

Após executar o SQL, você terá:

```
auth.users (gerenciado por Supabase)
├─ Usuários e senhas

public.profiles
├─ id (FK auth.users)
├─ nome
├─ sobrenome
├─ email
└─ updated_at

public.fornecedores
├─ id (PK)
├─ user_id (FK auth.users) ⭐
├─ nome
├─ preco
├─ localizacao
├─ endereco
├─ whatsapp
├─ instagram_handle
├─ imagem_url
├─ descricao
├─ capacidade_max
├─ comodidades (JSON)
├─ created_at
└─ updated_at

public.agendamentos
├─ id (PK)
├─ fornecedor_id (FK fornecedores) ⭐
├─ user_id (FK auth.users)
├─ cliente_nome
├─ cliente_zap
├─ cliente_telefone
├─ data_evento ⭐
├─ valor_total
├─ status ⭐
├─ notas
├─ created_at
└─ updated_at

Índices criados:
✅ idx_fornecedores_user_id
✅ idx_fornecedores_created_at
✅ idx_agendamentos_fornecedor_id
✅ idx_agendamentos_user_id
✅ idx_agendamentos_data_evento
✅ idx_agendamentos_status

RLS Policies:
✅ fornecedores (público ler, owner editar)
✅ agendamentos (público ler/inserir, provider editar)
✅ profiles (próprio perfil)
```

---

## ⚠️ Importante

### Campos com ⭐ que estão siendo usados no código:

**`fornecedores.user_id`**
- ✅ Usado em `Dashboard.jsx`
- ✅ Usado em `EditService.jsx`
- ✅ Usado em RLS policies

**`agendamentos.data_evento`**
- ✅ Usado em `CalendarView.jsx`
- ✅ Usado em `AddAgendamentoModal.jsx`
- ✅ Criado índice para performance

**`agendamentos.status`**
- ✅ Usado em `CalendarView.jsx`
- ✅ Usado em `FinanceiroStats.jsx`
- ✅ Valores: 'pendente', 'confirmado', 'cancelado'

**`fornecedores.comodidades`**
- ✅ Usado em `Details.jsx`
- ✅ Usado em `Explore.jsx`
- ✅ Formato: JSON com boolean para cada comodidade

---

## 🚀 Próximo Passo

Depois de executar o SQL:

1. ✅ Banco configurado
2. 👉 **Agora rode:** `npm run dev`
3. Teste a aplicação
4. Se houver erro, verifique **TROUBLESHOOTING** abaixo

---

## 🐛 TROUBLESHOOTING

### Erro: "relation "fornecedores" does not exist"

**Causa:** Tabelas não foram criadas  
**Solução:** Execute o SQL novamente

---

### Erro: "RLS policy violates..."

**Causa:** RLS policies bloqueando acesso  
**Solução:** Verifique se está logado (tem JWT token válido)

---

### Erro: "violates foreign key constraint"

**Causa:** Tentando inserir `user_id` inválido  
**Solução:** Certifique-se de estar autenticado antes de fazer ações

---

### Erro no upload de imagem

**Causa:** Bucket não é público  
**Solução:** Na Storage, clique em `imagens-servicos` → Settings → marque "Public"

---

### Erro: "column does not exist"

**Causa:** Nome do campo diferente do código  
**Solução:** Revise os nomes de campos na seção **"Campos com ⭐"** acima

---

## ✨ Checklist de Conclusão

- [ ] SQL executado com sucesso
- [ ] 3 tabelas criadas (profiles, fornecedores, agendamentos)
- [ ] Bucket `imagens-servicos` criado e públic
- [ ] Email auth habilitado
- [ ] `.env.local` configurado
- [ ] `npm run dev` rodando sem erros
- [ ] Consegue fazer login
- [ ] Dashboard carrega sem erro

Se todos os itens estão ✅, **seu banco está pronto!**

---

## 📞 Próximos Passos

1. **Testar fluxo completo:**
   - Criar conta
   - Login
   - Criar espaço (com upload de imagem)
   - Ver em explorar
   - Ver agendamentos no calendário

2. **Se tiver erros no código:**
   - Procure em `GUIA_IMPLEMENTACAO.md` → Problemas Críticos

3. **Se precisa entender o banco:**
   - Leia `ANALISE_PROJETO.md` → Modelo de Dados

---

**Setup Banco de Dados - EventlyHub**  
**Criado em:** 31 de janeiro de 2026  
**Status:** Pronto para copiar/colar

