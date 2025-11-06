import http from "http";
import express from "express";
import "dotenv/config";
import { pool } from "./config/database.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import { Server } from "socket.io";

//Servidor express
const app = express();
const PORT = process.env.PORT || 8080;

//Servidor http (pasamos app)
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/productos", productRouter);
app.use("/api/carrito", cartRouter);

app.get("/ping", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows[0]);
});

//Config de io
io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado:", socket.id);

  socket.on("joinCartRoom", (cartId) => {
    //cada uno de los clientes, entra en una "sala" de carrito
    socket.join(cartId);
    console.log(
      `Cliente ${socket.id} se unió a la sala del carrito: ${cartId}`
    );
  });
  socket.on("disconnect", () => {
    console.log("Un cliente se ha desconectado:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});