DROP TABLE IF EXISTS Items_carritos;
DROP TABLE IF EXISTS Imagenes_Productos;

DROP TABLE IF EXISTS Productos;
DROP TABLE IF EXISTS Carritos;


CREATE TABLE Productos(
	id_producto UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    categoria VARCHAR(100),
	CONSTRAINT stock_no_negativo CHECK (stock >= 0)
)

CREATE TABLE Carritos (
    id_carrito UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Imagenes_Productos(
	id_imagenes SERIAL PRIMARY KEY,
	id_producto UUID NOT NULL REFERENCES Productos(id_producto) ON DELETE CASCADE,
	imagen VARCHAR
)


CREATE TABLE Items_carritos(
	id_items SERIAL PRIMARY KEY,
    id_carrito UUID NOT NULL REFERENCES Carritos(id_carrito) ON DELETE CASCADE,
    id_producto UUID NOT NULL REFERENCES Productos(id_producto),
    cantidad INTEGER NOT NULL DEFAULT 1,
    UNIQUE(id_carrito, id_producto) 
)



CREATE INDEX idx_productos_categoria ON Productos(categoria);


CREATE INDEX idx_imagenes_producto_id ON Imagenes_Productos(id_producto);


CREATE INDEX idx_items_producto_id ON Items_carritos(id_producto);