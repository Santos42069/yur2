const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const messageContainer = document.getElementById('messageContainer');
    const menuToggle = document.querySelector('#menuToggle');
    const sideMenu = document.querySelector('#sideMenu');
    let isMenuOpen = false;

    // Enhanced menu toggle logic
    if (menuToggle && sideMenu) {
      menuToggle.addEventListener('mouseover', () => {
        if (!isMenuOpen) {
          sideMenu.classList.add('active');
        }
      });

      sideMenu.addEventListener('mouseover', () => {
        if (!isMenuOpen) {
          sideMenu.classList.add('active');
        }
      });

      document.addEventListener('mouseover', (e) => {
        if (!isMenuOpen && !sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
          sideMenu.classList.remove('active');
        }
      });

      menuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        sideMenu.classList.toggle('active', isMenuOpen);
        menuToggle.classList.add('animate-pulse-once');
        setTimeout(() => menuToggle.classList.remove('animate-pulse-once'), 300);
      });
    }

    // Enhanced message display function
    function showMessage(text, type = 'error') {
      const message = document.createElement('div');
      message.className = `message ${type}`;
      message.textContent = text;
      
      messageContainer.innerHTML = '';
      messageContainer.appendChild(message);
      
      // Trigger animation
      setTimeout(() => {
        message.classList.add('show');
      }, 100);

      // Auto-hide after 5 seconds
      setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => {
          if (messageContainer.contains(message)) {
            messageContainer.removeChild(message);
          }
        }, 300);
      }, 5000);
    }

    // Enhanced form validation and submission
    document.addEventListener('DOMContentLoaded', () => {
      if (loginForm) {
        // Add input animation effects
        const inputs = loginForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
          input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
          });
          
          input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
          });
        });

        // Enhanced form submission
        loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          
          const email = emailInput.value.trim();
          const password = passwordInput.value.trim();

          // Enhanced validation
          if (!email) {
            showMessage('❌ Por favor ingresa tu correo electrónico.', 'error');
            emailInput.focus();
            return;
          }

          if (!email.endsWith('javeriana.edu.co')) {
            showMessage('❌ Debes usar un correo @javeriana.edu.co para iniciar sesión.', 'error');
            emailInput.focus();
            return;
          }

          if (!password) {
            showMessage('❌ Por favor ingresa tu contraseña.', 'error');
            passwordInput.focus();
            return;
          }

          if (password.length < 6) {
            showMessage('❌ La contraseña debe tener al menos 6 caracteres.', 'error');
            passwordInput.focus();
            return;
          }

          // Show loading state
          const submitButton = loginForm.querySelector('.submit-button');
          const originalText = submitButton.textContent;
          submitButton.textContent = '🔄 Verificando...';
          submitButton.disabled = true;

          // Small delay for better UX, then check credentials
          setTimeout(() => {
            // Get registered users from localStorage (your existing system)
            const users = JSON.parse(localStorage.getItem('users')) || [];
            console.log('Stored users:', users); // Debug log
            console.log('Attempting login with:', { email, password }); // Debug log
            
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
              showMessage('🎉 ¡Inicio de sesión exitoso! Redirigiendo...', 'success');
              
              // Store session using your existing system
              localStorage.setItem('session', JSON.stringify({ email }));
              
              setTimeout(() => {
                window.location.href = 'pruebaPerfil.html';
              }, 1500);
            } else {
              // Check if email exists but password is wrong
              const emailExists = users.some(u => u.email === email);
              if (emailExists) {
                showMessage('❌ Contraseña incorrecta. Verifica tu contraseña.', 'error');
              } else {
                showMessage('❌ Correo no registrado. ¿Necesitas crear una cuenta?', 'error');
              }
              
              // Reset form
              submitButton.textContent = originalText;
              submitButton.disabled = false;
              passwordInput.value = '';
              passwordInput.focus();
            }
          }, 800);
        });
      }

      // Add keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (isMenuOpen) {
            isMenuOpen = false;
            sideMenu.classList.remove('active');
          }
          
          // Close any messages
          const messages = messageContainer.querySelectorAll('.message');
          messages.forEach(msg => {
            msg.classList.remove('show');
            setTimeout(() => {
              if (messageContainer.contains(msg)) {
                messageContainer.removeChild(msg);
              }
            }, 300);
          });
        }
      });

      // Add subtle animations on page load
      setTimeout(() => {
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach((input, index) => {
          setTimeout(() => {
            input.style.opacity = '0';
            input.style.transform = 'translateY(20px)';
            input.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
              input.style.opacity = '1';
              input.style.transform = 'translateY(0)';
            }, 50);
          }, index * 200);
        });
      }, 500);
    });