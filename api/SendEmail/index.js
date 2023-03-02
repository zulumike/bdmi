module.exports = function (context, req) {

    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs

    const mailAddress = (req.query.mailAddress || (req.body && req.body.mailAddress));
    const subject = (req.query.subject || (req.body && req.body.subject));
    const text = (req.query.text || (req.body && req.body.text));
    // const msgText = '<strong>' + text + '</strong>';

    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SendGridApiKey)
    const msg = {
    to: mailAddress, // Change to your recipient
    from: 'post@bevardovrefjell.no', // Change to your verified sender
    subject: subject,
    text: text,
    html: '<strong>' + text + '</strong>',
    }
    sgMail
    .send(msg)
    .then(() => {
        context.log('Email sent to ', mailAddress)
    })
    .catch((error) => {
        context.log(error)
    })


//    var message = {
//         "personalizations": [ { "to": [ { "email": mailAddress } ] } ],
//         from: { email: "post@bevardovrefjell.no" },
//         subject: subject,
//         content: [{
//             type: 'text/plain',
//             value: text        
//         }]
//     };
//     context.res = {
//         body: message
//     };
//     return message;


};