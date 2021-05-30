const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId,userOne,setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user',async()=>{
    const response = await request(app).post('/users').send({
            name: 'Muskan VIT',
            email: 'muskan.agarwal2019a@vitstudent.ac.in',
            password:'1234567'
    }).expect(201)

    //Assert that the database was changed correctly
    const user=await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    // expect(response.body.user.name).toBe('Muskan VIT')
    //OR
    expect(response.body).toMatchObject({
        user : {
            name: 'Muskan VIT',
            email: 'muskan.agarwal2019a@vitstudent.ac.in',
        },
        token:user.tokens[0].token
    })

    //asserting that password is not stored as a plain text
    expect(user.password).not.toBe('1234567')
})


test('Should login existing user',async()=>{
    const response= await request(app).post('/users/login').send({
            email: userOne.email,
            password:userOne.password
    }).expect(200)

    const user=await User.findById(userOneId)
    //OR
    // const user=await User.findById(response.body.user._id)

    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user',async()=>{
    await request(app).post('/users/login').send({
            email: userOne.email,
            password:'wvnjkwnj'
    }).expect(400)
})

test('Should get profile for user',async()=>{
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user',async()=>{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user',async()=>{
    await request(app)
        .delete('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user=await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user',async()=>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image',async()=>{
    const response= await request(app)
    .post('/users/me/avatar')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user=await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer)) 
    //toBe is not gonna work here for comparing objects
})

test('Should update valid user fields',async()=>{
    const response= await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        name : 'Ritika',
    })
    .expect(200)

    const user=await User.findById(userOneId)
    expect(user.name).toEqual('Ritika')
})

test('Should not update invalid user fields',async()=>{
    const response= await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        location : 'Ritika',
    })
    .expect(400)
})