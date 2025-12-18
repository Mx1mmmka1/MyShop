// тут я роблю лічильники і наповнення кошика

window.addEventListener('click', function(event) {

    // лічильник + / -
    if (event.target.dataset.action === 'plus' || event.target.dataset.action === 'minus') {
        const counterWrapper = event.target.closest('.counter-wrapper');
        const counter = counterWrapper.querySelector('[data-counter]');
        let currentValue = parseInt(counter.innerText);

        if (event.target.dataset.action === 'plus') {
            currentValue++;
        }
        if (event.target.dataset.action === 'minus' && currentValue > 1) {
            currentValue--;
        }
        counter.innerText = currentValue;
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

        const cartItemHTML = `
            <div class="cart-item">
                <img src="${productInfo.imgSrc}" alt="${productInfo.title}">
                <div>
                    <div class="cart-item-title">${productInfo.title}</div>
                    <div>${productInfo.quantity} шт. × ${productInfo.price} грн</div>
                    <div style="font-weight: bold; color: #e91e63;">${productInfo.price * productInfo.quantity} грн</div>
                </div>
            </div>`;

        const cartItems = document.getElementById('cart-items');

        // якщо кошик був порожній — очищаємо напис
        if (cartItems.classList.contains('empty-cart')) {
            cartItems.innerHTML = '';
            cartItems.classList.remove('empty-cart');
        }

        cartItems.insertAdjacentHTML('beforeend', cartItemHTML);

        // оновлення загальної суми
        let total = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const itemPriceText = item.querySelector('div[style*="color"]');
            if (itemPriceText) {
                total += parseInt(itemPriceText.innerText);
            }
        });
        document.getElementById('cart-total-price').innerText = total;
    }
});