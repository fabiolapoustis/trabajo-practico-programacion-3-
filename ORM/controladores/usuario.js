import { Usuario } from "../modelos/usuario.js";


export const getUsuario = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({attributes: { exclude: ['pass'] } // No enviar contraseñas
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearUsuario = async (req, res) => {
    try {
        const { nombre, pass, email } = req.body;
        if (!nombre || !pass || !email) {
            return res.status(400).json({ error: "Faltan datos obligatorios"});
        }
        const usuario = await Usuario.create({ nombre, email, pass });

        const { pass: _, ...usuarioSinPass } = usuario.toJSON();
        res.status(201).json(usuarioSinPass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const loginUsuario = async (req, res) => {
    try {
        const { email, pass } = req.body;
        if (!email || !pass) {
            return res.status(400).json({ 
                error: "Email y contraseña requeridos" 
            });
        }
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ 
                error: "Email y contraseña requeridos" 
            });
        }
        const passwordValido = await usuario.compararPassword(pass);

        if (!passwordValido) {
            return res.status(401).json({ 
                error: "Email y contraseña requeridos" 
            });
        }

        const { pass: _, ...usuarioSinPass } = usuario.toJSON();
        
        res.json({ 
            mensaje: "Bienvenido",
            usuario: usuarioSinPass 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};