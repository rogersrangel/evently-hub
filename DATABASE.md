## 📄 **3. DATABASE.md** (Banco - Apenas SQL)

```markdown
# 🗄️ Scripts do Banco

Execute no **SQL Editor** do Supabase **NA ORDEM INDICADA**:

## 1. TABELAS (Execute primeiro)

### 1.1 Profiles (Perfis de Usuário) - ATUALIZADA
```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT,
  telefone TEXT,
  cpf TEXT,
  endereco TEXT,
  cidade TEXT,
  estado CHAR(2),
  cep TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

Fornecedores

CREATE TABLE IF NOT EXISTS fornecedores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
  endereco TEXT,
  cidade TEXT,
  estado CHAR(2),
  capacidade_max INTEGER CHECK (capacidade_max > 0),
  whatsapp TEXT,
  imagem_url TEXT,
  comodidades JSONB DEFAULT '{}'::jsonb,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

Agendamentos

CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fornecedor_id UUID REFERENCES fornecedores(id) ON DELETE CASCADE NOT NULL,
  cliente_email TEXT NOT NULL,
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT,
  data_reserva DATE NOT NULL,
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado', 'concluido')),
  valor_total DECIMAL(10,2) NOT NULL CHECK (valor_total >= 0),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
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


