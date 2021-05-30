const {calculateTip , 
    fahrenheitToCelsius , 
    celsiusToFahrenheit , 
    add} = require('../src/math')
//can use jest or mochajs.com --> using jest here


/*
test('Should calculate total with tip',()=>{
    const total = calculateTip(10,0.3)
    
    if(total!==13)
    throw new Error('Total tip should be 13.Got '+total) 
})
*/
//alternative way
test('Should calculate total with tip',()=>{
    const total = calculateTip(10,0.3)
    expect(total).toBe(13)
})

test('Should calculate total with default tip',()=>{
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})

test('Should convert 32 fahrenheit To 0 Celsius',()=>expect(fahrenheitToCelsius(32)).toBe(0))

test('Should comvert 0 celsius To 32 Fahrenheit',()=>expect(celsiusToFahrenheit(0)).toBe(32))


//testing asynchronous functions
// test('Async test demo',(done)=>{
//     setTimeout(()=>{
//         expect(1).toBe(2) //always fail
//         done()
    
//     },2000)
// })


test('Should add two numbers',(done)=>{
    add(2,3).then((sum)=>{
        expect(sum).toBe(5)
        done()
    })
})

test('Should add two numbers async/await',async()=>{
    const sum = await add(10,22)
    expect(sum).toBe(32)
})

/*
test('Hello world!',()=>{
    
})

test('This should fail', () => {
    throw new Error('Failure!')
})
*/
    //Why test?
    //
    //-Saves Time
    //-Creates reliable software
    //-gives flexibility to developers
    //   -Refactoring
    //   -collaborating
    //   -profiling
    // -peace of mind