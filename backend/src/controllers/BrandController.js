const BrandService = require('../services/BrandService')
const uuidRegex = /^[0-9a-fH]{8}-[0-9a-fH]{4}-[0-9a-fH]{4}-[0-9a-fH]{4}-[0-9a-fH]{12}$/i 


const createBrand = async (req , res) => {
    const {name , logo } = req.body 
    try {
        if(!name || !logo) {
            return res.status(401).json({
                status : "ERR" , 
                message : "the input is required "
            })
        }
        const response = await BrandService.createBrand(req.body)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            status : "ERR" ,
            message : e.message
        })
    }
}
const updateBrand = async(req , res ) => {
    try {
        const idBrand = req.params.id 
        console.log("idBrand" , idBrand)
        const data = req.body

        if(!idBrand) {
            return res.status(401).json({
                status: "ERR" ,
                message : "id Brand not found"
            })
        }
        const response = await BrandService.updateBrand(idBrand , data)
        return res.status(200).json(response)
    }
    catch(e){
        return res.status(404).json({
            status :"ERR" , 
            message : e.message 
        })
    }
}
const deleteBrand =  async (req , res) => {
    try {
        const idBrand = req.params.id
        if(!idBrand ||!uuidRegex.test(idBrand.trim()) ){
            res.status(401).json({
                status : "ERR" ,
                message : ""
            })
        }
        const response = await BrandService.deleteBrand(idBrand)
        return res.status(200).json(response)
     }catch(e){
        return res.status(404).json({
            status : "ERR" , 
            message : e.message
        })
     }
}
const getdetailBrand = async(req , res ) => {
    try {
        const idBrand = req.params.id
        if(!idBrand || !uuidRegex.test(idBrand.trim())) {
            return res.status(401).json({
                status : "ERR" ,
                message : "id brand is not found"
            })
        }
        const response = await BrandService.getdetailBrand(idBrand)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            status :"ERR" ,
            message : e.message
        })
    }
}
const getall = async(req, res)=>{
    try {
        const response = await BrandService.getall() 
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
    createBrand ,
    updateBrand ,
    deleteBrand ,
    getdetailBrand ,
    getall
}