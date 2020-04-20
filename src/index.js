const Hapi = require('hapi'); 

const server = new Hapi.Server({ 
    host: 'localhost', 
    port: 3001, 
});

const { Pool } = require('pg')
const connectionString = 'postgresql://postgres:bantalbulu@localhost:5432/store'

const pool = new Pool({
  connectionString: connectionString,
})
// get product list
server.route({
    method: 'GET',
    path: '/productlist',
    handler: async (req, h) => {
          try {
            const res  = await pool.query('SELECT * FROM products')
            return res
          } catch (err) {
            return err.stack
          }
    }
})
// get product by id
server.route({
    method: 'GET',
    path: '/product/{id}',
    handler: async (req, h) => {
         const id = req.params.id; 
          try {
            const res  = await pool.query('SELECT * FROM products WHERE id = $1', [id])
            return res
          } catch (err) {
            return err.stack
          }
    }
})

//insert product
server.route({
    method: 'POST',
    path: '/productstore',
    handler: async (req, h) => {


      const reqBody = {
        no_product : req.payload.no_product,
        nama_product : req.payload.nama_product,
        harga_jual : req.payload.harga_jual,
        stok : req.payload.stok,
        kategori1 : req.payload.kategori1,
        kategori2 : req.payload.kategori2,
        kategori3 : req.payload.kategori3
    }

          try {
            const res  = await pool.query('INSERT INTO products(no_product, nama_product) VALUES($1, $2) RETURNING *', [reqBody.no_product, reqBody.nama_product])
            return res
          } catch (err) {
            return err.stack
          }
    }
})

//update product
server.route({
    method: 'PUT',
    path: '/productupdate/{id}',
    options: {
        plugins: {
          body: { merge: true}
        },
        handler: async (req, h) => {

            const id = req.params.id; 

            const reqBody = {
                no_product : req.payload.no_product,
                nama_product : req.payload.nama_product,
                harga_jual : req.payload.harga_jual,
                stok : req.payload.stok,
                kategori1 : req.payload.kategori1,
                kategori2 : req.payload.kategori2,
                kategori3 : req.payload.kategori3
            }
    
              try {
                const res  = await pool.query('UPDATE products SET no_product=($1),nama_product=($2) WHERE id=($3)',
                        [reqBody.no_product, reqBody.nama_product, id]
                    )
                return res
              } catch (err) {
                return err.stack
              }
        }
      }
    
})

const launch = async () => {
    try { 
        await server.start(); 
    } catch (err) { 
        console.error(err); 
        process.exit(1); 
    }; 
    console.log(`Server running at ${server.info.uri}`); 
}
launch();