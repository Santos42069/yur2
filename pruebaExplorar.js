 // Sample data
    const samplePosts = [
      {
        id: 1,
        content: "Vendo: Libro de Cálculo (2ª Edición) - $20,000 COP",
        username: "Juan Pérez",
        category: "libros",
        price: 20000,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        comments: [],
        image: null
      },
      {
        id: 2,
        content: "¡Empanadas caseras a la venta! $2,000 COP cada una",
        username: "María Gómez",    
        category: "comida",
        price: 2000,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        comments: [],
        image: null
      },
      {
        id: 3,
        content: "¡Fortnite BattlePass!",
        username: "Juan Sánchez",
        category: "objetos",
        price: 20000,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        comments: [],
        image: null
      }
    ];

    // DOM elements
    const listings = document.getElementById('listings');
    const filterCategory = document.getElementById('filterCategory');
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const sideMenu = document.getElementById('sideMenu');
    const searchInput = document.querySelector('.search-input');

    // State
    let posts = JSON.parse(localStorage.getItem('posts')) || [...samplePosts];
    let isMenuOpen = false;

    // Menu toggle with hover functionality
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

    // Render listings
    function renderListings(postsToShow = posts) {
      if (!listings) return;
      listings.innerHTML = '';
      
      if (postsToShow.length === 0) {
        listings.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
            <h3 style="font-size: 24px; margin-bottom: 16px; color: #95a5a6;">🔍 No se encontraron productos</h3>
            <p style="color: #7f8c8d;">Intenta con otro filtro o categoría</p>
          </div>
        `;
        return;
      }

      postsToShow.forEach((post, index) => {
        const categoryEmojis = {
          'libros': '📚',
          'comida': '🍕',
          'objetos': '📦',
          'otros': '🔧'
        };
        const categoryEmoji = categoryEmojis[post.category] || '📦';
        
        const listingElement = document.createElement('div');
        listingElement.className = `listing-item animate-slideIn${index % 2 === 0 ? 'Left' : 'Right'}`;
        listingElement.style.animationDelay = `${index * 0.1}s`;
        listingElement.setAttribute('data-category', post.category);
        
        const imageHTML = post.image ? 
          `<div class="listing-image">
            <img src="${post.image}" alt="Imagen del producto" loading="lazy">
          </div>` : 
          `<div class="listing-image">${categoryEmoji}</div>`;
        
        listingElement.innerHTML = `
          ${imageHTML}
          <div class="listing-content">
            <p class="font-semibold"><a href="pruebaPubDetails.html?postId=${post.id}">${post.content}</a></p>
            <p>${categoryEmoji} Categoría: ${post.category.charAt(0).toUpperCase() + post.category.slice(1)}</p>
            <p>💰 Precio: ${post.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
            <p>👤 Vendedor: ${post.username}</p>
            <p>📅 Publicado: ${post.timestamp}</p>
            <div class="actions">
              <button class="chat-btn" data-id="${post.id}" data-user="${post.username}">💬 Contactar Vendedor</button>
            </div>
          </div>
        `;
        
        listingElement.addEventListener('click', (e) => {
          if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A' && e.target.tagName !== 'IMG') {
            const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];
            if (!viewedProducts.some(p => p.id === post.id)) {
              viewedProducts.push({
                id: post.id,
                title: post.content.includes(' - ') ? post.content.split(' - ')[0] : post.content,
                price: post.price,
                description: post.content
              });
              localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
            }
            window.location.href = `pruebaPubDetails.html?postId=${post.id}`;
          }
        });
        
        listings.appendChild(listingElement);
      });
    }

    // Category filter
    if (filterCategory) {
      filterCategory.addEventListener('change', () => {
        const category = filterCategory.value;
        const filteredPosts = category === 'all' ? posts : posts.filter(post => post.category === category);
        renderListings(filteredPosts);
      });
    }

    // Search functionality
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm === '') {
          const category = filterCategory.value;
          const filteredPosts = category === 'all' ? posts : posts.filter(post => post.category === category);
          renderListings(filteredPosts);
          return;
        }
        
        const filteredPosts = posts.filter(post => 
          post.content.toLowerCase().includes(searchTerm) ||
          post.username.toLowerCase().includes(searchTerm) ||
          post.category.toLowerCase().includes(searchTerm)
        );
        renderListings(filteredPosts);
      });
    }

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (sideMenu && !sideMenu.contains(e.target) && e.target !== menuToggle && isMenuOpen) {
        isMenuOpen = false;
        sideMenu.classList.remove('active');
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        isMenuOpen = false;
        sideMenu.classList.remove('active');
      }
    });

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      renderListings();
    });