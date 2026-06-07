const prisma = require('../prisma/prismaClient')
const bcrypt  = require('bcryptjs')
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService')

const createUser = async(newUser) => {
   try {
    const {name , email , password ,role} = newUser 
    const existsingEmail = await prisma.user.findUnique({
        where : {
            email 
        }
    })
    if(existsingEmail) {
        return {
        status: "ERROR",
        message: "Email already exists",
      };
    }
    const HashPassword = await bcrypt.hashSync(password , 10 ) 

    const user  = await prisma.User.create({
        data : {
        name , email , password : HashPassword , role
        }
    })
        const { password : _ , ...userData} = user 

        return {
            status: "SUCCESS" , 
            message: "create user success " ,
            data : userData 
        }
   }
   catch(e) {
        throw new Error(e.message)
   }
}
const loginUser = (UserLogin) => {
    return new Promise (async (resolve , reject) => {
        const {email , password } = UserLogin 
        try{
            const checkUser = await prisma.User.findUnique({
                where : {email : email}  
            })
            if(checkUser == null) {
                resolve({
                    status : 'OK' ,
                    message : 'the user is not defined'
                })

            }
            const comparePass = bcrypt.compareSync(password , checkUser.password ) 
            console.log('compare password ' , comparePass ) 
            if(!comparePass) {
                resolve({
                    status : 'ERR' ,
                    message : 'the password is incorrect'
                })
            }
            const isAdmin =  checkUser.role === 'ADMIN' 
            const access_token = await genneralAccessToken({
                id : checkUser.id ,
                role : checkUser.role
            })
            const refresh_token = await genneralRefreshToken ({
                id : checkUser.id ,
                role : checkUser.role
            })
            
                resolve({
                    status : "OK" , 
                    message : "SUCCESS",
                    access_token , 
                    refresh_token   ,
                    data : UserLogin
                })
        } 
        catch(e) {
            reject(e)
        }
    })
}
const updateUser = async (id , data ) => {
    return new Promise (async(resolve , reject ) => {
        try {
           
            const CheckID = await prisma.user.findUnique({
                where : { 
                    id : id
                } 
            })
            if(CheckID == null ) {
                return resolve({
                    status : "The user is not defined" , 
                    message : "User not found"
                })
            }
            const updatedUser = await prisma.user.update({
                where : {id : id } ,
                data : data 
            })
            resolve({
                status : "SUCCESS" ,
                message : "SUCCESS" ,
                data : updatedUser
            })
        }
        catch(e) {
            reject(e)
        }
    })

    
}
const deleteUser = async (id) => {
    return new Promise (async (resolve , reject) => {
        try {
            const CheckID = await prisma.user.findUnique({
                where : {id : id}
            })
            if(CheckID == null) {
                resolve({
                 status : "The user is not defined" , 
                    message : "User not found"

                })
            }
            await prisma.user.delete({
                where : {id : id}
            })
             resolve({
                status : "SUCCESS" ,
                message : "DELETE SUCCESS" 
                
            })
        }catch(e) {
            reject(e) 
        }
    })
}
const getUser = async (id) => { 
    return new Promise (async(resolve , reject) => {
        try {
            const CheckID = await prisma.user.findUnique({
                where  : {id : id} 
            })
            if(CheckID === null) {
                resolve({
                    status: "ERR" , 
                    message :  "User id not defined"
                })

            }
            resolve ({
                status : "OK" ,
                message : "SUCCESS" , 
                data: CheckID 
        }) 

        }catch(e){
            reject(e)
        }
    })
}
const getAll = async () => {
    return new Promise(async (resolve , reject ) => {
        try {
            const allUser = await prisma.user.findMany()
            resolve({
                status : "OK" , 
                message  : "SUCCESS" ,
                data : allUser
            })
        }
        catch(e) {
            reject (e)
        }
    })
}
module.exports = {
    createUser ,
    loginUser , 
    updateUser , 
    deleteUser , 
    getUser ,
    getAll
}
