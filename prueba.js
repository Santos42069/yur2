// Sample data
    const samplePosts = [
      {
        id: 1,
        username: "Juan Pérez",
        content: "Libro de Cálculo (2ª Edición)",
        category: "libros",
        price: 20000,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        comments: [],
        badge: "Like New"
      },
      {
        id: 2,
        username: "María Gómez",
        content: "Empanadas caseras",
        category: "comida",
        price: 2000,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        comments: [],
        badge: "Good"
      },
      {
        id: 3,
        username: "Juan Sánchez",
        content: "Fortnite BattlePass",
        category: "objetos",
        price: 20000,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        comments: [],
        badge: "Vintage"
      }
    ];

    let posts = JSON.parse(localStorage.getItem('posts')) || [...samplePosts];

    const feed = document.getElementById('feed');
    const chatModal = document.getElementById('chatModal');
    const chatUser = document.getElementById('chatUser');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const closeChat = document.getElementById('closeChat');
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const sideMenu = document.getElementById('sideMenu');
    const itemCount = document.getElementById('itemCount');

    // Menu toggle with hover functionality
    let isMenuOpen = false;
    
    menuToggle?.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      sideMenu.classList.toggle('active');
    });

    menuClose?.addEventListener('click', () => {
      isMenuOpen = false;
      sideMenu.classList.remove('active');
    });

    // Hover functionality for menu
    if (menuToggle && sideMenu) {
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

    // SELL ITEM BUTTON PROTECTION
function handleCreatePost() {
  const session = JSON.parse(localStorage.getItem('session'));
  
  if (!session || !session.email || !session.email.endsWith('javeriana.edu.co')) {
    alert('⚠️ Debes iniciar sesión para crear una publicación');
    window.location.href = 'betalogin.html';
  } else {
    window.location.href = 'pruebaCrearPub.html';
  }
}

    // Update stats
    function updateStats() {
      const totalProductsEl = document.getElementById('totalProducts');
      if (totalProductsEl) {
        totalProductsEl.textContent = posts.length;
      }
      if (itemCount) {
        itemCount.textContent = `${posts.length} items`;
      }
    }

    // Render feed
    function renderFeed(postsToShow = posts) {
      if (!feed) return;
      feed.innerHTML = '';

      if (postsToShow.length === 0) {
        feed.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
            <h3 style="font-size: 24px; margin-bottom: 16px; color: #95a5a6;">🔍 No hay publicaciones aún</h3>
            <p style="color: #7f8c8d; margin-bottom: 20px;">¡Sé el primero en compartir algo increíble!</p>
            <button onclick="window.location.href='pruebaCrearPub.html'" class="sell-btn">Crear Primera Publicación</button>
          </div>
        `;
        return;
      }

      const categoryEmojis = {
        'libros': '📚',
        'comida': '🍕',
        'objetos': '📦',
        'otros': '🔧'
      };

      postsToShow.forEach((post) => {
        const categoryEmoji = categoryEmojis[post.category] || '📦';
        const badgeClass = post.badge === 'Good' ? 'good' : post.badge === 'Vintage' ? 'vintage' : '';
        
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
          <div class="item-image">${categoryEmoji}</div>
          <div class="item-badge ${badgeClass}">${post.badge || 'Like New'}</div>
          <button class="favorite-btn">♡</button>
          <div class="item-content">
            <h3 class="item-title">${post.content}</h3>
            <div class="item-meta">
              👤 ${post.username} • ${post.timestamp}
            </div>
            <div class="item-actions">
              <button class="action-btn like-btn" data-id="${post.id}">❤️ ${post.likes}</button>
              <button class="action-btn comment-btn" data-id="${post.id}">💬 ${post.comments.length}</button>
              <button class="action-btn chat-btn" data-id="${post.id}" data-user="${post.username}">Chatear</button>
            </div>
          </div>
          <div class="comment-section">
            <input type="text" class="comment-input" placeholder="Añade un comentario...">
            <button class="submit-comment" data-id="${post.id}">Enviar</button>
            ${post.comments.length > 0 ? `<div class="comments">${post.comments.map(c => `<p>💬 ${c}</p>`).join('')}</div>` : ''}
          </div>
        `;
        feed.appendChild(card);
      });
    }

    // Event delegation for feed
    if (feed) {
      feed.addEventListener('click', (e) => {
        const card = e.target.closest('.item-card');
        
        // If clicking on action buttons, handle them
        if (e.target.classList.contains('like-btn')) {
          const postId = parseInt(e.target.dataset.id);
          const post = posts.find(p => p.id === postId);
          if (post) {
            post.likes += 1;
            localStorage.setItem('posts', JSON.stringify(posts));
            e.target.innerHTML = `❤️ ${post.likes}`;
          }
          return;
        }
        
        if (e.target.classList.contains('comment-btn')) {
          const commentSection = card.querySelector('.comment-section');
          commentSection.style.display = commentSection.style.display === 'block' ? 'none' : 'block';
          return;
        }
        
        if (e.target.classList.contains('submit-comment')) {
          const postId = parseInt(e.target.dataset.id);
          const post = posts.find(p => p.id === postId);
          const commentInput = card.querySelector('.comment-input');
          if (commentInput?.value.trim()) {
            post.comments.push(commentInput.value.trim());
            localStorage.setItem('posts', JSON.stringify(posts));
            commentInput.value = '';
            renderFeed();
          }
          return;
        }
        
        if (e.target.classList.contains('chat-btn')) {
          if (chatUser && chatMessages && chatModal) {
            chatUser.textContent = e.target.dataset.user;
            chatMessages.innerHTML = `<p style="color: #95a5a6; text-align: center; padding: 20px;">¡Comienza a chatear con ${e.target.dataset.user}!</p>`;
            chatModal.style.display = 'flex';
          }
          return;
        }
        
        if (e.target.classList.contains('favorite-btn')) {
          e.target.textContent = e.target.textContent === '♡' ? '♥' : '♡';
          e.target.style.color = e.target.textContent === '♥' ? '#ff6b6b' : 'white';
          return;
        }

        if (e.target.classList.contains('comment-input')) {
          return;
        }
        
        // Otherwise, navigate to details
        if (card) {
          const postId = card.dataset.postId;
          window.location.href = `pruebaPubDetails.html?postId=${postId}`;
        }
      });
    }

    // Chat functionality
    if (sendMessage && chatInput && chatMessages) {
      const sendChatMessage = () => {
        const message = chatInput.value.trim();
        if (message) {
          const messageElement = document.createElement('p');
          messageElement.innerHTML = `<strong>Tú:</strong> ${message}`;
          messageElement.style.cssText = `
            background: linear-gradient(135deg, #ff6b6b, #ff5252);
            color: white;
            padding: 12px 16px;
            border-radius: 12px;
            margin: 8px 0;
            max-width: 80%;
            margin-left: auto;
            word-wrap: break-word;
          `;
          chatMessages.appendChild(messageElement);
          chatInput.value = '';
          chatMessages.scrollTop = chatMessages.scrollHeight;
          
          setTimeout(() => {
            const responseElement = document.createElement('p');
            responseElement.innerHTML = `<strong>${chatUser.textContent}:</strong> ¡Hola! Gracias por contactarme`;
            responseElement.style.cssText = `
              background: #3d566e;
              color: white;
              padding: 12px 16px;
              border-radius: 12px;
              margin: 8px 0;
              max-width: 80%;
              margin-right: auto;
              word-wrap: break-word;
            `;
            chatMessages.appendChild(responseElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }, 2000);
        }
      };

      sendMessage.addEventListener('click', sendChatMessage);
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          sendChatMessage();
        }
      });
    }

    if (closeChat) {
      closeChat.addEventListener('click', () => {
        if (chatModal) chatModal.style.display = 'none';
      });
    }

    // Close modal on outside click
    if (chatModal) {
      chatModal.addEventListener('click', (e) => {
        if (e.target === chatModal) {
          chatModal.style.display = 'none';
        }
      });
    }

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (sideMenu && !sideMenu.contains(e.target) && e.target !== menuToggle && isMenuOpen) {
        isMenuOpen = false;
        sideMenu.classList.remove('active');
      }
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm === '') {
          renderFeed();
          return;
        }
        
        const filteredPosts = posts.filter(post => 
          post.content.toLowerCase().includes(searchTerm) ||
          post.username.toLowerCase().includes(searchTerm) ||
          post.category.toLowerCase().includes(searchTerm)
        );
        renderFeed(filteredPosts);
      });
    }

    // Category filter
    const pills = document.querySelectorAll('.pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        const category = pill.textContent.toLowerCase();
        if (category.includes('all')) {
          renderFeed();
        } else {
          const filtered = posts.filter(post => 
            category.includes(post.category) || 
            post.category.includes(category.split(' ')[1])
          );
          renderFeed(filtered);
        }
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (isMenuOpen) {
          isMenuOpen = false;
          sideMenu?.classList.remove('active');
        }
        if (chatModal && chatModal.style.display === 'flex') {
          chatModal.style.display = 'none';
        }
      }
    });

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      updateStats();
      renderFeed();
    });