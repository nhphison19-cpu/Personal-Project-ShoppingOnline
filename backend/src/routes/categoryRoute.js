const express = require('express')
const router = express.Router()

const { createCategory  , updateCategory , getDetailCategory , getAll ,deleteCategory} = require("../controllers/CategoryController")
router.post('/create' , createCategory) 
router.put('/update/:id' , updateCategory)
router.get('/getCategory/:id' , getDetailCategory)
router.get('/getall' , getAll)
router.delete('/delete/:id' , deleteCategory)



module.exports = router