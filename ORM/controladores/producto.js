import { Producto } from "../modelos/index.js";

export const getProducto = async (req, res) => {
    try{
        const productos = await Producto.findAll();

        res.send(productos);
    }catch(error){
        res.send(error);
    }
};