document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cart-button');
    const cartPopup = document.getElementById('cart-popup');
    const closePopup = document.getElementById('close-popup');

    // Mostrar y ocultar la ventana flotante
    cartButton.addEventListener('click', (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del enlace
        // Alternamos entre mostrar y ocultar el popup
        if (cartPopup.classList.contains('show')) {
            cartPopup.classList.remove('show');
            cartPopup.classList.add('hide');
        } else {
            cartPopup.classList.remove('hide');
            cartPopup.classList.add('show');
        }
    });

    // Cerrar la ventana flotante con el botón de cerrar
    closePopup.addEventListener('click', () => {
        cartPopup.classList.remove('show');
        cartPopup.classList.add('hide');
    });

    // Cerrar la ventana flotante si se hace clic fuera de ella
    window.addEventListener('click', (e) => {
        // Verifica si el clic fue fuera del popup y del botón del carrito, 
        // y que no sea en un enlace, botón o imagen dentro del popup
        if (!cartPopup.contains(e.target) && !cartButton.contains(e.target) &&
            !e.target.closest('.cart-item') && e.target.tagName !== 'A' &&
            e.target.tagName !== 'BUTTON' && e.target.tagName !== 'IMG') {
            cartPopup.classList.remove('show');
            cartPopup.classList.add('hide');
        }
    });

    // Evitar que el clic dentro del cartPopup cierre el popup
    cartPopup.addEventListener('click', (e) => {
        e.stopPropagation(); // Esto evita que el clic se propague hacia el window
    });
});

let cart = []; // Array donde se almacenan los productos del carrito

// Función para agregar productos al carrito
function addToCart(product) {
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1; // Si ya está en el carrito, aumentamos la cantidad
    } else {
        product.quantity = 1; // Si no está en el carrito, agregamos el producto con cantidad 1
        cart.push(product);
    }
    updateCartPopup();
}

// Función para actualizar la cantidad de un producto
function updateProductQuantity(productId, increment) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        if (increment) {
            cart[productIndex].quantity += 1; // Incrementar cantidad
        } else if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1; // Decrementar cantidad (sin que baje de 1)
        }
    }
    updateCartPopup();
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId); // Eliminar producto completamente
    updateCartPopup(); // Actualizar la vista
}

// Función para actualizar el contenido del carrito en la vista
function updateCartPopup() {
    const cartContent = document.getElementById('cart-content');
    cartContent.innerHTML = ''; // Limpiar el contenido previo

    if (cart.length === 0) {
        cartContent.innerHTML = 'El carrito está vacío.';
    } else {
        let total = 0; // Inicializamos la variable para el total

        // Iteramos sobre los productos del carrito
        cart.forEach(item => {
            const productRow = document.createElement('div');
            productRow.classList.add('cart-item');
            productRow.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                <div class="cart-item-quantity">
                    <button class="quantity-button" onclick="updateProductQuantity('${item.id}', false)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-button" onclick="updateProductQuantity('${item.id}', true)">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">Eliminar</button>
            `;
            cartContent.appendChild(productRow);

            // Sumar el precio del producto al total
            total += item.price * item.quantity;
        });

        // Agregar el total y el botón "Comprar ahora"
        const totalRow = document.createElement('div');
        totalRow.classList.add('cart-total');
        totalRow.innerHTML = `
            <span class="total-text">Total: $${total.toFixed(2)}</span>
        `;
        cartContent.appendChild(totalRow);

        const checkoutButton = document.createElement('a');
        checkoutButton.href = 'pago.html';  // Enlace a la página de pago
        checkoutButton.classList.add('checkout-button');
        checkoutButton.textContent = `Comprar ahora - $${total.toFixed(2)}`;
        cartContent.appendChild(checkoutButton);
    }
}

// Asocia el evento de clic a cada enlace de producto para agregarlo al carrito
const productLinks = document.querySelectorAll('.grid-item a');
productLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del enlace

        // Obtiene los datos del producto desde los atributos de la etiqueta <a>
        const product = {
            id: link.getAttribute('data-id'),
            name: link.getAttribute('data-name'),
            price: parseFloat(link.getAttribute('data-price')),
            image: link.getAttribute('data-image') // Añadimos la imagen
        };

        // Añade el producto al carrito
        addToCart(product);
    });
});
const checkoutButton = document.createElement('a');
checkoutButton.href = 'pago.html';  // Enlace a la página de pago
checkoutButton.classList.add('checkout-button');
checkoutButton.textContent = `Comprar ahora - $${total.toFixed(2)}`;
cartContent.appendChild(checkoutButton);
