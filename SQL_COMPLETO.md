# 🗄️ SQL Completo para EventlyHub

**Copie e cole cada seção no SQL Editor do Supabase**

---

## ⚡ EXECUTAR TUDO DE UMA VEZ

Se quiser executar tudo de uma vez no SQL Editor do Supabase, copie e cole isto:

```sql
-- =====================================================
-- EVENTLYHUB - SETUP COMPLETO DO BANCO DE DADOS
-- =====================================================

-- ===== 1. TABELA PROFILES =====
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  nome varchar,
  sobrenome varchar,
  email varchar,
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ===== 2. TABELA FORNECEDORES =====
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

-- ===== 3. TABELA AGENDAMENTOS =====
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

## 🔍 CONSULTAS ÚTEIS

### **1. Ver Todos Fornecedores com Estatísticas**
```sql
SELECT 
  f.id,
  f.nome,
  f.localizacao,
  f.preco,
  u.email as proprietario_email,
  COUNT(a.id) as total_agendamentos,
  COUNT(CASE WHEN a.status = 'confirmado' THEN 1 END) as confirmados,
  COUNT(CASE WHEN a.status = 'pendente' THEN 1 END) as pendentes,
  COALESCE(SUM(CASE WHEN a.status = 'confirmado' THEN a.valor_total ELSE 0 END), 0) as faturamento_total,
  f.created_at as data_criacao
FROM fornecedores f
LEFT JOIN auth.users u ON f.user_id = u.id
LEFT JOIN agendamentos a ON f.id = a.fornecedor_id
GROUP BY f.id, f.nome, f.localizacao, f.preco, u.email, f.created_at
ORDER BY total_agendamentos DESC;
```

---

### **2. Ver Agendamentos de Um Fornecedor**
```sql
SELECT 
  a.id,
  a.cliente_nome,
  a.cliente_zap,
  a.data_evento,
  a.valor_total,
  a.status,
  a.notas,
  a.created_at
FROM agendamentos a
WHERE a.fornecedor_id = 'PASTE-ID-AQUI'
ORDER BY a.data_evento DESC;
```

---

### **3. Faturamento por Mês**
```sql
SELECT 
  DATE_TRUNC('month', data_evento)::date as mes,
  COUNT(*) as total_eventos,
  SUM(valor_total) as faturamento_total,
  AVG(valor_total) as ticket_medio
FROM agendamentos
WHERE status = 'confirmado'
GROUP BY DATE_TRUNC('month', data_evento)
ORDER BY mes DESC;
```

---

### **4. Top 10 Fornecedores por Faturamento**
```sql
SELECT 
  f.nome,
  f.localizacao,
  COUNT(a.id) as eventos,
  COALESCE(SUM(a.valor_total), 0) as total_faturado,
  COALESCE(AVG(a.valor_total), 0) as ticket_medio
FROM fornecedores f
LEFT JOIN agendamentos a ON f.id = a.fornecedor_id AND a.status = 'confirmado'
GROUP BY f.id, f.nome, f.localizacao
ORDER BY total_faturado DESC
LIMIT 10;
```

---

### **5. Agendamentos Próximos (Próximos 7 dias)**
```sql
SELECT 
  a.id,
  f.nome as espaco,
  a.cliente_nome,
  a.data_evento,
  a.status,
  a.valor_total
FROM agendamentos a
JOIN fornecedores f ON a.fornecedor_id = f.id
WHERE a.data_evento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY a.data_evento ASC;
```

---

### **6. Agendamentos Vencidos Não Confirmados**
```sql
SELECT 
  a.id,
  f.nome,
  a.cliente_nome,
  a.data_evento,
  a.cliente_zap,
  CURRENT_DATE - a.data_evento as dias_atraso
FROM agendamentos a
JOIN fornecedores f ON a.fornecedor_id = f.id
WHERE a.status = 'pendente' 
  AND a.data_evento < CURRENT_DATE
ORDER BY a.data_evento DESC;
```

---

### **7. Usuários com Mais Reservas Feitas**
```sql
SELECT 
  u.email,
  COUNT(a.id) as total_reservas,
  SUM(a.valor_total) as total_gasto,
  AVG(a.valor_total) as gasto_medio
FROM auth.users u
LEFT JOIN agendamentos a ON u.id = a.user_id
GROUP BY u.id, u.email
ORDER BY total_reservas DESC
LIMIT 20;
```

---

### **8. Comodidades Mais Solicitadas**
```sql
SELECT 
  CASE 
    WHEN comodidades->>'piscina' = 'true' THEN 'Piscina'
    WHEN comodidades->>'churrasqueira' = 'true' THEN 'Churrasqueira'
    WHEN comodidades->>'wifi' = 'true' THEN 'Wi-Fi'
    WHEN comodidades->>'ar_condicionado' = 'true' THEN 'Ar Condicionado'
    WHEN comodidades->>'cozinha' = 'true' THEN 'Cozinha'
    WHEN comodidades->>'estacionamento' = 'true' THEN 'Estacionamento'
  END as comodidade,
  COUNT(*) as quantidade
FROM fornecedores
WHERE comodidades IS NOT NULL
GROUP BY comodidade
ORDER BY quantidade DESC;
```

---

### **9. Verificar RLS Policies Ativadas**
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

### **10. Ver Estrutura de Uma Tabela**
```sql
-- Para fornecedores:
\d fornecedores

-- Para agendamentos:
\d agendamentos

-- Para profiles:
\d profiles
```

---

## 🧹 LIMPEZA DE DADOS

### **Deletar Agendamentos de Uma Data**
```sql
DELETE FROM agendamentos
WHERE data_evento = '2026-01-31';
```

---

### **Deletar Todos Agendamentos Pendentes**
```sql
DELETE FROM agendamentos
WHERE status = 'pendente';
```

---

### **Resetar Banco Completamente (CUIDADO!)**
```sql
-- Isso vai deletar TUDO
DELETE FROM agendamentos;
DELETE FROM fornecedores;
DELETE FROM profiles;

-- Opcional: deletar usuários (apenas em dev)
-- DELETE FROM auth.users;
```

---

### **Restaurar Tabelas do Zero**
```sql
-- Remover tudo
DROP TABLE IF EXISTS agendamentos CASCADE;
DROP TABLE IF EXISTS fornecedores CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Depois executar o script de criação acima
```

---

## 📈 MANUTENÇÃO

### **Atualizar um Fornecedor**
```sql
UPDATE fornecedores
SET 
  nome = 'Novo Nome',
  preco = 1500.00,
  localizacao = 'São Paulo - SP',
  updated_at = now()
WHERE id = 'PASTE-ID-AQUI';
```

---

### **Confirmar Agendamento**
```sql
UPDATE agendamentos
SET 
  status = 'confirmado',
  updated_at = now()
WHERE id = 'PASTE-ID-AQUI';
```

---

### **Cancelar Agendamento**
```sql
UPDATE agendamentos
SET 
  status = 'cancelado',
  updated_at = now()
WHERE id = 'PASTE-ID-AQUI';
```

---

### **Atualizar Comodidades de um Fornecedor**
```sql
UPDATE fornecedores
SET 
  comodidades = jsonb_set(
    comodidades, 
    '{piscina}', 
    'true'
  ),
  updated_at = now()
WHERE id = 'PASTE-ID-AQUI';
```

---

## 🔐 AUDITORIA

### **Ver Próximos Agendamentos de Um Cliente**
```sql
SELECT 
  a.data_evento,
  f.nome as espaco,
  a.valor_total,
  a.status
FROM agendamentos a
JOIN fornecedores f ON a.fornecedor_id = f.id
WHERE a.user_id = 'PASTE-USER-ID-AQUI'
  AND a.data_evento >= CURRENT_DATE
ORDER BY a.data_evento ASC;
```

---

### **Histórico Completo de um Cliente**
```sql
SELECT 
  a.id,
  a.data_evento,
  f.nome,
  a.valor_total,
  a.status,
  a.created_at
FROM agendamentos a
JOIN fornecedores f ON a.fornecedor_id = f.id
WHERE a.user_id = 'PASTE-USER-ID-AQUI'
ORDER BY a.created_at DESC;
```

---

### **Ver Perfil de um Usuário**
```sql
SELECT 
  p.id,
  p.nome,
  p.sobrenome,
  p.email,
  u.email as email_auth,
  u.created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'email@exemplo.com';
```

---

## 🚀 OTIMIZAÇÕES

### **Analisar Performance de uma Query**
```sql
EXPLAIN ANALYZE
SELECT * FROM agendamentos
WHERE fornecedor_id = 'id-aqui'
AND data_evento > CURRENT_DATE;
```

---

### **Criar Índice de Busca Full Text (Opcional)**
```sql
ALTER TABLE fornecedores ADD COLUMN IF NOT EXISTS search_text tsvector;

UPDATE fornecedores 
SET search_text = to_tsvector('portuguese', nome || ' ' || localizacao);

CREATE INDEX IF NOT EXISTS idx_fornecedores_search ON fornecedores USING GIN(search_text);

-- Usar assim:
SELECT * FROM fornecedores 
WHERE search_text @@ plainto_tsquery('portuguese', 'piscina');
```

---

### **Criar View de Dashboard (Opcional)**
```sql
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_usuarios,
  (SELECT COUNT(*) FROM fornecedores) as total_fornecedores,
  (SELECT COUNT(*) FROM agendamentos) as total_agendamentos,
  (SELECT SUM(valor_total) FROM agendamentos WHERE status = 'confirmado') as faturamento_total,
  (SELECT COUNT(*) FROM agendamentos WHERE status = 'pendente') as agendamentos_pendentes;

-- Usar assim:
SELECT * FROM dashboard_stats;
```

---

## ⚠️ IMPORTANTE

- **Sempre faça backup** antes de rodar DELETE
- **Teste em staging** antes de executar em produção
- **Ative RLS policies** para segurança
- **Índices melhoram performance** em tabelas grandes
- **Verificar RLS** antes de queries em produção

---

**Criado para EventlyHub - 31/01/2026**

