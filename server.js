require('dotenv').config({path:"./config/.env"})
const app=require('./app')
const cors=require('cors')
const cloudinary=require('cloudinary')
//handling uncaught error
process.on("uncaughtException",err=>{
    console.log(`error:${err.message}`)
    console.log(`shutting down the server due to uncaught exception`)
    process.exit(1)
})
const { connect } = require('./config/database')

connect()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
// console.log(youtube)


const server=app.listen(process.env.PORT,()=>{
    console.log(`server is listening on http://localhost:${process.env.PORT}`)
})
//unhandled promise rejection
process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`)
    console.log(`Shutting down the server due to unhandled promise rejection`)
    server.close(()=>{
        process.exit(1)
    })
})