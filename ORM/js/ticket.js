// ticket.js - Lógica del ticket de compra

let ventaInfo = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎫 Ticket.js cargado');

    // Cargar información de la venta
    cargarVentaInfo();

    // Verificar si hay venta
    if (!ventaInfo) {
        mostrarError();
        return;
    }

    // Mostrar ticket
    mostrarTicket();

    // Setup botones
    setupBotones();
});

/**
 * Cargar información de la venta desde localStorage
 */
function cargarVentaInfo() {
    ventaInfo = Storage.get('ultimaVenta');
    console.log('📋 Información de venta:', ventaInfo);

    if (!ventaInfo) {
        console.warn('⚠️ No se encontró información de la venta');
    }
}

/**
 * Mostrar error si no hay venta
 */
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

/**
 * Mostrar ticket con la información de la venta
 */
function mostrarTicket() {
    // Información del cliente
    const ticketCustomer = document.getElementById('ticketCustomer');
    if (ticketCustomer) {
        ticketCustomer.textContent = ventaInfo.nombre;
    }

    // Fecha
    const ticketDate = document.getElementById('ticketDate');
    if (ticketDate) {
        ticketDate.textContent = Utils.formatDate(ventaInfo.fecha);
    }

    // Número de ticket
    const ticketNumber = document.getElementById('ticketNumber');
    if (ticketNumber) {
        ticketNumber.textContent = `#${ventaInfo.id || generateTicketNumber()}`;
    }

    // Lista de productos
    renderizarProductosTicket();

    // Totales
    mostrarTotales();
}

/**
 * Generar número de ticket si no existe
 */
function generateTicketNumber() {
    return Date.now().toString().slice(-8);
}

/**
 * Renderizar productos en el ticket
 */
function renderizarProductosTicket() {
    const ticketItemsList = document.getElementById('ticketItemsList');
    
    if (!ticketItemsList) return;

    ticketItemsList.innerHTML = '';

    ventaInfo.productos.forEach(producto => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'ticket-item';

        const subtotal = producto.precio * producto.quantity;

        itemDiv.innerHTML = `
            <div style="flex: 1;">
                <strong>${producto.nombre}</strong>
                <br>
                <small style="color: #6c757d;">
                    ${producto.quantity} x ${Utils.formatPrice(producto.precio)}
                </small>
            </div>
            <div style="font-weight: bold;">
                ${Utils.formatPrice(subtotal)}
            </div>
        `;

        ticketItemsList.appendChild(itemDiv);
    });
}

/**
 * Mostrar totales
 */
function mostrarTotales() {
    const total = ventaInfo.total;

    const ticketSubtotal = document.getElementById('ticketSubtotal');
    const ticketTotal = document.getElementById('ticketTotal');

    if (ticketSubtotal) {
        ticketSubtotal.textContent = Utils.formatPrice(total);
    }

    if (ticketTotal) {
        ticketTotal.textContent = Utils.formatPrice(total);
    }
}

/**
 * Setup de botones
 */
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

/**
 * Descargar ticket como PDF
 */
async function descargarPDF() {
    console.log('📄 Descargando PDF...');

    try {
        // Verificar que html2pdf esté disponible
        if (typeof html2pdf === 'undefined') {
            throw new Error('Librería html2pdf no está disponible');
        }

        const ticketElement = document.getElementById('ticketContent');
        
        if (!ticketElement) {
            throw new Error('Elemento del ticket no encontrado');
        }

        // Configuración del PDF
        const options = {
            margin: 10,
            filename: `ticket_${ventaInfo.id || generateTicketNumber()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Generar PDF
        await html2pdf().set(options).from(ticketElement).save();

        console.log('✅ PDF descargado exitosamente');
        mostrarMensaje('✅ PDF descargado exitosamente', 'success');

    } catch (error) {
        console.error('❌ Error al descargar PDF:', error);
        alert(`❌ Error al descargar PDF: ${error.message}\n\nIntenta nuevamente o toma una captura de pantalla.`);
    }
}

/**
 * Iniciar nueva compra
 */
function nuevaCompra() {
    if (confirm('¿Deseas realizar una nueva compra?')) {
        // Limpiar datos de la venta anterior
        Storage.remove('ultimaVenta');
        
        // Limpiar nombre de usuario (para que ingrese nuevo nombre)
        User.clear();

        // Redirigir a inicio
        window.location.href = 'index.html';
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

    /* Estilos para impresión del ticket */
    @media print {
        body * {
            visibility: hidden;
        }
        #ticketContent, #ticketContent * {
            visibility: visible;
        }
        #ticketContent {
            position: absolute;
            left: 0;
            top: 0;
        }
        .ticket-actions {
            display: none !important;
        }
    }
`;
document.head.appendChild(style);

// Permitir imprimir con Ctrl+P
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
    }
});

console.log('✅ Ticket.js inicializado correctamente');