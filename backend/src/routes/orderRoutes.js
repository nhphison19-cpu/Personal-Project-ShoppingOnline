const express = require('express')
const { createOrder  , createOrderFormCart, GetMyOrder, getOrderById, cancelOrder, getAllOrders, updateOrderStatus } = require('../controllers/OrderController')
const {authMiddleware} = require('../middleware/authMiddleware')
const { adminMiddleware } = require('../middleware/adminMiddleware')

const router = express.Router()

router.use(authMiddleware)

router.post('/create' ,createOrder)
router.post('/createOrderFromCart'   , createOrderFormCart )
router.get('/getMyOrder'   , GetMyOrder )
router.get('/getOrderById/:orderid'    , getOrderById  )
router.post('/cancleOrder/:orderid'    , cancelOrder  )
router.get('/getAll'    , adminMiddleware,getAllOrders  )
router.put('/update/:orderid'   ,adminMiddleware , updateOrderStatus  )






module.exports = router