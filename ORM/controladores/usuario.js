import { Usuario } from "../modelos/index.js";

export const getUsuario = async (req, res) => {
    try{
        const usuarios = await Usuario.findAll();

        res.send(usuarios);
    }catch(error){
        res.send(error);
    }
};