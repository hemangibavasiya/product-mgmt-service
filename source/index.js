const express = require('express')
const dotenv = require('dotenv')


dotenv.config()

const dbCon = require('./repository/db')

global.db = dbCon.connect()
require('./model/modelExport')

const app = express()


app.listen(process.env.PORT, () => console.log('server is up now'))

const billRoutes = require('./routes/billroutes')
app.use(express.json())
app.use('/api/bill', billRoutes)