const expess = require('express')
const { getWishList ,addToWishList, deleteWish} = require('../controllers/WishlistController')
const {authMiddleware} = require('../middleware/authMiddleware')
const router = expess.Router()

router.get('/getWishList' , authMiddleware,getWishList)
router.post('/create/:id' , authMiddleware,addToWishList)
router.delete('/delete/:id' , authMiddleware, deleteWish)



module.exports = router 