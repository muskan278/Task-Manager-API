require('../src/db/mongoose')

const Task=require("../src/models/task")

/*
//due to mongoose $set not reqd.
Task.findByIdAndDelete('605a523adc8d8d46601ff0ad').then((task)=>{
    console.log(task)

    return Task.countDocuments({completed:false})
}).then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
})
*/

const deleteTaskAndCount = async(id) =>{
    await Task.findByIdAndDelete(id)
    const count=await Task.countDocuments({completed:false})
    return count
}
deleteTaskAndCount('605a5263b911251dbc332e7b').then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})