const express = require('express')
const { createBrand ,updateBrand, deleteBrand, getdetailBrand, getall} = require('../controllers/BrandController')
const router = express.Router()

router.post('/create' , createBrand)
router.put('/update/:id' , updateBrand)
router.delete('/delete/:id' , deleteBrand)
router.get('/getdetail/:id' , getdetailBrand)
router.get('/getall' , getall)



module.exports = router 