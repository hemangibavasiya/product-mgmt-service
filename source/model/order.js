const mongoose = require('mongoose')
const dbCon = require('../constants/dbCon')

const orderSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
   
    subtotal: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    }
}, {
    collection:dbCon.COLLECTION_ORDER
})

orderSchema.plugin(global.db.autoIncrement.plugin, {
    model: dbCon.COLLECTION_ORDER,
    field: 'orderId',
    startAt: 1
})
module.exports = global.db.connection.model(dbCon.COLLECTION_ORDER, orderSchema)