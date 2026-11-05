# NutriOS — Landing Page + Talkify (GitHub / Vercel)

## O que mudou
- Script oficial **Talkify Analytics** colocado no `<head>` de **todas as três páginas** para mensuração de pageviews e aquisição.
- Formulário principal envia nome, telefone, e-mail, perfil profissional, consentimento, origem, URL, referenciador, UTMs e click IDs para `POST /api/lead`.
- A função **Vercel serverless** em `api/lead.js` encaminha o cadastro ao webhook Talkify informado pela equipe.
- O lead só é redirecionado depois de o webhook retornar uma resposta de sucesso. Nutricionista -> `/obrigado/`; personal -> `/personal/`.
- Evento `Lead` enviado ao `window.dataLayer` **na página de conclusão**, uma vez por cadastro confirmado, sem dados pessoais. Também há evento de navegador `nutrios:lead`.
- Grupo WhatsApp do nutricionista foi mantido; a VSL do personal segue oculta.

## Publicação
1. Extraia o ZIP. Suba **todo o conteúdo** da pasta na raiz de um repositório GitHub, incluindo a pasta `api/`.
2. Na Vercel, importe o repositório como projeto com preset `Other`. **Não selecione saída estática que exclua funções serverless.** Não há comando de build.
3. Aplique o deploy e abra `/`, `/obrigado/`, `/personal/`.
4. Teste o formulário no site publicado com um contato de teste e confirme **no painel Talkify** se o lead, o perfil e UTMs foram armazenados. Confirme também o redirecionamento.
5. Verifique os pageviews no Talkify Analytics e o evento `Lead` no `dataLayer` (ou conecte-o ao GTM/GA4, caso deseje métricas de conversão nesse destino).

## Atenção importante
- **Não foi possível testar o webhook com um lead real aqui**, pois isso criaria um registro de teste na conta do cliente. O código está integrado, mas a resposta real e o esquema exato aceito pelo Talkify precisam ser confirmados após o deploy. Se Talkify exigir outros nomes de campos, ajuste `api/lead.js`.
- O `Lead` no `dataLayer` não garante que o widget Talkify reconheça esse evento customizado; depende das configurações do widget. O próprio analytics do Talkify deve contabilizar pageviews. Para contabilizar conversão diretamente no Talkify, valide se ele registra o webhook como lead ou requer um evento específico.
- A página do personal ainda precisa do **número do Jefferson** para que o botão de indicação funcione; isso é independente do formulário de inscrição principal.
- Publicar a **política de privacidade** oficial e conferir os avisos de consentimento antes de divulgar.
- O webhook do Talkify, fornecido pela VSales, está no lado do servidor (`api/lead.js`), não no navegador.
