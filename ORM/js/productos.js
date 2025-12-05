let todosLosProductos = [];
let productosFiltrados = [];
let paginaActual = 1;
const productosPorPagina = 6;

const API_ENDPOINTS = {
    productosActivos: 'http://localhost:3000/api/productos'
};
const API_URL = 'http://localhost:3000/uploads/'; // carpeta de imágenes

document.addEventListener('DOMContentLoaded', () => {
    console.log('🛍️ Productos.js cargado');
    cargarProductos();
    setupFiltros();
    setupPaginacion();
});

// Cargar productos
async function cargarProductos() {
    const loading = document.getElementById('loadingProducts');
    const errorBox = document.getElementById('errorProducts');
    const grid = document.getElementById('productsGrid');

    try {
        loading.style.display = 'block';
        errorBox.style.display = 'none';
        grid.style.display = 'none';

        const response = await fetch(API_ENDPOINTS.productosActivos);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        todosLosProductos = data.productos || [];
        productosFiltrados = [...todosLosProductos];

        loading.style.display = 'none';
        if (todosLosProductos.length === 0) mostrarMensajeVacio();
        else renderizarProductos();

    } catch (err) {
        console.error(err);
        loading.style.display = 'none';
        errorBox.style.display = 'block';
        errorBox.innerHTML = `
            <p>❌ Error al cargar productos: ${err.message}</p>
            <button onclick="cargarProductos()">Reintentar</button>
        `;
    }
}

function mostrarMensajeVacio() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:60px 20px;">
            <div style="font-size:5rem;margin-bottom:20px;">📦</div>
            <h3>No hay productos disponibles</h3>
        </div>
    `;
    grid.style.display = 'grid';
}

// Filtros
function setupFiltros() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const categoria = btn.dataset.category;
        filtrarProductos(categoria);
    }));
}

function filtrarProductos(categoria) {
    productosFiltrados = categoria === 'all' 
        ? [...todosLosProductos] 
        : todosLosProductos.filter(p => p.categoria === categoria);
    paginaActual = 1;
    renderizarProductos();
}

// Renderizado con paginación
function renderizarProductos() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const pagina = productosFiltrados.slice(inicio, fin);

    pagina.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const icono = p.categoria === 'Gato' ? '🐱' : '🐶';
        const imgUrl = p.imagen ? API_URL + p.imagen : 'https://via.placeholder.com/200?text=Sin+Imagen';
        card.innerHTML = `
            <img src="${imgUrl}" alt="${p.nombre}" class="product-image">
            <span class="product-category">${icono} ${p.categoria}</span>
            <h3 class="product-name">${p.nombre}</h3>
            <p class="product-description">${p.descripcion || 'Sin descripción'}</p>
            <div class="product-price">$${p.precio.toFixed(2)}</div>
        `;
        grid.appendChild(card);
    });

    grid.style.display = 'grid';
    actualizarPaginacion();
}

// Paginación
function setupPaginacion() {
    const prev = document.getElementById('prevPage');
    const next = document.getElementById('nextPage');

    if (prev) prev.addEventListener('click', () => { if(paginaActual>1){paginaActual--;renderizarProductos();} });
    if (next) next.addEventListener('click', () => { 
        const total = Math.ceil(productosFiltrados.length/productosPorPagina); 
        if(paginaActual<total){paginaActual++;renderizarProductos();} 
    });
}

function actualizarPaginacion() {
    const total = Math.ceil(productosFiltrados.length/productosPorPagina);
    const pagination = document.getElementById('pagination');
    const info = document.getElementById('pageInfo');
    const prev = document.getElementById('prevPage');
    const next = document.getElementById('nextPage');

    if(total<=1) { if(pagination) pagination.style.display='none'; return; }
    if(pagination) pagination.style.display='flex';
    if(info) info.textContent = `Página ${paginaActual} de ${total}`;
    if(prev) prev.disabled = paginaActual===1;
    if(next) next.disabled = paginaActual===total;
}
