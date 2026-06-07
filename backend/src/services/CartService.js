const  prisma = require('../prisma/prismaClient')

const addCart = async( productId , quantity , userId ) => {
    return new Promise (async(resolve , reject ) => {
        try {
            const Product = await prisma.product.findUnique({
                where : { id : productId}
            })
            if(!Product){
                return resolve({
                    status  :"ERR" ,
                    message : "Product not found"
                })
            }
            if(Product.stock < quantity) {
                return resolve({
                    status : "ERR" ,
                    message : `Only ${product.stock} items left in stock` 
                })
            }
            let cart = await prisma.cart.findUnique({
                where : { userId  : userId }
            })
            if(!cart) {
                cart = await prisma.cart.create({
                    data : { userId : userId}
                })
            }
            const exitsedCartItems = await prisma.cartItem.findFirst({
                where : {
                    cartId : cart.id ,
                    productId : productId
                }
            })
            if(exitsedCartItems ) {
                const newQuantity = exitsedCartItems.quantity + parseInt(quantity) 
                if(Product.stock < newQuantity) {
                    return resolve({
                    status : "ERR" ,
                    message : `Only ${product.stock} items left in stock` 
                })
                }
                const updatedItem  = await prisma.cartItem.update({
                    where : { id : exitsedCartItems.id} ,
                    data : {quantity : newQuantity}
                })
                  return resolve({
                    status : "SUCCESS" ,
                    message : "update product to cart" ,
                    data : updatedItem
                })
            }else {
                const newItem = await prisma.cartItem.create({
                    data : {
                        cartId : cart.id ,
                        productId : productId ,
                        quantity : parseInt(quantity)
                    }
                })
                return resolve({
                    status : "SUCCESS" ,
                    message : "Add product to cart" ,
                    data : newItem
                })
            }

        }
        catch(e){
            reject(e)
        }
    })
}
const getCart = async(userid) => {
    return new Promise (async(resolve , reject ) =>{ 
        try {
            const cart = await prisma.cart.findUnique({
                where : {
                    userId : userid
                } ,
                include : {
                    items  : {
                        include :  {
                            product : true
                        }
                    }
                }
            })
            if(!cart) {
                return resolve({
                    status : "OK" ,
                    message :"Cart is empty" ,
                    data : {items : []}
                })
            }
            return resolve({
                status : "OK" , 
                data : cart 
            })
        }catch(e){
            return reject(e)
        }
    })
}
const deleteCartItem = async(idUser , itemId) => {
    return new Promise (async(resolve , reject) => {
        try {
            const cart = await prisma.cart.findUnique({
                where : {
                    userId : idUser
                }
            })
            if(!cart ) {
                return resolve({
                    status : "ERR" ,
                    message : "cart is not exists"
                })
            }
            await prisma.cartItem.deleteMany({
                where : {
                    cartId : cart.id ,
                    id : itemId
                }
            })
            return resolve({
                status : "OK" ,
                message : "SUCCESS DELETE"
            })
        
        }catch(e){
            reject(e)
        }
        
    })
} 
const clearCart = async(idUser) =>{
    return new Promise (async(resolve , reject ) =>{
        try {
        const cart = await prisma.cart.findUnique({
            where : {
                userId : idUser
            }
        })
        if(!cart ) {
            return resolve({
                status : "ERR" ,
                message: "Cart is not found"
            })
        }
        await prisma.cartItem.deleteMany({
            where :{
                cartId : cart.id
            }
        })
        return resolve({
            status : "OK" ,
            message : "SUCCESS clear cart "
        })
    }catch(e){
        return reject(e)
    }
    })
}
module.exports = { addCart , getCart  , deleteCartItem , clearCart}