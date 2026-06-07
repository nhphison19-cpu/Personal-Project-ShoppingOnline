const prisma = require('../prisma/prismaClient')

const createInformation = async(userid , data ) =>{
    return new Promise(async(resolve , reject ) =>{ 
        try {
            const {fullName , phone , city , district , ward , detail } = data
            const checkid = await prisma.user.findUnique({
                where : {
                    id : userid 
                }
            })
            if(!checkid ) {
                return resolve({
                    status : "ERR" ,
                    message : "User is not found"
                })
            }
            const createdInformation = await prisma.address.create({
               
                data : {
                    userId : userid ,
                    fullName ,
                    phone ,
                    city ,
                    district ,
                    ward ,
                    detail ,
                }
                
                
            })
            return resolve({
                status : "OK" ,
                message : "SUCCESS" ,
                data  : createdInformation
            })
        }catch(e){
            return reject(e)
        }
    })
}
const getInformation = async(userid) => {
    return new Promise(async(resolve , reject )=> {
        try {
            const getall = await  prisma.address.findMany({
                where : { 
                    userId : userid
                }
            })
            return resolve({
                status : "ok" ,
                message :"SUCCESS",
                data: getall
            })
        }catch(e) {
            return reject(e)
        }
    })
}
const getInformationById = async(userid , informationId) =>{
    return new Promise(async(resolve , reject ) => {
       try {
 const checkId = await prisma.user.findUnique({
            where : {
                id : userid
            }
        })
        if(!checkId ) {
            return resolve({
                status : "ERR" ,
                message : "User is not found"
            })
        }
        const checkInformation = await prisma.address.findUnique({
            where : {
                id : informationId
            }
        })
        if(!checkInformation ) {
            return resolve({
                status : "ERR" ,
                message : "information is not found"
            })
        }
        const data = await prisma.address.findFirst({
            where : { 
                id : informationId  ,
                userId : userid
            } 
        })
        return resolve({
            status : "OK",
            message :"SUCCESS",
            data :data
        })
       }catch(e){
        return reject(e)
       }
    })
}
const updateInformation = async(userid , informationId , data) => {
    return new Promise(async(resolve , reject)=> {
        try {
            const {fullName , phone , city , district , ward , detail } = data
            const checkidUser = await prisma.user.findUnique({
                where : {
                    id : userid
                }
            })
            const checkIdInf = await prisma.address.findUnique({
                where : {
                    id : informationId
                }
            })
            if(checkidUser == null) {
                return resolve({
                    status : "ERR" ,
                    message :"User id is not found"
                })
            }
             if(checkIdInf == null) {
                return resolve({
                    status : "ERR" ,
                    message :"information id is not found"
                })
            }
            if (checkIdInf.userId !== userid) {
                return resolve({
                    status: "ERR",
                    message: "You do not have permission to update this information"
                })
            }
            const updateData = {}
            if (fullName) {
                updateData.fullName = fullName
            }
            if (phone) { 
                updateData.phone = phone
            }
            if (city) {
                updateData.city = city
            }
            if (district) {
                updateData.district = district
            }
            if (ward) { updateData.ward = ward
            }
            if (detail) {
                updateData.detail = detail
            }
            if(Object.keys(updateData).length == 0 )
                 {
            return resolve({
                status : "OK" ,
                message: "SUCCESS" ,
                data : checkIdInf 
             })
            }
            const updatedInf = await prisma.address.update({
                where :{
                    id : informationId 
                } ,
                data : updateData
            })
             return resolve({
                status : "OK" ,
                message: "SUCCESS" ,
                data : updatedInf 
            })       
        }catch(e){
            return reject(e)
        }
    })
}
const DeleteInf = async(userid , idInf) => {
    return new Promise(async(resolve , reject )=> {
        try {
             const checkidUser = await prisma.user.findUnique({
                where : {
                    id : userid
                }
            })
            const checkIdInf = await prisma.address.findUnique({
                where : {
                    id : idInf
                }
            })
            if(checkidUser == null) {
                return resolve({
                    status : "ERR" ,
                    message :"User id is not found"
                })
            }
             if(checkIdInf == null) {
                return resolve({
                    status : "ERR" ,
                    message :"information id is not found"
                })
            }
            if (checkIdInf.userId !== userid) {
                return resolve({
                    status: "ERR",
                    message: "You do not have permission to update this information"
                })
            }
            await prisma.address.delete({
                where : {
                    id : idInf
                }
            })
            return resolve({
                status : "ok" ,
                message :"SUCCESS Delete"
               
            })
        }catch(e) {
            return reject(e)
        }
    })
}
module.exports = {createInformation , getInformation , getInformationById , updateInformation , DeleteInf}