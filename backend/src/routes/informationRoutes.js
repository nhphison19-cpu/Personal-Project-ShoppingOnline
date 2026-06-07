const express = require('express')
const { authMiddleware } = require('../middleware/authMiddleware')
const { createInformation  ,  getInformation, getInformationById , updateInformation, DeleteInf} = require('../controllers/InfomationController')
const router = express.Router()

router.post('/create' , authMiddleware , createInformation)
router.get('/getall' , authMiddleware , getInformation)
router.get('/getById/:id' , authMiddleware , getInformationById)
router.put('/update/:id' , authMiddleware , updateInformation)
router.delete('/delete/:id' , authMiddleware , DeleteInf)






module.exports = router