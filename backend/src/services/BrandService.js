const prisma = require('../prisma/prismaClient')

const createBrand = async(newBrand) =>{
    return new Promise (async(resolve , reject) =>{ 
        const {name , logo } = newBrand 
        try {
            if(!name || name.trim() == ""){
                return resolve({
                    status : "ERR" , 
                    message : "The name of brand is required"
                })
            }
            const cleanname = name.trim()
            const CheckNameExists = await prisma.brand.findFirst({
                where : {
                    name : {
                        equals :  cleanname ,
                        //bỏ qua chữ cái hoa thường
                        mode : 'insensitive'
                    }
                }
            })
            if(CheckNameExists) {
                 return resolve({
                    status : "ERR" , 
                    message : "The name of brand is exists"
                })
            }

            const createdBrand = await prisma.brand.create({
                data : {
                    name : name.trim() ,
                    logo : logo  ? logo.trim() : null 
                }
            })
            resolve ({
                status : "OK" ,
                message : "SUCCESS" ,
                data : createdBrand
            })
        }catch(e) {
            return resolve({
                status: "ERR",
                message: "Prisma Create Brand Error: " + e.message
            })
        }
    })
}

const updateBrand = async(id ,data ) => {
    return new Promise (async(resolve , reject ) => {
        try {
            const CheckId = await prisma.brand.findUnique({
                where: {id : id}
            })
            if(CheckId == null) {
                return resolve({
                    status : "ERR" ,
                    message : "id is not found"
                })
            }
            const updateData = {}
            if(data.logo !== undefined && data.logo.trim() !=="" && data.logo !== null){
                    updateData.logo = data.logo.trim()
            }
            if(data.name && data.name.trim() !== "") {
                const cleanname = data.name.trim()
                const NameDuplicate = await prisma.brand.findFirst({
                    where : {
                        name : {
                            equals : cleanname ,
                            mode : 'insensitive'
                        },
                        id : {
                            not : id
                        }

                    }
                })
                if(NameDuplicate){
                    return resolve({
                        status : "ERR" ,
                        message : "The new brand name already exists"
                    })
                }
                updateData.name =  cleanname 
            }
            if(Object.keys(updateData).length === 0 ){
                return resolve({
                    status : "OK" ,
                    message : "SUCCESS" ,
                    data: CheckId 
                })
            }
            const updatedBrand = await prisma.brand.update({
                where : {id : id} ,
                data : updateData
            })
            return resolve({
                status: "OK",
                message: "Success update brand",
                data: updatedBrand
            })

        } catch(e) {
            return resolve({
                status: "ERR",
                message: "Prisma Update Brand Error: " + e.message
            })
        } 
    })
}
const deleteBrand = async(id) => {
    return new Promise (async(resolve , reject ) => {
        try {
            const checkId = await prisma.brand.findUnique({
                where:  {id : id }
            })
            if(checkId == null) {
               return  resolve({
                    status : "ERR" , 
                    message : "brand is not found"
                })
            }
            await prisma.brand.delete({
                where : {id : id }
            })
            return  resolve({
                    status : "OK" , 
                    message : "SUCCESS DELETE BRAND"
                })
        }catch (e) {
            reject (e)
        }

    })
}
const getdetailBrand = async(id) =>{
    return new Promise (async(resolve , reject ) =>{ 
        try {
            const checkId = await prisma.brand.findUnique({
                where : {id : id }
            })
            if(checkId == null) {
                return resolve({
                    status : "ERR" ,
                    message : "Brand is not found"
                })
            }
             return resolve({
                    status : "OK" ,
                    message : "SUCCESS" ,
                    data: checkId 
                })   
        }catch(e) {
            reject (e)
        }
    })
}
const getall = async() =>{
    return new Promise (async(resolve , reject ) => {
        try {
            const all = await prisma.brand.findMany()
            return resolve({
                status : "OK" ,
                message : "SUCCESS" ,
                data : all
            })
        }catch(e){
            return reject (e)
        }
    })
}
module.exports = {
    createBrand , 
    updateBrand , 
    deleteBrand , 
    getdetailBrand ,
    getall
}