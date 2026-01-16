document.addEventListener('DOMContentLoaded', () => {
      // Enhanced menu toggle logic - exactly like your Explorar page
      const menuToggle = document.querySelector('#menuToggle');
      const sideMenu = document.querySelector('#sideMenu');
      let isMenuOpen = false;

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

      // Add keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
          isMenuOpen = false;
          sideMenu.classList.remove('active');
        }
      });

      // Helper function to convert file to base64
      function fileToBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

      // Form submission - with fixed image handling
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
          
          // Convert image to base64 if file exists
          let imageData = null;
          if (file) {
            try {
              // Validate file type
              if (!file.type.startsWith('image/')) {
                alert('Por favor, selecciona solo archivos de imagen (JPG, PNG, etc.)');
                return;
              }
              
              // Check file size (limit to 5MB)
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
            username: "Usuario Actual", // Replace with actual user after login implementation
            category,
            price: parseInt(price),
            timestamp: new Date().toLocaleString(),
            likes: 0,
            comments: [],
            image: imageData // Now storing base64 data instead of blob URL
          };

          posts.push(newPost);
          localStorage.setItem('posts', JSON.stringify(posts));
          postForm.reset();
          
          // Show success message before redirect
          alert('¡Publicación creada exitosamente!');
          window.location.href = 'prueba.html'; // Redirect to main page
        });
      }

      // Add form validation animations
      const formElements = ['postContent', 'postCategory', 'postPrice'];
      formElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.addEventListener('blur', () => {
            if (element.value === '' && element.hasAttribute('required')) {
              element.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              element.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3)';
            } else {
              element.style.borderColor = 'rgba(75, 85, 99, 0.3)';
              element.style.boxShadow = 'none';
            }
          });

          element.addEventListener('focus', () => {
            element.style.borderColor = 'rgba(96, 165, 250, 0.5)';
            element.style.boxShadow = '0 0 20px rgba(96, 165, 250, 0.3)';
          });
        }
      });
    });