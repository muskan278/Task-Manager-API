require('../src/db/mongoose')

const { findByIdAndUpdate, count } = require('../src/models/user')
const User=require("../src/models/user")

/*
//60a7ead3bd3c8943ac181664
//due to mongoose $set not reqd.
User.findByIdAndUpdate('605b40c91cf31c4b28e26601',{age:1}).then((user)=>{
    console.log(user)

    return User.countDocuments({age:1})
}).then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
})
*/
const updateAgeAndCount = async(id,age) =>{
    const user= await User.findByIdAndUpdate(id,{age})
    const count=await User.countDocuments({age})
    return count
}
updateAgeAndCount('605a47b506b7380bc0e03dd1',1).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})