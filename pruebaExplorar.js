// Sample data for fallback
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

    // State
    let posts = JSON.parse(localStorage.getItem('posts')) || [...samplePosts];

    // Render listings with animations and images
    function renderListings(postsToShow = posts) {
      if (!listings) return;
      listings.innerHTML = '';
      postsToShow.forEach((post, index) => {
        const listingElement = document.createElement('div');
        listingElement.className = `listing-item animate-slideIn${index % 2 === 0 ? 'Left' : 'Right'}`;
        listingElement.style.animationDelay = `${index * 0.1}s`;
        listingElement.setAttribute('data-category', post.category);
        
        // Get category emoji
        const categoryEmojis = {
          'libros': '📚',
          'comida': '🍕',
          'objetos': '📦',
          'otros': '🔧'
        };
        const categoryEmoji = categoryEmojis[post.category] || '📦';
        
        // Create image HTML if image exists
        const imageHTML = post.image ? 
          `<div class="listing-image">
            <img src="${post.image}" alt="Imagen del producto" loading="lazy">
          </div>` : '';
        
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
        
        // Keep your exact click functionality
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

    // Handle category filter - keeping your exact functionality
    if (filterCategory) {
      filterCategory.addEventListener('change', () => {
        const category = filterCategory.value;
        const filteredPosts = category === 'all' ? posts : posts.filter(post => post.category === category);
        renderListings(filteredPosts);
      });
    }

    // Initial render - keeping your exact functionality
    document.addEventListener('DOMContentLoaded', () => {
      renderListings();
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        isMenuOpen = false;
        sideMenu.classList.remove('active');
      }
    });