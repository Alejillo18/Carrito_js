// Se encarga de gestionar todas las acciones del carrito
import { pool } from '../config/database.js';

export class CartManager {
  async createCart() {
    try {
      const query = 'INSERT INTO Carritos DEFAULT VALUES RETURNING id_carrito';
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      throw new Error('Error al crear el carrito: ' + error.message);
    }
  }
  async getCartById(id_carrito) {
    const query = {
      text: `
        SELECT
          it.id_items,        -- El ID del item en el carrito
          it.cantidad,        -- La cantidad de este producto
          p.id_producto,      -- El ID del producto
          p.nombre,           -- Info del producto...
          p.precio,
          p.stock,            -- El stock total (para que el frontend lo vea)
          -- Obtenemos la PRIMERA imagen de la tabla de imágenes
          (SELECT imagen FROM Imagenes_Productos img WHERE img.id_producto = p.id_producto LIMIT 1) AS imagen
        FROM Items_carritos AS it
        JOIN Productos AS p ON it.id_producto = p.id_producto
        WHERE it.id_carrito = $1
        ORDER BY p.nombre ASC;
      `,
      values: [id_carrito],
    };
    try {
      const result = await pool.query(query);
      return result.rows; // Retorna un array de productos en el carrito
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      throw new Error('Error al obtener el carrito: ' + error.message);
    }
  }
  async addProductToCart(id_carrito, id_producto, cantidad = 1) {
    try {
      const stockCheck = await pool.query('SELECT stock FROM Productos WHERE id_producto = $1', [id_producto]);
      if (stockCheck.rows.length === 0) throw new Error('Producto no existe');
      
      if (stockCheck.rows[0].stock < cantidad) {
         throw new Error(`Stock insuficiente. Solo quedan ${stockCheck.rows[0].stock} unidades.`);
      }

      const query = {
        text: `
          INSERT INTO Items_carritos (id_carrito, id_producto, cantidad)
          VALUES ($1, $2, $3)
          ON CONFLICT (id_carrito, id_producto) -- Si la llave (carrito, producto) ya existe...
          DO UPDATE SET cantidad = Items_carritos.cantidad + $3 -- ...le suma la cantidad
          RETURNING *;
        `,
        values: [id_carrito, id_producto, cantidad],
      };

      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      throw new Error('Error al agregar producto: ' + error.message);
    }
  }
  
  async updateItemQuantity(id_carrito, id_producto, nuevaCantidad) {
    if (nuevaCantidad <= 0) {

      return this.removeProductFromCart(id_carrito, id_producto);
    }

    try {
      const query = {
        text: `
          UPDATE Items_carritos
          SET cantidad = $1
          WHERE id_carrito = $2 AND id_producto = $3
          RETURNING *;
        `,
        values: [nuevaCantidad, id_carrito, id_producto],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      throw new Error('Error al actualizar cantidad: ' + error.message);
    }
  }
  async removeProductFromCart(id_carrito, id_producto) {
    try {
      const query = {
        text: 'DELETE FROM Items_carritos WHERE id_carrito = $1 AND id_producto = $2 RETURNING *;',
        values: [id_carrito, id_producto],
      };
      const result = await pool.query(query);
      if (result.rows.length === 0) {
        return null; // No se borró nada
      }
      return result.rows[0]; // Devuelve el item que fue borrado
    } catch (error) {
      console.error('Error al quitar producto del carrito:', error);
      throw new Error('Error al quitar producto: ' + error.message);
    }
  }

  async clearCart(id_carrito) {
    try {
      const query = {
        text: 'DELETE FROM Items_carritos WHERE id_carrito = $1 RETURNING *;',
        values: [id_carrito],
      };
      const result = await pool.query(query);
      return result.rows; // Devuelve todos los items que fueron borrados
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      throw new Error('Error al vaciar el carrito: ' + error.message);
    }
  }
}