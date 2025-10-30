// Enhanced AI SaaS Platform - Complete Functionality

// API Configuration
const API_CONFIG = {
  huggingface: 'https://api-inference.huggingface.co/models/google/gemma-2b-it',
  openai: 'https://api.openai.com/v1/chat/completions' // Backup option
};

// State Management
let currentTab = 'dashboard';
let userCredits = 100;
let chatHistory = [];

// Utility Functions
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key, defaultValue = null) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
}

function updateCredits(used) {
  userCredits = Math.max(0, userCredits - used);
  document.getElementById('user-credits').textContent = `Credits: ${userCredits}`;
  saveToStorage('userCredits', userCredits);
}

function showProgress(elementId, duration = 3000) {
  const progressBar = document.getElementById(elementId);
  if (!progressBar) return;
  
  progressBar.style.width = '0%';
  let progress = 0;
  const interval = setInterval(() => {
    progress += 100 / (duration / 100);
    progressBar.style.width = Math.min(progress, 100) + '%';
    if (progress >= 100) clearInterval(interval);
  }, 100);
}

// AI API Call Function
async function callAI(prompt, model = 'huggingface') {
  const key = localStorage.getItem('HF_KEY') || localStorage.getItem('OPENAI_KEY');
  if (!key) {
    return 'Configurez votre clé API (HuggingFace ou OpenAI) via Paramètres';
  }

  try {
    let response;
    if (model === 'huggingface') {
      response = await fetch(API_CONFIG.huggingface, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: prompt })
      });
    } else {
      response = await fetch(API_CONFIG.openai, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000
        })
      });
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (model === 'huggingface') {
      return data[0]?.generated_text || 'Réponse générée';
    } else {
      return data.choices[0]?.message?.content || 'Réponse générée';
    }
  } catch (error) {
    console.error('AI API Error:', error);
    return `Erreur API: ${error.message}. Vérifiez votre clé API.`;
  }
}

// Tab Management
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.add('hidden');
  });
  
  // Remove active from all sidebar links
  document.querySelectorAll('.sidebar a').forEach(link => {
    link.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(`${tabName}-tab`).classList.remove('hidden');
  
  // Add active to selected sidebar link
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  
  currentTab = tabName;
}

// Content Type Switcher (for content generation)
function showContentType(type) {
  document.querySelectorAll('.content-type').forEach(ct => ct.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  document.getElementById(`${type}-content`).classList.remove('hidden');
  event.target.classList.add('active');
}

// Chat Functionality
function addMessageToChat(message, isUser = false) {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
  messageDiv.textContent = message;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  chatHistory.push({ role: isUser ? 'user' : 'assistant', content: message });
  saveToStorage('chatHistory', chatHistory);
}

// Template System
const templates = {
  prospection: {
    title: "Email de Prospection B2B",
    prompt: "Écris un email de prospection B2B professionnel et personnalisé. Include: accroche personnalisée, valeur proposition claire, CTA simple. Ton: professionnel mais humain. Maximum 150 mots."
  },
  'sales-page': {
    title: "Page de Vente",
    prompt: "Crée une structure de page de vente complète avec: titre accrocheur, problème identifié, solution présentée, bénéfices, preuve sociale, FAQ, CTA multiple. Format: plan détaillé avec exemples."
  },
  'press-release': {
    title: "Communiqué de Presse",
    prompt: "Rédige un communiqué de presse professionnel avec: titre percutant, lead informatif, quotes, faits chiffrés, contact presse. Format journalistique standard."
  },
  onboarding: {
    title: "Séquence Onboarding",
    prompt: "Crée une séquence d'onboarding email de 7 jours. Chaque email avec: objectif, sujet, contenu principal, CTA. Focus: engagement et activation utilisateur."
  },
  'linkedin-post': {
    title: "Post LinkedIn Viral",
    prompt: "Écris un post LinkedIn viral avec structure: hook fort (première ligne), story personnelle, insight/apprentissage, CTA engagement. Inclus emojis stratégiques. 200-300 mots."
  },
  webinar: {
    title: "Script Webinaire",
    prompt: "Crée un script de webinaire de vente structuré: introduction engageante, présentation problème, solution détaillée, démonstration, objections traitées, offre, urgence, CTA."
  }
};

function useTemplate(templateKey) {
  const template = templates[templateKey];
  if (!template) return;
  
  switchTab('content');
  setTimeout(() => {
    document.getElementById('content-output').textContent = `Génération du template: ${template.title}...`;
    generateContent(template.prompt, 'content-output', 'content-progress');
  }, 300);
}

// Content Generation
async function generateContent(prompt, outputId, progressId) {
  const outputElement = document.getElementById(outputId);
  if (!outputElement) return;
  
  outputElement.textContent = 'Génération en cours...';
  showProgress(progressId);
  updateCredits(1);
  
  try {
    const result = await callAI(prompt);
    outputElement.textContent = result;
  } catch (error) {
    outputElement.textContent = `Erreur: ${error.message}`;
  }
}

// URL Analysis
async function analyzeURL(url) {
  const outputElement = document.getElementById('url-output');
  outputElement.textContent = 'Analyse en cours...';
  
  const prompt = `Analyse cette URL et fournis un résumé structuré en 5 points clés: ${url}. Inclus: thème principal, points importants, audience cible, call-to-action, valeur ajoutée.`;
  
  updateCredits(2);
  try {
    const result = await callAI(prompt);
    outputElement.textContent = result;
  } catch (error) {
    outputElement.textContent = `Erreur d'analyse: ${error.message}`;
  }
}

// Settings Management
function openSettings() {
  const hfKey = localStorage.getItem('HF_KEY') || '';
  const openaiKey = localStorage.getItem('OPENAI_KEY') || '';
  
  const newHfKey = prompt('Clé HuggingFace (laisser vide pour garder actuelle):', hfKey);
  if (newHfKey !== null && newHfKey.trim() !== '') {
    localStorage.setItem('HF_KEY', newHfKey.trim());
  }
  
  const newOpenaiKey = prompt('Clé OpenAI (optionnel, laisser vide pour garder actuelle):', openaiKey);
  if (newOpenaiKey !== null && newOpenaiKey.trim() !== '') {
    localStorage.setItem('OPENAI_KEY', newOpenaiKey.trim());
  }
  
  alert('Paramètres sauvegardés!');
}

// Initialize Application
function initApp() {
  // Load saved data
  userCredits = getFromStorage('userCredits', 100);
  chatHistory = getFromStorage('chatHistory', []);
  
  // Update UI
  document.getElementById('user-credits').textContent = `Credits: ${userCredits}`;
  
  // Restore chat history
  const chatMessages = document.getElementById('chat-messages');
  if (chatMessages) {
    chatHistory.forEach(msg => {
      addMessageToChat(msg.content, msg.role === 'user');
    });
  }
  
  // Event Listeners
  setupEventListeners();
}

function setupEventListeners() {
  // Sidebar navigation
  document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = link.getAttribute('data-tab');
      switchTab(tabName);
    });
  });
  
  // Settings button
  const settingsBtn = document.getElementById('settings-btn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', openSettings);
  }
  
  // Upgrade button
  const upgradeBtn = document.getElementById('upgrade-btn');
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
      alert('Redirection vers Stripe checkout - À implémenter');
    });
  }
  
  // Chat functionality
  const chatSend = document.getElementById('chat-send');
  const chatInput = document.getElementById('chat-input');
  
  if (chatSend && chatInput) {
    chatSend.addEventListener('click', async () => {
      const message = chatInput.value.trim();
      if (!message) return;
      
      addMessageToChat(message, true);
      chatInput.value = '';
      
      updateCredits(1);
      const response = await callAI(message);
      addMessageToChat(response, false);
    });
    
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatSend.click();
      }
    });
  }
  
  // Content generation
  const generateArticle = document.getElementById('generate-article');
  if (generateArticle) {
    generateArticle.addEventListener('click', () => {
      const topic = document.getElementById('article-topic').value;
      const tone = document.getElementById('article-tone').value;
      
      if (!topic) {
        alert('Veuillez saisir un sujet d\'article');
        return;
      }
      
      const prompt = `Écris un article SEO complet sur le sujet: "${topic}". Ton: ${tone}. Structure: titre H1, introduction accrocheuse, 3-4 sections H2 avec sous-sections H3, conclusion avec CTA. 800-1200 mots. Inclus des mots-clés naturellement.`;
      
      generateContent(prompt, 'content-output', 'content-progress');
    });
  }
  
  const generateSocial = document.getElementById('generate-social');
  if (generateSocial) {
    generateSocial.addEventListener('click', () => {
      const topic = document.getElementById('social-topic').value;
      const platform = document.getElementById('social-platform').value;
      
      if (!topic) {
        alert('Veuillez saisir un sujet de post');
        return;
      }
      
      const prompt = `Crée un post ${platform} viral sur: "${topic}". Adapte le format à la plateforme. Inclus: hook fort, storytelling, call-to-action, hashtags pertinents. Optimisé engagement.`;
      
      generateContent(prompt, 'content-output', 'content-progress');
    });
  }
  
  // URL Analysis
  const analyzeUrl = document.getElementById('analyze-url');
  if (analyzeUrl) {
    analyzeUrl.addEventListener('click', () => {
      const url = document.getElementById('url-input').value.trim();
      if (!url) {
        alert('Veuillez saisir une URL');
        return;
      }
      
      analyzeURL(url);
    });
  }
  
  // Document analysis (placeholder)
  const analyzeDoc = document.getElementById('analyze-doc');
  if (analyzeDoc) {
    analyzeDoc.addEventListener('click', () => {
      const fileInput = document.getElementById('doc-upload');
      if (!fileInput.files.length) {
        alert('Veuillez sélectionner un document');
        return;
      }
      
      document.getElementById('doc-output').textContent = 'Analyse de documents sera implémentée prochainement avec backend.';
    });
  }
}

// Auto-save stats simulation
function updateStats() {
  const stats = {
    requests: Math.floor(Math.random() * 50) + 100,
    words: (Math.floor(Math.random() * 5000) + 10000),
    time: Math.floor(Math.random() * 10) + 20,
    conversion: (Math.random() * 5 + 5).toFixed(1)
  };
  
  document.getElementById('requests-count').textContent = stats.requests;
  document.getElementById('words-generated').textContent = (stats.words / 1000).toFixed(1) + 'K';
  document.getElementById('time-saved').textContent = stats.time + 'h';
  document.getElementById('conversion-rate').textContent = stats.conversion + '%';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  updateStats();
  
  // Update stats every 30 seconds
  setInterval(updateStats, 30000);
});

// Legacy support for existing script.js functionality
if (typeof window !== 'undefined') {
  window.switchTab = switchTab;
  window.useTemplate = useTemplate;
  window.showContentType = showContentType;
}