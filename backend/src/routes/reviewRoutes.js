const express = require('express')
const { authMiddleware } = require('../middleware/authMiddleware')
const { createReview, getReviewProduct, updateReview, deleteReview } = require('../controllers/ReviewController')
const router = express.Router()

router.post('/create/:productId' ,authMiddleware , createReview)
router.get('/getReview/:productId'  , getReviewProduct)
router.put('/update/:id'  , authMiddleware,  updateReview)
router.delete('/delete/:id'  , authMiddleware,  deleteReview)



module.exports = router