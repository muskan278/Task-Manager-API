const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
    description : {
        type:String,
        required : true,
        trim : true
    },
    completed : {
        type: Boolean,
        default:false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref : 'User'
    }
},{
    timestamps:true
})
const Task = mongoose.model('Task',taskSchema)

module.exports = Task

/*
const task = new Task({
    description : "   Sleep    ",

})

task.save().then(()=>{
    console.log(task)
}).catch((error)=>{
    console.log('Error!',error)
})
*/
/*
const Task = mongoose.model('Task',{
    description : {
        type:String,
        required : true
    },
    completed : {
        type: Boolean,
        required : true
    }
})

const task = new Task({
    description : "Sleep",
    completed : false
})

task.save().then(()=>{
    console.log(task)
}).catch((error)=>{
    console.log('Error!',error)
})
*/