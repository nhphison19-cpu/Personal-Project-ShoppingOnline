const express = require('express') 
const { addCart, getCart, deleteCartItem, clearCart } = require('../controllers/CartController')
const router = express.Router() 
const {authMiddleware} = require('../middleware/authMiddleware')
 
router.post('/add' ,authMiddleware ,  addCart)
router.get('/get' ,authMiddleware ,  getCart)
router.delete('/delete/:id' , authMiddleware,deleteCartItem)
router.delete('/clear' , authMiddleware,clearCart)


module.exports = router