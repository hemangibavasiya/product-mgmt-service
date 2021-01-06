const mongoose = require('mongoose')
const dbCon = require('../constants/dbCon')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    Number_of_orders: {
        type: Number,
        required: true,
        default:0
    }
}, {
    collection: dbCon.COLLECTION_USER
})
userSchema.plugin(global.db.autoIncrement.plugin, {
    model: dbCon.COLLECTION_USER,
    field: 'userId',
    startAt: 1
})
module.exports = global.db.connection.model(dbCon.COLLECTION_USER, userSchema)
