const API_URL = '/api/cosmeticos';

let products = [];
let cart = {};
let category = 'Todos';

const money = value => Number(value || 0).toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function showMessage(elementId, message, isError = false) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = message;
  element.classList.toggle('error', isError);
  element.hidden = !message;
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  const page = document.getElementById(id);
  if (page) page.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function productCard(product) {
  const id = Number(product.id);
  return `
    <article class="card">
      <img
        src="${escapeHTML(product.imagem || '')}"
        alt="${escapeHTML(product.nome)}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://placehold.co/600x400/f8e8ef/8b4966?text=Produto+DivaReal';"
      >
      <h3>${escapeHTML(product.nome)}</h3>
      <p class="price">${money(product.preco)}</p>
      <p>${escapeHTML(product.categoria)}</p>
      ${product.descricao ? `<p>${escapeHTML(product.descricao)}</p>` : ''}
      <p>Disponíveis: ${Number(product.quantidade) || 0}</p>
      <label>Quantidade:
        <input type="number" min="1" max="99" value="1" id="qty-${id}" aria-label="Quantidade de ${escapeHTML(product.nome)}">
      </label>
      <button type="button" class="buy" data-add="${id}" ${Number(product.quantidade) <= 0 ? 'disabled' : ''}>
        Adicionar ao carrinho 🛒
      </button>
    </article>
  `;
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const filtered = products.filter(product =>
    category === 'Todos' || product.categoria === category
  );

  grid.innerHTML = filtered.length
    ? filtered.map(productCard).join('')
    : '<p class="empty">Nenhum produto encontrado nesta categoria.</p>';
}

function renderCategories() {
  const categories = ['Todos', ...new Set(products.map(product => product.categoria).filter(Boolean))];
  document.getElementById('categories').innerHTML = categories.map(item => `
    <button type="button"
      class="${item === category ? 'active' : ''}"
      data-category="${escapeHTML(item)}"
      aria-pressed="${item === category}">
      ${escapeHTML(item)}
    </button>
  `).join('');
}

function renderFeatured() {
  const featured = document.getElementById('featured');
  featured.innerHTML = products.slice(0, 4).map(productCard).join('');
}

function updateCart() {
  const cartItems = document.getElementById('cartItems');
  let total = 0;
  let count = 0;

  const entries = Object.entries(cart);
  if (!entries.length) {
    cartItems.textContent = 'Seu carrinho está vazio.';
  } else {
    cartItems.innerHTML = entries.map(([id, quantity]) => {
      const product = products.find(item => Number(item.id) === Number(id));
      if (!product) return '';
      const subtotal = Number(product.preco) * quantity;
      total += subtotal;
      count += quantity;
      return `
        <div class="cart-item">
          <div>
            <strong>${escapeHTML(product.nome)}</strong><br>
            ${money(product.preco)} cada
          </div>
          <label>
            <span class="sr-only">Quantidade</span>
            <input type="number" min="1" max="99" value="${quantity}"
              data-change-quantity="${id}" aria-label="Quantidade de ${escapeHTML(product.nome)} no carrinho">
          </label>
          <strong>${money(subtotal)}</strong>
          <button type="button" class="remove" data-remove="${id}">Remover</button>
        </div>
      `;
    }).join('');
  }

  document.getElementById('total').textContent = `Total: ${money(total)}`;
  document.getElementById('count').textContent = count;
}

function addToCart(id) {
  const product = products.find(item => Number(item.id) === Number(id));
  const input = document.getElementById(`qty-${id}`);
  const quantity = Number(input?.value);
  const stock = Number(product?.quantidade) || 0;

  if (!product) return;
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    alert('Escolha uma quantidade entre 1 e 99.');
    return;
  }
  if ((cart[id] || 0) + quantity > stock) {
    alert(`Estoque insuficiente. Disponível: ${Math.max(0, stock - (cart[id] || 0))}.`);
    return;
  }

  cart[id] = (cart[id] || 0) + quantity;
  updateCart();
  alert(`${product.nome} adicionado ao carrinho!`);
}

function changeQuantity(id, value) {
  const quantity = Number(value);
  const product = products.find(item => Number(item.id) === Number(id));
  if (!product) return;

  if (!Number.isInteger(quantity) || quantity < 1) {
    delete cart[id];
  } else if (quantity > 99 || quantity > Number(product.quantidade)) {
    alert(`Quantidade inválida. Estoque disponível: ${product.quantidade}.`);
    cart[id] = Math.min(99, Number(product.quantidade));
  } else {
    cart[id] = quantity;
  }
  updateCart();
}

function checkout() {
  if (!Object.keys(cart).length) {
    alert('Seu carrinho está vazio!');
    return;
  }

  const lines = Object.entries(cart).map(([id, quantity]) => {
    const product = products.find(item => Number(item.id) === Number(id));
    return product ? `${product.nome} x ${quantity}` : '';
  }).filter(Boolean);

  const total = Object.entries(cart).reduce((sum, [id, quantity]) => {
    const product = products.find(item => Number(item.id) === Number(id));
    return sum + (product ? Number(product.preco) * quantity : 0);
  }, 0);

  alert(`Resumo do pedido:\n${lines.join('\n')}\nTotal: ${money(total)}\n\nCheckout demonstrativo: nenhum pagamento foi realizado.`);
}

async function loadProducts() {
  showMessage('featuredMessage', 'Carregando produtos...');
  showMessage('productsMessage', 'Carregando produtos...');

  try {
    const response = await fetch(API_URL, { headers: { Accept: 'application/json' } });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || `Erro HTTP ${response.status}`);
    }
    if (!Array.isArray(result.data)) {
      throw new Error('A API retornou uma lista de produtos inválida.');
    }

    products = result.data;
    showMessage('featuredMessage', products.length ? '' : 'Ainda não há produtos cadastrados.');
    showMessage('productsMessage', products.length ? '' : 'Ainda não há produtos cadastrados.');
    renderFeatured();
    renderCategories();
    renderProducts();
    updateCart();
  } catch (error) {
    console.error('Não foi possível carregar os produtos:', error);
    showMessage('featuredMessage', `Não foi possível carregar os produtos. ${error.message}`, true);
    showMessage('productsMessage', `Não foi possível carregar os produtos. ${error.message}`, true);
    document.getElementById('featured').innerHTML = '';
    document.getElementById('productGrid').innerHTML = '';
  }
}

// Eventos delegados: os botões continuam funcionando após a renderização dinâmica.
document.addEventListener('click', event => {
  const pageButton = event.target.closest('[data-page]');
  if (pageButton) showPage(pageButton.dataset.page);

  const addButton = event.target.closest('[data-add]');
  if (addButton) addToCart(addButton.dataset.add);

  const categoryButton = event.target.closest('[data-category]');
  if (categoryButton) {
    category = categoryButton.dataset.category;
    renderCategories();
    renderProducts();
  }

  const removeButton = event.target.closest('[data-remove]');
  if (removeButton) {
    delete cart[removeButton.dataset.remove];
    updateCart();
  }
});

document.addEventListener('change', event => {
  const quantityInput = event.target.closest('[data-change-quantity]');
  if (quantityInput) changeQuantity(quantityInput.dataset.changeQuantity, quantityInput.value);
});

document.getElementById('goCart').addEventListener('click', () => {
  showPage('inicio');
  document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('checkoutButton').addEventListener('click', checkout);

renderCategories();
updateCart();
loadProducts();
