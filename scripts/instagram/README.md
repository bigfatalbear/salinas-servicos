# Posts automáticos no Instagram

Pipeline: gera o card (1080x1350, JPEG), salva a legenda e publica via Instagram Graph API com agendamento no GitHub Actions.

## 1. Conta e app

1. O Instagram precisa ser conta **Profissional** (Empresa ou Criador) e estar vinculado a uma **Página do Facebook**.
2. Crie um app em https://developers.facebook.com (tipo Empresa) e adicione o produto **Instagram Graph API**.
3. No Graph API Explorer, com as permissões `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`, obtenha:
   - `IG_USER_ID`: em `GET /me/accounts` pegue a página e depois `GET /{page-id}?fields=instagram_business_account`.
   - Token de longa duração (~60 dias): `GET /oauth/access_token?grant_type=fb_exchange_token&client_id=...&client_secret=...&fb_exchange_token=...`.

## 2. Segredos no GitHub

Com GitHub CLI:

```powershell
gh secret set IG_USER_ID --repo bigfatalbear/salinas-servicos
gh secret set IG_ACCESS_TOKEN --repo bigfatalbear/salinas-servicos
```

## 3. Funcionamento

- `npm run instagram:generate` cria `content/instagram/AAAA-MM-DD-tipo-slug.jpg`, a legenda e `pending.json`.
- O workflow `.github/workflows/instagram.yml` roda seg/qua/sex às 09:00 (Bahia), commita o post e publica.
- A imagem é servida publicamente pelo `raw.githubusercontent.com` (repositório público), então a API consegue buscá-la.
- Para testar sem postar: Actions > Instagram > Run workflow desmarcando "Publicar".
- Para postar manualmente: `npm run instagram:generate` e depois `npm run instagram:publish` com `IG_USER_ID` e `IG_ACCESS_TOKEN` no ambiente.

## Limites da API

- Somente imagem JPEG (este pipeline já gera JPEG), vídeo MP4 ou carrossel.
- Até 25 publicações a cada 24 horas.
- Token expira em ~60 dias; renove e atualize o segredo.
- A conta pessoal do Instagram não funciona com a API de publicação.

## Ajustar o conteúdo

- Categorias, localidades, dicas e hashtags ficam em `scripts/instagram/generate.mjs`.
- O visual do card é montado em SVG no mesmo arquivo (`buildSvg`).
