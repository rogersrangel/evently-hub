## 📄 **4. DEPLOY.md** (Deploy - Direto ao ponto)

```markdown
# 🚀 Deploy em Produção

## 1. Pré-requisitos
- Build local funcionando (`npm run build`)
- Domínio configurado (ex: `https://seu-app.vercel.app`)

## 2. Atualize Variáveis
No `.env.local` (ou painel do host):
```env
VITE_SUPABASE_URL=https://seu-projeto-prod.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-producao

3. Configure OAuth (Produção)
No Google Cloud Console:

Adicione domínio de produção às URLs

Ex: https://seu-app.vercel.app/auth/callback

No Supabase:

Atualize Site URL e Redirect URLs

Adicione domínio em CORS Origins (Settings → API)

4. Escolha seu Host
Vercel (Recomendado)

npm i -g vercel
vercel

Ou conecte repositório GitHub → Deploy automático.

Netlify
Conecte repositório

Build command: npm run build

Publish directory: dist

Cloudflare Pages
Pages → Create project

Build: npm run build

Output: /dist

5. Pós-deploy
Teste login Google

Verifique imagens carregam

Teste fluxo completo

✅ Pronto! Seu app está no ar.