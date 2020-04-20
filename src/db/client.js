const { Client } = require('pg')
const connectionString = 'postgresql://postgres:bantalbulu@localhost:5432/store'

const client = new Client({
  connectionString: connectionString,
})
client.connect()
