import { productApi, cartApi } from "./apiManager.js";

let cart_ID = null;

//Realizamos la conexion con el socket
const socket = io();


//Escuchamos a productos:
socket.on("productosActualizados", (productos)=>{
    renderProductos(productos);
})

socket.on("cartUpdated", (items)=>{
    renderCarrito(items)
})



//Ahora tenemos todas las funciones de renderizado en pantalla


function renderProductos(productos){
    const listaProductos = document.getElementById("lista-productos");
    if(!listaProductos) return;
    listaProductos.innerHTML = '';

    if (productos.length === 0) {
      listaProductos.innerHTML = '<p class="text-muted">No hay productos para mostrar.</p>';
      return;
    }

//Creamos por cada producto, su tarjeta de vistas (AHORA CON BOOTSTRAP)
    productos.forEach(prod => {
        const col = document.createElement('div')
        col.className = "col"; // Usamos la columna de la grilla de Bootstrap
        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img 
              src="${prod.imagenes[0] || 'https://via.placeholder.com/300'}" 
              class="card-img-top" 
              alt="${prod.nombre}"
            >
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${prod.nombre}</h5>
              <p class="card-text flex-grow-1">${prod.descripcion}</p>
              <p class="card-text"><strong>Precio: $${prod.precio}</strong></p>
              <p class="card-text"><small class="text-muted">Stock: ${prod.stock}</small></p>
              
              <button 
                class="btn btn-primary mt-auto btn-agregar" 
                data-pid="${prod.id_producto}"
                ${prod.stock === 0 ? 'disabled' : ''} 
              >
                ${prod.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
              </button>
            </div>
          </div>
        `;
        listaProductos.appendChild(col);
  });
}


function renderCarrito(items) {
    const seccionCarrito = document.getElementById('seccion-carrito');
    if (!seccionCarrito) return;
    
    seccionCarrito.innerHTML = ''; // Limpiamos el carrito
    
    if (items.length === 0) {
      seccionCarrito.innerHTML = '<div class="alert alert-info">Tu carrito está vacío.</div>';
      return;
    }

    //Creamos para el carrito un "List Group" de Bootstrap
    const listGroup = document.createElement('ul');
    listGroup.className = 'list-group';
    
    let totalCarrito = 0;

    items.forEach(item => {
      const subtotal = item.precio * item.cantidad;
      totalCarrito += subtotal;
      
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <div>
          <h6 class="my-0">${item.nombre}</h6>
          <small class="text-muted">Cantidad: ${item.cantidad}</small>
        </div>
        <span class="text-muted">$${subtotal.toFixed(2)}</span>
        
        <div class="btn-group" role="group">
          <button class="btn btn-sm btn-outline-secondary btn-restar-uno" data-pid="${item.id_producto}" data-cantidad="${item.cantidad}">-</button>
          <button class="btn btn-sm btn-outline-secondary btn-sumar-uno" data-pid="${item.id_producto}">+</button>
          <button class="btn btn-sm btn-outline-danger btn-quitar-todo" data-pid="${item.id_producto}">Quitar</button>
        </div>
      `;
      listGroup.appendChild(li);
    });
    
    seccionCarrito.appendChild(listGroup);
    
    // Añadimos el total al final
    seccionCarrito.innerHTML += `
      <h4 class="d-flex justify-content-between align-items-center mt-3">
        <span>Total:</span>
        <strong>$${totalCarrito.toFixed(2)}</strong>
      </h4>
    `;
  }


//Aca manejamos los eventos


async function handleAgregarCarrito(e){
    if (!e.target.classList.contains('btn-agregar')) return;
    const pid = e.target.dataset.pid;
    try{
        await cartApi.addProduct(cart_ID, pid, 1);
    }
    catch(error){
        alert(error.message)
    }
}


async function handleModificarCarrito(e){
    const pid = e.target.dataset.pid;
    let cantidadActual;
    try{
        if(e.target.classList.contains('btn-restar-uno')){
            cantidadActual = parseInt(e.target.dataset.cantidad);
            await cartApi.updateQuantity(cart_ID, pid, cantidadActual - 1);
        }
        else if (e.target.classList.contains('btn-sumar-uno')){
            await cartApi.addProduct(cart_ID, pid,1)
        }

        else if (e.target.classList.contains('btn-quitar-todo')){
            await cartApi.removeProduct(cart_ID, pid)
        }
    }
    catch(error){
        alert(error.message)
    }
}

//Inicializamos la gestion del carrito:

async function inicializar(){
    try{
        cart_ID = localStorage.getItem("cartID");
        if(!cart_ID){
            const nuevoCarrito = await cartApi.createCart();
            cart_ID = nuevoCarrito.id_carrito;
            localStorage.setItem('cartID', cart_ID);
        }
        
        // Intentamos cargar el carrito (para validar el ID)
        const itemsCarrito = await cartApi.getCart(cart_ID);
        
        // Si tuvo éxito (no saltó al catch), nos unimos a la sala
        socket.emit("joinCartRoom", cart_ID);
        renderCarrito(itemsCarrito);
    }
    catch(error){
        // El ID de localStorage es 'stale' (viejo) y dio 404.
        console.warn("No se pudo cargar el carrito (ID viejo). Creando uno nuevo...");
        localStorage.removeItem('cartID');
        
        const nuevoCarrito = await cartApi.createCart();
        cart_ID = nuevoCarrito.id_carrito;
        localStorage.setItem('cartID', cart_ID);
        
        socket.emit("joinCartRoom", cart_ID);
        renderCarrito([]); // Renderizamos un carrito vacío
    }

    try{
        // Respetamos el nombre de tu función en apiManager.js
        const productos = await productApi.getProductos(); 
        renderProductos(productos);
    }
    catch(error){
        alert("No se pudieron cargar los productos")
    }
    document.addEventListener('click', e =>{
        handleAgregarCarrito(e);
        handleModificarCarrito(e);
    })
}

inicializar();