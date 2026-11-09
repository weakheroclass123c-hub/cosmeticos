
// LISTA DE PRODUTOS
const products = [
    ["Batom Rosa",25,"Maquiagem","https://http2.mlstatic.com/D_NQ_NP_688717-MLA113923750605_062026-O.webp"],
    ["Batom Nude",29,"Maquiagem","https://m.media-amazon.com/images/I/615UuKVHxWS.jpg"],
    ["Gloss Labial",22,"Maquiagem","https://static.cdnlive.com.br/uploads/790/produto/17244184767391_detalhe.png"],
    ["Blush Rosa Quente",32,"Maquiagem","https://http2.mlstatic.com/D_NQ_NP_679503-MLB109677639812_042026-O-blush-color-glam-1--make-more.webp"],
    ["Paleta de Sombras",55,"Maquiagem","photo-1512496015851-a90fb38ba796"],
    ["Máscara de Cílios",27,"Maquiagem","photo-1631214540242-3cd8c6f8b5c7"],
    ["Base Líquida",48,"Maquiagem","photo-1522335789203-aabd1fc54bc9"],
    ["Pó Compacto",35,"Maquiagem","photo-1596462502278-27bfdc403348"],
    ["Corretivo",30,"Maquiagem","photo-1522335789203-aabd1fc54bc9"],
    ["Iluminador",38,"Maquiagem","photo-1596462502278-27bfdc403348"],
    ["Perfume Floral",89,"Perfumes","photo-1541643600914-78b084683601"],
    ["Perfume Elegance",110,"Perfumes","photo-1594035910387-fea47794261f"],
    ["Body Splash",59,"Perfumes","photo-1592945403244-b3fbafd7f539"],
    ["Creme Hidratante",45,"Skincare","photo-1608248543803-ba4f8c70ae0b"],
    ["Sérum Facial",65,"Skincare","photo-1601049541289-9b1b7bbbfe19"],
    ["Protetor Solar",52,"Skincare","photo-1556229010-6c3f2c9ca5f8"],
    ["Sabonete Facial",28,"Skincare","photo-1556228720-195a672e8a03"],
    ["Água Micelar",36,"Skincare","photo-1608248543803-ba4f8c70ae0b"],
    ["Máscara Facial",19,"Skincare","photo-1556229010-6c3f2c9ca5f8"],
    ["Óleo Capilar",39,"Cabelos","photo-1608248543803-ba4f8c70ae0b"],
    ["Máscara Capilar",44,"Cabelos","photo-1608248543803-ba4f8c70ae0b"],
    ["Shampoo",32,"Cabelos","photo-1608248543803-ba4f8c70ae0b"],
    ["Condicionador",34,"Cabelos","photo-1608248543803-ba4f8c70ae0b"],
    ["Kit Pincéis",49,"Acessórios","photo-1522335789203-aabd1fc54bc9"]
  ];
  
  // CARRINHO
  let cart = {};
  
  // FORMATAÇÃO DE PREÇOS
  function money(n) {
    return n.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }
  
  // TROCAR DE PÁGINA
  function showPage(id) {
    document.querySelectorAll(".page")
      .forEach(p => p.classList.remove("active"));
  
    document.getElementById(id)
      .classList.add("active");
  
    window.scrollTo({top:0,behavior:"smooth"});
  }
  
  // ENDEREÇO DAS IMAGENS
  function imageUrl(photo) {
    return photo;
}
  
  // CRIAR CONTAINER DO PRODUTO
  function card(p,i) {
    return `
      <article class="card">
        <img src="${imageUrl(p[3])}" alt="${p[0]}">
        <h3>${p[0]}</h3>
        <p class="price">${money(p[1])}</p>
        <p>${p[2]}</p>
  
        <label>Quantidade:
          <input type="number" min="1" max="99"
          value="1" id="qty${i}">
        </label>
  
        <button class="buy" onclick="add(${i})">
          Adicionar ao carrinho 🛒
        </button>
      </article>
    `;
  }
  
  // MOSTRAR PRODUTOS
  function renderProducts() {
    document.getElementById("productGrid").innerHTML =
      products.map((p,i) => ({p,i}))
      .filter(x => category === "Todos" || x.p[2] === category)
      .map(x => card(x.p,x.i)).join("");
  }
  
  // CATEGORIAS
  let category = "Todos";
  
  function renderCategories() {
    let cats = ["Todos", ...new Set(products.map(p => p[2]))];
  
    document.getElementById("categories").innerHTML =
      cats.map(c => `
        <button class="${c===category?'active':''}"
        onclick="setCategory('${c}')">${c}</button>
      `).join("");
  }
  
  function setCategory(c) {
    category = c;
    renderCategories();
    renderProducts();
  }
  
  // ADICIONAR AO CARRINHO
  function add(i) {
    let qty = Number(document.getElementById("qty"+i).value);
  
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      alert("Escolha uma quantidade entre 1 e 99.");
      return;
    }
  
    if (!cart[i]) cart[i] = 0;
  
    cart[i] += qty;
  
    updateCart();
    alert(products[i][0] + " adicionado ao carrinho!");
  }
  
  // ATUALIZAR CARRINHO
  function updateCart() {
    let html = "";
    let total = 0;
    let count = 0;
  
    for (let i in cart) {
      let p = products[i];
      let q = cart[i];
      let sub = p[1] * q;
  
      total += sub;
      count += q;
  
      html += `
        <div class="cart-item">
          <div>
            <strong>${p[0]}</strong><br>
            ${money(p[1])} cada
          </div>
  
          <input type="number" min="1" max="99"
            value="${q}"
            onchange="changeQty(${i},this.value)">
  
          <strong>${money(sub)}</strong>
  
          <button class="remove"
            onclick="removeItem(${i})">
            Remover
          </button>
        </div>
      `;
    }
  
    document.getElementById("cartItems").innerHTML =
      html || "Seu carrinho está vazio.";
  
    document.getElementById("total").innerText =
      "Total: " + money(total);
  
    document.getElementById("count").innerText = count;
  }
  
  // ALTERAR QUANTIDADE
  function changeQty(i,qty) {
    qty = Number(qty);
  
    if (!Number.isInteger(qty) || qty < 1) {
      removeItem(i);
      return;
    }
  
    cart[i] = Math.min(99,qty);
    updateCart();
  }
  
  // REMOVER PRODUTO
  function removeItem(i) {
    delete cart[i];
    updateCart();
  }
  
  // FINALIZAR PEDIDO
  function checkout() {
    if (!Object.keys(cart).length) {
      alert("Seu carrinho está vazio!");
      return;
    }
  
    let order = Object.entries(cart)
      .map(([i,q]) => products[i][0] + " x " + q)
      .join("\n");
  
    let total = Object.entries(cart)
      .reduce((s,[i,q]) => s + products[i][1]*q,0);
  
    alert(
      "Resumo do pedido:\n" +
      order +
      "\nTotal: " + money(total) +
      "\n\nCheckout demonstrativo."
    );
  }
  
  // MOSTRAR DESTAQUES E INICIAR A LOJA
  document.getElementById("featured").innerHTML =
    products.slice(0,4).map((p,i) => card(p,i)).join("");
  
  renderCategories();
  renderProducts();
  updateCart();
  