document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ bienvenidos.js cargado correctamente');
    
    const form = document.getElementById('welcomeForm');
    const customerInput = document.getElementById('customerName');
    const nameError = document.getElementById('nameError');
    
    // Cargar nombre si existe
    const nombreGuardado = localStorage.getItem('nombreCliente');
    if (nombreGuardado) {
        customerInput.value = nombreGuardado;
    }
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            guardarNombreYContinuar();
        });
    }
});

function guardarNombreYContinuar() {
    const customerInput = document.getElementById('customerName');
    const nombre = customerInput.value.trim();
    
    localStorage.setItem('nombreCliente', nombre);
    console.log('✅ Nombre guardado:', nombre);
    
    window.location.href = '/productos.html';
}