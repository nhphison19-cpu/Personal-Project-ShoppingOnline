const UserRouter = require('./userRoute')
const categoryRouter = require('./categoryRoute')
const brandRouter = require('./brandRoutes')
const productRouter  = require('./productRoutes')
const cartRouter = require('./cartRoutes')
const orderRouter = require('./orderRoutes')
const wishlistRouter = require('./wishlistRoutes')
const informationRouter = require('./informationRoutes')
const reviewRoutes = require('./reviewRoutes')
const momoRoutes = require('./momoRoutes')
const routes = (app) => {
    app.use('/api/user'  ,UserRouter) 
    app.use('/api/category' , categoryRouter)
    app.use('/api/brand' , brandRouter)
    app.use('/api/product' , productRouter)
    app.use('/api/cart' , cartRouter)
    app.use('/api/order' , orderRouter)
    app.use('/api/wishlist' , wishlistRouter )
    app.use('/api/information' , informationRouter)
    app.use('/api/review' , reviewRoutes)
    app.use('/api/payment' , momoRoutes)

}
module.exports = routes 