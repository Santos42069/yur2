// Sample data
    const sampleProfile = {
      username: "Estudiante Javeriana",
      bio: "Estudiante en la Javeriana, apasionado por la tecnología y el emprendimiento."
    };

    const sampleComments = [
      { email: "test@javeriana.edu.co", teacher: "Profesor García", rating: 4, comment: "Excelente docente, explica claramente." },
      { email: "test@javeriana.edu.co", teacher: "Profesor López", rating: 3, comment: "Buen profesor, pero las clases son densas." }
    ];

    const sampleProducts = [
      { id: 1, title: "Libro de Cálculo (2ª Edición)", price: 20000, description: "Vendo: Libro de Cálculo (2ª Edición) - $20,000 COP" },
      { id: 2, title: "Empanadas caseras", price: 2000, description: "¡Empanadas caseras a la venta! $2,000 COP cada una" }
    ];

    const samplePosts = [
      {
        email: "test@javeriana.edu.co",
        id: 1,
        content: "Vendo: Libro de Cálculo (2ª Edición) - $20,000 COP",
        username: "Juan Pérez",
        category: "libros",
        price: 20000,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        comments: []
      },
      {
        email: "test@javeriana.edu.co",
        id: 2,
        content: "¡Empanadas caseras a la venta! $2,000 COP cada una",
        username: "María Gómez",
        category: "comida",
        price: 2000,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        comments: []
      }
    ];

    // DOM elements
    const profileForm = document.getElementById('profileForm');
    const usernameInput = document.getElementById('usernameInput');
    const bioInput = document.getElementById('bioInput');
    const commentsList = document.getElementById('commentsList');
    const productsList = document.getElementById('productsList');
    const postsList = document.getElementById('postsList');
    const filterCategory = document.getElementById('filterCategory');
    const messageContainer = document.getElementById('messageContainer');
    const menuToggle = document.querySelector('#menuToggle');
    const sideMenu = document.querySelector('#sideMenu');
    const navLinks = document.querySelector('#navLinks');
    const menuMainContent = document.querySelector('#menuMainContent');
    const menuBottomSection = document.querySelector('#menuBottomSection');
    let isMenuOpen = false;
    let userEmail = '';

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

    // Enhanced message display function with error type
    function showMessage(text, type = 'success') {
      const message = document.createElement('div');
      message.className = `message ${type}`;
      message.textContent = text;
      
      messageContainer.innerHTML = '';
      messageContainer.appendChild(message);
      
      setTimeout(() => {
        message.classList.add('show');
      }, 100);

      // Auto-hide after different durations based on type
      const hideDelay = type === 'error' ? 5000 : 3000;
      setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => {
          if (messageContainer.contains(message)) {
            messageContainer.removeChild(message);
          }
        }, 300);
      }, hideDelay);
    }

    // Update navigation based on session
    function updateNavigation() {
      const session = JSON.parse(localStorage.getItem('session'));
      if (session && session.email) {
        navLinks.innerHTML = `
          <a href="pruebaExplorar.html">Explorar</a>
          <a href="#" id="logoutLink">Cerrar Sesión</a>
          <a href="pruebaPerfil.html">Perfil</a>
        `;
        menuMainContent.innerHTML = `
          <a href="prueba.html">Inicio</a>
          <a href="pruebaExplorar.html">Explorar</a>
          <a href="pruebaCrearPub.html">Crear Publicación</a>
        `;
        menuBottomSection.innerHTML = `  
          <a href="pruebaPerfil.html">👤 Perfil</a>
          <a href="#" id="logoutSideLink">🚪 Cerrar Sesión</a>
        `;
        
        // Add logout event listeners
        const logoutLink = document.getElementById('logoutLink');
        const logoutSideLink = document.getElementById('logoutSideLink');
        if (logoutLink) logoutLink.addEventListener('click', logout);
        if (logoutSideLink) logoutSideLink.addEventListener('click', logout);
      }
    }

    function logout(e) {
      e.preventDefault();
      localStorage.removeItem('session');
      showMessage('👋 Sesión cerrada exitosamente. Redirigiendo...', 'success');
      setTimeout(() => {
        window.location.href = 'betalogin.html';
      }, 1500);
    }

    // Navigation helper functions with error handling
    function navigateToProduct(productId) {
      try {
        // Store the selected product in localStorage for the details page
        const selectedProduct = viewedProducts.find(p => p.id == productId);
        if (selectedProduct) {
          localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
        }
        
        // Try to navigate to product details page
        const detailsPage = `pruebaPubDetails.html?postId=${productId}`;
        
        // Check if the page exists by creating a test link
        const testLink = document.createElement('a');
        testLink.href = detailsPage;
        
        // Navigate to the details page
        window.location.href = detailsPage;
        
      } catch (error) {
        console.error('Error navigating to product:', error);
        showMessage('❌ Error al cargar el producto. Redirigiendo a explorar...', 'error');
        setTimeout(() => {
          window.location.href = 'pruebaExplorar.html';
        }, 2000);
      }
    }

    function navigateToPost(postId) {
      try {
        // Store the selected post in localStorage for the details page
        const selectedPost = posts.find(p => p.id == postId);
        if (selectedPost) {
          localStorage.setItem('selectedPost', JSON.stringify(selectedPost));
        }
        
        // Try to navigate to post details page
        const detailsPage = `pruebaPubDetails.html?postId=${postId}`;
        window.location.href = detailsPage;
        
      } catch (error) {
        console.error('Error navigating to post:', error);
        showMessage('❌ Error al cargar la publicación. Redirigiendo a explorar...', 'error');
        setTimeout(() => {
          window.location.href = 'pruebaExplorar.html';
        }, 2000);
      }
    }

    // Alternative navigation function if details page doesn't exist
    function showProductModal(product) {
      const modal = document.createElement('div');
      modal.className = 'product-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>🛍️ ${product.title}</h3>
            <button class="close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <p><strong>Precio:</strong> ${product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
            <p><strong>Descripción:</strong> ${product.description}</p>
            <div class="modal-actions">
              <button onclick="window.location.href='pruebaExplorar.html'" class="btn-primary">Ver más productos</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Close modal functionality
      const closeBtn = modal.querySelector('.close-modal');
      closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
      // Close on outside click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
    }

    // State
    let profile = JSON.parse(localStorage.getItem('userProfile')) || sampleProfile;
    let comments = JSON.parse(localStorage.getItem('teacherRatings')) || sampleComments;
    let viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || sampleProducts;
    let posts = JSON.parse(localStorage.getItem('posts')) || samplePosts;

    // Render profile
    function renderProfile() {
      if (usernameInput && bioInput) {
        usernameInput.value = profile.username || '';
        bioInput.value = profile.bio || '';
      }
    }

    // Render comments
    function renderComments() {
      if (!commentsList) return;
      commentsList.innerHTML = '';
      const userComments = comments.filter(c => c.email === userEmail);
      if (userComments.length === 0) {
        commentsList.innerHTML = '<div class="empty-state">📝 No has dejado comentarios sobre profesores aún.</div>';
        return;
      }
      userComments.forEach((comment, index) => {
        const commentElement = document.createElement('div');
        commentElement.className = `content-item animate-slideIn${index % 2 === 0 ? 'Left' : 'Right'}`;
        commentElement.style.animationDelay = `${index * 0.2}s`;
        commentElement.innerHTML = `
          <h4>👨‍🏫 ${comment.teacher}</h4>
          <p><strong>Calificación:</strong> ${'⭐'.repeat(comment.rating)} (${comment.rating}/5)</p>
          <p><strong>Comentario:</strong> "${comment.comment}"</p>
        `;
        commentsList.appendChild(commentElement);
      });
    }

    // Enhanced render viewed products with navigation
    function renderProducts() {
      if (!productsList) return;
      productsList.innerHTML = '';
      if (viewedProducts.length === 0) {
        productsList.innerHTML = '<div class="empty-state">🛒 No has visto productos recientemente.</div>';
        return;
      }
      viewedProducts.slice(0, 5).forEach((product, index) => {
        const productElement = document.createElement('div');
        productElement.className = `content-item clickable-item animate-slideIn${index % 2 === 0 ? 'Left' : 'Right'}`;
        productElement.style.animationDelay = `${index * 0.2}s`;
        productElement.innerHTML = `
          <h4>🛍️ ${product.title}</h4>
          <p><strong>Precio:</strong> ${product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
          <p>${product.description}</p>
          <div class="click-hint">👆 Haz clic para ver detalles</div>
        `;
        
        // Enhanced click handler with error handling and fallback
        productElement.addEventListener('click', (e) => {
          e.preventDefault();
          productElement.style.transform = 'scale(0.98)';
          
          setTimeout(() => {
            productElement.style.transform = '';
            
            // Check if product details page exists, otherwise show modal
            if (typeof window !== 'undefined') {
              try {
                navigateToProduct(product.id);
              } catch (error) {
                console.error('Navigation failed, showing modal instead:', error);
                showProductModal(product);
              }
            }
          }, 150);
        });

        // Add hover effects
        productElement.addEventListener('mouseenter', () => {
          productElement.style.cursor = 'pointer';
        });

        productsList.appendChild(productElement);
      });
    }

    // Enhanced render posts with navigation
    function renderPosts(category = 'all') {
      if (!postsList) return;
      postsList.innerHTML = '';
      const userPosts = posts.filter(p => p.email === userEmail && (category === 'all' || p.category === category));
      if (userPosts.length === 0) {
        const emptyMessage = category === 'all' ? 
          '📝 No tienes publicaciones aún. ¡Crea tu primera publicación!' : 
          `📝 No tienes publicaciones en la categoría "${category}".`;
        postsList.innerHTML = `<div class="empty-state">${emptyMessage}</div>`;
        return;
      }
      userPosts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.className = `content-item clickable-item animate-slideIn${index % 2 === 0 ? 'Left' : 'Right'}`;
        postElement.style.animationDelay = `${index * 0.2}s`;
        
        const categoryIcon = {
          'libros': '📚',
          'comida': '🍕',
          'objetos': '📦'
        }[post.category] || '📦';
        
        postElement.innerHTML = `
          <h4>${categoryIcon} ${post.content.split(' - ')[0]}</h4>
          <p><strong>Descripción:</strong> ${post.content}</p>
          <p><strong>Precio:</strong> ${post.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
          <p><strong>Categoría:</strong> ${post.category}</p>
          <p><strong>Publicado:</strong> ${post.timestamp}</p>
          <p><strong>👍 Likes:</strong> ${post.likes || 0} | <strong>💬 Comentarios:</strong> ${(post.comments || []).length}</p>
          <div class="post-actions">
            <button class="edit-post-btn" data-post-id="${post.id}">✏️ Editar</button>
            <button class="delete-post-btn" data-post-id="${post.id}">🗑️ Eliminar</button>
            <div class="click-hint">👆 Haz clic para ver detalles</div>
          </div>
        `;

        // Enhanced click handler for posts
        postElement.addEventListener('click', (e) => {
          // Don't navigate if clicking on action buttons
          if (e.target.classList.contains('edit-post-btn') || e.target.classList.contains('delete-post-btn')) {
            return;
          }
          
          e.preventDefault();
          postElement.style.transform = 'scale(0.98)';
          setTimeout(() => {
            postElement.style.transform = '';
            navigateToPost(post.id);
          }, 150);
        });

        // Add action button handlers
        const editBtn = postElement.querySelector('.edit-post-btn');
        const deleteBtn = postElement.querySelector('.delete-post-btn');

        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          editPost(post.id);
        });

        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deletePost(post.id);
        });

        // Add hover effects
        postElement.addEventListener('mouseenter', () => {
          postElement.style.cursor = 'pointer';
        });

        postsList.appendChild(postElement);
      });
    }

    // Post management functions
    function editPost(postId) {
      showMessage('✏️ Funcionalidad de edición en desarrollo...', 'info');
      // Here you could redirect to an edit form or open a modal
      // For now, we'll just show a message
    }

    function deletePost(postId) {
      if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
        posts = posts.filter(p => p.id !== postId);
        localStorage.setItem('posts', JSON.stringify(posts));
        showMessage('🗑️ Publicación eliminada exitosamente.', 'success');
        renderPosts(filterCategory.value || 'all');
      }
    }

    // Save profile
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newUsername = usernameInput.value.trim();
        const newBio = bioInput.value.trim();

        if (!newUsername) {
          showMessage('❌ El nombre de usuario no puede estar vacío.', 'error');
          return;
        }

        profile.username = newUsername;
        profile.bio = newBio;
        localStorage.setItem('userProfile', JSON.stringify(profile));
        
        showMessage('✅ Perfil actualizado correctamente.', 'success');
        
        // Add visual feedback
        const submitButton = profileForm.querySelector('.submit-button');
        submitButton.classList.add('animate-pulse-once');
        setTimeout(() => submitButton.classList.remove('animate-pulse-once'), 300);
      });
    }

    // Filter posts by category
    if (filterCategory) {
      filterCategory.addEventListener('change', () => {
        renderPosts(filterCategory.value);
      });
    }

    // Check login and render
    document.addEventListener('DOMContentLoaded', () => {
      const session = JSON.parse(localStorage.getItem('session'));
      if (!session || !session.email || !session.email.endsWith('javeriana.edu.co')) {
        window.location.href = 'betalogin.html';
        return;
      }
      
      userEmail = session.email;
      updateNavigation();
      renderProfile();
      renderComments();
      renderProducts();
      renderPosts();

      // Add input animation effects
      const inputs = document.querySelectorAll('.form-input, .form-textarea');
      inputs.forEach((input, index) => {
        setTimeout(() => {
          input.style.opacity = '0';
          input.style.transform = 'translateY(20px)';
          input.style.transition = 'all 0.5s ease';
          
          setTimeout(() => {
            input.style.opacity = '1';
            input.style.transform = 'translateY(0)';
          }, 50);
        }, 500 + (index * 200));

        input.addEventListener('focus', function() {
          this.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
          this.style.transform = 'translateY(0)';
        });
      });
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        isMenuOpen = false;
        sideMenu.classList.remove('active');
      }
    });