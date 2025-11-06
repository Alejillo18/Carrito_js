import {Router} from "express"
import {ProductManager} from "../managers/productManager.js"

const productRouter = Router();
const productManager = new ProductManager();

//Ruta paara obtener todos los productos
productRouter.get("/", async(req, res) =>{
    try{
    const productos = await productManager.getProducts(req.query);
    res.status(200).json(productos);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})

//Ruta para obtener un producto por su id

productRouter.get("/:pid", async(req,res)=>{
    try{
        const {pid} = req.params;
        const producto = await productManager.getProductById(pid)
        if(producto) {return res.status(200).json({producto})}
        return res.status(404).json({error: "Producto no Encontrado"})
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})


//Agregar un producto
productRouter.post("/", async(req,res)=>{
    try{
        const nuevoProducto = await productManager.createProduct(req.body)
        const productosActualizados = await productManager.getProducts({});
        req.io.emit('productosActualizados', productosActualizados);
        res.status(201).json({nuevoProducto})
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})


//Actualizar un producto:
productRouter.put("/:pid", async(req,res)=>{
    try{
        const {pid} = req.params;
        const updateData = req.body;
        const productoActualizado = await productManager.updateProduct(pid,updateData);
        if (productoActualizado) {
        const productosActualizados = await productManager.getProducts({});
        req.io.emit('productosActualizados', productosActualizados);
        return res.status(200).json(productoActualizado)}
        return res.status(404).json({error: "Producto no encontrado"})    
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
})

//Borrar un producto:

productRouter.delete('/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const productoEliminado = await productManager.deleteProduct(pid);
      
      if (productoEliminado) {
        const productosActualizados = await productManager.getProducts({});
        req.io.emit('productosActualizados', productosActualizados);
        res.status(200).json(productoEliminado);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


export default productRouter