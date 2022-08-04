const express=require('express')
const app=express()

app.get('/',(req,res)=>{res.send('e-commerce-api')})

const port=process.env.PORT || 7000

const start=async()=>{
    try {
        console.log('connecting DB')
        app.listen(port,()=>{console.log(`server is listening on port ${port}`)})
    } catch (error) {
        console.log('error in connecting DB')
    }
}

start()