// Modal Components and State Management for AI SaaS Platform
// Handles: Registration, Demo booking, Pricing selection, Contact forms

// Global modal state
let modalState = {
  currentModal: null,
  isOpen: false
};

// Modal HTML Templates
const modalTemplates = {
  signup: `
    <div class="modal-overlay" id="signup-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>🚀 Créer votre compte gratuit</h2>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="signup-form">
            <div class="input-group">
              <label>Email professionnel</label>
              <input type="email" id="signup-email" required placeholder="votre@entreprise.com" />
            </div>
            <div class="input-group">
              <label>Nom complet</label>
              <input type="text" id="signup-name" required placeholder="Jean Dupont" />
            </div>
            <div class="input-group">
              <label>Entreprise</label>
              <input type="text" id="signup-company" placeholder="Nom de votre entreprise" />
            </div>
            <div class="input-group">
              <label>Mot de passe</label>
              <input type="password" id="signup-password" required minlength="8" placeholder="Minimum 8 caractères" />
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="signup-terms" required />
              <label for="signup-terms">J'accepte les <a href="/terms" target="_blank">conditions d'utilisation</a> et la <a href="/privacy" target="_blank">politique de confidentialité</a></label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="signup-newsletter" checked />
              <label for="signup-newsletter">Recevoir nos conseils marketing et IA (1x/semaine max)</label>
            </div>
            <button type="submit" class="btn primary full-width">Créer mon compte gratuit</button>
          </form>
          <div class="modal-footer">
            <p>Déjà un compte? <a href="#" onclick="openModal('login')">Se connecter</a></p>
            <div class="trust-indicators">
              <span>🔒 Chiffrement SSL</span>
              <span>🛡️ Conforme RGPD</span>
              <span>✨ 100 crédits offerts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  
  login: `
    <div class="modal-overlay" id="login-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>👋 Connexion à votre compte</h2>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="login-form">
            <div class="input-group">
              <label>Email</label>
              <input type="email" id="login-email" required placeholder="votre@email.com" />
            </div>
            <div class="input-group">
              <label>Mot de passe</label>
              <input type="password" id="login-password" required placeholder="Votre mot de passe" />
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="login-remember" />
              <label for="login-remember">Se souvenir de moi</label>
            </div>
            <button type="submit" class="btn primary full-width">Se connecter</button>
          </form>
          <div class="modal-footer">
            <p><a href="#" onclick="openModal('reset-password')">Mot de passe oublié?</a></p>
            <p>Nouveau? <a href="#" onclick="openModal('signup')">Créer un compte gratuit</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  
  demo: `
    <div class="modal-overlay" id="demo-modal">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h2>📅 Réserver votre démo personnalisée</h2>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="demo-intro">
            <p><strong>Découvrez comment AI SaaS peut transformer votre business en 30 minutes</strong></p>
            <div class="demo-benefits">
              <div class="benefit">✅ Analyse gratuite de vos besoins</div>
              <div class="benefit">✅ Démonstration personnalisée</div>
              <div class="benefit">✅ ROI estimé pour votre entreprise</div>
              <div class="benefit">✅ Stratégie d'implémentation</div>
            </div>
          </div>
          <form id="demo-form">
            <div class="form-row">
              <div class="input-group">
                <label>Nom complet *</label>
                <input type="text" id="demo-name" required placeholder="Jean Dupont" />
              </div>
              <div class="input-group">
                <label>Email professionnel *</label>
                <input type="email" id="demo-email" required placeholder="jean@entreprise.com" />
              </div>
            </div>
            <div class="form-row">
              <div class="input-group">
                <label>Téléphone</label>
                <input type="tel" id="demo-phone" placeholder="+33 6 12 34 56 78" />
              </div>
              <div class="input-group">
                <label>Entreprise *</label>
                <input type="text" id="demo-company" required placeholder="Nom de votre entreprise" />
              </div>
            </div>
            <div class="input-group">
              <label>Taille de l'équipe</label>
              <select id="demo-team-size">
                <option>1-5 personnes</option>
                <option>6-20 personnes</option>
                <option>21-50 personnes</option>
                <option>51-100 personnes</option>
                <option>100+ personnes</option>
              </select>
            </div>
            <div class="input-group">
              <label>Principaux défis actuels</label>
              <div class="checkbox-grid">
                <label><input type="checkbox" value="content-creation" /> Création de contenu</label>
                <label><input type="checkbox" value="lead-generation" /> Génération de leads</label>
                <label><input type="checkbox" value="customer-support" /> Support client</label>
                <label><input type="checkbox" value="data-analysis" /> Analyse de données</label>
                <label><input type="checkbox" value="automation" /> Automatisation</label>
                <label><input type="checkbox" value="scaling" /> Montée en charge</label>
              </div>
            </div>
            <div class="input-group">
              <label>Créneaux préférés</label>
              <div class="time-slots">
                <label><input type="radio" name="time-slot" value="morning" /> Matin (9h-12h)</label>
                <label><input type="radio" name="time-slot" value="afternoon" /> Après-midi (14h-17h)</label>
                <label><input type="radio" name="time-slot" value="evening" /> Fin de journée (17h-19h)</label>
              </div>
            </div>
            <div class="input-group">
              <label>Message complémentaire</label>
              <textarea id="demo-message" placeholder="Parlez-nous de vos objectifs spécifiques..."></textarea>
            </div>
            <button type="submit" class="btn primary full-width">Réserver ma démo gratuite</button>
          </form>
          <div class="modal-footer">
            <p class="demo-note">🎯 <strong>100% gratuit</strong> • Sans engagement • Réponse sous 2h ouvrées</p>
          </div>
        </div>
      </div>
    </div>
  `,
  
  pricing: `
    <div class="modal-overlay" id="pricing-modal">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h2>💎 Choisissez votre plan</h2>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="pricing-toggle">
            <label class="switch">
              <input type="checkbox" id="pricing-toggle" onchange="togglePricing()" />
              <span class="slider"></span>
            </label>
            <span>Paiement annuel (-20%)</span>
          </div>
          <div class="pricing-plans">
            <div class="plan-card">
              <div class="plan-header">
                <h3>Gratuit</h3>
                <div class="plan-price">
                  <span class="price">0€</span>
                  <span class="period">/mois</span>
                </div>
              </div>
              <div class="plan-features">
                <div class="feature">✅ 100 requêtes IA/mois</div>
                <div class="feature">✅ Templates de base</div>
                <div class="feature">✅ Support communautaire</div>
                <div class="feature">✅ Export PDF/TXT</div>
                <div class="feature-disabled">❌ Automatisations</div>
                <div class="feature-disabled">❌ Intégrations</div>
              </div>
              <button class="btn outline full-width" onclick="selectPlan('free')">Plan actuel</button>
            </div>
            
            <div class="plan-card popular">
              <div class="plan-badge">Le plus populaire</div>
              <div class="plan-header">
                <h3>Pro</h3>
                <div class="plan-price">
                  <span class="price monthly-price">99€</span>
                  <span class="price yearly-price hidden">79€</span>
                  <span class="period">/mois</span>
                </div>
                <div class="plan-savings yearly-savings hidden">Économisez 240€/an</div>
              </div>
              <div class="plan-features">
                <div class="feature">✅ Requêtes IA illimitées</div>
                <div class="feature">✅ Tous les templates premium</div>
                <div class="feature">✅ Automatisations avancées</div>
                <div class="feature">✅ Intégrations Slack/Notion</div>
                <div class="feature">✅ Support prioritaire</div>
                <div class="feature">✅ Analyse concurrentielle</div>
                <div class="feature">✅ Équipe jusqu'à 5 personnes</div>
              </div>
              <button class="btn primary full-width" onclick="selectPlan('pro')">Choisir Pro</button>
            </div>
            
            <div class="plan-card">
              <div class="plan-header">
                <h3>Enterprise</h3>
                <div class="plan-price">
                  <span class="price monthly-price">299€</span>
                  <span class="price yearly-price hidden">239€</span>
                  <span class="period">/mois</span>
                </div>
                <div class="plan-savings yearly-savings hidden">Économisez 720€/an</div>
              </div>
              <div class="plan-features">
                <div class="feature">✅ Tout du plan Pro</div>
                <div class="feature">✅ SSO/SCIM</div>
                <div class="feature">✅ Conformité SOC2/RGPD</div>
                <div class="feature">✅ Équipes illimitées</div>
                <div class="feature">✅ Support dédié 24/7</div>
                <div class="feature">✅ SLA 99.9% uptime</div>
                <div class="feature">✅ Formation personnalisée</div>
              </div>
              <button class="btn outline full-width" onclick="selectPlan('enterprise')">Nous contacter</button>
            </div>
          </div>
          <div class="pricing-guarantee">
            <p>🛡️ <strong>Garantie satisfait ou remboursé 30 jours</strong></p>
            <p>🔄 Changement de plan possible à tout moment</p>
          </div>
        </div>
      </div>
    </div>
  `,
  
  contact: `
    <div class="modal-overlay" id="contact-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>📞 Contactez notre équipe</h2>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="contact-intro">
            <p>Notre équipe d'experts vous accompagne dans votre projet</p>
            <div class="contact-stats">
              <div class="stat">⚡ Réponse sous 2h</div>
              <div class="stat">🎯 Conseils personnalisés</div>
              <div class="stat">💰 Devis gratuit</div>
            </div>
          </div>
          <form id="contact-form">
            <div class="form-row">
              <div class="input-group">
                <label>Nom *</label>
                <input type="text" id="contact-name" required />
              </div>
              <div class="input-group">
                <label>Email *</label>
                <input type="email" id="contact-email" required />
              </div>
            </div>
            <div class="form-row">
              <div class="input-group">
                <label>Téléphone</label>
                <input type="tel" id="contact-phone" />
              </div>
              <div class="input-group">
                <label>Entreprise *</label>
                <input type="text" id="contact-company" required />
              </div>
            </div>
            <div class="input-group">
              <label>Budget estimé</label>
              <select id="contact-budget">
                <option>Moins de 1000€/mois</option>
                <option>1000€ - 5000€/mois</option>
                <option>5000€ - 10000€/mois</option>
                <option>Plus de 10000€/mois</option>
                <option>À déterminer</option>
              </select>
            </div>
            <div class="input-group">
              <label>Type de projet</label>
              <select id="contact-project-type">
                <option>Implementation Enterprise</option>
                <option>Formation équipe</option>
                <option>Intégration personnalisée</option>
                <option>Consulting stratégique</option>
                <option>Support technique</option>
                <option>Autre</option>
              </select>
            </div>
            <div class="input-group">
              <label>Décrivez votre projet *</label>
              <textarea id="contact-message" required placeholder="Décrivez vos objectifs, défis actuels et attentes..."></textarea>
            </div>
            <button type="submit" class="btn primary full-width">Envoyer ma demande</button>
          </form>
          <div class="modal-footer">
            <div class="contact-methods">
              <div>📧 contact@ai-saas.com</div>
              <div>📱 +33 1 40 00 00 00</div>
              <div>💬 Chat en direct sur le site</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  
  'reset-password': `
    <div class="modal-overlay" id="reset-password-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>🔐 Réinitialiser le mot de passe</h2>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="reset-password-form">
            <div class="input-group">
              <label>Email de votre compte</label>
              <input type="email" id="reset-email" required placeholder="votre@email.com" />
            </div>
            <p class="form-note">Nous vous enverrons un lien de réinitialisation par email.</p>
            <button type="submit" class="btn primary full-width">Envoyer le lien</button>
          </form>
          <div class="modal-footer">
            <p><a href="#" onclick="openModal('login')">Retour à la connexion</a></p>
          </div>
        </div>
      </div>
    </div>
  `
};

// Modal Functionality
function openModal(modalType) {
  // Close any existing modal first
  closeModal();
  
  // Create modal container if it doesn't exist
  let modalContainer = document.getElementById('modal-container');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    document.body.appendChild(modalContainer);
  }
  
  // Insert modal HTML
  if (modalTemplates[modalType]) {
    modalContainer.innerHTML = modalTemplates[modalType];
    modalState.currentModal = modalType;
    modalState.isOpen = true;
    
    // Add event listeners
    setupModalEventListeners(modalType);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
      const firstInput = modalContainer.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 100);
    
    // Track modal opening
    trackEvent('modal_opened', { modal_type: modalType });
  }
}

function closeModal() {
  const modalContainer = document.getElementById('modal-container');
  if (modalContainer) {
    modalContainer.innerHTML = '';
  }
  
  modalState.currentModal = null;
  modalState.isOpen = false;
  
  // Restore body scroll
  document.body.style.overflow = '';
}

// Modal Event Listeners Setup
function setupModalEventListeners(modalType) {
  const modal = document.getElementById(`${modalType}-modal`);
  if (!modal) return;
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close on escape key
  document.addEventListener('keydown', handleEscapeKey);
  
  // Setup form submission
  const form = modal.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmission(modalType, form);
    });
  }
}

function handleEscapeKey(e) {
  if (e.key === 'Escape' && modalState.isOpen) {
    closeModal();
  }
}

// Form Submission Handlers
function handleFormSubmission(modalType, form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  switch (modalType) {
    case 'signup':
      handleSignup(data);
      break;
    case 'login':
      handleLogin(data);
      break;
    case 'demo':
      handleDemoBooking(data);
      break;
    case 'contact':
      handleContactSubmission(data);
      break;
    case 'reset-password':
      handlePasswordReset(data);
      break;
  }
}

async function handleSignup(data) {
  const submitBtn = document.querySelector('#signup-form button[type="submit"]');
  submitBtn.innerHTML = '<span class="spinner"></span> Création du compte...';
  submitBtn.disabled = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save user data locally (in real app, this would be API call)
    const userData = {
      email: data.email || document.getElementById('signup-email').value,
      name: data.name || document.getElementById('signup-name').value,
      company: data.company || document.getElementById('signup-company').value,
      createdAt: new Date().toISOString(),
      plan: 'free',
      credits: 100
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Track conversion
    trackEvent('user_signup', { source: 'modal' });
    
    // Success feedback
    showSuccessMessage('Compte créé avec succès! Redirection vers l\'application...');
    
    setTimeout(() => {
      closeModal();
      window.location.href = '/app.html';
    }, 1500);
    
  } catch (error) {
    showErrorMessage('Erreur lors de la création du compte. Veuillez réessayer.');
    submitBtn.innerHTML = 'Créer mon compte gratuit';
    submitBtn.disabled = false;
  }
}

async function handleLogin(data) {
  const submitBtn = document.querySelector('#login-form button[type="submit"]');
  submitBtn.innerHTML = '<span class="spinner"></span> Connexion...';
  submitBtn.disabled = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user exists (in real app, this would be API validation)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      localStorage.setItem('isLoggedIn', 'true');
      trackEvent('user_login', { source: 'modal' });
      
      showSuccessMessage('Connexion réussie! Redirection...');
      
      setTimeout(() => {
        closeModal();
        window.location.href = '/app.html';
      }, 1000);
    } else {
      throw new Error('Utilisateur non trouvé');
    }
    
  } catch (error) {
    showErrorMessage('Email ou mot de passe incorrect.');
    submitBtn.innerHTML = 'Se connecter';
    submitBtn.disabled = false;
  }
}

async function handleDemoBooking(data) {
  const submitBtn = document.querySelector('#demo-form button[type="submit"]');
  submitBtn.innerHTML = '<span class="spinner"></span> Réservation...';
  submitBtn.disabled = true;
  
  try {
    // Collect form data
    const demoData = {
      name: document.getElementById('demo-name').value,
      email: document.getElementById('demo-email').value,
      phone: document.getElementById('demo-phone').value,
      company: document.getElementById('demo-company').value,
      teamSize: document.getElementById('demo-team-size').value,
      challenges: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value),
      timeSlot: document.querySelector('input[name="time-slot"]:checked')?.value,
      message: document.getElementById('demo-message').value,
      timestamp: new Date().toISOString()
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save demo request locally
    const existingDemos = JSON.parse(localStorage.getItem('demoRequests') || '[]');
    existingDemos.push(demoData);
    localStorage.setItem('demoRequests', JSON.stringify(existingDemos));
    
    // Track conversion
    trackEvent('demo_requested', { 
      company: demoData.company, 
      team_size: demoData.teamSize 
    });
    
    // Show success with next steps
    showSuccessMessage(`Démo réservée! Nous vous contactons sous 2h à ${demoData.email}`);
    
    setTimeout(() => {
      closeModal();
      // Optionally redirect to thank you page
    }, 2000);
    
  } catch (error) {
    showErrorMessage('Erreur lors de la réservation. Veuillez réessayer.');
    submitBtn.innerHTML = 'Réserver ma démo gratuite';
    submitBtn.disabled = false;
  }
}

async function handleContactSubmission(data) {
  const submitBtn = document.querySelector('#contact-form button[type="submit"]');
  submitBtn.innerHTML = '<span class="spinner"></span> Envoi...';
  submitBtn.disabled = true;
  
  try {
    // Collect form data
    const contactData = {
      name: document.getElementById('contact-name').value,
      email: document.getElementById('contact-email').value,
      phone: document.getElementById('contact-phone').value,
      company: document.getElementById('contact-company').value,
      budget: document.getElementById('contact-budget').value,
      projectType: document.getElementById('contact-project-type').value,
      message: document.getElementById('contact-message').value,
      timestamp: new Date().toISOString()
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Save contact request locally
    const existingContacts = JSON.parse(localStorage.getItem('contactRequests') || '[]');
    existingContacts.push(contactData);
    localStorage.setItem('contactRequests', JSON.stringify(existingContacts));
    
    // Track conversion
    trackEvent('contact_submitted', { 
      project_type: contactData.projectType,
      budget: contactData.budget
    });
    
    showSuccessMessage('Message envoyé! Notre équipe vous contactera dans les 2h.');
    
    setTimeout(() => {
      closeModal();
    }, 2000);
    
  } catch (error) {
    showErrorMessage('Erreur lors de l\'envoi. Veuillez réessayer.');
    submitBtn.innerHTML = 'Envoyer ma demande';
    submitBtn.disabled = false;
  }
}

async function handlePasswordReset(data) {
  const submitBtn = document.querySelector('#reset-password-form button[type="submit"]');
  submitBtn.innerHTML = '<span class="spinner"></span> Envoi...';
  submitBtn.disabled = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    trackEvent('password_reset_requested');
    
    showSuccessMessage('Email de réinitialisation envoyé! Vérifiez votre boîte de réception.');
    
    setTimeout(() => {
      closeModal();
    }, 2000);
    
  } catch (error) {
    showErrorMessage('Erreur lors de l\'envoi. Veuillez réessayer.');
    submitBtn.innerHTML = 'Envoyer le lien';
    submitBtn.disabled = false;
  }
}

// Pricing Functions
function togglePricing() {
  const toggle = document.getElementById('pricing-toggle');
  const monthlyPrices = document.querySelectorAll('.monthly-price');
  const yearlyPrices = document.querySelectorAll('.yearly-price');
  const yearlySavings = document.querySelectorAll('.yearly-savings');
  
  if (toggle.checked) {
    // Show yearly pricing
    monthlyPrices.forEach(el => el.classList.add('hidden'));
    yearlyPrices.forEach(el => el.classList.remove('hidden'));
    yearlySavings.forEach(el => el.classList.remove('hidden'));
  } else {
    // Show monthly pricing
    monthlyPrices.forEach(el => el.classList.remove('hidden'));
    yearlyPrices.forEach(el => el.classList.add('hidden'));
    yearlySavings.forEach(el => el.classList.add('hidden'));
  }
}

function selectPlan(planType) {
  trackEvent('plan_selected', { plan: planType });
  
  switch (planType) {
    case 'free':
      showSuccessMessage('Vous utilisez déjà le plan gratuit!');
      setTimeout(closeModal, 1500);
      break;
      
    case 'pro':
      // In real app, redirect to Stripe checkout
      showSuccessMessage('Redirection vers le paiement sécurisé...');
      setTimeout(() => {
        closeModal();
        // window.location.href = '/checkout?plan=pro';
        alert('Redirection vers Stripe checkout - À implémenter');
      }, 1500);
      break;
      
    case 'enterprise':
      closeModal();
      setTimeout(() => openModal('contact'), 300);
      break;
  }
}

// Utility Functions
function showSuccessMessage(message) {
  showNotification(message, 'success');
}

function showErrorMessage(message) {
  showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()">&times;</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

function trackEvent(eventName, data = {}) {
  // Analytics tracking (implement with your analytics service)
  console.log('Event tracked:', eventName, data);
  
  // Store events locally for analytics
  const events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
  events.push({
    event: eventName,
    data: data,
    timestamp: new Date().toISOString(),
    url: window.location.href
  });
  
  // Keep only last 100 events
  if (events.length > 100) {
    events.splice(0, events.length - 100);
  }
  
  localStorage.setItem('analyticsEvents', JSON.stringify(events));
}

// Export functions for global access
if (typeof window !== 'undefined') {
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.togglePricing = togglePricing;
  window.selectPlan = selectPlan;
}