const express    = require('express')
const {authMiddleware} = require('../middleware/authMiddleware')
const {adminMiddleware} = require('../middleware/adminMiddleware')

const { createProduct, updateProduct, getdetailProduct ,getall, deleteProduct } = require('../controllers/ProductControlller')
const router = express.Router()

router.post('/create' , authMiddleware , adminMiddleware ,createProduct) 
router.put('/update/:id' , authMiddleware , adminMiddleware ,updateProduct) 
router.get('/getdetail/:id' , getdetailProduct) 
router.get('/getall' , getall) 
router.delete('/delete/:id' , authMiddleware , adminMiddleware ,deleteProduct) 





module.exports = router