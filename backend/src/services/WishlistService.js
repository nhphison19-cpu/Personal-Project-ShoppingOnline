const prisma = require('../prisma/prismaClient')

const getWishList = async(userid) => {
    return new Promise(async (resolve , reject ) => {
        try {
            const checkid = await prisma.user.findUnique({
                where : {
                    id: userid 
                }
            })
            if(checkid === null) {
                return resolve({
                    status : "ERR" ,
                    message : "User not found"
                })
            }
            const getWishList = await prisma.wishlist.findMany({
                where : { userId : userid } ,
                include : {
                    product : {
                        include : {
                            images : true 
                        }
                    }
                }
            })

            return resolve({
                status : "OK",
                message : "SUCCESS" ,
                data : getWishList
            })

        }catch(e) {
            return reject(e)
        }
    })
}
const addToWishList = async(userid , productid ) => {
    return new Promise(async(resolve , reject) => {
        try {
            const checkUser = await prisma.user.findUnique({
                where : {
                    id : userid
                }
            })
            if(checkUser === null) {
                return resolve({
                    status : "ERR",
                    message : "USER IS NOT FOUND"
                })
            }
            const checkProduct = await prisma.product.findUnique({
                where : {
                    id : productid 
                }
            })
            if(checkProduct === null) {
                return resolve({
                    status : "ERR" ,
                    message : "Product is not found"
                })
            }
            const createdWish = await prisma.wishlist.create({
               data : {
                userId  : userid  ,
                productId : productid 
               }
            })
            return resolve({
                status : "OK",
                message: "SUCCESS CREATED WISH" ,
                data :createdWish
            })
        }catch(e) {
            return reject(e)
        }
    })
}
const deleteWish = async(userid , productId) => {
    return new Promise(async (resolve , reject ) => {
        try {
            const checkid = await prisma.user.findUnique({
                where : {id : userid}
            })
            if(checkid== null){
                return resolve({
                    status : "ERR" ,
                    message :"user is not found"
                })
            }
            const checkproductId  = await prisma.product.findUnique({
                where : {id : productId }
            })
            if(checkproductId === null ){
                return resolve({
                    status : "ERR" ,
                    message : "product is not found"
                })
            }
           const currentWish = await prisma.wishlist.findFirst({
            where : {
              
                    userId : userid , 
                    productId : productId
                
                
            }
           })
           if(!currentWish) 
           {
            return resolve({
                    status: "ERR",
                    message: "This product is not in your wishlist"
                })
           }
            await prisma.wishlist.delete({
                where : {   
                        id : currentWish.id
                }
            })
            return resolve({
                status : "OK" ,
                message : "SUCCESS DELETE"
            })
        }catch(e){
            return reject(e)
        }
    })
}
module.exports = {getWishList  , addToWishList , deleteWish}