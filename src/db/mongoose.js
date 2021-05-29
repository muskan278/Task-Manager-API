const mongoose = require('mongoose')
const MONGODB_URL = process.env.MONGODB_URL
//different database name than task-manager coz mongoose has a diff db structure
mongoose.connect(MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
})
