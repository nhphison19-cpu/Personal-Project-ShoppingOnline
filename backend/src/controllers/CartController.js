const CartService = require('../services/CartService')
const uuidRegex = /^[0-9a-fH]{8}-[0-9a-fH]{4}-[0-9a-fH]{4}-[0-9a-fH]{4}-[0-9a-fH]{12}$/i


const addCart = async(req , res) =>{
    try {
        const {productId , quantity} = req.body 
        const userId =  req.user.id

        if(!productId || !quantity) {
            return res.status(401).json({
                status : "ERR" , 
                message : "missing required fields (productId , quantity)"
            })
        }
        const response = await CartService.addCart(productId , quantity , userId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            status : "ERR" ,
            message : e.message
        })
    }
} 
const getCart  = async (req, res) =>{
    try {
        const userid = req.user.id 
        if(!userid) {
            return res.status(401).json({
                status : "ERR" ,
                message : "UserId is required"
            })
        }
        const response = await CartService.getCart(userid)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            status: "ERR" ,
            message : e.message 
        })
    }
}
const deleteCartItem = async(req , res) =>{
    try {
        const userid = req.user.id
        if(!userid) {
            return res.status(401).json({
                status : "ERR" ,
                message : "id is not found"
            })
        }
        const itemId = req.params.id
        if(!itemId) {
            return res.status(401).json({
                status : "ERR" ,
                message : "id is not found"
            })
        }
        const response = await CartService.deleteCartItem(userid , itemId)
        return res.status(200).json(response)
    }
    catch(e){
        return res.status(404).json({
            status  :"ERR" ,
            message : e.message
        })
    }
}
const clearCart = async(req, res) =>{
    try {
        const userId = req.user.id 
        if(!userId) {
            return res.status(401).json({
                status : "ERR" ,
                message : "Auth"
            })
        }
        const response = await CartService.clearCart(userId)
        return res.status(200).json(response)
    }
    catch(e){
        return res.status(404).json({
            status : "ERR" ,
            message : e.message 
        })
    }
}
module.exports = {
    addCart , 
    getCart ,
    deleteCartItem ,
    clearCart
}