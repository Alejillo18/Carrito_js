//Con este archivo gestionamos todos los pedidos a nuestra api, app.js de backend

const baseUrl = '/api';

async function apiFetch(endpoint, options = {}){
    options.headers =   
    {
        'Content-type' : 'application/json',
        ...options.headers
    }

    if (options.body){
        options.body = JSON.stringify(options.body)
    }

    try{
        const response = await fetch(baseUrl + endpoint, options)
        if (response.status === 204){ return{ok: true};}
        const data =  await response.json();
        if(!response.ok){
            throw new Error(data.error || "Error en la peticion a la api")
        }
        return data;
    }
    catch(error){
        throw error;
    }
}

// Metodos para los productos:
export const productApi = {
    getProductos : (queryParams = {}) =>{
        const queryString = new URLSearchParams(queryParams).toString();
        return apiFetch(`/productos?${queryString}`);
    },

    getProductById: (pid) => {
        return apiFetch(`/productos/${pid}`);
      },

    createProduct: (productData) => {
        return apiFetch('/productos', {
          method: 'POST',
          body: productData,
        });
      },

      updateProduct: (pid, updateData) => {
        return apiFetch(`/productos/${pid}`, {
          method: 'PUT',
          body: updateData,
        });
      },

      deleteProduct: (pid) => {
        return apiFetch(`/productos/${pid}`, {
          method: 'DELETE',
        });
      }
    }
//Metodos del carrito:

export const cartApi = {
    createCart: () => {
      return apiFetch('/carrito', { method: 'POST' });
    },
  
    getCart: (cid) => {
      return apiFetch(`/carrito/${cid}`);
    },
  
    addProduct: (cid, pid, cantidad = 1) => {
      return apiFetch(`/carrito/${cid}/producto/${pid}`, {
        method: 'POST',
        body: { cantidad },
      });
    },
  
    updateQuantity: (cid, pid, nuevaCantidad) => {
      return apiFetch(`/carrito/${cid}/producto/${pid}`, {
        method: 'PUT',
        body: { nuevaCantidad },
      });
    },
  
    removeProduct: (cid, pid) => {
      return apiFetch(`/carrito/${cid}/producto/${pid}`, {
        method: 'DELETE',
      });
    },
  
    clearCart: (cid) => {
      return apiFetch(`/carrito/${cid}`, {
        method: 'DELETE',
      });
    },
  }