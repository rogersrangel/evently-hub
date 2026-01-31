# ✅ CHECKLIST TÉCNICO - EventlyHub

**Versão:** 1.0  
**Data:** 31 de janeiro de 2026  
**Status Geral:** 🟡 EM ANDAMENTO

---

## 🎯 ANTES DE USAR EM PRODUÇÃO

### **Segurança (CRÍTICO)**
- [ ] **RLS Policies Ativadas**
  - [ ] Fornecedores: only owner pode editar
  - [ ] Agendamentos: everyone pode ver, provider pode editar
  - [ ] Profiles: user vê apenas seu próprio
  - **Comando:** Executar SQL do `SQL_COMPLETO.md`

- [ ] **ProtectedRoute Implementado**
  - [ ] Criar arquivo `src/components/ProtectedRoute.jsx`
  - [ ] Proteger `/dashboard`
  - [ ] Proteger `/registrar`
  - [ ] Proteger `/editar/:id`
  - [ ] Proteger `/profile`
  - **Arquivo:** Ver código em `GUIA_IMPLEMENTACAO.md`

- [ ] **Verificação de Propriedade**
  - [ ] EditService.jsx verifica user_id
  - [ ] Impossível editar espaço alheio
  - [ ] Impossível deletar agendamento alheio
  - **Código:** Ver em `GUIA_IMPLEMENTACAO.md` (problema 2)

- [ ] **CORS Configurado**
  - [ ] Storage bucket permite uploads
  - [ ] Supabase API aceita requisições do seu domínio

- [ ] **Variáveis de Ambiente**
  - [ ] `.env.local` criado
  - [ ] VITE_SUPABASE_URL correto
  - [ ] VITE_SUPABASE_ANON_KEY correto
  - [ ] Não versionar `.env.local`

---

### **Features Implementadas**
- [x] Autenticação (login/cadastro)
- [x] Listar espaços
- [x] Detalhes do espaço
- [x] Cadastro de espaço
- [x] Edição de espaço
- [x] Upload de imagem
- [x] Dashboard do fornecedor
- [x] Calendário de agendamentos
- [x] Modal de novo agendamento
- [x] Estatísticas financeiras
- [x] Perfil do usuário
- [x] Logout
- [ ] **Comodidades Editáveis** ⚠️
  - [ ] Adicionar checkboxes em EditService.jsx
  - [ ] Salvar como JSONB
  - **Estimated Time:** 30 min
  - **Code:** Ver `GUIA_IMPLEMENTACAO.md` (problema 1)

---

### **Banco de Dados**
- [x] Tabela `profiles` criada
- [x] Tabela `fornecedores` criada
- [x] Tabela `agendamentos` criada
- [x] Índices de performance criados
- [x] RLS habilitado em tabelas
- [ ] **RLS Policies Aplicadas** ⚠️
  - [ ] Fornecedores policies
  - [ ] Agendamentos policies
  - [ ] Profiles policies
  - **SQL:** `SQL_COMPLETO.md`

---

### **Storage**
- [x] Bucket `imagens-servicos` criado
- [x] Bucket marcado como public
- [x] Upload funcional em RegisterService.jsx
- [x] Upload funcional em EditService.jsx
- [ ] CORS testado
- [ ] Permissões verificadas

---

### **Testes (Obrigatório)**
- [ ] **Teste 1: Fluxo Completo**
  1. [ ] Criar conta
  2. [ ] Login
  3. [ ] Criar espaço
  4. [ ] Upload de imagem funciona
  5. [ ] Editar espaço
  6. [ ] Ver em explorar
  7. [ ] Ver detalhes

- [ ] **Teste 2: Agendamento**
  1. [ ] Usuário A cria espaço
  2. [ ] Usuário B faz agendamento
  3. [ ] Usuário A vê no calendário
  4. [ ] Mudar status de agendamento

- [ ] **Teste 3: Segurança**
  1. [ ] Usuário B NÃO consegue editar espaço de A
  2. [ ] Usuário deslogado NÃO acessa dashboard
  3. [ ] Usuário deslogado NÃO consegue editar espaço
  4. [ ] RLS impede queries não autorizadas

- [ ] **Teste 4: Performance**
  1. [ ] Explore carrega com 100+ espaços
  2. [ ] Calendário com 50+ agendamentos é rápido
  3. [ ] Upload de imagem grande não trava

---

## 🚀 SETUP STEP-BY-STEP

### **Dia 1 - Preparação (1-2 horas)**

```bash
# 1. Clonar/Abrir projeto
cd /caminho/do/projeto

# 2. Instalar dependências
npm install

# 3. Criar .env.local
touch .env.local
# Adicionar variáveis do Supabase

# 4. Testar servidor local
npm run dev
# Deve abrir em http://localhost:5173
```

- [ ] Projeto roda localmente
- [ ] Sem erros no console

---

### **Dia 1 - Database Setup (30 min)**

```
Supabase Dashboard
├── SQL Editor
│   ├── [ ] Executar script de criação de tabelas
│   ├── [ ] Verificar tabelas criadas
│   └── [ ] Criar índices
│
├── Storage
│   ├── [ ] New Bucket "imagens-servicos"
│   ├── [ ] Marcar como Public
│   └── [ ] Testar upload
│
└── Authentication
    ├── [ ] Email provider habilitado
    ├── [ ] Testar signup
    └── [ ] Testar login
```

- [ ] Todas as tabelas criadas
- [ ] Bucket criado e público
- [ ] Auth testado

---

### **Dia 2 - Features Obrigatórias (2-3 horas)**

1. **ProtectedRoute** ⚠️ CRÍTICO
   ```bash
   # Criar arquivo
   touch src/components/ProtectedRoute.jsx
   ```
   - [ ] Arquivo criado
   - [ ] Implementado corretamente
   - [ ] Exportado em App.jsx

2. **Comodidades Editáveis** ⚠️ IMPORTANTE
   - [ ] Checkboxes adicionadas em EditService.jsx
   - [ ] Estado gerencia comodidades
   - [ ] Salva em handleUpdate

3. **Verificação de Propriedade** ⚠️ CRÍTICO
   - [ ] EditService.jsx verifica user_id
   - [ ] Impossível editar espaço alheio
   - [ ] Mensagem de erro clara

4. **user_id em Agendamentos** ⚠️ IMPORTANTE
   - [ ] AddAgendamentoModal.jsx obtém user
   - [ ] Salva user_id com INSERT
   - [ ] Dashboard mostra agendamentos corretos

---

### **Dia 3 - RLS e Segurança (2 horas)**

```sql
-- No SQL Editor do Supabase:
-- [ ] Executar RLS policies para fornecedores
-- [ ] Executar RLS policies para agendamentos
-- [ ] Executar RLS policies para profiles
-- [ ] Testar queries com diferentes usuários
```

- [ ] Todas as policies criadas
- [ ] Sem erros na execução
- [ ] Testadas com 2 usuários diferentes

---

### **Dia 4 - Testes Completos (3 horas)**

Criar 2 contas:
- Conta A (Fornecedor)
- Conta B (Cliente)

**Teste 1: Fluxo Normal**
```
Conta A:
[ ] Login
[ ] Dashboard vazio (sem espaços)
[ ] Criar espaço com imagem
[ ] Editar espaço
[ ] Ver agendamentos

Conta B:
[ ] Login
[ ] Ir em explorar
[ ] Buscar espaço da Conta A
[ ] Ver detalhes
[ ] Fazer agendamento

Conta A:
[ ] Ver novo agendamento no calendário
[ ] Confirmar agendamento

Conta B:
[ ] Dashboard mostra agendamento confirmado
```

**Teste 2: Segurança**
```
Conta B (tenta hacker):
[ ] Tenta acessar /dashboard sem logout de A
    → Deve redirecionar para /login
[ ] Tenta acessar /editar/:id_de_A
    → Deve mostrar erro ou redirecionar
[ ] Tenta fazer UPDATE direto no DB
    → RLS deve bloquear

Conta A:
[ ] Tenta editar agendamento de B
    → RLS deve bloquear
```

**Teste 3: Performance**
```
[ ] Carregar Explore com 50+ espaços
    → Deve ser rápido (< 2s)
[ ] Abrir calendário com 30+ agendamentos
    → Deve ser rápido (< 1s)
[ ] Upload de imagem 5MB
    → Deve completar em < 10s
```

---

## 📋 LISTA DE PROBLEMAS CONHECIDOS

| ID | Problema | Severidade | Status | Solução |
|----|----------|-----------|--------|---------|
| P1 | RLS não ativado | 🔴 Crítico | ❌ Não iniciado | Executar SQL |
| P2 | Sem ProtectedRoute | 🔴 Crítico | ❌ Não iniciado | Criar componente |
| P3 | user_id vazio em agendamentos | 🟠 Alto | ❌ Não iniciado | Adicionar getUser() |
| P4 | Comodidades não editáveis | 🟠 Alto | ❌ Não iniciado | Adicionar checkboxes |
| P5 | Possível editar espaço alheio | 🔴 Crítico | ❌ Não iniciado | Verificar user_id |
| P6 | Sem validação de email | 🟡 Médio | ⏳ Em análise | Implementar |
| P7 | Sem confirmação antes de deletar | 🟡 Médio | ⏳ Em análise | Modal confirm |
| P8 | Sem reset de senha | 🟡 Médio | ⏳ Em análise | Adicionar email |

---

## 🎁 EXTRAS (Opcional - Depois)

- [ ] Avaliações/Reviews de espaços
- [ ] Foto de perfil do usuário
- [ ] Notificações por email
- [ ] Integração com Stripe (pagamentos)
- [ ] Chat entre cliente e fornecedor
- [ ] Google Calendar sync
- [ ] App mobile (React Native)
- [ ] Dark mode
- [ ] Multilíngue (EN, ES, PT)

---

## 📞 DEBUGGING

### **Se tiver erro ao fazer login:**
```
1. Verifique .env.local
2. Verifique se Auth está habilitado no Supabase
3. Veja console do navegador (F12 → Console)
4. Verifique em Supabase → Logs
```

### **Se imagem não carrega:**
```
1. Verifique se bucket é público
2. Verifique URL retornada (deve ter .supabase.co)
3. Teste upload direto no Storage
4. Verifique CORS do browser
```

### **Se agendamento não salva:**
```
1. Verifique se fornecedor_id é válido
2. Verifique se data_evento está no formato yyyy-MM-dd
3. Abra DevTools → Network → veja erro da requisição
4. Verifique em Supabase → Logs
```

### **Se RLS bloqueia tudo:**
```
1. Verifique se policies estão criadas
2. Verifique se user está autenticado
3. Teste query direta no SQL Editor
4. Desative RLS temporariamente para debug:
   ALTER TABLE fornecedores DISABLE ROW LEVEL SECURITY;
```

---

## 🏁 GO-LIVE CHECKLIST

### **24 horas antes do launch:**
- [ ] Todos testes passando ✅
- [ ] RLS ativado e testado ✅
- [ ] ProtectedRoute implementado ✅
- [ ] Sem erros no console ✅
- [ ] Performance OK ✅

### **No dia do launch:**
- [ ] Backup do banco feito
- [ ] Variáveis de produção configuradas
- [ ] Domain apontando corretamente
- [ ] SSL certificado válido
- [ ] Monitoramento ativado
- [ ] Suporte avisado

### **Após launch:**
- [ ] Monitorar erros por 24h
- [ ] Responder rápido a issues
- [ ] Ter plano de rollback pronto

---

## 📊 ESTIMATIVA DE TEMPO

| Task | Tempo |
|------|-------|
| Setup inicial | 1-2h |
| Database | 30min |
| ProtectedRoute | 1h |
| Comodidades editáveis | 30min |
| Verificação propriedade | 1h |
| RLS setup | 1h |
| Testes completos | 3h |
| **TOTAL** | **~8-10h** |

---

**Próximo Passo:** Começar com Setup inicial e database!

