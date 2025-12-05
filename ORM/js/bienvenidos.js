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
    const nameError = document.getElementById('nameError');
    const nombre = customerInput.value.trim();
    
    // Validaciones
    if (nombre === '') {
        nameError.textContent = 'Por favor, ingresa tu nombre';
        nameError.style.display = 'block';
        customerInput.focus();
        return;
    }
    
    if (nombre.length < 2) {
        nameError.textContent = 'El nombre debe tener al menos 2 caracteres';
        nameError.style.display = 'block';
        customerInput.focus();
        return;
    }
    
    // ✅ Guardar nombre en localStorage
    localStorage.setItem('nombreCliente', nombre);
    console.log('✅ Nombre guardado:', nombre);
    
    nameError.style.display = 'none';
    
    // Redirigir a productos
    window.location.href = '/productos.html';
}