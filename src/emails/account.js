const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/*
sgMail.send({
    to : "muskan.agarwal2019a@vitstudent.ac.in",
    from: "agarwalmuskan278@gmail.com",
    subject :" This is my first creation",
    text : "I hope this one actually get to you"
})
*/ 

const sendWelcomeEmail = (email,name) =>{
    sgMail.send({
        to : email,
        from : 'agarwalmuskan278@gmail.com',
        subject : 'Thanks for joining in',
        text : `Welcome to the app , ${name}. Let us know how you get along with the app`,
    })
}

const sendCancellationEmail = (email,name) =>{
    sgMail.send({
        to : email,
        from : 'agarwalmuskan278@gmail.com',
        subject : 'Sorry to see you go!',
        text : 
        `Goodbye, ${name} , hope to see you back soon.

        We would be pleased if you could tell us what let you to delete the account and where we could have improved.`,
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}