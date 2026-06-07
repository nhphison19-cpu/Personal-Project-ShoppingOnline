const express = require("express");

const router = express.Router();
const {authMiddleware} = require('../middleware/authMiddleware')
const  {adminMiddleware} = require('../middleware/adminMiddleware')
const { createUser , loginUser , updateUser, deleteUser, getUser, getAll} = require("../controllers/UserController");

router.post('/sign-up', createUser);
router.post('/sign-in' , loginUser)
router.put('/update-user/:id'  , authMiddleware , updateUser)
router.delete('/delete/:id' ,authMiddleware , adminMiddleware ,  deleteUser )
router.get('/get-detail-user/:id' , authMiddleware , getUser)
router.get('/getall/' ,authMiddleware ,adminMiddleware ,getAll)

module.exports = router;