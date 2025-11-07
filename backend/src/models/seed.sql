-- Limpiamos las tablas antes de insertar nuevos datos
TRUNCATE TABLE Items_carritos, Imagenes_Productos, Productos, Carritos RESTART IDENTITY CASCADE;



-- Insertar Productos
INSERT INTO Productos (id_producto, nombre, descripcion, precio, stock, categoria)
VALUES
('00000000-0000-0000-0000-000000000001', 'ASRock Radeon RX 6600 Challenger D 8GB', 'Tarjeta gráfica ideal para gaming 1080p. Bajo consumo y buena relación calidad/precio.', 270000, 15, 'gpus'),
('00000000-0000-0000-0000-000000000002', 'MSI Radeon RX 6750 XT MECH 2X 12GB', 'GPU potente para gaming en 1440p. Buena ventilación y diseño robusto.', 400000, 8, 'gpus'),
('00000000-0000-0000-0000-000000000003', 'Gigabyte GeForce RTX 4060 Eagle OC 8GB', 'NVIDIA de nueva generación. DLSS 3 y buena eficiencia para juegos modernos.', 360000, 12, 'gpus'),
('00000000-0000-0000-0000-000000000004', 'Intel Core i5-13600K', 'Procesador de alto rendimiento para gaming y productividad.', 320000, 10, 'cpus'),
('00000000-0000-0000-0000-000000000005', 'AMD Ryzen 7 7800X3D', 'Procesador con tecnología 3D V-Cache para máximo rendimiento en gaming.', 450000, 6, 'cpus'),
('00000000-0000-0000-0000-000000000006', 'Intel Core i3-12100F', 'Procesador económico ideal para builds de entrada.', 150000, 18, 'cpus'),
('00000000-0000-0000-0000-000000000007', 'Corsair Vengeance RGB 32GB DDR5', 'Memoria RAM DDR5 de alta velocidad con iluminación RGB.', 120000, 20, 'ram'),
('00000000-0000-0000-0000-000000000008', 'Kingston Fury Beast 16GB DDR4', 'Memoria RAM DDR4 de buen rendimiento y disipador de calor.', 65000, 25, 'ram'),
('00000000-0000-0000-0000-000000000009', 'G.Skill Trident Z5 64GB DDR5', 'Memoria RAM DDR5 de alta gama para entusiastas y creadores de contenido.', 280000, 7, 'ram'),
('00000000-0000-0000-0000-000000000010', 'ASUS ROG Strix B550-F Gaming', 'Placa madre AMD B550 con iluminación RGB y excelente conectividad.', 180000, 12, 'mother'),
('00000000-0000-0000-0000-000000000011', 'Gigabyte Z790 AORUS Elite AX', 'Placa madre Intel Z790 con WiFi 6E y soporte para DDR5.', 280000, 9, 'mother'),
('00000000-0000-0000-0000-000000000012', 'MSI MPG B550 Gaming Plus', 'Placa madre AMD B550 con diseño robusto y buen sistema de enfriamiento.', 160000, 14, 'mother'),
('00000000-0000-0000-0000-000000000013', 'Corsair RM750x 750W 80 Plus Gold', 'Fuente de alimentación modular de alta eficiencia y bajo ruido.', 140000, 15, 'psus'),
('00000000-0000-0000-0000-000000000014', 'Seasonic Focus GX-850 850W', 'Fuente de alimentación con excelente regulación de voltaje y componentes japoneses.', 170000, 8, 'psus'),
('00000000-0000-0000-0000-000000000015', 'EVGA 600 GD 600W 80 Plus Gold', 'Fuente de alimentación económica pero con certificación Gold.', 90000, 20, 'psus'),
('00000000-0000-0000-0000-000000000016', 'NZXT H510 Flow', 'Gabinete de torre media con excelente flujo de aire y diseño minimalista.', 110000, 13, 'cases'),
('00000000-0000-0000-0000-000000000017', 'Lian Li PC-O11 Dynamic', 'Gabinete premium con diseño dual chamber y amplio espacio para watercooling.', 220000, 6, 'cases'),
('00000000-0000-0000-0000-000000000018', 'Fractal Design Meshify C', 'Gabinete compacto con frente mesh para óptima ventilación.', 130000, 11, 'cases'),
('00000000-0000-0000-0000-000000000019', 'Samsung 970 EVO Plus 1TB NVMe', 'SSD NVMe de alto rendimiento para gamers y profesionales.', 120000, 18, 'storages'),
('00000000-0000-0000-0000-000000000020', 'WD Blue SN570 1TB NVMe', 'SSD NVMe económico pero con buen rendimiento para uso general.', 85000, 22, 'storages'),
('00000000-0000-0000-0000-000000000021', 'Seagate BarraCuda 2TB HDD', 'Disco duro convencional para almacenamiento masivo económico.', 50000, 30, 'storages');

-- Insertar Imágenes
INSERT INTO Imagenes_Productos (id_producto, imagen)
VALUES
('00000000-0000-0000-0000-000000000001', 'https://www.asrock.com/Graphics-Card/features/DUALFANDESIGN-Radeon%20RX%206600%20Challenger%20D%208GB.jpg'),
('00000000-0000-0000-0000-000000000002', 'https://www.invidcomputers.com/images/0000000000414534000338036414534--2-.png'),
('00000000-0000-0000-0000-000000000003', 'https://cdn.mos.cms.futurecdn.net/G8MKH8mwKgbJ5KBcHpVvee-1200-80.png'),
('00000000-0000-0000-0000-000000000004', 'https://www.achorao.com/cdn/shop/files/intel-procesadores-default-title-procesador-intel-core-i5-13600k-3-50-5-10ghz-24mb-lga-1700-5032037258746-46365339255024_1080x.jpg?v=1738880776'),
('00000000-0000-0000-0000-000000000005', 'https://diamondsystemar.vtexassets.com/arquivos/ids/161726/78003387800_2.jpg.jpg?v=638802506645030000'),
('00000000-0000-0000-0000-000000000006', 'https://www.grupocentrotecnologico.com/wp-content/uploads/2022/07/I13-12-GEN.png'),
('00000000-0000-0000-0000-000000000007', 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/vengeance-rgb-ddr5-wht-config/Gallery/Vengeance-RGB-DDR5-2UP-WHITE_01.webp'),
('00000000-0000-0000-0000-000000000008', 'https://www.maximus.com.ar/Temp/App_WebSite/App_PictureFiles/Items/KF432C16BB2A-16_800.jpg'),
('00000000-0000-0000-0000-000000000009', 'https://ar-hard.com.ar/wp-content/uploads/Trident_Z5_Neo_RGB_White_2.jpg'),
('00000000-0000-0000-0000-000000000010', 'https://mexx-img-2019.s3.amazonaws.com/Motherboard-Am4-Asus-Rog-Strix-B550-F-GAMING-WIFI-II_43255_1.jpeg'),
('00000000-0000-0000-0000-000000000011', 'https://www.gigabyte.com/FileUpload/Global/KeyFeature/2181/innergigabyteimages/smartfan601.png'),
('00000000-0000-0000-0000-000000000012', 'https://storage-asset.msi.com/global/picture/image/feature/mb/B550/MPG/gaming-plus/msi-mpg-b550-gaming-plus-hero-02.png'),
('00000000-0000-0000-0000-000000000013', 'https://www.invidcomputers.com/images/000000000041425071973414250--1-.png'),
('00000000-0000-0000-0000-000000000014', 'https://xtremegames.com.ar/wp-content/uploads/2022/11/imagen-600x600.png'),
('00000000-0000-0000-0000-000000000015', 'https://images.evga.com/products/gallery/png/100-GD-0600-V1_XL_1.png'),
('00000000-0000-0000-0000-000000000016', 'https://nzxt.com/cdn/shop/files/h5-elite-hero-black.png?v=1744789660&width=2000'),
('00000000-0000-0000-0000-000000000017', 'https://m.media-amazon.com/images/I/71b0CSuKkNL._AC_SL1500_.jpg'),
('00000000-0000-0000-0000-000000000018', 'https://http2.mlstatic.com/D_NQ_NP_833122-MLA31117259936_062019-O.webp'),
('00000000-0000-0000-0000-000000000019', 'https://m.media-amazon.com/images/I/71OYNmVRFhL._AC_SL1500_.jpg'),
('00000000-0000-0000-0000-000000000020', 'https://m.media-amazon.com/images/I/61a+U9YhovL._AC_SL1500_.jpg'),
('00000000-0000-0000-0000-000000000021', 'https://fullh4rd.com.ar/img/productos/12/hd-hdd-2tb-seagate-barracuda-sata-iii-35-0.jpg');