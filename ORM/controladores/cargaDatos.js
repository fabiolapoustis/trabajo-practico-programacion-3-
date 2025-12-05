import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Producto } from '../modelos/producto.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datosProductos = [
  {
    nombre: "Alimento Premium Perro Adulto",
    precio: 15000,
    descripcion: "Alimento balanceado premium para perros adultos de todas las razas. Rico en proteínas y vitaminas.",
    categoria: "Perro"
  },
  {
    nombre: "Alimento Premium Gato",
    precio: 12000,
    descripcion: "Alimento balanceado premium para gatos adultos con omega 3 y 6. Previene bolas de pelo.",
    categoria: "Gato"
  },
  {
    nombre: "Collar Antipulgas y Garrapatas",
    precio: 3500,
    descripcion: "Collar antipulgas de larga duración hasta 8 meses. Protección completa contra parásitos.",
    categoria: "Perro"
  },
  {
    nombre: "Juguete Interactivo para Gatos",
    precio: 2500,
    descripcion: "Juguete interactivo con plumas para estimular el instinto cazador. Diseño resistente.",
    categoria: "Gato"
  },
  {
    nombre: "Cama Ortopédica para Perros",
    precio: 8500,
    descripcion: "Cama ortopédica con memory foam para perros medianos y grandes. Funda lavable.",
    categoria: "Perro"
  },
  {
    nombre: "Rascador Torre 3 Niveles",
    precio: 6500,
    descripcion: "Torre rascador de 3 niveles con casita y hamaca para gatos. Base antideslizante.",
    categoria: "Gato"
  },
  {
    nombre: "Correa Retráctil 5 Metros",
    precio: 4200,
    descripcion: "Correa retráctil automática de 5 metros para perros hasta 25kg. Sistema de freno seguro.",
    categoria: "Perro"
  },
  {
    nombre: "Arena Sanitaria Gatos",
    precio: 3800,
    descripcion: "Arena aglutinante con control de olores. 10kg de duración.",
    categoria: "Gato"
  },
  {
    nombre: "Shampoo Antipulgas Perro",
    precio: 2200,
    descripcion: "Shampoo medicado antipulgas con aloe vera. pH balanceado.",
    categoria: "Perro"
  },
  {
    nombre: "Transportadora para Gatos",
    precio: 5500,
    descripcion: "Transportadora resistente con ventilación. Ideal para viajes.",
    categoria: "Gato"
  }
];

export const cargarProductos = async () => {
  try {
    console.log('📸 Cargando productos con imágenes...');

    const uploadsDir = path.join(__dirname, '../../uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      console.log('⚠️  Carpeta uploads/ no existe');
      return;
    }

    const archivos = fs.readdirSync(uploadsDir);
    const imagenes = archivos.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    if (imagenes.length === 0) {
      console.log('⚠️  No hay imágenes en la carpeta uploads/');
      return;
    }

    console.log(`   Encontradas ${imagenes.length} imágenes`);

    let productosCreados = 0;
    let productosOmitidos = 0;

    for (let i = 0; i < imagenes.length; i++) {
      const imagen = imagenes[i];
      const datosProducto = datosProductos[i % datosProductos.length];
      
      const existe = await Producto.findOne({ where: { imagen } });
      
      if (existe) {
        productosOmitidos++;
        continue;
      }

      const nombre = i < datosProductos.length 
        ? datosProducto.nombre 
        : `${datosProducto.nombre} ${Math.floor(i / datosProductos.length) + 1}`;

      await Producto.create({
        nombre,
        precio: datosProducto.precio,
        descripcion: datosProducto.descripcion,
        imagen,
        categoria: datosProducto.categoria,
        activo: true
      });

      productosCreados++;
    }

    if (productosCreados > 0) {
      console.log(`   ✅ ${productosCreados} productos creados`);
    }
    if (productosOmitidos > 0) {
      console.log(`   ⏭️  ${productosOmitidos} productos omitidos (ya existían)`);
    }

  } catch (error) {
    console.error('Error al cargar productos:', error.message);
  }
};