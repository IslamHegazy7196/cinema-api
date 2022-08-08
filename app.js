require('dotenv').config()
require('express-async-errors')
// express
const express=require('express')
const app=express()
const morgan=require('morgan')
const cookieParser=require('cookie-parser')
// connect BD
const connectDB=require('./DB/connect')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cookieParser(process.env.JWT_SECRET))
// routes require
const authRouter=require('./routes/authRoutes')
const userRouter=require('./routes/userRoutes')
const notFoundMiddleware=require('./middleware/not-found')
const errorHandlerMiddleware=require('./middleware/error-handler')
// routes
app.get('/',(req,res)=>{res.send('e-commerce-api')})
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port=process.env.PORT || 5000

const start=async()=>{
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port,()=>{console.log(`server is listening on port ${port}`)})
    } catch (error) {
        console.log('error in connecting DB')
    }
}

start()