window.onload = function() {
    // --- عرض المنتجات ديناميكياً في البداية ---
    const productsList = document.getElementById('products-list');
    if (productsList && typeof products !== "undefined") {
        productsList.innerHTML = products.map((product, idx) => `
            <div class="product" style="--card-index:${idx}">
                <div class="product-image"><img src="${product.image}" alt="${product.title}"></div>
                <h2>${product.title}</h2>
                <p class="price">${product.price}</p>
                <p class="desc">${product.desc}</p>
                ${product.available ? `
                    <button class="buy-btn" onclick="localStorage.setItem('trendora-product-name', '${product.title.replace(/'/g, "\\'")}'); window.open('Buy-form/form.html', '_blank')">شراء</button>
                ` : ''}
            </div>
        `).join('');
    }

    // --- Simple Theme Switch ---
    const simpleSwitch = document.getElementById('simple-theme-switch');
    const body = document.body;
    const sliderIcon = document.querySelector('.slider-icon');

    function setTheme(dark) {
        if (simpleSwitch) {
            if (dark) {
                body.classList.add('dark');
                simpleSwitch.checked = true;
                if (sliderIcon) sliderIcon.textContent = '🌙';
            } else {
                body.classList.remove('dark');
                simpleSwitch.checked = false;
                if (sliderIcon) sliderIcon.textContent = '🌞';
            }
        }
    }

    if (simpleSwitch) {
        simpleSwitch.addEventListener('change', () => {
            const isDark = simpleSwitch.checked;
            setTheme(isDark);
            localStorage.setItem('trendora-theme', isDark ? 'dark' : 'light');
        });
    }

    const savedTheme = localStorage.getItem('trendora-theme');
    setTheme(savedTheme === 'dark');

    // --- Modal logic ---
    const productElements = document.querySelectorAll('.product');
    const modal = document.getElementById('product-modal');
    const modalTitle = document.querySelector('.modal-title');
    const modalPrice = document.querySelector('.modal-price');
    const modalDesc = document.querySelector('.modal-desc');
    const closeModal = document.querySelector('.close-modal');
    const modalImg = document.getElementById('modal-img');

    productElements.forEach(productElement => {
        productElement.addEventListener('click', () => {
            const title = productElement.querySelector('h2').innerText;
            const price = productElement.querySelector('.price').innerText;
            const desc = productElement.querySelector('.desc').innerText;
            const imgSrc = productElement.querySelector('img').src;

            modalTitle.innerText = title;
            modalPrice.innerText = price;
            modalDesc.innerText = desc;
            modalImg.src = imgSrc;

            modal.classList.add('open');
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('open');
        });
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (modal.classList.contains('open') && event.target === modal) {
            modal.classList.remove('open');
        }
    });
}