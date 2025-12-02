// Configuración global de la aplicación
const API_URL = 'http://localhost:3000';

// Endpoints de la API
const API_ENDPOINTS = {
    productos: `${API_URL}/producto`,
    productosActivos: `${API_URL}/producto/activos`,
    productoById: (id) => `${API_URL}/producto/${id}`,
    ventas: `${API_URL}/venta`,
    usuarios: `${API_URL}/usuario`,
    login: `${API_URL}/usuario/login`
};

// Funciones de utilidad para localStorage
const Storage = {
    // Guardar datos
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
            return false;
        }
    },

    // Obtener datos
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error al leer de localStorage:', error);
            return null;
        }
    },

    // Eliminar datos
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error al eliminar de localStorage:', error);
            return false;
        }
    },

    // Limpiar todo
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error al limpiar localStorage:', error);
            return false;
        }
    }
};

// Gestión del carrito
const Cart = {
    // Obtener carrito
    get: () => {
        return Storage.get('cart') || [];
    },

    // Guardar carrito
    save: (cart) => {
        return Storage.set('cart', cart);
    },

    // Agregar producto
    addProduct: (product, quantity = 1) => {
        const cart = Cart.get();
        const existingIndex = cart.findIndex(item => item.id === product.id);

        if (existingIndex >= 0) {
            // Si ya existe, aumentar cantidad
            cart[existingIndex].quantity += quantity;
        } else {
            // Si no existe, agregar nuevo
            cart.push({
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                descripcion: product.descripcion,
                imagen: product.imagen,
                categoria: product.categoria,
                quantity: quantity
            });
        }

        Cart.save(cart);
        Cart.updateBadge();
        return cart;
    },

    // Actualizar cantidad de un producto
    updateQuantity: (productId, quantity) => {
        const cart = Cart.get();
        const index = cart.findIndex(item => item.id === productId);

        if (index >= 0) {
            if (quantity <= 0) {
                // Si la cantidad es 0 o menos, eliminar
                cart.splice(index, 1);
            } else {
                cart[index].quantity = quantity;
            }
            Cart.save(cart);
            Cart.updateBadge();
        }

        return cart;
    },

    // Eliminar producto
    removeProduct: (productId) => {
        const cart = Cart.get();
        const filtered = cart.filter(item => item.id !== productId);
        Cart.save(filtered);
        Cart.updateBadge();
        return filtered;
    },

    // Limpiar carrito
    clear: () => {
        Storage.remove('cart');
        Cart.updateBadge();
    },

    // Obtener total
    getTotal: () => {
        const cart = Cart.get();
        return cart.reduce((total, item) => {
            return total + (item.precio * item.quantity);
        }, 0);
    },

    // Obtener cantidad total de items
    getTotalItems: () => {
        const cart = Cart.get();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Actualizar badge del carrito
    updateBadge: () => {
        const totalItems = Cart.getTotalItems();
        const badges = document.querySelectorAll('#cartBadge, #cartCount');
        
        badges.forEach(badge => {
            if (badge) {
                badge.textContent = totalItems;
            }
        });
    }
};

// Gestión del tema (claro/oscuro)
const Theme = {
    // Obtener tema actual
    get: () => {
        return Storage.get('theme') || 'light';
    },

    // Aplicar tema
    apply: (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        Storage.set('theme', theme);
    },

    // Toggle tema
    toggle: () => {
        const currentTheme = Theme.get();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        Theme.apply(newTheme);
        Theme.updateButton();
        return newTheme;
    },

    // Actualizar botón de tema
    updateButton: () => {
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.getElementById('themeText');
        const currentTheme = Theme.get();

        if (themeIcon && themeText) {
            if (currentTheme === 'dark') {
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Modo Claro';
            } else {
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Modo Oscuro';
            }
        }
    },

    // Inicializar tema
    init: () => {
        const savedTheme = Theme.get();
        Theme.apply(savedTheme);
        Theme.updateButton();

        // Listener para el botón de tema
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                Theme.toggle();
            });
        }
    }
};

// Gestión del usuario
const User = {
    // Guardar nombre
    setName: (name) => {
        return Storage.set('customerName', name);
    },

    // Obtener nombre
    getName: () => {
        return Storage.get('customerName');
    },

    // Verificar si hay usuario
    exists: () => {
        return !!User.getName();
    },

    // Limpiar usuario
    clear: () => {
        return Storage.remove('customerName');
    }
};

// Utilidades generales
const Utils = {
    // Formatear precio
    formatPrice: (price) => {
        return `$${parseFloat(price).toFixed(2)}`;
    },

    // Formatear fecha
    formatDate: (date = new Date()) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    },

    // Mostrar/ocultar elemento
    toggleElement: (element, show) => {
        if (element) {
            element.style.display = show ? 'block' : 'none';
        }
    },

    // Mostrar mensaje de error
    showError: (message, containerId = 'errorProducts') => {
        const errorContainer = document.getElementById(containerId);
        if (errorContainer) {
            errorContainer.innerHTML = `
                <p>❌ ${message}</p>
                <button onclick="location.reload()" class="btn btn-secondary">Reintentar</button>
            `;
            errorContainer.style.display = 'block';
        }
    },

    // Generar ID único
    generateId: () => {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    },

    // Scroll al inicio
    scrollToTop: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Inicializar tema al cargar cualquier página
document.addEventListener('DOMContentLoaded', () => {
    Theme.init();
    Cart.updateBadge();
});

console.log('✅ Config.js cargado correctamente');