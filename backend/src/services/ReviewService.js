const prisma = require('../prisma/prismaClient')

const createReview = async(userid , data , productid) => {
    return new Promise (async(resolve , reject) => {
        try {
            const {rate , comment} = data 
            if(!rate || !comment ) {
                return resolve({
                    status : "ERR" ,
                    message : "The inpuut is required"
                })
            }
            const checkId = await  prisma.user.findUnique({
                where : { 
                    id : userid 
                }
            })
            const checkProductId = await  prisma.product.findUnique({
                where : { 
                    id : productid 
                }
            })
             if(checkProductId == null){
                return resolve({
                    status : "ERR" ,
                    message : "Product is not found"
                })
            }
            if(checkId == null){
                return resolve({
                    status : "ERR" ,
                    message : "USer is not found"
                })
            }
            const createdReview = await prisma.review.create({
                data : {
                    userId : userid ,
                    productId : productid ,
                    rating : Number(rate) ,
                    comment : comment
                }
            })
            return resolve({
                status : "OK" ,
                message :"SUCCESS Create",
                data : createdReview
            })
        }
        catch(e) {
            return reject(e)
        }
    })
}
const getReviewProduct = async(productId) => {
    return new Promise (async(resolve , reject ) => {
        try {
            const checkProduct = await prisma.product.findUnique({
                where : {
                    id : productId 
                }
            })
            if(checkProduct === null){
                return resolve({
                    status : "ERR",
                    message :"Product is not found"
                })
            }
            const dataReview = await prisma.review.findMany({
                where : {
                    productId : productId
                } ,
                include : {
                    user : { select  : { name :true ,  email : true}}
                }
            })
            return resolve({
                status : "OK",
                message :"SUCCESS" ,
                data : dataReview
            })
        }catch(e) {
            return reject(e)
        }
    })
}
const updateReview = async(userid , data , reviewId) => {
    return new Promise(async(resolve , reject ) => {
        try {
            const checkId = await prisma.user.findUnique({
                where : { id : userid }
            })
            const checkReview = await prisma.review.findFirst({
                where : { id : reviewId }
            })
            if(checkId == null){
                return resolve({
                    status : "ERR" ,
                    message : "User is not found"
                })
            }
            if(checkReview == null){
                return resolve({
                    status : "ERR" ,
                    message : "Review is not found"
                })
            }
            
            const  {rate  , comment} = data 
            const updatedData = {}
            if(rate !== undefined) {
                updatedData.rating = Number(rate)
            }
            if(comment !== undefined ) {
                updatedData.comment = comment
            }
            const updatedReview = await prisma.review.update({
                where : { id : reviewId } , 
                data : updatedData
            })
            return resolve({
                status : "OK",
                message : "UPDATE SUCCESS" ,
                data :updatedReview
            })
        }catch(e) {
            return reject(e)
        }
    })
}
const deleteReview = async(userid , reviewid) => {
    return new Promise (async(resolve , reject ) => {
        try {
            const checkuser = await prisma.user.findUnique({
                where : {id  :userid }
            })
            const checkReview = await prisma.review.findUnique({
                where : {id  :reviewid }
            })
            if(checkuser == null) {
                return resolve({
                    status :"ERR" ,
                    message : "User is not found"
                })
            }
            if(checkReview == null) {
                return resolve({
                    status :"ERR" ,
                    message : "review   is not found"
                })
            } 
           let deleteConditinon = {id : reviewid}

           if(checkuser.role == "ADMIN" ) {
                if(checkReview.userId !== userid ){
                    return resolve({
                        status : "ERR" ,
                        message : "you do not have permission to delete this review"
                    })
                }
                deleteConditinon.userId = userid
           }
          await prisma.review.delete({
            where : deleteConditinon
          })
          return resolve({
            status: "OK",
            message: "DELETE SUCCESS"
        })
        }catch(e){
            return reject(e)
        }
    })
}
module.exports = {createReview , getReviewProduct , updateReview , deleteReview}