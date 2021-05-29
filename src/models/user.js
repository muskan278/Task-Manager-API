const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task= require('./task')

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        trim : true
    },
    email : {
        type : String,
        unique : true,
        required:true,
        trim : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password : {
        type:String,
        required:true,
        trim : true,
        minlength : 7,
        validate(value){
            // if(value.length<=6){
            //     throw new Error('Password must be greater than length 6')
            // }
            if(value.toLowerCase().includes('password'))
            throw new Error('Password cannot contain the word "password"')
        }
    },
    age : {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0)
            {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

//setting up a virtual property
//virtual coz we r not changing what we r storing in user document
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})
userSchema.methods.toJSON =  function(){
// userSchema.methods.getPublicProfile =  function(){
    const user= this
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}


userSchema.methods.generateAuthToken = async function(){
    const user= this
    const token = jwt.sign({_id : user._id.toString()},process.env.JWT_SECRET)
    
    user.tokens = user.tokens.concat({ token})
    await user.save()
    
    return token
}
//methods --> instance methods
//statics --> model methods
userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({email:email})

    if(!user){
        throw new Error('Unable to login(user not found)')
    }

    const isMatch =  await bcrypt.compare(password , user.password)
    if(!isMatch)
    {
        throw new Error('Unable to login (Wrong password)')
    }

    return user
}

//setting up middleware to encrypt password
//we need to use 'this' so we r using a standard fn and not arrow fn
// arrow fn do not bind 'this'
//hash the plain text password before saving
userSchema.pre('save',async function(next){
    const user = this

    // console.log('just before saving')
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }

    next()
})

//Delete user task when user is removed
userSchema.pre('remove',async function(next){
    const user = this

    //deleting multiple task using just the owner field
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User

// const me = new User({
//     name : "  Manan  ",
//     email : '  MIKE@gmail.com  ',
//     password : " rehminsd"
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log('Error!',error)
// })


/*
const User = mongoose.model('User',{
    name : {
        type:String
    },
    age : {
        type: Number
    }
})

const me = new User({
    name: 'Muskan',
    age : 27
})

me.save().then(()=>{
    console.log(me)
}).catch((error)=>{
    console.log('Error!',error)
})
*/

/*
const User = mongoose.model('User',{
    name : {
        type:String,
        required:true
    },
    email : {
        type : String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age : {
        type: Number,
        validate(value){
            if(value < 0)
            {
                throw new Error('Age must be a positive number')
            }
        }
    }
})

const me = new User({
    name : "Manan",
    email : 'mike@',
    age: 21
})

me.save().then(()=>{
    console.log(me)
}).catch((error)=>{
    console.log('Error!',error)
})
*/
/*
const User = mongoose.model('User',{
    name : {
        type:String,
        required:true,
        trim : true
    },
    email : {
        type : String,
        required:true,
        trim : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password : {
        type:String,
        required:true,
        trim : true,
        minlength : 7,
        validate(value){
            // if(value.length<=6){
            //     throw new Error('Password must be greater than length 6')
            // }
            if(value.toLowerCase().includes('password'))
            throw new Error('Password cannot contain the word "password"')
        }
    },
    age : {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0)
            {
                throw new Error('Age must be a positive number')
            }
        }
    }
})

const me = new User({
    name : "  Manan  ",
    email : '  MIKE@gmail.com  ',
    password : " rehminsd"
})

me.save().then(()=>{
    console.log(me)
}).catch((error)=>{
    console.log('Error!',error)
})
*/
