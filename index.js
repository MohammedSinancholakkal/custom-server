//loads env files content first to get env variables

require('dotenv').config()
const express = require('express')  //to connect the server , import server{express}
const cors = require('cors')  // to datashare contents from front end to server
const router = require('./Route/route')  //import router to share datas
require('./DB/connection')


const CustomServer = express()  //assign server into custom server
  
CustomServer.use(cors())  //use server with cors
CustomServer.use(express.json())  //set the json before router 
CustomServer.use(router)  // // also use the router under cors()

CustomServer.use('/uploads',express.static('./uploads'))


const PORT = process.env.PORT || 3000;
  

//to run port on the server we have to use listen()
CustomServer.listen(PORT, ()=>{
    console.log(`CustomServer running at port: ${PORT} && Waitng For Client Request`); 
});


//to get datas on browser we want to get the server

CustomServer.get('/',(req,res)=>{
    res.send(`<h1> CustomServer running at port: ${PORT} && Waitng For Client Request <h1/>`)

})  





