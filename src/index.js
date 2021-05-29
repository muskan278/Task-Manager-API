/**
PS C:\Users\HP\Desktop\Node-course> cd task-manager
PS C:\Users\HP\Desktop\Node-course\task-manager> /Users/HP/mongodb/bin/mongod.exe --dbpath=/Users/HP/mongodb-data 

https://httpstatuses.com/

Here we are using-->
200-->things go wrong
400-->things go wrong due to user data
500-->things go wrong bcoz of an error in the server
*/

const express = require('express')

//ensures mongoose connects to database
require('./db/mongoose')

const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')

const app = express()
const port = process.env.PORT 


//without middleware : new request --> run route handler
//with middleware : new request --> do something --> run route handler
/*
app.use((req,res,next)=>{
    // console.log(req.method , req.path)
    // next()

    if(req.method === 'GET'){
        res.send('GET requests are disabled')
    }
    else{
        next()
    }
})

*/

/*
app.use((req,res,next)=>{
    res.status(503).send('Site is currently down.Check back soon')
})
*/

/*
const multer=require('multer')
const upload = multer({
    dest : 'images',
    limits:{
        fileSize : 1000000 
    },
    fileFilter(req,file,cb){
        // if(!file.originalname.endsWith('.pdf')){
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a word doc'))
        }
        cb(undefined,true)

        /*
        //types of callback(cb)
        cb(new Error('File must be a PDF'))
        cb(undefined,true)
        cb(undefined,false) //never needed here(silenetly rejects upload)
        */
  /*
  }
})
app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

*/
//parse incoming object to JSON
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

/*
const router=new express.Router()
router.get('/test',(req,res)=>{
    res.send("This is from my other router")
})
app.use(router)
*/

app.listen(port,()=>{
    console.log('Server is up on port '+ port)
})

/*
const bcrypt=require('bcryptjs')
const { collection } = require('./models/user')
const myFunction=async()=>{
    const password='muskan12345!'
    const hashedPassword = await bcrypt.hash(password,8)

    console.log(password)
    console.log(hashedPassword)

//hashing algos by design are one way methods u can't get back plain text again
//so in bcrypt we compare the user entered password with user password
    const isMatch=await bcrypt.compare('muskan12345!',hashedPassword)
    console.log(isMatch)
}

myFunction()
*/

/*
const jwt = require('jsonwebtoken')

const myFunction = async() =>{
    const token = jwt.sign({_id:'abc123'},'thisismynewcourse',{expiresIn:'7 days'})
    console.log(token)

    const data = jwt.verify(token,'thisismynewcourse')
    console.log(data)
}
myFunction()
*/
/*
const pet = {
    name:"Hal"
}

console.log(JSON.stringify(pet))

//whenever res.send is done it calls JSON.stringify by default
*/

/*
const pet = {
    name:"Hal"
}
pet.toJSON = function(){
    console.log(this)
    return {}
}
console.log(JSON.stringify(pet)) //empty coz toJSON sets it to empty
*/

/*
const Task = require('./models/task')
const main = async ()=>{
    const task = await Task.findById('60abfaaedfa61b1614747abf')
    console.log(task.owner)
    //now if we want to know the owner's name we gotta manually fetch it from users model by using the id
    //but we can instead use a mongoose property which make it easier  --> ref  (reference from this field to that model) --> in task model
    await task.populate('owner').execPopulate()
    console.log(task.owner)
    // now we have a relationship b/w user and task
}
main()
*/
/*
const User = require('./models/user')
const main = async ()=>{
    const user = await User.findById('60abf9e57e27c455f84fe371')
    console.log(user.tasks)
    //now if we want to know the owner's name we gotta manually fetch it from users model by using the id
    //but we can instead use a mongoose property 
    //setting upp a virtual property(not actually getting stored in db)
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
    // now we have a relationship b/w user and task
}
main()
*/


