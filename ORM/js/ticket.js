let ventaInfo = null;

document.addEventListener('DOMContentLoaded', () => {

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
    console.log('Información de venta:', ventaInfo);
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
    try {
        console.log('📄 Generando PDF...');

        const downloadBtn = document.getElementById('downloadPDF');
        const textoOriginal = downloadBtn.textContent;
        downloadBtn.textContent = '⏳ Generando...';
        downloadBtn.disabled = true;

        if (typeof window.jspdf === 'undefined') {
            await cargarJsPDF();
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(102, 126, 234);
        doc.text('P&G PETSHOP', 105, 25, { align: 'center' });

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        doc.text('TICKET DE COMPRA', 105, 35, { align: 'center' });

        doc.setDrawColor(102, 126, 234);
        doc.setLineWidth(1);
        doc.line(20, 40, 190, 40);

        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Cliente:', 20, 55);
        doc.setFont(undefined, 'normal');
        doc.text(ventaInfo.nombre, 45, 55);

        doc.setFont(undefined, 'bold');
        doc.text('Fecha:', 20, 63);
        doc.setFont(undefined, 'normal');
        doc.text(ventaInfo.fecha, 45, 63);

        doc.setFont(undefined, 'bold');
        doc.text('Ticket:', 20, 71);
        doc.setFont(undefined, 'normal');
        doc.text(`#${ventaInfo.id}`, 45, 71);

        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(20, 77, 190, 77);

        let y = 90;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('PRODUCTOS', 20, y);
        y += 10;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        ventaInfo.productos.forEach(producto => {
            const nombreProducto = producto.nombre.length > 45 
                ? producto.nombre.substring(0, 42) + '...' 
                : producto.nombre;
            
            const subtotal = (producto.precio * producto.cantidad).toFixed(2);

            doc.setFont(undefined, 'bold');
            doc.text(nombreProducto, 20, y);
            y += 5;

            doc.setFont(undefined, 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(`${producto.cantidad} x $${parseFloat(producto.precio).toFixed(2)}`, 25, y);
            
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'bold');
            doc.text(`$${subtotal}`, 190, y - 5, { align: 'right' });
            
            y += 8;
            
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });

        y += 5;
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);
        y += 12;

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Subtotal:', 120, y);
        doc.text(`$${ventaInfo.total.toFixed(2)}`, 190, y, { align: 'right' });
        y += 10;

        doc.setFontSize(16);
        doc.setTextColor(102, 126, 234);
        doc.text('TOTAL:', 120, y);
        doc.text(`$${ventaInfo.total.toFixed(2)}`, 190, y, { align: 'right' });

        y += 25;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont(undefined, 'italic');
        doc.text('¡Gracias por tu compra!', 105, y, { align: 'center' });
        doc.text('P&G PetShop - www.pgpetshop.com', 105, y + 7, { align: 'center' });

        const fileName = `ticket-${ventaInfo.id}-${Date.now()}.pdf`;
        doc.save(fileName);

        console.log('✅ PDF descargado:', fileName);

        downloadBtn.textContent = textoOriginal;
        downloadBtn.disabled = false;

        setTimeout(() => {
            alert('✅ Ticket descargado exitosamente');
        }, 100);

    } catch (error) {
        console.error('Error al generar PDF:', error);

        const downloadBtn = document.getElementById('downloadPDF');
        if (downloadBtn) {
            downloadBtn.textContent = 'Descargar PDF';
            downloadBtn.disabled = false;
        }

        if (confirm('No se pudo generar el PDF automáticamente.\n\n¿Deseas abrir el diálogo de impresión?\n(Puedes elegir "Guardar como PDF")')) {
            window.print();
        }
    }
}

function cargarJsPDF() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
            resolve();
        };
        script.onerror = () => {
            console.error('Error al cargar jsPDF');
            reject(new Error('No se pudo cargar jsPDF'));
        };
        document.head.appendChild(script);
    });
}

function nuevaCompra() {
    if (confirm('¿Deseas realizar una nueva compra?')) {
        localStorage.removeItem('ultimaVenta');
        window.location.href = 'index.html';
    }
}