// MCP System Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for fixed header
          behavior: 'smooth'
        });
        
        // Update URL without page reload
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });
  
  // Form validation for contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      let isValid = true;
      
      // Simple validation
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Name is required');
        isValid = false;
      } else {
        clearError(nameInput);
      }
      
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required');
        isValid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email');
        isValid = false;
      } else {
        clearError(emailInput);
      }
      
      if (!messageInput.value.trim()) {
        showError(messageInput, 'Message is required');
        isValid = false;
      } else {
        clearError(messageInput);
      }
      
      if (isValid) {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'bg-green-100 text-green-800 p-4 rounded mt-4';
        successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        
        contactForm.appendChild(successMessage);
        
        // Reset form
        contactForm.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }
    });
  }
  
  // Helper functions for form validation
  function showError(input, message) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
    
    errorElement.className = 'error-message text-red-600 text-sm mt-1';
    errorElement.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
      formGroup.appendChild(errorElement);
    }
    
    input.classList.add('border-red-500');
  }
  
  function clearError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
      errorElement.remove();
    }
    
    input.classList.remove('border-red-500');
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Feature detection for demo purposes
  const demoButtons = document.querySelectorAll('.demo-button');
  if (demoButtons.length > 0) {
    demoButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const demoType = this.getAttribute('data-demo');
        const demoContainer = document.getElementById(`${demoType}-demo`);
        
        if (demoContainer) {
          // Toggle demo visibility
          const isVisible = !demoContainer.classList.contains('hidden');
          
          if (isVisible) {
            demoContainer.classList.add('hidden');
            this.textContent = `Show ${demoType.charAt(0).toUpperCase() + demoType.slice(1)} Demo`;
          } else {
            demoContainer.classList.remove('hidden');
            this.textContent = `Hide ${demoType.charAt(0).toUpperCase() + demoType.slice(1)} Demo`;
          }
        }
      });
    });
  }
  
  // Check if we're on the documentation page
  const docSidebar = document.getElementById('doc-sidebar');
  if (docSidebar) {
    // Make documentation sidebar sticky on scroll
    const sidebarTop = docSidebar.offsetTop;
    
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > sidebarTop) {
        docSidebar.classList.add('sticky');
        docSidebar.classList.add('top-20');
      } else {
        docSidebar.classList.remove('sticky');
        docSidebar.classList.remove('top-20');
      }
    });
    
    // Highlight current section in sidebar
    const docSections = document.querySelectorAll('.doc-section');
    const sidebarLinks = docSidebar.querySelectorAll('a');
    
    window.addEventListener('scroll', function() {
      let currentSection = '';
      
      docSections.forEach(section => {
        const sectionTop = section.offsetTop;
        
        if (window.pageYOffset >= sectionTop - 100) {
          currentSection = section.getAttribute('id');
        }
      });
      
      sidebarLinks.forEach(link => {
        link.classList.remove('text-indigo-600', 'font-medium');
        link.classList.add('text-gray-600');
        
        const href = link.getAttribute('href').substring(1);
        
        if (href === currentSection) {
          link.classList.remove('text-gray-600');
          link.classList.add('text-indigo-600', 'font-medium');
        }
      });
    });
  }
});
