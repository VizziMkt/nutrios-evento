// Recebe formulário no próprio domínio da Vercel e encaminha ao webhook Talkify.
// A URL do webhook fornecida pelo cliente fica apenas no servidor.
const TALKIFY_WEBHOOK = 'https://app.usetalkify.com.br/webhooks/api-leads?workspace_id=b3a30da4-005f-4b92-b5b8-1486aa05d388';
const allowedProfiles=new Set(['nutricionista','personal']);
function clip(value,max=250){return typeof value==='string'?value.trim().slice(0,max):'';}
module.exports = async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){
    res.setHeader('Allow','POST');
    return res.status(405).json({success:false,error:'method_not_allowed'});
  }
  const body=typeof req.body==='string'?(()=>{try{return JSON.parse(req.body)}catch(e){return null}})():req.body;
  if(!body||typeof body!=='object') return res.status(400).json({success:false,error:'bad_json'});
  const nome=clip(body.nome,120),email=clip(body.email,200),telefone=clip(body.telefone,24);
  const perfil=clip(body.perfil,30);
  if(!nome||!/^\S+@\S+\.\S+$/.test(email)||telefone.replace(/\D/g,'').length<10||!allowedProfiles.has(perfil)||body.consentimento!==true){
    return res.status(400).json({success:false,error:'invalid_lead'});
  }
  if(clip(body.website,200)) return res.status(200).json({success:true}); // honeypot
  const attrs={};
  for(const k of ['origem','utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','gclid','fbclid','msclkid','ttclid','landing_page','page_url','referrer']){
    attrs[k]=clip(body[k],k.includes('page')||k==='referrer'?1800:250);
  }
  // Envia dados principais e atribuição em formato JSON comum para captação via webhook.
  // Se o webhook contratado exigir um schema diferente, ajustar o mapeamento aqui.
  const payload={
    name:nome, phone:telefone, email,
    nome,telefone,perfil,origem:attrs.origem||'evento-28-novembro',
    source:attrs.utm_source||attrs.origem||'evento-28-novembro',
    consentimento:true, submitted_at:new Date().toISOString(),
    ...attrs,
    metadata:{perfil,evento:'nutrios_28_novembro',...attrs}
  };
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),12000);
  try{
    const upstream=await fetch(TALKIFY_WEBHOOK,{
      method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(payload),signal:controller.signal
    });
    const responseText=await upstream.text();
    if(!upstream.ok){
      console.error('Talkify webhook HTTP',upstream.status,responseText.slice(0,350));
      return res.status(502).json({success:false,error:'talkify_http_error'});
    }
    // Alguns webhooks devolvem 200 com success:false; respeitar falha explícita.
    try{
      const data=JSON.parse(responseText);
      if(data?.success===false||data?.error){
        console.error('Talkify webhook business error',JSON.stringify(data).slice(0,350));
        return res.status(502).json({success:false,error:'talkify_rejected'});
      }
    }catch(e){}
    return res.status(200).json({success:true});
  }catch(error){
    console.error('Talkify webhook failed:',error?.name||'network');
    return res.status(502).json({success:false,error:'talkify_unavailable'});
  }finally{clearTimeout(timeout);}
};
