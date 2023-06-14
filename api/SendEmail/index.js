module.exports = async function (context, req) {

    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    context.log('JavaScript HTTP trigger function processed a request to SendEmail Api.');
    const mailAddress = (req.query.mailAddress || (req.body && req.body.mailAddress));
    const mailAddresses = Object.values(mailAddress);
    
    const subject = (req.query.subject || (req.body && req.body.subject));
    const text = (req.query.text || (req.body && req.body.text));
    console.log(text);
    const responseMessage = mailAddress
    ? "Success"
    : "This HTTP triggered function executed successfully.";
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SendGridApiKey)
    const msg = {
    to: mailAddresses, // Change to your recipient
    from: 'post@bevardovrefjell.no', // Change to your verified sender
    subject: subject,
    text: text,
    html: '<strong>' + text + '</strong>',
    }
    await sgMail
    .sendMultiple(msg)
    // .then(() => {
    //     context.log('Email sent to ', mailAddress)
    // })
    .catch((error) => {
        context.log(error)
    })
    context.res = {
        // status: 200, 200 is default
        body: responseMessage
    };

};