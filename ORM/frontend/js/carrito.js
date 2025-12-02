// carrito.js - Lógica del carrito de compras

let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('🛒 Carrito.js cargado');

    // Verificar usuario
    if (!verificarUsuario()) {
        return;
    }

    // Mostrar nombre del cliente
    mostrarNombreCliente();

    // Cargar carrito
    cargarCarrito();

    // Setup botón finalizar compra
    setupFinalizarCompra();

    // Setup modal
    setupModal();
});

/**
 * Verificar que el usuario haya ingresado su nombre
 */
function verificarUsuario() {
    const customerName = User.getName();
    
    if (!customerName) {
        alert('⚠️ Debes ingresar tu nombre primero');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

/**
 * Mostrar nombre del cliente
 */
function mostrarNombreCliente() {
    const customerName = User.getName();
    const displayElement = document.getElementById('customerNameDisplay');
    
    if (displayElement && customerName) {
        displayElement.textContent = customerName;
    }
}

/**
 * Cargar carrito desde localStorage
 */
function cargarCarrito() {
    carrito = Cart.get();
    console.log('📦 Carrito cargado:', carrito);

    if (carrito.length === 0) {
        mostrarCarritoVacio();
    } else {
        mostrarCarritoConProductos();
    }
}

/**
 * Mostrar mensaje de carrito vacío
 */
function mostrarCarritoVacio() {
    const emptyCart = document.getElementById('emptyCart');
    const cartWithItems = document.getElementById('cartWithItems');

    Utils.toggleElement(emptyCart, true);
    Utils.toggleElement(cartWithItems, false);
}

/**
 * Mostrar carrito con productos
 */
function mostrarCarritoConProductos() {
    const emptyCart = document.getElementById('emptyCart');
    const cartWithItems = document.getElementById('cartWithItems');

    Utils.toggleElement(emptyCart, false);
    Utils.toggleElement(cartWithItems, true);

    renderizarCarrito();
    calcularTotales();
}

/**
 * Renderizar items del carrito
 */
function renderizarCarrito() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (!cartItemsContainer) return;

    // Limpiar contenedor
    cartItemsContainer.innerHTML = '';

    // Renderizar cada item
    carrito.forEach(item => {
        const itemElement = crearItemCarrito(item);
        cartItemsContainer.appendChild(itemElement);
    });
}

/**
 * Crear elemento de item del carrito
 */
function crearItemCarrito(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.dataset.productId = item.id;

    const imagenUrl = item.imagen 
        ? `${API_URL}${item.imagen}` 
        : 'https://via.placeholder.com/100?text=Sin+Imagen';

    const subtotal = item.precio * item.quantity;

    itemDiv.innerHTML = `
        <img src="${imagenUrl}" 
             alt="${item.nombre}" 
             class="cart-item-image"
             onerror="this.src='https://via.placeholder.com/100?text=Sin+Imagen'">
        
        <div class="cart-item-details">
            <h3 class="cart-item-name">${item.nombre}</h3>
            <p class="cart-item-price">Precio: ${Utils.formatPrice(item.precio)}</p>
            <p style="color: #6c757d; font-size: 0.9rem;">${item.descripcion || ''}</p>
        </div>

        <div class="cart-item-controls">
            <div class="quantity-control">
                <button class="quantity-btn" onclick="cambiarCantidadCarrito(${item.id}, -1)">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="cambiarCantidadCarrito(${item.id}, 1)">+</button>
            </div>
            <div style="text-align: center; margin: 10px 0;">
                <strong>Subtotal: ${Utils.formatPrice(subtotal)}</strong>
            </div>
            <button class="btn btn-danger" onclick="eliminarDelCarrito(${item.id})" style="width: 100%;">
                🗑️ Eliminar
            </button>
        </div>
    `;

    return itemDiv;
}

/**
 * Cambiar cantidad de un producto en el carrito
 */
function cambiarCantidadCarrito(productId, cambio) {
    const item = carrito.find(p => p.id === productId);
    
    if (!item) return;

    const nuevaCantidad = item.quantity + cambio;

    if (nuevaCantidad <= 0) {
        // Si llega a 0, preguntar si desea eliminar
        if (confirm('¿Deseas eliminar este producto del carrito?')) {
            eliminarDelCarrito(productId);
        }
        return;
    }

    if (nuevaCantidad > 99) {
        alert('⚠️ Cantidad máxima: 99 unidades');
        return;
    }

    // Actualizar cantidad
    Cart.updateQuantity(productId, nuevaCantidad);
    
    // Recargar carrito
    cargarCarrito();
}

/**
 * Eliminar producto del carrito
 */
function eliminarDelCarrito(productId) {
    const item = carrito.find(p => p.id === productId);
    
    if (!item) return;

    if (confirm(`¿Estás seguro de eliminar "${item.nombre}" del carrito?`)) {
        Cart.removeProduct(productId);
        cargarCarrito();
        
        // Mostrar mensaje
        mostrarMensaje(`❌ ${item.nombre} eliminado del carrito`, 'warning');
    }
}

/**
 * Calcular totales
 */
function calcularTotales() {
    const total = Cart.getTotal();
    
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');

    if (subtotalElement) {
        subtotalElement.textContent = Utils.formatPrice(total);
    }

    if (totalElement) {
        totalElement.textContent = Utils.formatPrice(total);
    }
}

/**
 * Setup botón finalizar compra
 */
function setupFinalizarCompra() {
    const finalizarBtn = document.getElementById('finalizarCompra');
    
    if (finalizarBtn) {
        finalizarBtn.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert('⚠️ El carrito está vacío');
                return;
            }

            mostrarModalConfirmacion();
        });
    }
}

/**
 * Setup modal de confirmación
 */
function setupModal() {
    const modal = document.getElementById('confirmModal');
    const cancelBtn = document.getElementById('cancelModal');
    const confirmBtn = document.getElementById('confirmModal');

    if (cancelBtn) {
        cancelBtn.addEventListener('click', cerrarModal);
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', procesarCompra);
    }

    // Cerrar al hacer click fuera del modal
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModal();
            }
        });
    }
}

/**
 * Mostrar modal de confirmación
 */
function mostrarModalConfirmacion() {
    const modal = document.getElementById('confirmModal');
    const modalTotal = document.getElementById('modalTotal');
    
    const total = Cart.getTotal();

    if (modalTotal) {
        modalTotal.textContent = Utils.formatPrice(total);
    }

    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * Cerrar modal
 */
function cerrarModal() {
    const modal = document.getElementById('confirmModal');
    
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * Procesar la compra
 */
async function procesarCompra() {
    console.log('💳 Procesando compra...');

    cerrarModal();

    // Mostrar loading
    mostrarLoading();

    try {
        const customerName = User.getName();
        const total = Cart.getTotal();

        // Preparar datos de la venta
        const ventaData = {
            nombre: customerName,
            productos: carrito.map(item => ({
                id: item.id,
                cantidad: item.quantity
            }))
        };

        console.log('📤 Enviando venta:', ventaData);

        // Enviar a la API
        const response = await fetch(API_ENDPOINTS.ventas, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ventaData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al procesar la compra');
        }

        const data = await response.json();
        console.log('✅ Venta registrada:', data);

        // Guardar datos de la venta en localStorage para el ticket
        const ventaInfo = {
            id: data.venta.id,
            nombre: customerName,
            fecha: new Date().toISOString(),
            productos: carrito,
            total: total
        };

        Storage.set('ultimaVenta', ventaInfo);

        // Limpiar carrito
        Cart.clear();

        // Ocultar loading
        ocultarLoading();

        // Redirigir al ticket
        window.location.href = 'ticket.html';

    } catch (error) {
        console.error('❌ Error al procesar compra:', error);
        ocultarLoading();
        alert(`❌ Error al procesar la compra: ${error.message}\n\nPor favor intenta nuevamente.`);
    }
}

/**
 * Mostrar mensaje de loading
 */
function mostrarLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'processingLoading';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    loadingDiv.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
        ">
            <div class="spinner"></div>
            <p style="margin-top: 20px; font-weight: bold;">Procesando tu compra...</p>
        </div>
    `;

    document.body.appendChild(loadingDiv);
}

/**
 * Ocultar loading
 */
function ocultarLoading() {
    const loading = document.getElementById('processingLoading');
    if (loading) {
        loading.remove();
    }
}

/**
 * Mostrar mensaje temporal
 */
function mostrarMensaje(mensaje, tipo = 'success') {
    const colores = {
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545'
    };

    const mensajeDiv = document.createElement('div');
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colores[tipo]};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    mensajeDiv.textContent = mensaje;

    document.body.appendChild(mensajeDiv);

    setTimeout(() => {
        mensajeDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => mensajeDiv.remove(), 300);
    }, 3000);
}

console.log('✅ Carrito.js inicializado correctamente');