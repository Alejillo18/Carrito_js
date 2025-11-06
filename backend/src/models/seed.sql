-- Limpiamos las tablas antes de insertar nuevos datos
TRUNCATE TABLE Items_carritos, Imagenes_Productos, Productos, Carritos RESTART IDENTITY CASCADE;

-- Insertar Productos

INSERT INTO Productos (id_producto, nombre, descripcion, precio, stock, categoria)
VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Taza de Cerámica', 'Una taza ideal para café, 300ml. Apta para microondas.', 1500.50, 50, 'Hogar'),
('b2c3d4e5-f6a7-8901-2345-678901bcdefa', 'Laptop Pro', 'Notebook 15 pulgadas, 16GB RAM, 512GB SSD. Procesador M3.', 850000.00, 10, 'Electrónica'),
('c3d4e5f6-a7b8-9012-3456-789012cdefab', 'Teclado Mecánico RGB', 'Teclado con switches cherry mx red, 100% RGB.', 120000.75, 25, 'Electrónica'),
('d4e5f6a7-b8c9-0123-4567-890123cdefab', 'Planta Artificial', 'Planta decorativa de plástico, no requiere agua.', 4500.00, 100, 'Hogar');

-- Insertar Imágenes para esos productos
INSERT INTO Imagenes_Productos (id_producto, imagen)
VALUES
-- Imágenes Taza
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'https://ejemplo.com/taza_blanca.jpg'),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'https://ejemplo.com/taza_detalle.jpg'),

-- Imágenes Laptop
('b2c3d4e5-f6a7-8901-2345-678901bcdefa', 'https://ejemplo.com/laptop_frente.jpg'),
('b2c3d4e5-f6a7-8901-2345-678901bcdefa', 'https://ejemplo.com/laptop_teclado.jpg'),
('b2c3d4e5-f6a7-8901-2345-678901bcdefa', 'https://ejemplo.com/laptop_perfil.jpg'),

-- Imágenes Teclado
('c3d4e5f6-a7b8-9012-3456-789012cdefab', 'https://ejemplo.com/teclado_rgb.jpg');

-- (Nota: Dejamos la 'Planta Artificial' sin imágenes a propósito
-- para probar cómo se ve el array 'imagenes: []' vacío)