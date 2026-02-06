## 📄 **3. DATABASE.md** (Banco - Apenas SQL)

```markdown
# 🗄️ Scripts do Banco

Execute no **SQL Editor** do Supabase:

## 1. Tabelas

### Profiles
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nome TEXT,
  telefone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

Fornecedores

CREATE TABLE fornecedores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  nome TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  imagem_url TEXT,
  comodidades JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

Agendamentos

CREATE TABLE agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fornecedor_id UUID REFERENCES fornecedores(id) NOT NULL,
  cliente_email TEXT NOT NULL,
  data_reserva DATE NOT NULL,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT NOW()
);

2. Índices

CREATE INDEX idx_fornecedores_user_id ON fornecedores(user_id);
CREATE INDEX idx_agendamentos_fornecedor_id ON agendamentos(fornecedor_id);

3. RLS Policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;  
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

Policies (execute todos):

-- Profiles
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);

-- Fornecedores  
CREATE POLICY "fornecedores_select" ON fornecedores FOR SELECT USING (true);
CREATE POLICY "fornecedores_own" ON fornecedores FOR ALL USING (auth.uid() = user_id);

-- Agendamentos
CREATE POLICY "agendamentos_select" ON agendamentos FOR SELECT USING (true);
CREATE POLICY "agendamentos_insert" ON agendamentos FOR INSERT WITH CHECK (true);

✅ Execute na ordem: Tabelas → Índices → RLS Policies


