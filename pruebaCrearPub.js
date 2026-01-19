// LOGIN PROTECTION - Place this at the top of your JS file or in a <script> tag
document.addEventListener('DOMContentLoaded', () => {
  const session = JSON.parse(localStorage.getItem('session'));
  
  // Check if user is logged in with a valid Javeriana email
  if (!session || !session.email || !session.email.endsWith('javeriana.edu.co')) {
    // Redirect to login page if not logged in
    alert('⚠️ Debes iniciar sesión para acceder a esta página');
    window.location.href = 'betalogin.html';
    return;
  }
});


document.addEventListener('DOMContentLoaded', () => {
      const menuToggle = document.getElementById('menuToggle');
      const menuClose = document.getElementById('menuClose');
      const sideMenu = document.getElementById('sideMenu');
      let isMenuOpen = false;

      

      // Menu toggle with hover
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



      // Helper function to convert file to base64
      function fileToBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

      // Form submission
      const postForm = document.getElementById('postForm');
      if (postForm) {
        postForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const content = document.getElementById('postContent')?.value;
          const category = document.getElementById('postCategory')?.value;
          const price = document.getElementById('postPrice')?.value || 0;
          const file = document.getElementById('fileInput')?.files[0];

          if (!content || !category) {
            alert('Por favor, completa todos los campos obligatorios');
            return;
          }

          const posts = JSON.parse(localStorage.getItem('posts')) || [];
          
          let imageData = null;
          if (file) {
            try {
              if (!file.type.startsWith('image/')) {
                alert('Por favor, selecciona solo archivos de imagen (JPG, PNG, etc.)');
                return;
              }
              
              if (file.size > 5 * 1024 * 1024) {
                alert('La imagen es demasiado grande. Por favor, selecciona una imagen menor a 5MB.');
                return;
              }
              
              imageData = await fileToBase64(file);
            } catch (error) {
              console.error('Error al procesar la imagen:', error);
              alert('Error al procesar la imagen. Por favor, intenta con otra imagen.');
              return;
            }
          }

          const newPost = {
            id: posts.length + 1,
            content,
            username: "Usuario Actual",
            category,
            price: parseInt(price),
            timestamp: new Date().toLocaleString(),
            likes: 0,
            comments: [],
            image: imageData
          };

          posts.push(newPost);
          localStorage.setItem('posts', JSON.stringify(posts));
          postForm.reset();
          
          alert('¡Publicación creada exitosamente!');
          window.location.href = 'prueba.html';
        });
      }

      // Form validation animations
      const formElements = ['postContent', 'postCategory', 'postPrice'];
      formElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.addEventListener('blur', () => {
            if (element.value === '' && element.hasAttribute('required')) {
              element.style.borderColor = '#ef4444';
              element.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            } else {
              element.style.borderColor = '#445566';
              element.style.boxShadow = 'none';
            }
          });

          element.addEventListener('focus', () => {
            element.style.borderColor = '#ff6b6b';
            element.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.1)';
          });
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
    });