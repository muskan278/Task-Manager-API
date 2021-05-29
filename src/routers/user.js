const express = require('express')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer=require('multer')
const {sendWelcomeEmail , sendCancellationEmail} = require('../emails/account')
const router=new express.Router()
router.get('/test',(req,res)=>{
    res.send("From a new file")
})


/*
//path,callback fn
app.post('/users',(req,res)=>{
    console.log(req.body)
    // res.send("testing")

    const user = new User(req.body)

    user.save().then(()=>{
        res.status(201).send(user)
    }).catch((error)=>{
        res.status(400)
        res.send(error)

        //OR
        //res.status(400).send(error)
    })
})
*/

//SIGNUP
//above fn with aysync await
router.post('/users',async(req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }

})

//LOGIN
router.post('/users/login',async(req,res)=>{
    try{
        const user= await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        // res.send({user : user.getPublicProfile() ,token})
        res.send({user ,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

//LOGOUT
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()

        res.send("Logged out")
    }
    catch(e){
        res.status(500).send(e)
    }
})

//LOGOUT OF ALL SESSIONS
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens =[]
        await req.user.save()

        res.status(200).send("Logged out from all sesions")
    }
    catch(e){
        res.status(500).send(e)
    }
})


/*
//https://mongoosejs.com/docs/queries.html
//all users
app.get('/users',(req,res)=>{

    User.find({}).then((users)=>{
        res.send(users)
    }).catch((e)=>{
        res.status(500).send()
    })
})
*/

//will be used aage to get the profile of the logged in user
router.get('/users/me', auth ,async(req,res)=>{

    // try{
    //     const users=await User.find({})
    //     res.send(users)
    // }
    // catch(e){
    //     res.status(500).send()
    // }
    res.send(req.user)
})

/*
//single user by ID
//route parameters ==> :id
app.get('/users/:id',(req,res)=>{
    const _id=req.params.id
//mongoose automatically converts string to object ids
    User.findById(_id).then((user)=>{
        if(!user)
        {
            return res.send(404).send()
        }

        res.send(user)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
*/

/*
//NOT NEEDED NOW
router.get('/users/:id',async(req,res)=>{
    const _id=req.params.id
    try{
        const user=await User.findById(_id)
        if(!user)
        {
            return res.status(404).send()
        }

        res.send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
})
*/

//****************** 
//only that particular user should be allowed to edit and delete his profile so modifying accordingly


//patch--> designed for updating an existing resource
/*
router.patch('/users/:id',async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=["name","email","age","password"]
    //get called for every property in updates array
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation)
    {
        return res.status(400).send({error:'Invalid updates'})
    }

    const _id=req.params.id

    try{
        const user= await User.findById(_id)
        // user.name='something else'
        updates.forEach((update)=>{
            user[update] = req.body[update]
        })
        await user.save()
        //above is done to make it more mongoose traditional way so that pre fn for hashing works
        // const user=await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})
*/

router.patch('/users/me',auth ,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=["name","email","age","password"]
    //get called for every property in updates array
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation)
    {
        return res.status(400).send({error:'Invalid updates'})
    }

    const _id=req.user._id

    try{
        const user= await User.findById(_id)
        // user.name='something else'
        updates.forEach((update)=>{
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

/*
router.delete('/users/:id',async(req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})
*/
router.delete('/users/me',auth, async(req,res)=>{
    try{
        // const user=await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }

        await req.user.remove()
        sendCancellationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

const upload = multer({
    // dest : 'avatars',
    limits:{
        fileSize : 1000000 
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined,true)

        /*
        //types of callback(cb)
        cb(new Error('File must be a PDF'))
        cb(undefined,true)
        cb(undefined,false) //never needed here(silenetly rejects upload)
        */
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250 , height:250}).png().toBuffer()
    req.user.avatar=buffer
    
    // req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{   
    res.status(400).send({error:error.message})
})
/*
binary markup --> jsbin.com
html me
<img src="data:image/jpg;base64, BINARY DATA HERE "
*/

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)

        //if ther is no user or user doesnt have img associated
        if(!user || !user.avatar)
        {
            throw new Error()
        }
//when json is sent back express automatically sets this header
//here we gotta set
        res.set('Content-Type','image/png')
        // res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    }
    catch(e){
        res.status(404).send(e)
    }
})



module.exports=router
