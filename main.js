const menuIcon = document.querySelector('.fa-bars');
const sideMenu = document.getElementById('side-menu');

// فتح وقفل القائمة بضغطة واحدة على التلات شرط (Toggle)
if (menuIcon && sideMenu) {
    menuIcon.addEventListener('click', function(e) {
        e.stopPropagation(); // عشان الضغطة متسمعش في الصفحة كلها بره
        sideMenu.classList.toggle('active');
    });

    // أول ما تدوس في أي حتة تانية في الصفحة، القائمة تتقفل لوحدها
    document.addEventListener('click', function() {
        sideMenu.classList.remove('active');
    });

    // لو دوست جوه القائمة نفسها متتقفلش بالغلط
    sideMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

let cart = [];

// دالة زيادة ونقصان الكمية وتحديث السلة فوراً
function updateQty(name, price, change, qtyId) {
    const qtySpan = document.getElementById(qtyId);
    if (!qtySpan) return;

    let currentQty = parseInt(qtySpan.innerText) + change;
    if (currentQty < 0) currentQty = 0;

    qtySpan.innerText = currentQty;

    let item = cart.find(p => p.name === name);
    if (item) {
        item.quantity = currentQty;
        if (item.quantity === 0) {
            cart = cart.filter(p => p.name !== name);
        }
    } else if (currentQty > 0) {
        cart.push({ name: name, price: price, quantity: currentQty });
    }

    updateBadge();
    updateCartModalUI();
}

// تحديث عداد الشنطة فوق في الهيدر
function updateBadge() {
    const badge = document.querySelector('.cart-count') || document.getElementById('cart-count');
    let total = 0;
    cart.forEach(i => total += i.quantity);
    if (badge) badge.innerText = total;
}

// تحديث محتوى نافذة السلة والإجمالي
function updateCartModalUI() {
        const cartItemsList = document.getElementById('cartItemsList');
    const cartTotal = document.getElementById('cartTotal');


    if (!cartItemsList || !cartTotal) return;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="empty-cart">السلة فارغة حالياً</p>';
        cartTotal.innerText = '0';
        return;
    }

    let html = '';
    let totalPrice = 0;

    cart.forEach(item => {
        let sub = item.price * item.quantity;
        totalPrice += sub;
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px;">
                <div>
                    <strong>${item.name}</strong><br>
                    <span style="color: #666; font-size: 11px;">LE ${item.price} × ${item.quantity}</span>
                </div>
                <strong>LE ${sub}</strong>
            </div>
        `;
    });

    cartItemsList.innerHTML = html;
    cartTotal.innerText = totalPrice;
}

// فتح وإغلاق نافذة السلة
function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        // لو الـ display مش block أو flex خليه flex، والعكس صحيح
        if (cartModal.style.display === 'flex') {
            cartModal.style.display = 'none';
        } else {
            cartModal.style.display = 'flex';
        }
    }
}

// إتمام الطلب
function checkout() {
    if (cart.length === 0) {
        alert('السلة فارغة بالفعل!');
        return;
    }

    alert('شكراً لك! تم إتمام طلبك بنجاح.');
    cart = [];
    
    // إرجاع كل العدادات تحت المنتجات إلى 0
    for (let i = 1; i <= 6; i++) {
        let span = document.getElementById('qty-' + i);
        if (span) span.innerText = '0';
    }

    updateBadge();
    updateCartModalUI();
    toggleCart();
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert('السلة فارغة حالياً!');
        return;
    }

    // اكتب رقم الواتساب بتاعك هنا بدل الـ 0 والاعدادات دي (مثلاً كود الدولة ورقمك بدون علامة +)
    // مثال: 201012345678+
    const phoneNumber = "201024762467"; // <--- حط رقمك هنا

    let message = "مرحباً VEXA، أود طلب المنتجات التالية:\n\n";
    let totalPrice = 0;

    cart.forEach((item, index) => {
        let sub = item.price * item.quantity;
        totalPrice += sub;
        message += `${index + 1}. ${item.name} (الكمية: ${item.quantity}) - السعر: LE ${sub}\n`;
    });

    message += `\nالإجمالي الكلي: LE ${totalPrice}`;

    // ترميز الرسالة عشان تفتح رابط الواتساب صح
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // فتح رابط الواتساب في نافذة جديدة
    window.open(whatsappUrl, '_blank');
}

const searchBtn = document.getElementById("searchBtn");
const searchBarBox = document.getElementById("searchBarBox");
const searchInput = document.getElementById("searchInput");
const closeSearchBtn = document.getElementById("closeSearchBtn");

if (searchBtn && searchBarBox && searchInput) {
  searchBtn.addEventListener("click", () => {
    const isHidden = searchBarBox.style.display === "none" || !searchBarBox.style.display;
    searchBarBox.style.display = isHidden ? "flex" : "none";
    if (isHidden) {
      searchInput.focus();
    }
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    const cards = document.querySelectorAll(".product-card, .product-info");

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? "" : "none";
    });
  });
}

if (closeSearchBtn && searchBarBox && searchInput) {
  closeSearchBtn.addEventListener("click", () => {
    searchBarBox.style.display = "none";
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));
  });
}




      
