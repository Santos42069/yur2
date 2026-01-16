const registerForm = document.getElementById('registerForm');
    const emailInput = document.getElementById('emailInput');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const passwordStrength = document.getElementById('passwordStrength');
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

      // Auto-hide after 5 seconds for errors, 3 seconds for success
      const hideDelay = type === 'success' ? 3000 : 5000;
      setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => {
          if (messageContainer.contains(message)) {
            messageContainer.removeChild(message);
          }
        }, 300);
      }, hideDelay);
    }

    // Password strength checker
    function checkPasswordStrength(password) {
      if (!password) {
        passwordStrength.textContent = '';
        return;
      }

      let strength = 0;
      if (password.length >= 6) strength++;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/\d/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;

      if (strength <= 2) {
        passwordStrength.textContent = '🔴 Débil';
        passwordStrength.className = 'password-strength strength-weak';
      } else if (strength <= 4) {
        passwordStrength.textContent = '🟡 Media';
        passwordStrength.className = 'password-strength strength-medium';
      } else {
        passwordStrength.textContent = '🟢 Fuerte';
        passwordStrength.className = 'password-strength strength-strong';
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      if (registerForm) {
        // Add input animation effects
        const inputs = registerForm.querySelectorAll('.form-input');
        inputs.forEach((input, index) => {
          // Staggered animation on load
          setTimeout(() => {
            input.style.opacity = '0';
            input.style.transform = 'translateY(20px)';
            input.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
              input.style.opacity = '1';
              input.style.transform = 'translateY(0)';
            }, 50);
          }, 500 + (index * 200));

          // Focus/blur effects
          input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
          });
          
          input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
          });
        });

        // Password strength checker
        passwordInput.addEventListener('input', (e) => {
          checkPasswordStrength(e.target.value);
        });

        // Enhanced form submission with your existing localStorage system
        registerForm.addEventListener('submit', (e) => {
          e.preventDefault();
          
          const email = emailInput.value.trim();
          const username = usernameInput.value.trim();
          const password = passwordInput.value.trim();

          // Enhanced validation
          if (!email) {
            showMessage('❌ Por favor ingresa tu correo electrónico.', 'error');
            emailInput.focus();
            return;
          }

          if (!email.endsWith('javeriana.edu.co')) {
            showMessage('❌ Debes usar un correo @javeriana.edu.co para registrarte.', 'error');
            emailInput.focus();
            return;
          }

          if (!username) {
            showMessage('❌ Por favor ingresa un nombre de usuario.', 'error');
            usernameInput.focus();
            return;
          }

          if (username.length < 3) {
            showMessage('❌ El nombre de usuario debe tener al menos 3 caracteres.', 'error');
            usernameInput.focus();
            return;
          }

          if (!password) {
            showMessage('❌ Por favor ingresa una contraseña.', 'error');
            passwordInput.focus();
            return;
          }

          if (password.length < 6) {
            showMessage('❌ La contraseña debe tener al menos 6 caracteres.', 'error');
            passwordInput.focus();
            return;
          }

          // Simulate loading state
          const submitButton = registerForm.querySelector('.submit-button');
          const originalText = submitButton.textContent;
          submitButton.textContent = '🔄 Creando cuenta...';
          submitButton.disabled = true;

          // Simulate API call delay
          setTimeout(() => {
            // Use your existing localStorage system
            let users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if user already exists
            if (users.some(user => user.email === email)) {
              showMessage('❌ Este correo ya está registrado. Intenta iniciar sesión.', 'error');
              
              // Reset form
              submitButton.textContent = originalText;
              submitButton.disabled = false;
              emailInput.focus();
              return;
            }

            // Check if username already exists
            if (users.some(user => user.username === username)) {
              showMessage('❌ Este nombre de usuario ya existe. Elige otro.', 'error');
              
              // Reset form
              submitButton.textContent = originalText;
              submitButton.disabled = false;
              usernameInput.focus();
              return;
            }

            // Register new user using your existing system
            users.push({ email, username, password });
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('userProfile', JSON.stringify({ email, username, bio: '' }));
            localStorage.setItem('session', JSON.stringify({ email }));
            
            showMessage('🎉 ¡Registro exitoso! Bienvenido a UNIMERCS. Redirigiendo...', 'success');
            
            setTimeout(() => {
              window.location.href = 'pruebaPerfil.html';
            }, 2000);
          }, 1500);
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

        // Enter key on form
        if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
          const inputs = Array.from(registerForm.querySelectorAll('input'));
          const currentIndex = inputs.indexOf(document.activeElement);
          
          if (currentIndex < inputs.length - 1) {
            e.preventDefault();
            inputs[currentIndex + 1].focus();
          }
        }
      });

      // Real-time email validation
      emailInput.addEventListener('input', (e) => {
        const email = e.target.value;
        if (email && !email.endsWith('javeriana.edu.co')) {
          e.target.style.borderColor = '#ef4444';
        } else {
          e.target.style.borderColor = 'rgba(107, 114, 128, 0.3)';
        }
      });

      // Real-time username validation
      usernameInput.addEventListener('input', (e) => {
        const username = e.target.value;
        if (username && username.length < 3) {
          e.target.style.borderColor = '#ef4444';
        } else {
          e.target.style.borderColor = 'rgba(107, 114, 128, 0.3)';
        }
      });
    });