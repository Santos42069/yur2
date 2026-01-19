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



const productItem = document.getElementById('productItem');
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

    function updateNavigation() {
      const session = JSON.parse(localStorage.getItem('session'));
      if (session && session.email) {
        const menuBottomSection = document.querySelector('.menu-bottom-section');
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
      window.location.href = 'betalogin.html';
    }

    // Get post ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('postId'));

    // Load posts
    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Render product details
    function renderProductDetails() {
      const post = posts.find(p => p.id === postId);
      if (!post) {
        productItem.innerHTML = '<p style="text-align: center; color: #95a5a6; font-style: italic; padding: 40px;">Producto no encontrado.</p>';
        return;
      }

      const categoryEmojis = {
        'libros': '📚',
        'comida': '🍕',
        'objetos': '📦',
        'otros': '🔧'
      };
      const categoryEmoji = categoryEmojis[post.category] || '📦';

      productItem.innerHTML = `
        <h3>${post.content.split(' - ')[0]}</h3>
        ${post.image ? `<img src="${post.image}" alt="Imagen del producto" class="product-image" />` : ''}
        
        <div class="price-highlight">
          💰 ${post.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
        </div>

        <div class="detail-item">
          <p><strong>📝 Descripción:</strong> ${post.content}</p>
        </div>

        <div class="detail-item">
          <p><strong>${categoryEmoji} Categoría:</strong> ${post.category.charAt(0).toUpperCase() + post.category.slice(1)}</p>
        </div>

        <div class="detail-item">
          <p><strong>👤 Vendedor:</strong> ${post.username}</p>
        </div>

        <div class="detail-item">
          <p><strong>📅 Publicado:</strong> ${post.timestamp}</p>
        </div>

        <div class="detail-item">
          <p><strong>👍 Likes:</strong> ${post.likes || 0} | <strong>💬 Comentarios:</strong> ${(post.comments || []).length}</p>
        </div>

        <button class="contact-button" onclick="alert('Funcionalidad de contacto en desarrollo')">
          📞 Contactar Vendedor
        </button>
      `;

      // Update viewed products
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

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      updateNavigation();
      renderProductDetails();
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