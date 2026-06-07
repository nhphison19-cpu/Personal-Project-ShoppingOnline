const CategoryService = require('../services/CategoryService')
const uuidRegex = /^[0-9a-fH]{8}-[0-9a-fH]{4}-[0-9a-fH]{4}-[0-9a-fH]{4}-[0-9a-fH]{12}$/i;

const createCategory = async(req, res) =>{ 
    try {
        const {name , image } = req.body 
        if(!name) {
            return res.status(400).json({
                status : "ERR" , 
                message : "The input name is required"
            })
        }
        const response = await CategoryService.createCategory(req.body) 
        return res.status(200).json(response)
    }
    catch(e){
        return res.status(401).json({
            status : "ERR" ,
            message : e
         })
    }
}
const updateCategory = async(req , res) => {
    try{
        const CategoryId = req.params.id 
        console.log("CategoryId" , CategoryId)
        const data = req.body 
        const uuidRegex = /^[0-9a-fH]{8}-[0-9a-fH]{4}-[0-9a-fH]{4}-[0-9a-fH]{4}-[0-9a-fH]{12}$/i;
        if(!CategoryId || !uuidRegex.test(CategoryId.trim())) {
            return res.status(400).json({
                status :"ERR",
                message : "Category ID not found "
            })
        }
        const response = await CategoryService.updateCategory(CategoryId , data) 
        if (response.status === "ERR" || response.status === "err") {
            return res.status(400).json(response);
        }
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            status : "ERR" ,
            message : e
        })
    }
}
const getDetailCategory = async (req , res) => {
    try{
        const CategoryID = req.params.id
        if(!CategoryID) {
            return res.status(401).json({
                status : "ERR" , 
                message : "Category Id not found"
            })
        }
        const response = await CategoryService.getDetailCategory(CategoryID) 
        return res.status(200).json(response)
    }catch (e) {
        return res.status(404).json({
            status : "ERR" , 
            message : e 
        })
    }
}
const getAll = async(req , res) => {
    try {
        const response = await CategoryService.getAll() 
        return res.status(200).json(response) 
    }
    catch(e) {
        return res.status(404).json({
            status : "ERR" ,
            message : e.message 
        })
    }
}
const deleteCategory = async (req , res) =>{
    try {
        const categoryId = req.params.id 
        if(!categoryId || !uuidRegex.test(categoryId.trim())) {
            return res.status(401).json({
                status : "ERR" ,
                message : "Id is not found"
            })
        }
        const response = await CategoryService.deleteCategory(categoryId) 
        return res.status(200).json(response) 
    }
    catch(e) {
        return res.status(404).json({
            status : "ERR" ,
            message : e.message 
        })
    }
}
module.exports = {
    createCategory , 
    updateCategory , 
    getDetailCategory , 
    getAll , 
    deleteCategory
}