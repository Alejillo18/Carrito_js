import pg from "pg"
import "dotenv/config"

const {Pool} = pg

//utilizamos variables de entorno
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
   /*  user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, */
})

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error al conectar con la base de datos:', err);
    } else {
      console.log('Conexión exitosa a la base de datos:', res.rows[0].now);
    }
  });

