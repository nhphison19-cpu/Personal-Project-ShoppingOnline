const prisma= require('../prisma/prismaClient')

const createOrder = async(userid , orderData ) =>{
    try {

    const {paymentMethod , shippingAddress , items } = orderData
    return new Promise (async(resolve , reject) =>{
        const checkid = await prisma.user.findUnique({
            where : {id : userid }
        })
        if(!checkid ) {
            return resolve ({
                status: "ERR" ,
                message : "user not found "
            })
        }
        const result = await prisma.$transaction(async (tx) => {
            let totalPrice = 0 
            const orderItemsData = []
            for(const item of items){
                const product = await tx.product.findUnique({
                    where : { id : item.productId}
                })
                if(!product) {
                    throw new Error (`Product with ID ${item.productId} not found`)
                }
                const prasedQuantity = parseInt(item.quantity)
                if(product.stock < prasedQuantity ) {
                    throw  new Error (`Product "${product.name}" only has ${product.stock} items left in stock`)
                }
                const finalPrice = product.discountPrice ? product.discountPrice : product.price
                totalPrice += finalPrice * prasedQuantity
                orderItemsData.push({
                    productId : item.productId ,
                    quantity : prasedQuantity ,
                    price : finalPrice
                })
                await tx.product.update({
                    where : {id : item.productId} ,
                    data : {
                        stock : product.stock - prasedQuantity ,
                        sold : product.sold + prasedQuantity
                    }
                })
            }
            const newOrder = await tx.order.create({
                    data : {
                        userId : userid ,
                        totalPrice ,
                        shippingAddress ,
                        paymentMethod , 
                        status : "PENDING" ,
                        orderItems : {
                            create : orderItemsData
                        }
                    } , 
                    include : {
                        orderItems :true 
                    }
                })
                const cart = await prisma.cart.findUnique ({
                where : { 
                    userId : userid
                }
            })
            if(cart) {
                const productIdsBought = items.map(i => i.productId) 
                await tx.cartItem.deleteMany({
                    where : { 
                        cartId : cart.id ,
                        productId : {
                            in : productIdsBought
                        }
                    }
                })
            }
            return newOrder   
        })
        return resolve({
                    status: "SUCCESS",
                    message: "Order created successfully",
                    data: result
                })
        
    })
    }catch(e) {
        return reject(e)
    }
}
const createOrderFormCart = async( userId  , orderData ) => {
    return new Promise (async (resolve , reject ) => {
        try { 
            const {paymentMethod , shippingAddress} = orderData 
            const checkid = await  prisma.user.findUnique({
                where : {id : userId}
            })
            if(checkid == null) {
                return resolve({
                    status : "ERR" ,
                    message  : "user  not found "
                })
            }
            const result = await  prisma.$transaction( async (tx) => {

                const cart = await tx.cart.findUnique({
                    where :  { userId : userId} ,
                    include : {
                        items : {
                            include  :{ 
                                product : true
                            }
                        }
                    }
                })
                if(!cart || cart.items.length == 0) {
                    throw new Error ("Your cart is empty . can't not order ")
                }
                let totalPrice = 0 
                const orderItemsData = []

                for(const cartItem of cart.items) {
                    const product = cartItem.product

                    if(product.stock < cartItem.quantity) {
                        throw new Error (`Product "${product.name}" only has ${product.stock} items left in stock. You have ${cartItem.quantity} in cart.`)
                    }
                    const finalPrice  = product.discountPrice ? product.discountPrice : product.price
                    totalPrice += finalPrice * cartItem.quantity

                    orderItemsData.push({
                        productId : cartItem.productId ,
                        quantity : cartItem.quantity ,
                        price : finalPrice 
                    })

                    await tx.product.update({
                    where : { 
                        id : cartItem.productId 
                    },
                    data :{ 
                        stock :  product.stock - cartItem.quantity ,
                        sold : product.sold + cartItem.quantity
                        }
                    })
                }
                    const newOrder = await tx.order.create({
                        data : {
                            userId : userId ,
                            totalPrice ,
                            shippingAddress ,
                            paymentMethod ,
                            status : "PENDING" ,
                            orderItems :{ 
                                create : orderItemsData 
                            }
                        },
                        include : {
                            orderItems : true 
                        }
                    })
                     await tx.cartItem.deleteMany({
                where : {cartId : cart.id }
            })
            return newOrder 

            })
           return resolve({
            status : "OK" ,
            message : "Order created successfully from your cart" ,
            data : result 
           })

        }
        catch(e){
            reject(e)
        }
    })
}
const GetMyOrder = async( userid ) => {
    return new Promise ( async(resolve , reject ) => {
        try { 
            const userId = await prisma.user.findUnique({
                where :  { id : userid } 
            })
            if(userId == null) {
                return resolve({
                    status : "ERR" ,
                    message  : "User not found"
                })
            }
            const orders = await prisma.order.findMany({
                where : { 
                    userId  : userid 
                } ,
                include : {
                    orderItems : { 
                        include : {
                            product : true 
                        }
                    }
                } ,
                orderBy : {
                    createdAt : 'desc'
                }
            })
            return resolve({
                status: "OK",
                message: "Get list orders successfully",
                data: orders
            })
        }
        catch(E) {
            reject(E)
        }
    })
}
const getOrderById = async(userid , orderid) =>{
    return new Promise (async (resolve , reject ) => {
        try {
            const checkUser = await prisma.user.findUnique({
                where : {id : userid }
            })
            if(checkUser === null){
                return resolve({
                    status : "ERR" ,
                    message: "User not found"
                })
            }
            const order = await prisma.order.findFirst({
                where : {
                    userId : userid ,
                    id : orderid
                    
                } ,
                include : {
                    orderItems : {
                        include : {
                            product : true 
                        }
                    }
                }
            })
            if (order === null) {
                return resolve({
                    status: "ERR",
                    message: "Order not found or you do not have permission to view this order"
                })
            }
            return resolve({
                status: "OK",
                message: "Get order details successfully",
                data: order
            })

        }catch(e){
            reject(e)   
        }
    })
}
const cancelOrder = async(userid , orderid) =>{
    return new Promise (async (resolve , reject ) => {
        try {
            const checkId = await prisma.user.findUnique({
                where : {
                    id : userid
                }
            })
            if(checkId == null) {
                return resolve({
                    status : "ERR" ,
                    message : "User not found "
                })
            }
            const result = await prisma.$transaction(async(tx) => {
                const order = await prisma.order.findFirst({
                where : {
                    id : orderid , 
                    userId : userid 
                } ,
                include : { 
                    orderItems  :{ 
                        include : {
                            product : true 
                        }
                    }
                }
            })
             if(!order ) {
                throw new Error("order is not found")
            }
            if(order.status !=="PENDING") {
                throw new Error("Orders can only be canceled while they are pending")
            }
                for(const item of order.orderItems ) {
                    await tx.product.update({
                        where : {
                            id : item.productId 
                        },
                        data : {
                            stock : item.product.stock  + item.quantity ,
                            sold : item.product.sold - item.quantity 
                        }
                    })
                }
                const updatedOrder = await tx.order.update({
                    where : {
                        id : orderid
                    } , 
                    data:  {
                        status : "CANCELLED"
                    }
                })
                return updatedOrder
            })
            return resolve({
                status : "OK" ,
                message : "SUCCESS CANCLE" ,
                data : result
            })

        }catch(e) {
                return resolve({
                status: "ERR",
                message: e.message || "Failed to cancel order"
            })
        }
    })
}
const getAllOrders = async({page = 1 , limit = 5 , status } ) => {
     const where = status ? {status}  : {} 
    return new Promise (async(resolve ,  reject) => {
        try {
            const [orders , totalOrders] = await Promise.all([
                  prisma.order.findMany({
                        where , 
                        skip : (page - 1 ) * Number(limit) ,
                        take : Number(limit) ,
                        include : {
                            user : {   
                                select : { name : true , email : true }
                                } ,
                            orderItems : {
                                include : {
                                    product : true 
                                }
                            } 
                        } ,
                        orderBy : { createdAt : "desc"} , 
                }) , 
                prisma.order.count({where})
            ]) 
            const totalPages = Math.ceil(totalOrders / Number(limit))
            return resolve({
                status : "OK",
                message: "Get all orders successfully", 
                data: orders ,
                pagination : {
                    currentPage : Number(page) ,
                    limit : Number(limit) ,
                    totalOrders ,
                    totalPages
                }
            })
        }
        catch(e) {
            reject(e)
        }
    })
}
const updateOrderStatus = async(orderid , statusOrder) => {
    return new Promise(async (resolve , reject ) => {
        try {
            const checkid = await prisma.order.findUnique({
            where : { 
                id :  orderid 
            }
        })
        if(checkid == null) {
            return resolve({
                status : "ERR" ,
                Message : "Order id not found"
            })
        }
        const updateOrder = await prisma.order.update({
            where : {
                id : orderid 
            } ,
            data :  {
                status : statusOrder
            }
        })
        return resolve({
            status : "OK",
            message : "SUCCESS UPDATE STATUS ORDER" , 
            data : updateOrder
        })
        }catch(e) {
            reject(e)
        }
    })
}
module.exports = { createOrder , createOrderFormCart , GetMyOrder , getOrderById , cancelOrder , getAllOrders ,updateOrderStatus}