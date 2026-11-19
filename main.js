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

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const searchBarBox = document.getElementById("searchBarBox");
  const searchInput = document.getElementById("searchInput");
  const closeSearchBtn = document.getElementById("closeSearchBtn");

  if (searchBtn && searchBarBox && searchInput) {
    searchBtn.addEventListener("click", () => {
      const isOpen = searchBarBox.style.display === "flex";
      searchBarBox.style.display = isOpen ? "none" : "flex";
      if (!isOpen) {
        searchInput.focus();
      }
    });

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      const cards = document.querySelectorAll(".product-card");

      console.log("Search query:", query, "Cards found:", cards.length);

      cards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          card.style.removeProperty("display");
        } else {
          card.style.setProperty("display", "none", "important");
        }
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
});

const vexaCollections = {
  "MEN'S NEW ARRIVALS": [
    { name: "VEXA Drop 01 Denim Jacket", price: "950 EGP", img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80" },
    { name: "VEXA Heavyweight Boxy Hoodie", price: "850 EGP", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80" },
    { name: "VEXA Street Cargo Pants", price: "780 EGP", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80" },
    { name: "VEXA Essential Oversized Tee", price: "450 EGP", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80" },
    { name: "VEXA Vintage Washed Crewneck", price: "720 EGP", img: "https://images.unsplash.com/photo-1614975059251-992f11792b9f?w=500&q=80" },
    { name: "VEXA Urban Zip-Up Jacket", price: "890 EGP", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80" }
  ],
  "T-SHIRTS": [
    { name: "VEXA Heavyweight White Tee", price: "420 EGP", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80" },
    { name: "VEXA Oversized Jet Black Tee", price: "420 EGP", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80" },
    { name: "VEXA Street Graphic Print Tee", price: "480 EGP", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80" },
    { name: "VEXA Boxy Acid Wash Tee", price: "490 EGP", img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80" },
    { name: "VEXA Sand Beige Essential Tee", price: "440 EGP", img: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=80" },
    { name: "VEXA Retro Back-Print Tee", price: "500 EGP", img: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&q=80" }
  ],
    "GIRLS COLLECTIONS": [
    { name: "VEXA Women Oversized Graphic Tee - Black", price: "450 EGP", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80" },
    { name: "VEXA Women Cropped Street Tee - White", price: "430 EGP", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80" },
    { name: "VEXA Women Relaxed Sweatpants - Grey", price: "680 EGP", img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&q=80" },
    { name: "VEXA Women Vintage Washed Tee", price: "470 EGP", img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80" },
    { name: "VEXA Women Wide-Leg Sweatpants - Beige", price: "720 EGP", img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80" },
    { name: "VEXA Women Essential Boxy Tee - Sand", price: "440 EGP", img: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=80" },
    { name: "VEXA Women Fleece Joggers - Black", price: "690 EGP", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80" },
    { name: "VEXA Women Retro Print Tee", price: "480 EGP", img: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&q=80" },
    { name: "VEXA Women Street Cargo Sweatpants", price: "750 EGP", img: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=500&q=80" },
    { name: "VEXA Women Soft Oversized Hoodie", price: "840 EGP", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80" }
  ],
  "JERSEYS": [
    { name: "VEXA 90s Vintage Mesh Jersey", price: "550 EGP", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80" },
    { name: "VEXA Oversized Blockcore Jersey", price: "580 EGP", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80" },
    { name: "VEXA Striped Street Polo Jersey", price: "560 EGP", img: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&q=80" },
    { name: "VEXA Varsity Number 08 Jersey", price: "590 EGP", img: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500&q=80" },
    { name: "VEXA Retro Collar Sport Jersey", price: "570 EGP", img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80" },
    { name: "VEXA Monochrome Club Jersey", price: "550 EGP", img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&q=80" }
  ],
  "SWEATPANTS": [
    { name: "VEXA Heavyweight Baggy Sweatpants - Grey", price: "680 EGP", img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&q=80" },
    { name: "VEXA Wide-Leg Black Joggers", price: "690 EGP", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80" },
    { name: "VEXA Fleece Stacked Sweatpants", price: "720 EGP", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80" },
    { name: "VEXA Cream Straight-Fit Pants", price: "700 EGP", img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80" },
    { name: "VEXA Cargo Pocket Street Pants", price: "760 EGP", img: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=500&q=80" },
    { name: "VEXA Charcoal Vintage Joggers", price: "680 EGP", img: "https://images.unsplash.com/photo-1584865288642-42078afe6942?w=500&q=80" }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("collectionModal");
  const modalTitle = document.getElementById("collectionTitle");
  const modalItems = document.getElementById("collectionItems");
  const closeModalBtn = document.getElementById("closeCollectionModal");
  const whatsappNumber = "201024762467"; // حط رقم الواتساب بتاعك هنا بصيغة 201...

  if (!modal || !modalTitle || !modalItems) return;

  function openCollection(titleKey) {
    const items = vexaCollections[titleKey];
    if (!items) return;

    modalTitle.textContent = titleKey;
    modalItems.innerHTML = items.map((item) => {
      const msg = encodeURIComponent(`Hello VEXA_eg, I want to inquire about: ${item.name} (${item.price})`);
      return `
                <div class="modal-product-card">
          <div>
            <img src="${item.img}" alt="${item.name}">
            <h4 style="margin:8px 0 4px; font-size:13px; line-height:1.3;">${item.name}</h4>
            <p style="margin:0; font-weight:bold; font-size:13px; color:#111;">${item.price}</p>
          </div>
          <a href="https://wa.me/${whatsappNumber}?text=${msg}" target="_blank" class="modal-wa-btn">Inquire via WhatsApp</a>
        </div>
      `;
    }).join("");


    modal.style.setProperty("display", "flex", "important");
  }

  document.body.addEventListener("click", (e) => {
    if (e.target.closest("#closeCollectionModal") || e.target.closest(".collection-modal-header button") || e.target === modal) {
      e.stopPropagation();
      modal.style.setProperty("display", "none", "important");
      return;
    }

    const clickedCard = e.target.closest(".collection-card, .featured-card, .category-card, [class*='collection'], [class*='category']");
    if (!clickedCard || clickedCard.closest(".collection-modal")) return;

    const cardText = clickedCard.textContent.toUpperCase();
    for (const key of Object.keys(vexaCollections)) {
      if (cardText.includes(key)) {
        e.preventDefault();
        openCollection(key);
        break;
      }
    }
  });
});


document.addEventListener("click", (e) => {
  const swatch = e.target.closest(".swatch");
  if (!swatch) return;

  e.stopPropagation();
  const card = swatch.closest(".product-card") || swatch.parentElement.parentElement;
  const img = card ? card.querySelector("img") : null;
  const newImg = swatch.dataset.img;

  if (img && newImg) {
    img.src = newImg;
  }

  const siblings = swatch.parentElement.querySelectorAll(".swatch");
  siblings.forEach((s) => s.classList.remove("active"));
  swatch.classList.add("active");
});




      
