const InformationService = require('../services/InfomationService')

const createInformation = async(req , res ) => {
    try {
        const {fullName , phone , city , district , ward , detail } = req.body
        const userid = req.user.id 
        if(!userid ) {
            return res.status(400).json({
                status :"ERR" ,
                message : "User is not found"
            })
        }
        if(!fullName || !phone || !city || !district || !ward || !detail) {
            return res.status(400).json({
                status : "ERR" ,
                message : "input is required"
            })
        }
        const response = await InformationService.createInformation(userid , req.body )
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            status : "ERR" ,
            message : e.message
        })
    }
}
const getInformation = async(req , res ) => {
    try {
        const userid = req.user.id
        const all = await InformationService.getInformation(userid) 
        return res.status(200).json(all)
    }catch(e) {
        return res.status(404).json({
            status : "ERR" ,
            message : e.message
        })
    }
}
const getInformationById = async(req , res ) => {
    try {
        const userid = req.user.id 
        const informationID = req.params.id
        if(!userid) {
            return res.status(400).json({
                status : "ERR" ,
                message :"User id is not found"
            })
        }
         if(!informationID) {
            return res.status(400).json({
                status : "ERR" ,
                message :"information id is not found"
            })
        }
        const response = await InformationService.getInformationById(userid , informationID)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            status : "ERR" ,
            message :e.message
        })
    }
}
const updateInformation = async(req , res ) =>{
    try {
            const userid = req.user.id
            const idInf = req.params.id
            const {fullName , phone , city , district , ward , detail } = req.body

            if(!userid) {
                return res.status(400).json({
                    status:"ERR",
                    message: "User id is not found"
                })
            }
            if(!idInf) {
                 return res.status(400).json({
                    status:"ERR",
                    message: "Information id is not found"
                })
            }
            const response = await InformationService.updateInformation(userid , idInf , req.body)
            return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            status :"ERR",
            message : e.message
        })
    }
}
const DeleteInf = async(req , res ) =>{
    try {
            const userid = req.user.id
            const idInf = req.params.id

            if(!userid) {
                return res.status(400).json({
                    status:"ERR",
                    message: "User id is not found"
                })
            }
            if(!idInf) {
                 return res.status(400).json({
                    status:"ERR",
                    message: "Information id is not found"
                })
            }
            const response = await InformationService.DeleteInf(userid , idInf )
            return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            status :"ERR",
            message : e.message
        })
    }
}
module.exports = {createInformation , getInformation , getInformationById , updateInformation , DeleteInf}