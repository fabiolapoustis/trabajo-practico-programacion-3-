import { Usuario } from "../modelos/usuario.js";

// =========== MOSTRAR USUARIO ============
export const getUsuario = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({attributes: { exclude: ['pass'] } // No enviar contraseñas
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// =========== CREAR USUARIO ============
export const crearUsuario = async (req, res) => {
    try {
        const { nombre, pass, email } = req.body;

        // Validar que vengan los datos
        if (!nombre || !pass || !email) {
            return res.status(400).json({ error: "Faltan datos obligatorios"});
        }
        const usuario = await Usuario.create({ nombre, email, pass });

        // No devolver la contraseña
        const { pass: _, ...usuarioSinPass } = usuario.toJSON();

        res.status(201).json(usuarioSinPass);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =========== LOGIN USUARIO ============
export const loginUsuario = async (req, res) => {
    try {
        const { email, pass } = req.body;

        if (!email || !pass) {
            return res.status(400).json({ 
                error: "Email y contraseña requeridos" 
            });
        }

        // Buscar usuario por email
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ 
                error: "Credenciales inválidas" 
            });
        }

        // Comparar contraseñas
        const passwordValido = await usuario.compararPassword(pass);

        if (!passwordValido) {
            return res.status(401).json({ 
                error: "Credenciales inválidas" 
            });
        }

        // Login exitoso
        const { pass: _, ...usuarioSinPass } = usuario.toJSON();
        
        res.json({ 
            mensaje: "Login exitoso",
            usuario: usuarioSinPass 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};