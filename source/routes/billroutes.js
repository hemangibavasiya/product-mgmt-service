const router = require('express').Router()
const status  = require('http-status')
const {displayAvgBillDetails} = require('../services/displayavgbill')
const {viewNoOfOrders} = require('../services/viewNoOfOrders')


router.get('/avg/display', async (req, res) => {
    try {
        const response = await displayAvgBillDetails()
        res.status(status.OK).send(response)
    } catch (error) {
        if (error.status) res.status(error.status).send({"error_message": error.message})
        res.status(status.INTERNAL_SERVER_ERROR).send({"error_message": error})
    }
})

router.get('/order/display', async (req, res) => {
    try {
        const response = await viewNoOfOrders()
        res.status(status.OK).send(response)
    } catch (error) {
        if (error.status) res.status(error.status).send({"error_message": error.message})
        res.status(status.INTERNAL_SERVER_ERROR).send({"error_message": error})
    }
})

module.exports = router