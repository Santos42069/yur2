 const registerForm = document.getElementById('registerForm');
    const emailInput = document.getElementById('emailInput');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const passwordStrength = document.getElementById('passwordStrength');
    const messageContainer = document.getElementById('messageContainer');
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const sideMenu = document.getElementById('sideMenu');
    let isMenuOpen = false;

    // Menu toggle
    if (menuToggle && sideMenu) {
      menuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        sideMenu.classList.toggle('active');
      });

      menuClose?.addEventListener('click', () => {
        isMenuOpen = false;
        sideMenu.classList.remove('active');
      });

      menuToggle.addEventListener('mouseenter', () => {
        if (!isMenuOpen) {
          sideMenu.classList.add('active');
        }
      });

      sideMenu.addEventListener('mouseenter', () => {
        if (!isMenuOpen) {
          sideMenu.classList.add('active');
        }
      });

      document.addEventListener('mouseover', (e) => {
        if (!isMenuOpen && !sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
          sideMenu.classList.remove('active');
        }
      });
    }

    // Message display
    function showMessage(text, type = 'error') {
      const message = document.createElement('div');
      message.className = `message ${type}`;
      message.textContent = text;
      
      messageContainer.innerHTML = '';
      messageContainer.appendChild(message);
      
      setTimeout(() => message.classList.add('show'), 100);

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

    passwordInput.addEventListener('input', (e) => {
      checkPasswordStrength(e.target.value);
    });

    // Form submission
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

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

        const submitButton = registerForm.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = '🔄 Creando cuenta...';
        submitButton.disabled = true;

        setTimeout(() => {
          let users = JSON.parse(localStorage.getItem('users')) || [];
          
          if (users.some(user => user.email === email)) {
            showMessage('❌ Este correo ya está registrado. Intenta iniciar sesión.', 'error');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            emailInput.focus();
            return;
          }

          if (users.some(user => user.username === username)) {
            showMessage('❌ Este nombre de usuario ya existe. Elige otro.', 'error');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            usernameInput.focus();
            return;
          }

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

    // Real-time validation
    emailInput.addEventListener('input', (e) => {
      const email = e.target.value;
      if (email && !email.endsWith('javeriana.edu.co')) {
        e.target.style.borderColor = '#ef4444';
      } else {
        e.target.style.borderColor = '#445566';
      }
    });

    usernameInput.addEventListener('input', (e) => {
      const username = e.target.value;
      if (username && username.length < 3) {
        e.target.style.borderColor = '#ef4444';
      } else {
        e.target.style.borderColor = '#445566';
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        isMenuOpen = false;
        sideMenu.classList.remove('active');
      }
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (sideMenu && !sideMenu.contains(e.target) && e.target !== menuToggle && isMenuOpen) {
        isMenuOpen = false;
        sideMenu.classList.remove('active');
      }
    });