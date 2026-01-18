const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
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

      setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => {
          if (messageContainer.contains(message)) {
            messageContainer.removeChild(message);
          }
        }, 300);
      }, 5000);
    }

    // Form submission
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

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

        const submitButton = loginForm.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = '🔄 Verificando...';
        submitButton.disabled = true;

        setTimeout(() => {
          const users = JSON.parse(localStorage.getItem('users')) || [];
          const user = users.find(u => u.email === email && u.password === password);
          
          if (user) {
            showMessage('🎉 ¡Inicio de sesión exitoso! Redirigiendo...', 'success');
            localStorage.setItem('session', JSON.stringify({ email }));
            
            setTimeout(() => {
              window.location.href = 'pruebaPerfil.html';
            }, 1500);
          } else {
            const emailExists = users.some(u => u.email === email);
            if (emailExists) {
              showMessage('❌ Contraseña incorrecta. Verifica tu contraseña.', 'error');
            } else {
              showMessage('❌ Correo no registrado. ¿Necesitas crear una cuenta?', 'error');
            }
            
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            passwordInput.value = '';
            passwordInput.focus();
          }
        }, 800);
      });
    }

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