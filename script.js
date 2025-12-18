// лічильники в картках + кошик з видаленням при 0

window.addEventListener('click', function(event) {

    // лічильник в картках товарів
    if (event.target.dataset.action === 'plus' || event.target.dataset.action === 'minus') {
        const counterWrapper = event.target.closest('.counter-wrapper');
        if (!counterWrapper) return;
        const counter = counterWrapper.querySelector('[data-counter]');
        let value = parseInt(counter.innerText);

        if (event.target.dataset.action === 'plus') value++;
        if (event.target.dataset.action === 'minus' && value > 1) value--;

        counter.innerText = value;
    }

    // додавання в кошик
    if (event.target.hasAttribute('data-cart')) {
        const card = event.target.closest('.product-card');

        const productInfo = {
            title: card.querySelector('h3').innerText,
            price: parseInt(card.querySelector('.price').dataset.price),
            imgSrc: card.querySelector('img').src,
            quantity: parseInt(card.querySelector('[data-counter]').innerText)
        };

        // шаблон з кнопками +/– в кошику
        const cartItemHTML = `
            <div class="cart-item">
                <img src="${productInfo.imgSrc}" alt="${productInfo.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${productInfo.title}</div>
                    <div class="cart-item-counter-wrapper counter-wrapper">
                        <button class="items__control" data-action="minus">-</button>
                        <div class="items__current" data-counter>${productInfo.quantity}</div>
                        <button class="items__control" data-action="plus">+</button>
                    </div>
                    <div class="cart-item-price" style="font-weight: bold; color: #e91e63; margin-top: 5px;">
                        ${productInfo.price * productInfo.quantity} грн
                    </div>
                </div>
            </div>`;

        const cartItems = document.getElementById('cart-items');
        if (cartItems.classList.contains('empty-cart')) {
            cartItems.innerHTML = '';
            cartItems.classList.remove('empty-cart');
        }

        cartItems.insertAdjacentHTML('beforeend', cartItemHTML);
        updateCartTotal();
    }

    // + / - в кошику (з видаленням при 0)
    if (event.target.classList.contains('items__control') && event.target.closest('.cart-item')) {
        const counterWrapper = event.target.closest('.counter-wrapper');
        const counter = counterWrapper.querySelector('[data-counter]');
        let value = parseInt(counter.innerText);

        if (event.target.dataset.action === 'plus') {
            value++;
        } else if (event.target.dataset.action === 'minus') {
            value--;
            if (value <= 0) {
                // видаляємо товар з кошика
                event.target.closest('.cart-item').remove();
                updateCartTotal();
                checkEmptyCart();
                return;
            }
        }

        counter.innerText = value;

        // оновлюємо ціну товару
        const cartItem = event.target.closest('.cart-item');
        const priceElement = cartItem.querySelector('.cart-item-price');
        const basePrice = priceElement.dataset.basePrice || productInfo.price; // можна зберегти basePrice при додаванні, але для простоти перерахуємо
        const originalPrice = parseInt(cartItem.querySelector('.price')?.dataset.price || 0);
        const newPrice = originalPrice * value;
        priceElement.innerText = newPrice + ' грн';

        updateCartTotal();
    }
});

// оновлення суми
function updateCartTotal() {
    let total = 0;
    document.querySelectorAll('.cart-item-price').forEach(el => {
        total += parseInt(el.innerText);
    });
    document.getElementById('cart-total-price').innerText = total;
}

// перевірка порожнього кошика
function checkEmptyCart() {
    const cartItems = document.getElementById('cart-items');
    if (cartItems.children.length === 0) {
        cartItems.innerHTML = 'Кошик порожній';
        cartItems.classList.add('empty-cart');
    }
}
