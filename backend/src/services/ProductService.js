const prisma = require('../prisma/prismaClient')
const slugify = require('slugify')

const createProduct = async(newProduct) => {
    return new Promise (async(resolve , reject ) =>{
        const {name , description , price , stock , categoryId , brandId , discountPrice , images} = newProduct
        try {
            const slug = slugify(name , {lower : true , strict : true })
            const checkSlug = await prisma.product.findFirst({
                where : { slug : slug}
            })
            if(checkSlug){
                return resolve({
                    status : "ERR" ,
                    message : "The product slug is already exists"
                })
            }
            const createdProduct = await prisma.product.create({
                data : {
                     name ,
                     description , 
                     price : parseFloat(price), 
                     discountPrice : discountPrice ? parseFloat(discountPrice) : null, 
                     stock : parseInt(stock), 
                     categoryId , 
                     brandId  ,
                     slug , 
                     images : {
                        create :images ? images.map(url => ({url})) : []
                     }
                    },
                    include : {images : true}
            })
            return resolve({
                status :"OK" ,
                message : "SUCCESS" ,
                data : createdProduct
            })
        }
        catch(e){
            reject(e)
        }
    })
}
const updateProduct = async(id , data) => {
    return new Promise (async(resolve , reject ) =>{
        try {
            const CheckId = await prisma.product.findUnique({
                where : {id : id}
            })
            if(CheckId == null){
                return resolve({
                    status :"ERR" ,
                    message : "Product is not found"
                })
            }
           const {name , description , price , stock , categoryId , brandId , discountPrice , images} = data
            const updateData = {}
            if(name) {
                updateData.name = name
                updateData.slug = slugify(name , {lower : true , strict : true })
            }
            if(description) {
                updateData.description = description
            }
            if(price !== undefined) {
                updateData.price = parseFloat(price)
            }
            if(stock !== undefined)  {
                updateData.stock = parseInt(stock)
            }
            if(categoryId){
                updateData.categoryId = categoryId
            }
            if(brandId) {
                updateData.brandId = brandId
            }
            if(discountPrice !== undefined) {
                updateData.discountPrice = discountPrice ? parseFloat(discountPrice) : null
            }
            if(images){
                await prisma.productImage.deleteMany({
                    where : { productId : id}
                })
                updateData.images = {
                    create : images.map(url => ({ url }))
                }
            }
            const updatedProduct = await prisma.product.update({
                where : {id : id} ,
                data : updateData ,
                include :{ images : true}
            })
            return resolve({
                status : "Ok",
                message : "SUCCESS" ,
                data : updatedProduct
            })
        }catch(e) {
            return reject(e)
        }
    })
}
const getdetailProduct = async (id ) => {
    return new Promise (async(resolve    , reject ) =>{
        try {
        const checkId = await prisma.product.findUnique({
            where : {
                id :id 
            }
        })
        if(checkId ==  null){
            return resolve({
                status : "ERR" ,
                message : "product is not found"
            })
        }
        return resolve({
            status : "ok" ,
            message: "Success" ,
            data : checkId  
        })
    }catch(e){
        reject(e)
    }

    }) 
}
const getall = async() => {
    return new Promise (async(resolve , reject ) =>{
        try {
            const data = await prisma.product.findMany({
                include : {
                    images : true , 
                    brand : true ,
                    category : true
                }
            })
            return resolve({
                status :"OK" ,
                message : "SUCCESS" , 
                data : data
            })
        }catch(e) {
            reject(e)
        }
    })
}
const deleteProduct = async(id) => {
    return new Promise (async (resolve , reject ) => {
        try {
        const checkId = await prisma.product.findUnique({
            where : {id : id }
        })
        if(checkId == null) {
            return resolve({
                status : "ERR" ,
                message  : "Id product is not found"
            })

        }
        await prisma.product.delete({
            where : { id : id }
        })
        return resolve({
            status : "Ok", 
            message : "SUCCESS Delete product" 
        })
    }
    catch (e) {
        return reject(e)
    }
    })
}
module.exports = {createProduct , updateProduct ,getdetailProduct , getall , deleteProduct}