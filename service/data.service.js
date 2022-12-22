//  import jsonwebtoken

const { application } = require("express")
const jwt=require("jsonwebtoken")

// import db
const db=require("./db")
 
 //database
 userDetails={
    1000:{acno:1000,userName:'shafeel',password:1000,balance:5000,transaction:[]},
    1001:{acno:1001,userName:'afra',password:1001,balance:8000,transaction:[]},
    1002:{acno:1002,userName:'shan',password:1002,balance:52000,transaction:[]}
  }

// Register 

const register=(acno,userName,password)=>{
  // asynchronus
  return   db.User.findOne({acno})
  .then(user=>{
    if(user){
      return {
        statusCode:400,
        status:false,
        message:"User already exists...."
      }
    }else{
      const newUser=new db.User({
        acno,
        userName,
        password,
        balance:0,
        transaction:[]
      })
      newUser.save()
      return {
        statusCode:200,
        status:true,
        message:"Register Successfully.."
      }
    }
    
  })

    
}
  // login()
  const login=(acno,pswd)=>{

    // asychronus
    return db.User.findOne({acno,password:pswd})
    .then(user=>{
      if(user){
        currentName=user.userName
        currentAcno=acno

      // token generation using jwt

      const token=jwt.sign({
        currentAcno:acno
      },"supersecretkey12345")


        return   {
            statusCode:200,
            status:true,
            message:"Login Successfully..",
            currentAcno,
            currentName,
            token
          }
      }else{
        return {
          statusCode:401,
          status:false,
          message:"Incorrect Account number / Password"
        }
      }
    })
   
   
  }

    

   // deposit()

  const deposit=(acno,pswd,amt)=>{
    var amount=parseInt(amt)
    return db.User.findOne({acno,password:pswd})
    .then(user=>{
      if(user){
        console.log(user)
        user.balance+=amount
        user.transaction.push({
          type:"CREDIT",
          amount:amount
        })
        user.save()
        return {
            statusCode:200,
            status:true,
            message:`${amount} credited.New balance is ${user.balance}`
        } 
      }else{
        return {
          statusCode:401,
          status:false,
          message:"Incorrect Password or Account Number"
      }
      }
     
    })
    

   
  }

// withdraw()

const withdraw=(acno1,pswd1,amt1)=>{
    
    let amount=parseInt(amt1)
   return db.User.findOne({
      acno:acno1,
      password:pswd1})
      .then(user=>{
        if(user){
          if(user.balance>amount){

            user.balance-=amount
            user.transaction.push({
              type:"DEBIT",
              amount:amount
            })
            user.save()
           return {
            statusCode:200,
            status:true,
            message:`${amount} debited.New balance is ${user.balance}`
        } 
          }else{
            return  {
              statusCode:401,
              status:false,
              message:" Insufficent Balance "
          }
          }
         
         }else{
          return  {
            statusCode:401,
            status:false,
            message:"Incorrect Password or  Account Number"
        }
         }
         
      })
}
  // transaction

 const getTransaction=(acno)=>{
  return db.User.findOne({acno})

  .then(user=>{
    
   if(user){
    return {
      statusCode:200,
      status:true,
      transaction:user.transaction
  } 
   }else{
    return {
      statusCode:401,
      status:false,
     message:"Incorrect Account Number"
  } 
   }
  })
   }
// delete

const onDelete=(acno)=>{
  return db.User.deleteOne({acno})
  .then(result=>{
    if(result){
      return {
        statusCode:200,
      status:true,
      message:"Delete Successfully.."
      }
    }else{
      return {
        statusCode:401,
        status:false,
       message:"Incorrect Account Number"
    } 
    }
  })
}



module.exports={
    register,
    login,
    deposit,
    withdraw,
    getTransaction,
    onDelete
}