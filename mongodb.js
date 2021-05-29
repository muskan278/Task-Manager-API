//http://mongodb.github.io/node-mongodb-native/3.6/api/
/**
PS C:\Users\HP\Desktop\Node-course> cd task-manager
PS C:\Users\HP\Desktop\Node-course\task-manager> /Users/HP/mongodb/bin/mongod.exe --dbpath=/Users/HP/mongodb-data 
 */
//CRUD --> CREATE READ UPDATE DELETE

/*
const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient
const ObjectID = mogodb.ObjectID
*/
const {MongoClient,ObjectID}=require('mongodb')

const connectionURL='mongodb://127.0.0.1:27017'
const databaseName='task-manager'

//DELETE
//connecting database is an asynchronous operation
/*
MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('Unable to connect to database!')
    }

    console.log('Connected Correctly!')
    
    const db=client.db(databaseName)

    db.collection('users').deleteMany({
        age:22
    }).then((result)=>{
        console.log(result.deletedCount)
    }).catch((error)=>{
        console.log(error)
    })
    
    db.collection('tasks').deleteOne({
        description:"Code"
    }).then((result)=>{
        console.log(result.deletedCount)
    }).catch((error)=>{
        console.log(error)
    })
})
*/


















//UPDATE
/*
MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('Unable to connect to database!')
    }

    console.log('Connected Correctly!')
    
    const db=client.db(databaseName)

    
    const updatePromise = db.collection('users').updateOne({
        _id:new ObjectID("6027d8aa47fea13fb8201a3e")
    },{
        $set:{
            name:'Manan'
        }
    })

    updatePromise.then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
    
    db.collection('users').updateOne({
        _id:new ObjectID("6027d8aa47fea13fb8201a3e")
    },{
        $set:{
            name:'Manan'
        }
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })

    db.collection('users').updateOne({
        _id:new ObjectID("6027d8aa47fea13fb8201a3e")
    },{
        $inc:{
            age: 3
        }
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
  

    db.collection('tasks').updateMany({
        completed:false
    },{
        $set:{
            completed: true
        }
    }).then((result)=>{
        console.log(result.modifiedCount)
    }).catch((error)=>{
        console.log(error)
    })
    
})
*/




















//find
/*
MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('Unable to connect to database!')
    }

    console.log('Connected Correctly!')
    
    const db=client.db(databaseName)

        db.collection('users').findOne({name:'Ritika',age:18},(error,user)=>{
            if(error)
            return console.log('Unable to fetch')
        
            console.log(user)
        
        })
        db.collection('users').findOne({_id:new ObjectID("6059c8d737f56d3288b54804")},(error,user)=>{
            if(error)
            return console.log('Unable to fetch')
        
            console.log(user)
        
        })
        //find gives a cursor back
        db.collection('users').find({age:19}).toArray((error,users)=>{
            if(error)
            return console.log('Unable to fetch')
        
            console.log(users)
        
        })

        db.collection('users').find({age:19}).count((error,count_users)=>{
            if(error)
            return console.log('Unable to fetch')
        
            console.log(count_users)
        
        })
    })
    */
     
   /*
    MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
        if(error){
            return console.log('Unable to connect to database!')
        }
    
        console.log('Connected Correctly!')
        
        const db=client.db(databaseName)

            db.collection('tasks').findOne({_id:new ObjectID("6059c8bd20843b05d497b093")},(error,task)=>{
                if(error)
                return console.log('Unable to fetch')
            
                console.log(task)
            
            })
            //find gives a cursor back
            db.collection('tasks').find({completed:false}).toArray((error,tasks)=>{
                if(error)
                return console.log('Unable to fetch')
            
                console.log(tasks)
            
            })

        })
*/






















//GLOBALLY UNIQUE ID AND INSERT
/*
//globally unique id    
const id=new ObjectID();
console.log(id);
console.log(id.id);
console.log(id.id.length);
console.log(id.toHexString());
console.log(id.toHexString().length);
console.log(id.getTimestamp());
MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('Unable to connect to database!')
    }

    console.log('Connected Correctly!')
    
    const db=client.db(databaseName)

    db.collection('users').insertOne({
        _id:id,
        name:'Muskan',
        age:19
    },(error,result)=>{
        if(error){
            return console.log('Unable to insert user')
        }
//ops==>array of docs
        console.log(result.ops)
        })
*/
        /*
        db.collection('users').insertMany([
        {
            name:'Muskan',
            age:19
        },
        {
            name:'Ritika',
            age:18
        }
        ],(error,result)=>{
            if(error){
                return console.log('Unable to insert user')
            }
        //ops==>array of docs
            console.log(result.ops)
            })
            */


    /*
    const db=client.db(databaseName)
    db.collection('tasks').insertMany([
        {
            description:"Code",
            completed: false
        },
        {
            description:"Eat",
            completed: true
        },
        {
            description:"Sleep",
            completed: true
        }
    ],(error,result)=>{
        if(error){
            return console.log('Unable to insert tasks')
        }
    //ops==>array of docs
    console.log(result.ops)
    })
})
*/
        
