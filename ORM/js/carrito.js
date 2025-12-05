let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('🛒 Carrito.js cargado');
    
    cargarCarrito();
    renderizarCarrito();
    
    // Setup botones
    const finalizarBtn = document.getElementById('finalizarCompra');
    if (finalizarBtn) {
        finalizarBtn.addEventListener('click', procesarCompra);
    }
    
    const cancelBtn = document.getElementById('cancelModal');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('confirmModal').style.display = 'none';
        });
    }
    
    const confirmBtn = document.getElementById('confirmModal');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmarCompra);
    }
});

function cargarCarrito() {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    console.log('📦 Carrito cargado:', carrito);
}

function renderizarCarrito() {
    const emptyCart = document.getElementById('emptyCart');
    const cartWithItems = document.getElementById('cartWithItems');
    const cartItemsContainer = document.getElementById('cartItems');

    if (carrito.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartWithItems) cartWithItems.style.display = 'none';
        console.log('🛒 Carrito vacío');
        return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    if (cartWithItems) cartWithItems.style.display = 'block';

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    carrito.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${item.imagen || 'default.png'}" alt="${item.nombre}" class="cart-item-image">
            
            <div class="cart-item-details">
                <h3>${item.nombre}</h3>
                <p>Precio: $${parseFloat(item.precio).toFixed(2)}</p>
            </div>

            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="cambiarCantidad(${index}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button class="quantity-btn" onclick="cambiarCantidad(${index}, 1)">+</button>
                </div>
                <div>
                    <strong>Subtotal: $${(item.precio * item.cantidad).toFixed(2)}</strong>
                </div>
                <button class="btn btn-danger" onclick="eliminarDelCarrito(${index})">🗑️ Eliminar</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    calcularTotales();
}

function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad < 1) {
        carrito.splice(index, 1);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
}

function calcularTotales() {
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = `$${total.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

function procesarCompra() {
    if (carrito.length === 0) {
        alert('❌ El carrito está vacío');
        return;
    }

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const modalTotal = document.getElementById('modalTotal');
    if (modalTotal) modalTotal.textContent = `$${total.toFixed(2)}`;
    
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) confirmModal.style.display = 'flex';
}

async function confirmarCompra() {
    try {
        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

        const ventaData = {
            nombre: "Cliente PetShop",
            productos: carrito.map(item => ({
                id: item.id,
                cantidad: item.cantidad
            }))
        };

        console.log('📤 Enviando venta:', ventaData);

        const res = await fetch('/api/venta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ventaData)
        });

        const data = await res.json();
        console.log('📥 Respuesta:', data);

        if (res.ok) {
            // ✅ GUARDAR INFORMACIÓN DE LA VENTA EN LOCALSTORAGE
            const ventaInfo = {
                id: data.ventaId,
                nombre: ventaData.nombre,
                fecha: new Date().toLocaleDateString('es-AR'),
                productos: carrito,
                total: total
            };
            
            localStorage.setItem('ultimaVenta', JSON.stringify(ventaInfo));
            
            alert('✅ ¡Compra realizada exitosamente!');
            localStorage.removeItem('carrito');
            carrito = [];
            document.getElementById('confirmModal').style.display = 'none';
            
            // ✅ REDIRIGIR AL TICKET
            setTimeout(() => window.location.href = 'ticket.html', 1500);
        } else {
            alert('❌ Error: ' + (data.error || 'Error desconocido'));
        }
    } catch (err) {
        console.error('❌ Error catch:', err);
        alert('❌ Error al procesar la compra: ' + err.message);
    }
}