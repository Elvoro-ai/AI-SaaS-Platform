// Enhanced Landing Page Button Handlers for AI SaaS Platform
// Handles: Sign up, Demo booking, Pricing, Contact, and App navigation

// DOM Elements
const email = document.getElementById('email');
const getStarted = document.getElementById('get-started');
const openApp = document.getElementById('open-app');

// Utility Functions
function saveLead(email, source = 'landing') {
  const leads = JSON.parse(localStorage.getItem('leads') || '[]');
  const leadData = {
    email,
    source,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    referrer: document.referrer
  };
  leads.push(leadData);
  localStorage.setItem('leads', JSON.stringify(leads));
  
  // Track conversion
  trackEvent('lead_captured', { source, email });
}

// AI Assistant Integration
async function askAssistant(prompt) {
  const apiKey = localStorage.getItem('HF_KEY');
  if (!apiKey) {
    return 'Assistant: Pour une expérience personnalisée, configurez votre clé API HuggingFace dans l\'application.';
  }
  
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/google/gemma-2b-it', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    return data?.[0]?.generated_text || 'Merci de votre intérêt pour AI SaaS! Notre équipe vous contactera bientôt.';
  } catch (error) {
    console.error('AI Assistant Error:', error);
    return 'Merci de votre intérêt pour AI SaaS! Votre demande a été enregistrée et notre équipe vous contactera bientôt.';
  }
}

// Analytics and Tracking
function trackEvent(eventName, data = {}) {
  // Store events locally for analytics
  const events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
  events.push({
    event: eventName,
    data: data,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent
  });
  
  // Keep only last 100 events
  if (events.length > 100) {
    events.splice(0, events.length - 100);
  }
  
  localStorage.setItem('analyticsEvents', JSON.stringify(events));
  
  // In production, send to analytics service
  console.log('Event tracked:', eventName, data);
}

// Main CTA Button Handler ("Commencer gratuitement")
if (getStarted && email) {
  getStarted.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const emailValue = email.value.trim();
    
    // Validation
    if (!emailValue) {
      email.focus();
      email.style.borderColor = '#ef4444';
      showNotification('⚠️ Veuillez entrer votre adresse email', 'error');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      email.focus();
      email.style.borderColor = '#ef4444';
      showNotification('⚠️ Veuillez entrer une adresse email valide', 'error');
      return;
    }
    
    // Reset email styling
    email.style.borderColor = '';
    
    // Update button state
    const originalText = getStarted.innerHTML;
    getStarted.innerHTML = '<span class="spinner"></span> Création du compte...';
    getStarted.disabled = true;
    
    try {
      // Save lead
      saveLead(emailValue, 'hero_cta');
      
      // Get personalized welcome message
      const welcomeMessage = await askAssistant(
        `Génère un message de bienvenue chaleureux et professionnel pour un nouvel utilisateur de notre plateforme SaaS IA qui vient de s'inscrire avec l'email: ${emailValue}. Le message doit être motivant et mentionner les prochaines étapes.`
      );
      
      // Show success notification
      showNotification('✅ Compte créé avec succès! Redirection...', 'success');
      
      // Create basic user profile
      const userData = {
        email: emailValue,
        createdAt: new Date().toISOString(),
        plan: 'free',
        credits: 100,
        source: 'hero_cta'
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      
      // Track successful signup
      trackEvent('user_signup_success', { email: emailValue, source: 'hero_cta' });
      
      // Show welcome message
      setTimeout(() => {
        alert(welcomeMessage);
        window.location.href = '/app.html';
      }, 1500);
      
    } catch (error) {
      console.error('Signup error:', error);
      showNotification('❌ Une erreur est survenue. Veuillez réessayer.', 'error');
      getStarted.innerHTML = originalText;
      getStarted.disabled = false;
    }
  });
  
  // Enter key support for email input
  email.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      getStarted.click();
    }
  });
}

// "Ouvrir l'app" Button Handler
if (openApp) {
  openApp.addEventListener('click', (e) => {
    e.preventDefault();
    trackEvent('app_button_clicked', { source: 'header' });
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      window.location.href = '/app.html';
    } else {
      // Show signup modal for non-logged users
      if (typeof openModal === 'function') {
        openModal('signup');
      } else {
        // Fallback to direct signup
        window.location.href = '/app.html';
      }
    }
  });
}

// Pricing Button Handlers
function setupPricingButtons() {
  // Free plan button
  const freeButtons = document.querySelectorAll('.pricing .plan:first-child .btn');
  freeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      trackEvent('free_plan_selected', { source: 'pricing_section' });
      
      if (typeof openModal === 'function') {
        openModal('signup');
      } else {
        // Fallback
        if (email) {
          email.focus();
          email.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
  
  // Pro plan button
  const proButtons = document.querySelectorAll('.pricing .plan.popular .btn');
  proButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      trackEvent('pro_plan_selected', { source: 'pricing_section' });
      
      if (typeof openModal === 'function') {
        openModal('pricing');
      } else {
        // Fallback to signup with pro intent
        localStorage.setItem('intendedPlan', 'pro');
        if (typeof openModal === 'function') {
          openModal('signup');
        } else {
          alert('Redirection vers l\'inscription Pro - Fonctionnalité à implémenter');
        }
      }
    });
  });
  
  // Enterprise plan button
  const enterpriseButtons = document.querySelectorAll('.pricing .plan:last-child .btn');
  enterpriseButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      trackEvent('enterprise_plan_selected', { source: 'pricing_section' });
      
      if (typeof openModal === 'function') {
        openModal('contact');
      } else {
        // Fallback
        alert('Pour le plan Enterprise, contactez-nous à contact@ai-saas.com ou +33 1 40 00 00 00');
      }
    });
  });
}

// Navigation Links Handlers
function setupNavigationLinks() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Track navigation
        trackEvent('navigation_clicked', { target: targetId });
      }
    });
  });
}

// Demo Video Handler
function setupDemoVideo() {
  const demoVideo = document.querySelector('.demo');
  if (demoVideo) {
    demoVideo.addEventListener('play', () => {
      trackEvent('demo_video_played', { timestamp: new Date().toISOString() });
    });
    
    demoVideo.addEventListener('ended', () => {
      trackEvent('demo_video_completed', { timestamp: new Date().toISOString() });
      
      // Show CTA after video completion
      setTimeout(() => {
        if (typeof openModal === 'function') {
          showNotification('🎯 Prêt à commencer? Créez votre compte gratuit!', 'info');
          
          setTimeout(() => {
            if (confirm('Voulez-vous créer votre compte gratuit maintenant?')) {
              openModal('signup');
            }
          }, 2000);
        }
      }, 1000);
    });
  }
}

// FAQ Interaction
function setupFAQ() {
  const faqItems = document.querySelectorAll('#faq details');
  faqItems.forEach((item, index) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        trackEvent('faq_opened', { question_index: index, question: item.querySelector('summary').textContent });
      }
    });
  });
}

// Utility function for notifications (fallback)
function showNotification(message, type = 'info') {
  // Check if modal notification function exists
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
    return;
  }
  
  // Fallback notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  `;
  
  switch (type) {
    case 'success':
      notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      break;
    case 'error':
      notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      break;
    default:
      notification.style.background = 'linear-gradient(135deg, #6366f1, #4f46e5)';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Auto remove
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Email validation styling
function setupEmailValidation() {
  if (email) {
    email.addEventListener('input', () => {
      email.style.borderColor = '';
    });
    
    email.addEventListener('blur', () => {
      const emailValue = email.value.trim();
      if (emailValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
          email.style.borderColor = '#ef4444';
        } else {
          email.style.borderColor = '#10b981';
        }
      }
    });
  }
}

// Trust indicators animation
function setupTrustIndicators() {
  const trustElement = document.querySelector('.trust');
  if (trustElement) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          trackEvent('trust_indicators_viewed');
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(trustElement);
  }
}

// Initialize all functionality
function initLandingPage() {
  // Setup all button handlers
  setupPricingButtons();
  setupNavigationLinks();
  setupDemoVideo();
  setupFAQ();
  setupEmailValidation();
  setupTrustIndicators();
  
  // Track page load
  trackEvent('landing_page_loaded', {
    timestamp: new Date().toISOString(),
    referrer: document.referrer,
    userAgent: navigator.userAgent
  });
  
  // Setup exit intent (optional)
  setupExitIntent();
}

// Exit Intent Detection
function setupExitIntent() {
  let hasShownExitIntent = false;
  
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && !hasShownExitIntent && typeof openModal === 'function') {
      hasShownExitIntent = true;
      trackEvent('exit_intent_triggered');
      
      setTimeout(() => {
        if (confirm('Attendez! Avant de partir, souhaitez-vous réserver une démo gratuite de 15 minutes?')) {
          openModal('demo');
        }
      }, 500);
    }
  });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLandingPage);
} else {
  initLandingPage();
}

// Global error handler
window.addEventListener('error', (e) => {
  trackEvent('javascript_error', {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno
  });
});

// Export functions for global access
if (typeof window !== 'undefined') {
  window.saveLead = saveLead;
  window.askAssistant = askAssistant;
  window.trackEvent = trackEvent;
}