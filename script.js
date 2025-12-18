// основний скрипт: лічильники, кошик, видалення, статус, підрахунок ціни

const cartWrapper = document.querySelector('#cart-items');
const cartEmptyBadge = document.querySelector('.empty-cart');
const orderButton = document.querySelector('.cart-order-button');

window.addEventListener('click', function(event) {

    // лічильник в картках
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

        const cartItemHTML = `
            <div class="cart-item" data-id="${productInfo.title}">
                <img src="${productInfo.imgSrc}" alt="${productInfo.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${productInfo.title}</div>
                    <div class="counter-wrapper">
                        <button class="items__control" data-action="minus">-</button>
                        <div class="items__current" data-counter>${productInfo.quantity}</div>
                        <button class="items__control" data-action="plus">+</button>
                    </div>
                    <div class="cart-item-price" style="font-weight: bold; color: #e91e63; margin-top: 5px;">
                        ${productInfo.price * productInfo.quantity} грн
                    </div>
                </div>
            </div>`;

        cartWrapper.insertAdjacentHTML('beforeend', cartItemHTML);
        toggleCartStatus();
        calcCartPrice();
    }

    // + / - в кошику з видаленням при 0
    if (event.target.classList.contains('items__control') && event.target.closest('.cart-item')) {
        const counterWrapper = event.target.closest('.counter-wrapper');
        const counter = counterWrapper.querySelector('[data-counter]');
        let value = parseInt(counter.innerText);

        if (event.target.dataset.action === 'plus') {
            value++;
        } else if (event.target.dataset.action === 'minus') {
            value--;
            if (value <= 0) {
                event.target.closest('.cart-item').remove();
                toggleCartStatus();
                calcCartPrice();
                return;
            }
        }

        counter.innerText = value;

        // оновлюємо ціну цього товару
        const cartItem = event.target.closest('.cart-item');
        const priceElement = cartItem.querySelector('.cart-item-price');
        const basePrice = parseInt(cartItem.querySelector('.price')?.dataset.price || 
            document.querySelector(`.product-card h3:contains('${cartItem.querySelector('.cart-item-title').innerText}')`)?.closest('.product-card').querySelector('.price').dataset.price);
        priceElement.innerText = basePrice * value + ' грн';

        calcCartPrice();
    }
});

// показ/приховування "Кошик порожній" і кнопки оформлення
function toggleCartStatus() {
    if (cartWrapper.children.length > 0) {
        cartEmptyBadge?.classList.add('none');
        orderButton?.classList.remove('none');
    } else {
        cartEmptyBadge?.classList.remove('none');
        orderButton?.classList.add('none');
        cartWrapper.innerHTML = 'Кошик порожній';
    }
}

// підрахунок загальної вартості
function calcCartPrice() {
    let totalPrice = 0;
    document.querySelectorAll('.cart-item-price').forEach(item => {
        totalPrice += parseInt(item.innerText);
    });
    document.getElementById('cart-total-price').innerText = totalPrice;
}
