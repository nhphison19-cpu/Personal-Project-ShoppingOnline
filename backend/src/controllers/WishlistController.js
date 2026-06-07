const WishlistService = require('../services/WishlistService')

const getWishList = async(req , res ) => {
    try { 
    const userid = req.user.id
    if(!userid ) {
        return res.status(400).json({
            status : "ERR",
            message : "User not found"
        })
    }
    const response = await WishlistService.getWishList(userid)
    return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            status : "ERR" ,
            message : e.message
         })
    }
}
const addToWishList = async(req , res) => {
    try {
        const userid = req.user.id 
        const productId = req.params.id 
        if(!userid) {
            return res.status(400).json({
                status : "ERR",
                message : "user is not found"
            })
        }
        if(!productId) {
            return res.status(400).json({
                status : "ERR" ,
                message : "Product is not found"
            })
        }
        const response = await WishlistService.addToWishList(userid , productId ) 
        return res.status(200).json(response)
        
    }catch(e){
        return res.status(404).json({
            status : "ERR" ,
            message : e.message
        })
    }
}
const deleteWish = async(req , res) => {
    try {
            const userid = req.user.id
            const productId = req.params.id
            if(!userid ) {
                return res.status(400).json({
                    status : "ERR" ,
                    message : "User is not found"
                })
            }
            if(!productId) {
                return res.status(400).json({
                    status : "ERR" ,
                    message : "product is not found"
                })
            }
            const response = await WishlistService.deleteWish(userid , productId) 
            return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            status : "ERR" ,
            message : e.message
        })
    }
}
module.exports = {getWishList , addToWishList , deleteWish}