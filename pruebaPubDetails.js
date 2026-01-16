const productItem = document.getElementById('productItem');
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const navLinks = document.querySelector('.nav-links');
    let isClicked = false;

    function updateNavigation() {
      const session = JSON.parse(localStorage.getItem('session'));
      if (session && session.email) {
        navLinks.innerHTML = `
          <a href="pruebaExplorar.html">Explorar</a>
          <a href="#" id="logoutLink">Cerrar Sesión</a>
          <a href="pruebaPerfil.html">Perfil</a>
        `;
        const menuMainContent = document.querySelector('.menu-main-content');
        const menuBottomSection = document.querySelector('.menu-bottom-section');
        menuMainContent.innerHTML = `
          <a href="prueba.html">🏠 Inicio</a>
          <a href="pruebaExplorar.html">🔍 Explorar</a>
          <a href="pruebaCrearPub.html">✏️ Crear Publicación</a>
        `;
        menuBottomSection.innerHTML = `  
          <a href="pruebaPerfil.html">👤 Perfil</a>
          <a href="#" id="logoutSideLink">🚪 Cerrar Sesión</a>
        `;
        
        const logoutLink = document.getElementById('logoutLink');
        const logoutSideLink = document.getElementById('logoutSideLink');
        if (logoutLink) logoutLink.addEventListener('click', logout);
        if (logoutSideLink) logoutSideLink.addEventListener('click', logout);
      }
    }

    function logout(e) {
      e.preventDefault();
      localStorage.removeItem('session');
      window.location.href = 'betalogin.html';
    }

    // Enhanced menu toggle logic
    if (menuToggle && sideMenu) {
      menuToggle.addEventListener('mouseover', () => {
        if (!isClicked) {
          sideMenu.classList.add('active');
        }
      });

      sideMenu.addEventListener('mouseover', () => {
        if (!isClicked) {
          sideMenu.classList.add('active');
        }
      });

      document.addEventListener('mouseover', (e) => {
        if (!isClicked && !sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
          sideMenu.classList.remove('active');
        }
      });

      menuToggle.addEventListener('click', () => {
        isClicked = !isClicked;
        sideMenu.classList.toggle('active', isClicked);
        menuToggle.classList.add('animate-pulse-once');
        setTimeout(() => menuToggle.classList.remove('animate-pulse-once'), 300);
      });
    }

    // Get post ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('postId'));

    // Load posts
    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Render product details - keeping your exact functionality
    function renderProductDetails() {
      const post = posts.find(p => p.id === postId);
      if (!post) {
        productItem.innerHTML = '<p style="text-align: center; color: #9ca3af; font-style: italic;">Producto no encontrado.</p>';
        return;
      }

      // Get category emoji
      const categoryEmojis = {
        'libros': '📚',
        'comida': '🍕',
        'objetos': '📦',
        'otros': '🔧'
      };
      const categoryEmoji = categoryEmojis[post.category] || '📦';

      productItem.innerHTML = `
        <h3>${post.content.split(' - ')[0]}</h3>
        <p><strong>📝 Descripción:</strong> ${post.content}</p>
        ${post.image ? `<img src="${post.image}" alt="Post image" />` : ''}
        <p><strong>💰 Precio:</strong> ${post.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
        <p><strong>${categoryEmoji} Categoría:</strong> ${post.category.charAt(0).toUpperCase() + post.category.slice(1)}</p>
        <p><strong>👤 Publicado por:</strong> ${post.username}</p>
        <p><strong>📅 Fecha:</strong> ${post.timestamp}</p>
        <p><strong>👍 Likes:</strong> ${post.likes || 0}</p>
        <p><strong>💬 Comentarios:</strong> ${(post.comments || []).length}</p>
        <a href="#contact" class="contact-button hover-pulse">📞 Contactar Vendedor</a>
      `;

      // Update viewed products - keeping your exact functionality
      const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];
      if (!viewedProducts.some(p => p.id === post.id)) {
        viewedProducts.push({
          id: post.id,
          title: post.content.split(' - ')[0],
          price: post.price,
          description: post.content
        });
        localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
      }
    }

    // Initialize page - keeping your exact functionality
    document.addEventListener('DOMContentLoaded', () => {
      const session = JSON.parse(localStorage.getItem('session'));
      if (!session || !session.email || !session.email.endsWith('javeriana.edu.co')) {
        window.location.href = 'betalogin.html';
        return;
      }
      updateNavigation();
      renderProductDetails();
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isClicked) {
        isClicked = false;
        sideMenu.classList.remove('active');
      }
    });