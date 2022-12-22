// server data base integration
 

// import mongose
const mongoose=require('mongoose')

// connect server with mongo via mongoose

mongoose.connect('mongodb://localhost:27017/bank',{
    useNewUrlParser:true
})

// create model 
const User=mongoose.model('User',{
    acno:Number,
    userName:String,
    password:String,
    balance:Number,
    transaction:[]
})


module.exports={
    User
}