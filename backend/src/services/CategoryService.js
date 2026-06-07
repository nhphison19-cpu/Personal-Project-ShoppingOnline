const prisma =  require('../prisma/prismaClient')
const slugify = require('slugify')

const createCategory = async (newCategory) => {
    return new Promise (async(resolve , reject ) => {
        const {name , image } = newCategory 
        try {
            if(!name) {
                return resolve({
                    status : "ERR" ,
                    message : "the name of category is required"
                })
            }
            const slug = slugify(name  , {lower : true  ,  strict : true })
            const checkSlug = await prisma.category.findUnique({
                where : {slug  : slug   }
            })
            if(checkSlug) {
                return resolve({
                    status : "ERR" ,
                    message : "The category slug is already exists"
                })
            }
            const createdCategory = await prisma.category.create({
                data : {name , slug , image} 
            })
            resolve ({
                status : "SUCCESS" ,
                message : "Create Success",
                data : createdCategory
            })
        }
        catch(e) {
            reject(e)
        }
    })
}
const updateCategory = async ( id , data ) => {
    return new Promise (async(resolve , reject ) =>  {
        try{
        const checkId = await prisma.category.findUnique({
            where : {id : id  }
        })
        console.log("check id" ,checkId )
        if(checkId == null) {
           return  resolve({
                status : "ERR" ,
                message : "category not found"
            })
        }
        const updateData = {} 
        if (data.image !== undefined && data.image.trim()!=="") {
                updateData.image  = data.image.trim()
            }
        if(data.name && data.name.trim() !== "") {
            const cleanName = data.name.trim()
            const newSlug = slugify(cleanName, {lower : true , strict : true} )
            const SlugDupcate = await prisma.category.findFirst({
                where: {slug : newSlug ,
                         id : {
                            not : id 
                         }
                } ,
               
            })
            if(SlugDupcate) {
               return  resolve({
                    status : "err" ,
                    message : "The new category name resulting in a duplicate slug"
                })
            }
            updateData.name = cleanName 
            updateData.slug = newSlug
        }
        if(Object.keys(updateData).length == 0 ) {
            return resolve({
                status : "OK" ,
                message: "SUCCESS" ,
                data : checkId 
            }
            )
        }
        const updatedCategory = await prisma.category.update({
            where : {id : id} ,
            data : updateData 
        })
        
        return resolve ({
            status : "OK" ,
            message : "Success update category" ,
            data : updatedCategory 
        })
        }catch(e) {
            return resolve({
                status: "ERR",
                message: "Prisma Update Error: " + e.message
            })
        }
    })
}
const getDetailCategory = async (id) => {
    return new Promise (async (resolve , reject ) => {
        try {
            const CheckId = await prisma.category.findUnique({
                where : {id : id }
            })
            if(CheckId == null ){
                return resolve ({
                    status : "ERR" ,
                    message : "Id category is not found"
                })
            }
            return resolve({
                status : "OK" ,
                message : "SUCCESS" ,
                data: CheckId
            })

        }catch(e) {
            return resolve({
                status: "ERR",
                message:  e.message
            })
        }
    })
}
const getAll =  async() => {
    return new Promise (async (resolve  , reject ) => { 
        try {
            const allCategory = await prisma.category.findMany()
            return resolve({
                status : "OK" ,
                message : "Success" , 
                data : allCategory 
            })  
        }
        catch(e) {
            reject(e)
        }
    })
}
const deleteCategory = async (id) => {
    return new Promise (async (resolve , reject ) => {
        try {
            const CheckID =  await prisma.category.findUnique({
                where : {id : id }
            })
            if(CheckID == null){
                return resolve ({
                    status : "ERR" ,
                    message : "Category is not found"
                })
            }
            await prisma.category.delete({
                where : {id : id}
            }) 
            resolve({
                status : "OK" ,
                message : "SUCCESS DELETE CATEGORY"
            })
        }catch (e) {
            return resolve({
                status: "ERR",
                message: "Prisma Delete Error: " + e.message
            })
        }
    })
}
module.exports = {createCategory , updateCategory , getDetailCategory , 
    getAll , deleteCategory
}