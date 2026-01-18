// Sample data (same as original)
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
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const sideMenu = document.getElementById('sideMenu');
    const navLinks = document.querySelector('.header-icons');
    const menuMainContent = document.getElementById('menuMainContent');
    const menuBottomSection = document.getElementById('menuBottomSection');
    let isMenuOpen = false;
    let userEmail = '';

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
        if (!isMenuOpen) sideMenu.classList.add('active');
      });

      sideMenu.addEventListener('mouseenter', () => {
        if (!isMenuOpen) sideMenu.classList.add('active');
      });

      document.addEventListener('mouseover', (e) => {
        if (!isMenuOpen && !sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
          sideMenu.classList.remove('active');
        }
      });
    }

    // Message display
    function showMessage(text, type = 'success') {
      const message = document.createElement('div');
      message.className = `message ${type}`;
      message.textContent = text;
      
      messageContainer.innerHTML = '';
      messageContainer.appendChild(message);
      
      setTimeout(() => message.classList.add('show'), 100);

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

    // Update navigation
    function updateNavigation() {
      const session = JSON.parse(localStorage.getItem('session'));
      if (session && session.email) {
        menuBottomSection.innerHTML = `  
          <a href="pruebaPerfil.html">👤 Perfil</a>
          <a href="#" id="logoutSideLink">🚪 Cerrar Sesión</a>
        `;
        
        const logoutSideLink = document.getElementById('logoutSideLink');
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

    // Render viewed products
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
        
        productElement.addEventListener('click', () => {
          window.location.href = `pruebaPubDetails.html?postId=${product.id}`;
        });

        productsList.appendChild(productElement);
      });
    }

    // Render posts
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

        postElement.addEventListener('click', (e) => {
          if (e.target.classList.contains('edit-post-btn') || e.target.classList.contains('delete-post-btn')) {
            return;
          }
          window.location.href = `pruebaPubDetails.html?postId=${post.id}`;
        });

        const editBtn = postElement.querySelector('.edit-post-btn');
        const deleteBtn = postElement.querySelector('.delete-post-btn');

        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          showMessage('✏️ Funcionalidad de edición en desarrollo...', 'info');
        });

        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
            posts = posts.filter(p => p.id !== post.id);
            localStorage.setItem('posts', JSON.stringify(posts));
            showMessage('🗑️ Publicación eliminada exitosamente.', 'success');
            renderPosts(filterCategory.value || 'all');
          }
        });

        postsList.appendChild(postElement);
      });
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
      });
    }

    // Filter posts
    if (filterCategory) {
      filterCategory.addEventListener('change', () => {
        renderPosts(filterCategory.value);
      });
    }

    // Check login and initialize
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