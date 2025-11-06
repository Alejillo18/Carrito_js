import {Router} from "express";
import {CartManager} from "../managers/cartManager.js"


const cartRouter = Router();
const cartManager = new CartManager();

//Para manejar las salas privadas, conviene hacer una funcion que gestion las id de las mismas,para su posterior buena conexion
async function emitCartUpdate(req, cartId) {
  try {
    const cartContents = await cartManager.getCartById(cartId);
    req.io.to(cartId).emit('cartUpdated', cartContents);
  } catch (error) {
    console.error('Error al emitir actualización del carrito:', error);
  }
}
cartRouter.post('/', async (req, res) => {
    try {
      const nuevoCarrito = await cartManager.createCart();
      res.status(201).json(nuevoCarrito);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  cartRouter.get('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const carrito = await cartManager.getCartById(cid);
      
      if (carrito) {
        res.status(200).json(carrito);
      } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  cartRouter.post('/:cid/producto/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { cantidad } = req.body; 
      
      const itemAgregado = await cartManager.addProductToCart(cid, pid, cantidad || 1);
      //Avisamos a la sala
      await emitCartUpdate(req, cid)
      res.status(201).json(itemAgregado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

  cartRouter.put('/:cid/producto/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { nuevaCantidad } = req.body;
      if (nuevaCantidad === undefined) {
        return res.status(400).json({ error: 'Falta nuevaCantidad en el body' });
      }
      const itemActualizado = await cartManager.updateItemQuantity(cid, pid, nuevaCantidad);
      await emitCartUpdate(req, cid);
      res.status(200).json(itemActualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

  cartRouter.delete('/:cid/producto/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const itemEliminado = await cartManager.removeProductFromCart(cid, pid);
      await emitCartUpdate(req, cid);
      res.status(200).json(itemEliminado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  cartRouter.delete('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const itemsEliminados = await cartManager.clearCart(cid);
      await emitCartUpdate(req, cid);
      res.status(200).json(itemsEliminados);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  export default cartRouter;