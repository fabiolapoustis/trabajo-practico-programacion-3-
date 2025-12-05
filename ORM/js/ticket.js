let ventaInfo = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎫 Ticket.js cargado');

    // Cargar información de la venta
    cargarVentaInfo();

    if (!ventaInfo) {
        mostrarError();
        return;
    }

    mostrarTicket();
    setupBotones();
});

function cargarVentaInfo() {
    ventaInfo = JSON.parse(localStorage.getItem('ultimaVenta'));
    console.log('📋 Información de venta:', ventaInfo);
}

function mostrarError() {
    const ticketScreen = document.querySelector('.ticket-screen');
    if (ticketScreen) {
        ticketScreen.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 5rem; margin-bottom: 20px;">❌</div>
                <h2>No se encontró información de la compra</h2>
                <p style="color: #6c757d; margin-bottom: 30px;">
                    Por favor realiza una compra primero
                </p>
                <a href="productos.html" class="btn btn-primary">
                    Ir a Productos
                </a>
            </div>
        `;
    }
}

function mostrarTicket() {
    const ticketCustomer = document.getElementById('ticketCustomer');
    if (ticketCustomer) ticketCustomer.textContent = ventaInfo.nombre;

    const ticketDate = document.getElementById('ticketDate');
    if (ticketDate) ticketDate.textContent = ventaInfo.fecha;

    const ticketNumber = document.getElementById('ticketNumber');
    if (ticketNumber) ticketNumber.textContent = `#${ventaInfo.id}`;

    renderizarProductosTicket();
    mostrarTotales();
}

function renderizarProductosTicket() {
    const ticketItemsList = document.getElementById('ticketItemsList');
    if (!ticketItemsList) return;

    ticketItemsList.innerHTML = '';

    ventaInfo.productos.forEach(producto => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'ticket-item';
        itemDiv.style.cssText = 'display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;';

        const subtotal = producto.precio * producto.cantidad;

        itemDiv.innerHTML = `
            <div style="flex: 1;">
                <strong>${producto.nombre}</strong>
                <br>
                <small style="color: #6c757d;">
                    ${producto.cantidad} x $${parseFloat(producto.precio).toFixed(2)}
                </small>
            </div>
            <div style="font-weight: bold;">
                $${parseFloat(subtotal).toFixed(2)}
            </div>
        `;

        ticketItemsList.appendChild(itemDiv);
    });
}

function mostrarTotales() {
    const ticketSubtotal = document.getElementById('ticketSubtotal');
    const ticketTotal = document.getElementById('ticketTotal');

    if (ticketSubtotal) {
        ticketSubtotal.textContent = `$${parseFloat(ventaInfo.total).toFixed(2)}`;
    }

    if (ticketTotal) {
        ticketTotal.textContent = `$${parseFloat(ventaInfo.total).toFixed(2)}`;
    }
}

function setupBotones() {
    const downloadBtn = document.getElementById('downloadPDF');
    const newPurchaseBtn = document.getElementById('newPurchase');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', descargarPDF);
    }

    if (newPurchaseBtn) {
        newPurchaseBtn.addEventListener('click', nuevaCompra);
    }
}

async function descargarPDF() {
    console.log('📄 Descargando PDF...');
    alert('📄 Usa Ctrl+P o el botón de imprimir para descargar como PDF');
    window.print();
}

function nuevaCompra() {
    if (confirm('¿Deseas realizar una nueva compra?')) {
        localStorage.removeItem('ultimaVenta');
        window.location.href = 'index.html';
    }
}

console.log('✅ Ticket.js inicializado');