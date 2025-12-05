const API_URL = 'http://localhost:3000';

const API_ENDPOINTS = {
    productos: `${API_URL}/producto`,
    productosActivos: `${API_URL}/producto/activos`,
    productoById: (id) => `${API_URL}/producto/${id}`,
    ventas: `${API_URL}/venta`,
    usuarios: `${API_URL}/usuario`,
    login: `${API_URL}/usuario/login`
};

const Storage = {
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
            return false;
        }
    },

    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error al leer de localStorage:', error);
            return null;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error al eliminar de localStorage:', error);
            return false;
        }
    },

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

const Cart = {
    get: () => {
        return Storage.get('cart') || [];
    },

    save: (cart) => {
        return Storage.set('cart', cart);
    },

    addProduct: (product, quantity = 1) => {
        const cart = Cart.get();
        const existingIndex = cart.findIndex(item => item.id === product.id);

        if (existingIndex >= 0) {
            cart[existingIndex].quantity += quantity;
        } else {
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

    updateQuantity: (productId, quantity) => {
        const cart = Cart.get();
        const index = cart.findIndex(item => item.id === productId);

        if (index >= 0) {
            if (quantity <= 0) {
                cart.splice(index, 1);
            } else {
                cart[index].quantity = quantity;
            }
            Cart.save(cart);
            Cart.updateBadge();
        }

        return cart;
    },

    removeProduct: (productId) => {
        const cart = Cart.get();
        const filtered = cart.filter(item => item.id !== productId);
        Cart.save(filtered);
        Cart.updateBadge();
        return filtered;
    },

    clear: () => {
        Storage.remove('cart');
        Cart.updateBadge();
    },

    getTotal: () => {
        const cart = Cart.get();
        return cart.reduce((total, item) => {
            return total + (item.precio * item.quantity);
        }, 0);
    },

    getTotalItems: () => {
        const cart = Cart.get();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

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

const User = {
    setName: (name) => {
        return Storage.set('customerName', name);
    },

    getName: () => {
        return Storage.get('customerName');
    },

    exists: () => {
        return !!User.getName();
    },

    clear: () => {
        return Storage.remove('customerName');
    }
};


const Utils = {
    formatPrice: (price) => {
        return `$${parseFloat(price).toFixed(2)}`;
    },
    formatDate: (date = new Date()) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    },

    toggleElement: (element, show) => {
        if (element) {
            element.style.display = show ? 'block' : 'none';
        }
    },

    showError: (message, containerId = 'errorProducts') => {
        const errorContainer = document.getElementById(containerId);
        if (errorContainer) {
            errorContainer.innerHTML = `
                <p> ${message}</p>
                <button onclick="location.reload()" class="btn btn-secondary">Reintentar</button>
            `;
            errorContainer.style.display = 'block';
        }
    },

    generateId: () => {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    },

    scrollToTop: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Theme.init();
    Cart.updateBadge();
});

console.log('✅ Config.js cargado correctamente');