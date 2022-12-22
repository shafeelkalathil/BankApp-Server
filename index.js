// server creation

// 1.import express
const express=require("express")
const dataService=require("./service/data.service")
//  import jsonwebtoken

const jwt=require("jsonwebtoken")

// import cors

const cors=require("cors")


// 2.create server app
const app= express()
// to parse json

app.use(express.json())

// to use cors to share data with others

app.use(cors({
    origin:['http://localhost:4200',
    'http://192.168.1.3:8080',
    'http://127.0.0.1:8080']
}))

// Application specific middleware
// const middleware=(req,res,next)=>{
//     console.log("Appplication middleware")
//     next()
// }
// app.use(middleware)

// Router specific middelware -token validation
const jwtMiddleware=(req,res,next)=>{
    try{
        const token=req.headers['x-access-token']
        // const token=req.body.token
    const data= jwt.verify(token,"supersecretkey12345")
    next()

    }catch{
        res.status(422).json({
            statusCode:422,
            status:false,
            message:"Please Login"
        })
    }
}

// 3. HTTP request resolve
// GET Request-to read  data
// app.get('/',(req,res)=>{
//     res.send("GET METHOD")
// })

// // POST Request-to create data
// app.post('/',(req,res)=>{
//     res.send("POST METHOD")
// })

// // PUT Request-to update data completely
// app.put('/',(req,res)=>{
//     res.send("PUT METHOD")
// })

// //PATCH Request-to update data partially
// app.patch('/',(req,res)=>{
//     res.send("PATCH METHOD")
// }) 

// //DELETE Request-to remove  data 
// app.delete('/',(req,res)=>{
//     res.send("DELETE METHOD")
// }) 
// Bank App Request Resolving

// register API
app.post('/register',(req,res)=>{
    dataService.register(req.body.acno,req.body.userName,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})


// login API
app.post('/login',(req,res)=>{
    dataService.login(req.body.acno,req.body.pswd)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
   
})

// deposit API
app.post('/deposit',jwtMiddleware,(req,res)=>{
    dataService.deposit(req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{

        res.status(result.statusCode).json(result)
    })
})
// withdraw API
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    dataService.withdraw(req.body.acno1,req.body.pswd1,req.body.amt1)
    .then(result=>{

        res.status(result.statusCode).json(result)
    })
})

// transaction API
app.post('/transaction',jwtMiddleware,(req,res)=>{
    try{
        dataService.getTransaction(req.body.acno)
        .then(result=>{

            res.status(result.statusCode).json(result)
        })
    }catch{
        res.status(422).json({
            statusCode:422,
            status:false,
            message:"No transaction has been done"
        })
    }
})

// onDelete API

app.delete('/delete/:acno',(req,res)=>{
    dataService.onDelete(req.params.acno)

        .then(result=>{

            res.status(result.statusCode).json(result)
        })
   
})


// 4.setup port number
app.listen(3000,()=>{
    console.log("Server started at port 3000 ")
})
