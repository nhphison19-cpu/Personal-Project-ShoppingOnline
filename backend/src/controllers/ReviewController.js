const ReviewService = require('../services/ReviewService')

const createReview = async(req , res) => {
    try {
        const  {rate , comment } = req.body
        if(!rate ||!comment) {
            return res.status(400).json({
                status: "ERR",
                message : "the input is required"
            })
        }
        const userid = req.user.id 
        const productId = req.params.productId
        if(!userid) {
              return res.status(400).json({
                status: "ERR",
                message : "User is not found"
            })
        }
        console.log("productId" , productId)
        if(!productId) {
              return res.status(400).json({
                status: "ERR",
                message : "Product is not found"
            })
        }
        const response = await ReviewService.createReview( userid, {rate , comment} , productId)
        return res.status(200).json(response)
    }catch(e) {
      return res.status(404).json({
                status: "ERR",
                message : e.message
            })
    }
}
const getReviewProduct = async(req , res) => {
    try {
        const Productid = req.params.productId
        if(!Productid) {
            return res.status(400).json({
                status : "ERR" ,
                message :"Product is not found"
            })
        }
        const response = await  ReviewService.getReviewProduct(Productid)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            status : "ERR" ,
            message : e.message
        })
    }
}
const updateReview = async(req , res) => {
    try {
        const  {rate , comment } = req.body
        if(!rate ||!comment) {
            return res.status(400).json({
                status: "ERR",
                message : "the input is required"
            })
        }
        const userid = req.user.id 
        const reviewId = req.params.id
        if(!userid) {
              return res.status(400).json({
                status: "ERR",
                message : "User is not found"
            })
        }
        if(!reviewId) {
              return res.status(400).json({
                status: "ERR",
                message : "review is not found"
            })
        }
        const response = await ReviewService.updateReview( userid, {rate , comment} , reviewId)
        return res.status(200).json(response)
    }catch(e) {
      return res.status(404).json({
                status: "ERR",
                message : e.message
            })
    }
}
const deleteReview = async(req , res) => {
    try {
        const userid = req.user.id 
        const reviewid = req.params.id
        if(!userid ) {
            return res.status(400).json({
                status : "ERR" ,
                message :"User is not found"
            })
        }
        if(!reviewid ) {
            return res.status(400).json({
                status : "ERR" ,
                message :"Review is not found"
            })
        }
        const response = await ReviewService.deleteReview(userid , reviewid)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            status : "ERR" ,
            message : e.message
        })
    }
}
module.exports = {createReview , getReviewProduct , updateReview , deleteReview}