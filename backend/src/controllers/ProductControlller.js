const ProductService = require('../services/ProductService')
const slugify = require('slugify')
const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/


const createProduct = async(req , res ) =>{
    const {name , description , price , stock , categoryId , brandId  } = req.body 
    try {
        if(!name || !description || !price || !stock ||!categoryId ||!brandId ) {
            return res.status(401).json({
                status : "ERR" ,
                message : "the input is not required"
            })
        }
        const response = await ProductService.createProduct(req.body)
        return res.status(200).json(response)
    }
    catch(e){
        return res.status(404).json({
            status : "ERR" ,
            message : e.message
        })
    }
}
const updateProduct = async (req, res) => {
    try {
        const IdProduct = req.params.id 
        const data = req.body 
        console.log("IdProduct" , IdProduct)
        if(!IdProduct ||!uuidRegex.test(IdProduct.trim())) {
            return res.status(401).json({
                status : "ERR" ,
                message : "id product is not found"
            })
        }
        const response = await ProductService.updateProduct(IdProduct , data )
        if(response.status == "ERR" || response.status == "err") {
            return res.status(400).json(response)
        }
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            status : "ERR" ,
            message : e.message 
        })
    }
}
const getdetailProduct = async(req , res) => {
    try {
        const IdProduct = req.params.id 
        if(!IdProduct){
            return res.status(401).json({
                status : "ERR" ,
                message : "id product is not found "
            })
        }
        const response = await ProductService.getdetailProduct(IdProduct) 
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            status : "ERR" ,
            message : e.message
        })
    }
}
const getall = async(req , res ) =>{
    try {
        const response = await ProductService.getall() 
        return res.status(200).json(response)
    }
    catch(e) {
        return res.status(404).json({
            status  : "ERR" ,
            message : e.message 
        })
    }
}
const deleteProduct = async(req , res) => {
    try{
        const idProduct = req.params.id 
        if(!idProduct ) {
            return res.status(401).json({
                status : "ERR" , 
                message  : "id is not found"
            })

        }
        const response = await ProductService.deleteProduct(idProduct) 
        return res.status(200).json(response)
    }
    catch(e) {
        return res.status(404).json({
            status : "ERR" ,
            message : e.message
        })
    }
}

module.exports = {createProduct ,updateProduct , getdetailProduct  , getall  , deleteProduct}