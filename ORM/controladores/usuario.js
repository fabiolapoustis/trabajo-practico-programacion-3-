import { Usuario } from "../modelos/usuario.js";

export const getUsuario = async (req, res) => {
    try{
        const usuarios = await Usuario.findAll();

        res.send(usuarios);
    }catch(error){
        res.send(error);
    }
};

export const crearUsuario = async (req, res) => {
    try{
        const {nombre, pass, email} = req.body;

        const usuario = await Usuario.create({nombre,email,pass});

        res.send(usuario);

    } catch (error){
        res.send(error)
    }
}