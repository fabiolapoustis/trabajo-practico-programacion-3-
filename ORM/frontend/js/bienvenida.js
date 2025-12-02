// bienvenida.js - Lógica de la pantalla de bienvenida

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Bienvenida.js cargado');

    // Verificar si ya hay un usuario guardado
    checkExistingUser();

    // Manejar el formulario de bienvenida
    const welcomeForm = document.getElementById('welcomeForm');
    if (welcomeForm) {
        welcomeForm.addEventListener('submit', handleWelcomeSubmit);
    }

    // Validación en tiempo real
    const customerNameInput = document.getElementById('customerName');
    if (customerNameInput) {
        customerNameInput.addEventListener('input', validateNameInput);
    }
});

/**
 * Verificar si ya existe un usuario guardado
 * Si existe, redirigir directamente a productos
 */
function checkExistingUser() {
    const existingUser = User.getName();
    
    if (existingUser) {
        console.log('✅ Usuario existente encontrado:', existingUser);
        // Preguntar si desea continuar con el mismo usuario
        const continuar = confirm(`¿Deseas continuar como ${existingUser}?`);
        
        if (continuar) {
            window.location.href = 'productos.html';
        } else {
            // Limpiar usuario anterior
            User.clear();
        }
    }
}

/**
 * Validar input del nombre en tiempo real
 */
function validateNameInput(event) {
    const input = event.target;
    const value = input.value.trim();
    const errorElement = document.getElementById('nameError');

    // Limpiar errores previos
    input.classList.remove('input-error');
    if (errorElement) {
        errorElement.textContent = '';
    }

    // Validaciones
    if (value.length > 0 && value.length < 2) {
        showInputError(input, errorElement, 'El nombre debe tener al menos 2 caracteres');
        return false;
    }

    if (value.length > 50) {
        showInputError(input, errorElement, 'El nombre es demasiado largo');
        return false;
    }

    // Validar que solo contenga letras y espacios
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (value.length > 0 && !nameRegex.test(value)) {
        showInputError(input, errorElement, 'El nombre solo puede contener letras');
        return false;
    }

    return true;
}

/**
 * Mostrar error en el input
 */
function showInputError(input, errorElement, message) {
    input.classList.add('input-error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Manejar el submit del formulario de bienvenida
 */
function handleWelcomeSubmit(event) {
    event.preventDefault();
    
    const customerNameInput = document.getElementById('customerName');
    const customerName = customerNameInput.value.trim();

    console.log('📝 Formulario enviado con nombre:', customerName);

    // Validar nombre
    if (!customerName) {
        alert('⚠️ Por favor, ingresa tu nombre para continuar');
        customerNameInput.focus();
        return;
    }

    if (customerName.length < 2) {
        alert('⚠️ El nombre debe tener al menos 2 caracteres');
        customerNameInput.focus();
        return;
    }

    if (customerName.length > 50) {
        alert('⚠️ El nombre es demasiado largo (máximo 50 caracteres)');
        customerNameInput.focus();
        return;
    }

    // Validar que solo contenga letras y espacios
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(customerName)) {
        alert('⚠️ El nombre solo puede contener letras');
        customerNameInput.focus();
        return;
    }

    // Guardar nombre en localStorage
    const saved = User.setName(customerName);
    
    if (saved) {
        console.log('✅ Nombre guardado exitosamente:', customerName);
        
        // Mostrar mensaje de bienvenida
        showWelcomeMessage(customerName);
        
        // Redirigir a productos después de 1 segundo
        setTimeout(() => {
            window.location.href = 'productos.html';
        }, 1000);
    } else {
        alert('❌ Error al guardar tu nombre. Por favor intenta nuevamente.');
    }
}

/**
 * Mostrar mensaje de bienvenida temporal
 */
function showWelcomeMessage(name) {
    const welcomeCard = document.querySelector('.welcome-card');
    
    if (welcomeCard) {
        // Crear mensaje de bienvenida
        const messageDiv = document.createElement('div');
        messageDiv.className = 'welcome-success';
        messageDiv.innerHTML = `
            <div style="
                background: #d4edda;
                color: #155724;
                padding: 15px;
                border-radius: 5px;
                margin-top: 20px;
                font-weight: bold;
                animation: fadeIn 0.5s;
            ">
                ✅ ¡Bienvenido ${name}! Redirigiendo...
            </div>
        `;
        
        welcomeCard.appendChild(messageDiv);
    }
}

/**
 * Agregar estilos CSS adicionales
 */
const style = document.createElement('style');
style.textContent = `
    .input-error {
        border-color: #dc3545 !important;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

console.log('✅ Bienvenida.js inicializado correctamente');