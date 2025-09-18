

const mongoose = require('mongoose')

const connectionString = process.env.connection_string

mongoose.connect(connectionString).then(()=>{
    console.log("MnogoDB Atlass connected seuccessfully to CustomServer");
    
}).catch(err=>{
    console.log("MongoDb connection failed",err);
    
})