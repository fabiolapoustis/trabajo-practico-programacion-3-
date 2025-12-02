// productos.js - Lógica del catálogo de productos

let todosLosProductos = [];
let productosFiltrados = [];
let paginaActual = 1;
const productosPorPagina = 6;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🛍️ Productos.js cargado');

    // Verificar que el usuario haya ingresado su nombre
    if (!verificarUsuario()) {
        return;
    }

    // Mostrar nombre del cliente
    mostrarNombreCliente();

    // Cargar productos
    cargarProductos();

    // Setup de filtros
    setupFiltros();

    // Setup de paginación
    setupPaginacion();
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
 * Mostrar nombre del cliente en el header
 */
function mostrarNombreCliente() {
    const customerName = User.getName();
    const displayElements = document.querySelectorAll('#customerNameDisplay, #customerGreeting');
    
    displayElements.forEach(element => {
        if (element) {
            element.textContent = customerName;
        }
    });
}

/**
 * Cargar productos desde la API
 */
async function cargarProductos() {
    const loadingElement = document.getElementById('loadingProducts');
    const errorElement = document.getElementById('errorProducts');
    const gridElement = document.getElementById('productsGrid');

    try {
        // Mostrar loading
        Utils.toggleElement(loadingElement, true);
        Utils.toggleElement(errorElement, false);
        Utils.toggleElement(gridElement, false);

        console.log('📡 Cargando productos desde:', API_ENDPOINTS.productosActivos);

        // Llamar a la API - traer todos los productos activos
        const response = await fetch(`${API_ENDPOINTS.productosActivos}?limit=100`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Productos recibidos:', data);

        // Guardar productos
        todosLosProductos = data.productos || [];
        productosFiltrados = [...todosLosProductos];

        // Ocultar loading
        Utils.toggleElement(loadingElement, false);

        if (todosLosProductos.length === 0) {
            mostrarMensajeVacio();
        } else {
            renderizarProductos();
        }

    } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        Utils.toggleElement(loadingElement, false);
        Utils.toggleElement(errorElement, true);
        errorElement.innerHTML = `
            <p>❌ Error al cargar productos: ${error.message}</p>
            <button onclick="cargarProductos()" class="btn btn-secondary">Reintentar</button>
        `;
    }
}

/**
 * Mostrar mensaje cuando no hay productos
 */
function mostrarMensajeVacio() {
    const gridElement = document.getElementById('productsGrid');
    if (gridElement) {
        gridElement.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <div style="font-size: 5rem; margin-bottom: 20px;">📦</div>
                <h3>No hay productos disponibles</h3>
                <p style="color: #6c757d;">Vuelve más tarde para ver nuestros productos</p>
            </div>
        `;
        Utils.toggleElement(gridElement, true);
    }
}

/**
 * Setup de filtros por categoría
 */
function setupFiltros() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al clickeado
            button.classList.add('active');
            
            // Obtener categoría
            const categoria = button.dataset.category;
            
            // Filtrar productos
            filtrarProductos(categoria);
        });
    });
}

/**
 * Filtrar productos por categoría
 */
function filtrarProductos(categoria) {
    console.log('🔍 Filtrando por categoría:', categoria);
    
    if (categoria === 'all') {
        productosFiltrados = [...todosLosProductos];
    } else {
        productosFiltrados = todosLosProductos.filter(p => p.categoria === categoria);
    }
    
    // Resetear a página 1
    paginaActual = 1;
    
    // Renderizar
    renderizarProductos();
}

/**
 * Renderizar productos con paginación
 */
function renderizarProductos() {
    const gridElement = document.getElementById('productsGrid');
    
    if (!gridElement) return;

    // Calcular índices
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = productosFiltrados.slice(inicio, fin);

    // Limpiar grid
    gridElement.innerHTML = '';

    // Renderizar productos
    productosPagina.forEach(producto => {
        const card = crearTarjetaProducto(producto);
        gridElement.appendChild(card);
    });

    // Mostrar grid
    Utils.toggleElement(gridElement, true);

    // Actualizar paginación
    actualizarPaginacion();

    // Scroll to top
    Utils.scrollToTop();
}

/**
 * Crear tarjeta de producto
 */
function crearTarjetaProducto(producto) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = producto.id;

    // Icono según categoría
    const iconoCategoria = producto.categoria === 'Gato' ? '🐱' : '🐶';
    
    // URL de imagen
    const imagenUrl = producto.imagen 
        ? `${API_URL}${producto.imagen}` 
        : 'https://via.placeholder.com/200?text=Sin+Imagen';

    card.innerHTML = `
        <img src="${imagenUrl}" 
             alt="${producto.nombre}" 
             class="product-image"
             onerror="this.src='https://via.placeholder.com/200?text=Sin+Imagen'">
        
        <span class="product-category">${iconoCategoria} ${producto.categoria}</span>
        
        <h3 class="product-name">${producto.nombre}</h3>
        
        <p class="product-description">${producto.descripcion || 'Sin descripción'}</p>
        
        <div class="product-price">${Utils.formatPrice(producto.precio)}</div>
        
        <div class="product-actions">
            <div class="quantity-control">
                <button class="quantity-btn" onclick="cambiarCantidad(${producto.id}, -1)">-</button>
                <span class="quantity-display" id="qty-${producto.id}">1</span>
                <button class="quantity-btn" onclick="cambiarCantidad(${producto.id}, 1)">+</button>
            </div>
            <button class="add-to-cart" onclick="agregarAlCarrito(${producto.id})">
                🛒 Agregar
            </button>
        </div>
    `;

    return card;
}

/**
 * Cambiar cantidad de un producto
 */
function cambiarCantidad(productId, cambio) {
    const qtyElement = document.getElementById(`qty-${productId}`);
    
    if (!qtyElement) return;

    let cantidad = parseInt(qtyElement.textContent);
    cantidad = Math.max(1, cantidad + cambio); // Mínimo 1
    cantidad = Math.min(99, cantidad); // Máximo 99

    qtyElement.textContent = cantidad;
}

/**
 * Agregar producto al carrito
 */
function agregarAlCarrito(productId) {
    const producto = todosLosProductos.find(p => p.id === productId);
    
    if (!producto) {
        alert('❌ Producto no encontrado');
        return;
    }

    const qtyElement = document.getElementById(`qty-${productId}`);
    const cantidad = qtyElement ? parseInt(qtyElement.textContent) : 1;

    console.log(`➕ Agregando ${cantidad}x ${producto.nombre} al carrito`);

    // Agregar al carrito
    Cart.addProduct(producto, cantidad);

    // Mostrar feedback visual
    mostrarFeedbackAgregado(producto.nombre, cantidad);

    // Resetear cantidad a 1
    if (qtyElement) {
        qtyElement.textContent = '1';
    }
}

/**
 * Mostrar feedback cuando se agrega al carrito
 */
function mostrarFeedbackAgregado(nombreProducto, cantidad) {
    // Crear elemento de feedback
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    feedback.innerHTML = `✅ ${cantidad}x ${nombreProducto} agregado al carrito`;

    document.body.appendChild(feedback);

    // Remover después de 3 segundos
    setTimeout(() => {
        feedback.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
}

/**
 * Setup de paginación
 */
function setupPaginacion() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (paginaActual > 1) {
                paginaActual--;
                renderizarProductos();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
            if (paginaActual < totalPaginas) {
                paginaActual++;
                renderizarProductos();
            }
        });
    }
}

/**
 * Actualizar controles de paginación
 */
function actualizarPaginacion() {
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    const paginationElement = document.getElementById('pagination');
    const pageInfoElement = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    // Mostrar/ocultar paginación
    if (totalPaginas <= 1) {
        Utils.toggleElement(paginationElement, false);
        return;
    } else {
        Utils.toggleElement(paginationElement, true);
    }

    // Actualizar info de página
    if (pageInfoElement) {
        pageInfoElement.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    }

    // Habilitar/deshabilitar botones
    if (prevBtn) {
        prevBtn.disabled = paginaActual === 1;
    }

    if (nextBtn) {
        nextBtn.disabled = paginaActual === totalPaginas;
    }
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('✅ Productos.js inicializado correctamente');