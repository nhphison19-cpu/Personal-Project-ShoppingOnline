const OrderService = require('../services/OrderService')

const createOrder = async (req , res) => {
    try {
        const {paymentMethod , shippingAddress , items } = req.body 
        const userid = req.user.id
        if(!userid ) {
            return res.status(400).json({
                status: " ERR" ,
                message : "User  authentication is required"
            })
        }
        if(!paymentMethod || !shippingAddress ) {
            return res.status(400).json({
                status : "ERR" ,
                message : "Shipping address and payment method are required"
            })
        }
        if(!items || !Array.isArray(items) || items.length == 0 ){
            return res.status(400).json({
                status : "ERR" ,
                message : "Order items cannot be empty"
            })
        }
        const response = await OrderService.createOrder(userid , {paymentMethod , shippingAddress , items})
        return res.status(200).json(response) 

    }catch(e){
        return res.status(404).json({
            status : "ERR" ,
            message : e.message
        })
    }
}
const createOrderFormCart = async(req , res ) => { 
    try {
        const { paymentMethod , shippingAddress  } = req.body 
        const userid = req.user.id
        
        if(!userid) {
            return res.status(400).json({
                status : "ERR" ,
                message : "User id not found"
            })
        }
        if(!paymentMethod || !shippingAddress ) {
            return res.status(400).json({
                status : "ERR" ,
                message : "Shipping address and payment method are required"
            })
        }
        const response = await OrderService.createOrderFormCart(userid , {paymentMethod , shippingAddress })
        if(response.status == "ERR" ) {
            return res.status(400).json(response)
        }
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: "ERR",
            message: e.message || "Internal Server Error"
        })
    }
}
const GetMyOrder  = async (req , res) => {
    try {
        const userid = req.user.id 
        if(!userid) {
            return res.status(400).json({
                status  : "ERR" ,
                message : "user id not found"
            })
        }
        const response = await OrderService.GetMyOrder(userid)
        return res.status(200).json(response)
    }
    catch(e){
        return res.status(404).json({
            status  : "ERR" ,
            message : e.message 
        })
    }
}
const getOrderById = async ( req , res) => {
    try {
        const userid = req.user.id 
        const orderid = req.params.orderid 
        console.log("orderid" , req.params.orderid)
        if(!userid ) {
            return res.status(400).json({
                status: "ERR" ,
                message : "User not found "
            })
        }
        if(!orderid ) {
            return res.status(400).json({
                status: "ERR" ,
                message : "Order not found "
            })
        }
        const response = await OrderService.getOrderById( userid , orderid)
        return res.status(200).json(response)
    }
    catch(e) {
        return res.status(404).json({
            status  : "ERR" ,
            message : e.message
        })
    }
}
const cancelOrder = async (req , res ) => {
    try {
            const userid = req.user.id 
            const orderid = req.params.orderid
            if(!userid) {
                return res.status(400).json({
                    status : "ERR" ,
                    message : "User is not found"
                })
            }
            if(!orderid ) {
                return res.status(400).json({
                    status : "ERR",
                    message : "Order is not found"
                })
            }
            const response = await OrderService.cancelOrder(userid ,orderid )
            return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            status : "ERR" ,
             message : e.message 
        })
    }
}
const getAllOrders = async(req , res) => {
    try {
        const response = await OrderService.getAllOrders(req.query) 
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            status : "ERR" ,
            message :e.message 
        })
    }

}
const updateOrderStatus = async(req  , res ) => {
    try {
        const orderid = req.params.orderid
        const statusOrder = req.body.status
        if(!orderid) {
            return res.status(400).json({
                status : "ERR",
                message :"Order not found"
            })
        }
        const response = await OrderService.updateOrderStatus(orderid , statusOrder) 
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            status : "ERR",
            message : e.message
        })
    }
}
module.exports = { createOrder , createOrderFormCart ,GetMyOrder , getOrderById , cancelOrder , getAllOrders , updateOrderStatus}
