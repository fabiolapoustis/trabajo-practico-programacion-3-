import { Venta } from "./venta.js";
import { Producto } from "./producto.js";
import { Usuario } from "./usuario.js";
import { Venta_detalle } from "./venta_detalle.js";


Venta.belongsToMany(Producto, { through: 'Venta_detalle', foreignKey: 'ventaId' });
Producto.belongsToMany(Venta, { through: 'Venta_detalle', foreignKey: 'productoId' });

export {Usuario,Venta,Producto,Venta_detalle};