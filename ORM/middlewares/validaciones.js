export const validarProducto = (req, res, next) => {
    const { nombre, precio, categoria } = req.body;

    if (!nombre || nombre.trim() === "") {
        return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    if (!precio || precio <= 0) {
        return res.status(400).json({ error: "El precio debe ser mayor a 0" });
    }

    if (!categoria || categoria.trim() === "") {
        return res.status(400).json({ error: "La categoría es obligatoria" });
    }

    next();
};

export const validarUsuario = (req, res, next) => {
    const { nombre, email, pass } = req.body;

    if (!nombre || !email || !pass) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email inválido" });
    }

    if (pass.length < 6) {
        return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    next();
};