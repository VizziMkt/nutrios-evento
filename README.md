# NutriOS — Site de captação para o evento 28/11

## Estrutura
- `/` — Landing page comercial (index.html)
- `/obrigado/` — Nutricionista: confirmação + entrada no grupo WhatsApp
- `/personal/` — Personal: texto sobre parceria + formulário de indicação

Todos são arquivos HTML estáticos, prontos para importar em um repositório GitHub e publicar pela Vercel sem build.

## O que está configurado
- Identidade visual e LP principal existentes mantidas.
- Link do grupo de WhatsApp na página `/obrigado/`:
  https://chat.whatsapp.com/BNAAUV4fiR1FhBzSLA6cKC?mode=gi_t
- VSL do personal temporariamente escondida, substituída por texto explicativo.
- Fluxo preparado para redirecionar após um envio **confirmado** pelo destino dos leads:
  Nutricionista -> `/obrigado/`; Personal -> `/personal/`.

## PENDÊNCIAS PARA CAPTAÇÃO REAL (não publicar como fluxo ativo antes de resolver)
1. **Talkify:** editar `index.html` e configurar `TALKIFY_PUBLIC_ENDPOINT`. Confirmar com a equipe Talkify o formato exato de envio, autenticação, CORS e critério de sucesso. O exemplo `fetch` do HTML é apenas estrutura preparada e pode precisar de ajuste. Não colocar segredos ou tokens privados em HTML aberto; se o endpoint exigir autenticação, usar função serverless segura.
2. **Personal:** editar `personal/index.html` e configurar `JEFFERSON_WHATSAPP` com DDI 55 + DDD + número, apenas dígitos. Sem o número, o botão não consegue encaminhar indicação. Esse formulário usa `wa.me`, abre o WhatsApp do próprio usuário e **não envia automaticamente**.
3. **Política de privacidade:** inserir o link/aviso oficial na LP, e confirmar textos de consentimento.
4. **VSL:** quando disponível, ativar bloco e inserir o vídeo. O texto atual foi incluído apenas provisoriamente.
5. **QA:** simular cadastro de cada perfil, confirmar armazenamento, redirecionamento, grupo, WhatsApp e visual móvel.

## GitHub + Vercel
1. Criar novo repositório no GitHub, ex.: `nutrios-evento`.
2. Fazer upload **do conteúdo da pasta** (não da pasta como subdiretório).
3. Em Vercel: Add New Project -> Import repository -> Framework Preset: Other -> Root Directory `./`.
4. Deploy. Para site estático, sem comandos de build.
5. Verificar `/`, `/obrigado/` e `/personal/`.
6. Adicionar domínio/subdomínio no painel Vercel e configurar os DNS fornecidos ali.

**Atenção:** a LP não confirma inscrição e nem redireciona enquanto Talkify não estiver integrado. Isso evita perder leads silenciosamente.
