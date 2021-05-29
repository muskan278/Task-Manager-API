const express = require('express')
const Task = require('../models/task')
const auth= require('../middleware/auth')
const router=new express.Router()

/*
//path,callback fn
app.post('/tasks',(req,res)=>{
    console.log(req.body)
    
    const task = new Task(req.body)

    task.save().then(()=>{
        res.status(201).send(task)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})
*/

router.post('/tasks', auth ,async(req,res)=>{
    // console.log(req.body)
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body ,
        owner : req.user._id 
    })

    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(400).send(error)
    }
    
})

//all tasks
/*
app.get('/tasks',(req,res)=>{

    Task.find({}).then((tasks)=>{
        res.send(tasks)
    }).catch((e)=>{
        res.status(500).send()
    })
})

router.get('/tasks',auth,async(req,res)=>{

    try{
        // const tasks = await Task.find({owner: req.user._id})
        //OR
        await req.user.populate('tasks').execPopulate()
        
        res.send(req.user.tasks)
    }
    catch(e){
        res.status(500).send()
    }
})
*/

//GET /tasks?completed=true
//GET /tasks?limit=20&skip=2
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks',auth,async(req,res)=>{
    const match={}
    const sort={}

    if(req.query.completed){
        match.completed = req.query.completed==='true'
    }

    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
        sort[parts[0]] = parts[1]==='desc'?-1:1
    }
    try{
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
                 /*sort : {
                     createdAt : -1,
                    //1--> ascending
                    //-1--> descending
                    completed: -1 // true first
                 
                }   */
                
            }
        }).execPopulate()
        
        res.send(req.user.tasks)
    }
    catch(e){
        res.status(500).send()
    }
})


//single task by ID
//route parameters ==> :id
/*
app.get('/tasks/:id',(req,res)=>{
    const _id=req.params.id
    Task.findById(_id).then((task)=>{
        if(!task)
        {
            return res.send(404).send()
        }

        res.send(task)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
*/

//first make sure they r authenticated
/*
router.get('/tasks/:id',async(req,res)=>{
    const _id=req.params.id

    try{
        const task= await Task.findById(_id)
        if(!task)
        {
            return res.status(404).send()
        }

        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }

})
*/
router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id

    try{
        // const task= await Task.findById(_id)
        const task= await Task.findOne({_id , owner: req.user._id})

        if(!task)
        {
            //task not created by logged in user
            return res.status(404).send("task not created by u")
        }

        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }

})

//patch--> designed for updating an existing resource
/*
router.patch('/tasks/:id',async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['description','completed']
    //get called for every property in updates array
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error:'Invalid updates'})
    }

    const _id=req.params.id
    try{
        const task= await Task.findById(_id)
        // user.name='something else'
        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()
        //above is done to make it more mongoose traditional way so that pre fn for hashing works
        // const task=await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        if(!task){
            return res.status(404).send("Task not found")
        }
        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})
*/

router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['description','completed']
    //get called for every property in updates array
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error:'Invalid updates'})
    }

    const _id=req.params.id
    try{
        const task= await Task.findOne({_id : req.params.id , owner:req.user._id})
        // user.name='something else'

        if(!task){
            return res.status(404).send("Task not found")
        }
        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()
        //above is done to make it more mongoose traditional way so that pre fn for hashing works
        // const task=await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

/*
router.delete('/tasks/:id',async(req,res)=>{
    try{
        const task=await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})
*/
router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task=await Task.findOneAndDelete({_id : req.params.id , owner:req.user._id} )
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

module.exports=router
