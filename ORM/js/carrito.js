let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('🛒 Carrito.js cargado');
    
    cargarCarrito();
    renderizarCarrito();
    

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
    console.log('Carrito cargado:', carrito);
}

function renderizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito.length === 0) {
        document.getElementById('emptyCart').style.display = 'block';
        document.getElementById('cartWithItems').style.display = 'none';
        return;
    }
    
    document.getElementById('emptyCart').style.display = 'none';
    document.getElementById('cartWithItems').style.display = 'block';
    
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';
    
    let subtotal = 0;
    
    carrito.forEach((item, index) => {
        const itemTotal = item.precio * item.cantidad;
        subtotal += itemTotal;
        
        const imagenUrl = item.imagen && item.imagen !== 'default.png' 
            ? `/uploads/${item.imagen}` 
            : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><text y="50%" x="50%" text-anchor="middle" font-size="80">🐾</text></svg>';
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${imagenUrl}" 
                 alt="${item.nombre}" 
                 class="cart-item-image"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22><text y=%2250%25%22 x=%2250%25%22 text-anchor=%22middle%22 font-size=%2280%22>🐾</text></svg>'">
            <div class="cart-item-details">
                <h3>${item.nombre}</h3>
                <p class="cart-item-price">$${parseFloat(item.precio).toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <button class="btn-qty" onclick="cambiarCantidad(${index}, -1)">−</button>
                <span class="item-quantity">${item.cantidad}</span>
                <button class="btn-qty" onclick="cambiarCantidad(${index}, 1)">+</button>
            </div>
            <div class="cart-item-total">
                <p>$${itemTotal.toFixed(2)}</p>
            </div>
            <button class="btn-remove" onclick="eliminarDelCarrito(${index})">🗑️</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('modalTotal').textContent = `$${subtotal.toFixed(2)}`;
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
        alert('El carrito está vacío');
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

        const nombreCliente = localStorage.getItem('nombreCliente') || 'Cliente Sin Nombre';

        const ventaData = {
            nombre: nombreCliente,
            productos: carrito.map(item => ({
                id: item.id,
                cantidad: item.cantidad
            }))
        };

        console.log('Enviando venta:', ventaData);

        const res = await fetch('/api/venta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ventaData)
        });

        const data = await res.json();
        console.log('📥 Respuesta:', data);

        if (res.ok) {
            const ventaInfo = {
                id: data.ventaId,
                nombre: nombreCliente,
                fecha: new Date().toLocaleDateString('es-AR'),
                productos: carrito,
                total: total
            };
            
            localStorage.setItem('ultimaVenta', JSON.stringify(ventaInfo));
            
            localStorage.removeItem('carrito');
            carrito = [];
            document.getElementById('confirmModal').style.display = 'none';
            
            setTimeout(() => window.location.href = 'ticket.html', 1500);
        } else {
            alert('Error: ' + (data.error || 'Error desconocido'));
        }
    } catch (err) {
        console.error('Error catch:', err);
        alert('Error al procesar la compra: ' + err.message);
    }
}