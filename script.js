// Minimal IA assistant front: mock actions
const email = document.getElementById('email');
const getStarted = document.getElementById('get-started');
const openApp = document.getElementById('open-app');

function saveLead(email){
  const leads = JSON.parse(localStorage.getItem('leads')||'[]');
  leads.push({email, ts: Date.now()});
  localStorage.setItem('leads', JSON.stringify(leads));
}

async function askAssistant(prompt){
  const resp = await fetch('https://api-inference.huggingface.co/models/google/gemma-2b-it',{
    method:'POST',headers:{'Authorization':'Bearer '+(localStorage.getItem('HF_KEY')||'')},
    body: JSON.stringify({inputs: prompt})
  });
  if(!resp.ok){
    return 'Assistant: Configurez votre clé API HuggingFace (localStorage.HF_KEY)';
  }
  const data = await resp.json();
  return data?.[0]?.generated_text || 'Réponse générée.';
}

getStarted?.addEventListener('click', async()=>{
  if(!email.value) return alert('Entrez votre email');
  saveLead(email.value);
  const copy = await askAssistant('Génère un message de bienvenue chaleureux pour un nouvel utilisateur SaaS.');
  alert(copy);
});

openApp?.addEventListener('click', ()=>{
  window.location.href = '/app.html';
});
