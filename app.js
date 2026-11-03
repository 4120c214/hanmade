// 織心手作購物系統

function getCart() {
    return JSON.parse(localStorage.getItem("zhixinCart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("zhixinCart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll("#cart-count").forEach(el => {
        el.textContent = count;
    });
}

// 加入購物車
function addToCart(product, quantity = 1) {
    let cart = getCart();

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }

    saveCart(cart);
    alert("商品已成功加入購物車！");
}

// 商品頁按鈕
document.addEventListener("click", function(event) {
    const addButton = event.target.closest(".add-cart");
    const buyButton = event.target.closest(".buy-now");

    if (addButton || buyButton) {
        const button = addButton || buyButton;

        const product = {
            id: button.dataset.id,
            name: button.dataset.name,
            price: Number(button.dataset.price),
            image: button.dataset.image
        };

        if (buyButton) {
            localStorage.setItem("zhixinCart", JSON.stringify([
                { ...product, quantity: 1 }
            ]));
            window.location.href = "./checkout.html";
        } else {
            addToCart(product);
        }
    }
});

// 購物車頁面
function renderCart() {
    const container = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    if (!container || !totalElement) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h2>購物車目前是空的</h2>
                <p>快去挑選喜歡的手作商品吧！</p>
                <a href="./product.html" class="button">繼續購物</a>
            </div>
        `;
        totalElement.textContent = "NT$ 0";
        return;
    }

    let total = 0;

    container.innerHTML = cart.map(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>NT$ ${item.price.toLocaleString("zh-TW")}</p>

                    <div class="quantity-control">
                        <button onclick="changeQuantity('${item.id}', -1)">－</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity('${item.id}', 1)">＋</button>
                    </div>

                    <p>小計：NT$ ${subtotal.toLocaleString("zh-TW")}</p>
                    <button class="remove-button" onclick="removeItem('${item.id}')">刪除商品</button>
                </div>
            </div>
        `;
    }).join("");

    totalElement.textContent = "NT$ " + total.toLocaleString("zh-TW");
}

function changeQuantity(id, change) {
    let cart = getCart();
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    saveCart(cart);
    renderCart();
}

function removeItem(id) {
    const cart = getCart().filter(item => item.id !== id);
    saveCart(cart);
    renderCart();
}

// 結帳頁面
function renderCheckout() {
    const container = document.getElementById("checkout-items");
    const totalElement = document.getElementById("checkout-total");

    if (!container || !totalElement) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = "<p>購物車沒有商品，請先選購商品。</p>";
        totalElement.textContent = "NT$ 0";
        return;
    }

    let total = 0;

    container.innerHTML = cart.map(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        return `
            <div class="checkout-item">
                <span>${item.name} × ${item.quantity}</span>
                <strong>NT$ ${subtotal.toLocaleString("zh-TW")}</strong>
            </div>
        `;
    }).join("");

    totalElement.textContent = "NT$ " + total.toLocaleString("zh-TW");
}

// 建立訂單
function submitOrder(event) {
    event.preventDefault();

    const cart = getCart();

    if (cart.length === 0) {
        alert("購物車沒有商品！");
        return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const address = document.getElementById("customer-address").value.trim();
    const payment = document.getElementById("payment-method").value;

    if (!name || !phone || !address || !payment) {
        alert("請完整填寫訂購資料！");
        return;
    }

    const total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    const order = {
        orderId: "ZX" + Date.now(),
        customerName: name,
        phone: phone,
        address: address,
        payment: payment,
        items: cart,
        total: total,
        status: "待處理",
        date: new Date().toLocaleString("zh-TW")
    };

    const orders = JSON.parse(localStorage.getItem("zhixinOrders")) || [];
    orders.unshift(order);

    localStorage.setItem("zhixinOrders", JSON.stringify(orders));
    localStorage.setItem("zhixinLastOrder", JSON.stringify(order));
    localStorage.removeItem("zhixinCart");

    window.location.href = "./order-success.html";
}

// 訂單成功頁面
function renderSuccess() {
    const container = document.getElementById("success-info");

    if (!container) return;

    const order = JSON.parse(localStorage.getItem("zhixinLastOrder"));

    if (!order) {
        container.innerHTML = "<p>目前沒有訂單資料。</p>";
        return;
    }

    container.innerHTML = `
        <h2>🎉 訂單成立成功！</h2>
        <p>感謝您購買織心手作商品。</p>
        <div class="order-detail">
            <p>訂單編號：${order.orderId}</p>
            <p>訂購人：${order.customerName}</p>
            <p>聯絡電話：${order.phone}</p>
            <p>收件地址：${order.address}</p>
            <p>付款方式：${order.payment}</p>
            <p>訂單日期：${order.date}</p>
            <h3>訂單總金額：NT$ ${order.total.toLocaleString("zh-TW")}</h3>
        </div>
        <a href="./orders.html" class="button">查看我的訂單</a>
        <a href="./product.html" class="button secondary-button">繼續購物</a>
    `;
}

// 訂單查詢頁面
function renderOrders() {
    const container = document.getElementById("order-list");

    if (!container) return;

    const orders = JSON.parse(localStorage.getItem("zhixinOrders")) || [];

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h2>目前沒有訂單</h2>
                <a href="./product.html" class="button">前往商城</a>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <h3>訂單編號：${order.orderId}</h3>
            <p>訂購人：${order.customerName}</p>
            <p>訂單日期：${order.date}</p>
            <p>商品：${order.items.map(item => `${item.name} × ${item.quantity}`).join("、")}</p>
            <p class="price">總金額：NT$ ${order.total.toLocaleString("zh-TW")}</p>
            <p>訂單狀態：<strong>${order.status}</strong></p>
            <button class="button" onclick="updateOrderStatus('${order.orderId}')">模擬出貨</button>
        </div>
    `).join("");
}

// 模擬訂單出貨
function updateOrderStatus(orderId) {
    const orders = JSON.parse(localStorage.getItem("zhixinOrders")) || [];

    const order = orders.find(item => item.orderId === orderId);

    if (order) {
        order.status = "已出貨";
        localStorage.setItem("zhixinOrders", JSON.stringify(orders));
        renderOrders();
        alert("訂單狀態已更新為已出貨！");
    }
}

// 網頁載入時執行
document.addEventListener("DOMContentLoaded", function() {
    updateCartCount();
    renderCart();
    renderCheckout();
    renderSuccess();
    renderOrders();

    const form = document.getElementById("checkout-form");

    if (form) {
        form.addEventListener("submit", submitOrder);
    }
});
/* ===== 自動標示目前所在的頁面選單 ===== */

document.addEventListener("DOMContentLoaded", function() {
    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();
    
    const pageMap = {
        "": "index.html",
        "index.html": "index.html",
        "about.html": "about.html",
        "product.html": "product.html",
        "product-detail.html": "product.html",
        "shop.html": "shop.html",
        "contact.html": "contact.html"
    };
    
    const activePage = pageMap[currentPage] || "index.html";
    
    const menuLinks = document.querySelectorAll("header nav a");
    
    menuLinks.forEach(function(link) {
        const href = link.getAttribute("href");
        
        if (!href) return;
        
        const linkPage = href
            .split("/")
            .pop()
            .split("?")[0]
            .toLowerCase();
        
        if (linkPage === activePage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});