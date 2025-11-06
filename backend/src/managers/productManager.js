//Se encarga de gestionar todas las posibles acciones sobre los productos
import { pool } from '../config/database.js'

export class ProductManager {
  async getProducts(queryParams = {}) {
    const { nombre, categoria, precio_min, precio_max, sort } = queryParams;
    let baseQuery = `SELECT
        p.*, -- p.* trae todas las columnas de Productos
        COALESCE(array_agg(img.imagen) FILTER (WHERE img.imagen IS NOT NULL), '{}') AS imagenes
      FROM Productos AS p
      LEFT JOIN Imagenes_Productos AS img ON p.id_producto = img.id_producto`;
    let filters = [];
    let values = [];
    let orderByClause = '';
    let paramIndex = 1;

    if (nombre) {
      // MEJORA: Añadido 'p.' para evitar ambigüedad
      filters.push(`p.nombre ILIKE $${paramIndex++}`);
      values.push(`%${nombre}%`);
    }

    if (categoria) {
      // MEJORA: Añadido 'p.'
      filters.push(`p.categoria = $${paramIndex++}`);
      values.push(categoria);
    }

    if (precio_min) {
      // MEJORA: Añadido 'p.'
      filters.push(`p.precio >= $${paramIndex++}`);
      values.push(precio_min);
    }
    if (precio_max) {
      // MEJORA: Añadido 'p.'
      filters.push(`p.precio <= $${paramIndex++}`);
      values.push(precio_max);
    }

    if (filters.length > 0) {
      baseQuery += ' WHERE ' + filters.join(' AND ');
    }
    baseQuery += ' GROUP BY p.id_producto';
    
    // para ordenar
    if (sort) {
      // MEJORA: Añadidas opciones de 'nombre'
      const validSortOptions = {
        'precio_asc': 'p.precio ASC',
        'precio_desc': 'p.precio DESC',
        'nombre_asc': 'p.nombre ASC',
        'nombre_desc': 'p.nombre DESC'
      };

      if (validSortOptions[sort]) {
        orderByClause = ` ORDER BY ${validSortOptions[sort]}`;
      } else {
        orderByClause = ' ORDER BY p.precio ASC';
      }
    } else {
      orderByClause = ' ORDER BY p.precio ASC';
    }

    baseQuery += orderByClause;
    const query = {
      text: baseQuery,
      values,
    };

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Error al obtener los productos. ' + error.message);
    }
  }


  async getProductById(id_producto) {
    const query = {
      text: `
        SELECT
          p.*,
          COALESCE(array_agg(img.imagen) FILTER (WHERE img.imagen IS NOT NULL), '{}') AS imagenes
        FROM Productos AS p
        LEFT JOIN Imagenes_Productos AS img ON p.id_producto = img.id_producto
        WHERE p.id_producto = $1  -- Filtro por ID
        GROUP BY p.id_producto; -- Agrupamos para el array_agg
      `,
      values: [id_producto],
    };

    try {
      const result = await pool.query(query);
      if (result.rows.length === 0) {
        return null; // Producto no encontrado
      }
      return result.rows[0]; // Retorna el producto encontrado
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error);
      throw new Error('Error al obtener el producto por ID. ' + error.message);
    }
  }

  async createProduct(productData) {
    const { nombre, descripcion, precio, stock, categoria, imagenes = [] } = productData;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const productQuery = {
        text: `
          INSERT INTO Productos (nombre, descripcion, precio, stock, categoria)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id_producto; 
        `,
        values: [nombre, descripcion, precio, stock, categoria],
      };

      const productResult = await client.query(productQuery);
      const newProductId = productResult.rows[0].id_producto;
      //Pasamos a insertar las imagenes a la tabla intermedia, de imagenes_producto
      if (imagenes.length > 0) {
        for (const imgURL of imagenes) {
          const imageQuery = {
            text: 'INSERT INTO Imagenes_Productos(id_producto, imagen) VALUES ($1, $2)',
            values: [newProductId, imgURL]
          };
          await client.query(imageQuery);
        }
      }
      await client.query('COMMIT');
      return { id_producto: newProductId, ...productData };
    }
    catch (error) {
      await client.query('ROLLBACK');
      throw new Error("Error al crear el nuevo producto: " + error.message);
    }
    finally {
      client.release();
    }
  }

  async updateProduct(id_producto, updateData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const currentResult = await client.query(
        'SELECT * FROM Productos WHERE id_producto = $1 FOR UPDATE',
        [id_producto]
      );
      if (currentResult.rows.length === 0) {
        throw new Error('Producto no encontrado para actualizar');
      }
      const currentProduct = currentResult.rows[0];
      const dataToUpdate = { ...currentProduct, ...updateData };
      const { nombre, descripcion, precio, stock, categoria } = dataToUpdate;
      const updateProductQuery = {
        text: `
          UPDATE Productos
          SET nombre = $1, descripcion = $2, precio = $3, stock = $4, categoria = $5
          WHERE id_producto = $6
          RETURNING *;
        `,
        values: [nombre, descripcion, precio, stock, categoria, id_producto],
      };
      const updatedProductResult = await client.query(updateProductQuery);
      if (updateData.imagenes !== undefined) {
        const currentImagesResult = await client.query(
          'SELECT imagen FROM Imagenes_Productos WHERE id_producto = $1',
          [id_producto]
        );
        const currentImages = currentImagesResult.rows.map(row => row.imagen);
        const newImages = updateData.imagenes || [];
        const imagesToDelete = currentImages.filter(img => !newImages.includes(img));
        const imagesToAdd = newImages.filter(img => !currentImages.includes(img));
        if (imagesToDelete.length > 0) {
          await client.query(
            'DELETE FROM Imagenes_Productos WHERE id_producto = $1 AND imagen = ANY($2::text[])',
            [id_producto, imagesToDelete]
          );
        }
        if (imagesToAdd.length > 0) {
          for (const imgUrl of imagesToAdd) {
            await client.query(
              'INSERT INTO Imagenes_Productos (id_producto, imagen) VALUES ($1, $2)',
              [id_producto, imgUrl]
            );
          }
        }
      }
      await client.query('COMMIT');
      return updatedProductResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al actualizar el producto (transacción revertida):', error);
      throw new Error('Error al actualizar el producto. ' + error.message);
    } finally {
      client.release();
    }
  }

  async deleteProduct(id_producto) {
    const query = {
      text: 'DELETE FROM Productos WHERE id_producto = $1 RETURNING *;',
      values: [id_producto],
    };
    try {
      const result = await pool.query(query);
      if (result.rows.length === 0) {
        return null;
      }
      console.log('Producto eliminado:', result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error('Error al eliminar el producto:', error); 
      throw new Error('Error al eliminar el producto. ' + error.message);
    }
  }

}