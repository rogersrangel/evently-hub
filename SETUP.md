# ⚙️ Setup Rápido

## 1. Clone e Instale
```bash
git clone https://github.com/rogersrangel/evently-hub.git
cd evently-hub
npm install

2. Configure o Ambiente
Crie .env.local com:

VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima

3. Banco de Dados
Crie projeto em supabase.com

Execute scripts em DATABASE.md

Crie bucket imagens-servicos (Storage)

4. Google Login (Opcional)
Para login com Google:

Crie projeto no Google Cloud

Configure OAuth (veja guia completo abaixo)

Adicione URLs no Supabase

5. Execute

npm run dev

Acesse: http://localhost:5173


🔐 Configuração do Google OAuth
Passo a Passo:
Google Cloud Console

Novo projeto → Ative Google+ API

Credenciais → Criar OAuth Client ID

URLs: http://localhost:5173 e http://localhost:5173/auth/callback

Supabase Dashboard

Authentication → Providers → Google

Cole Client ID e Secret

Site URL: http://localhost:5173

Redirect: http://localhost:5173/auth/callback

Teste

Acesse /login

Clique "Continuar com Google"

⚡ Comandos Úteis

npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run preview  # Teste build

