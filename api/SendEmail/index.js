module.exports = async function (context, req) {
    const fs = require('fs');
    const request = require('request');
    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    context.log('JavaScript HTTP trigger function processed a request to SendEmail Api.');
    const mailAddress = (req.query.mailAddress || (req.body && req.body.mailAddress));
    const mailAddresses = Object.values(mailAddress);
    const fileName = (req.query.fileName || (req.body && req.body.fileName));
    const fileUrl = (req.query.fileUrl || (req.body && req.body.fileUrl));
    const subject = (req.query.subject || (req.body && req.body.subject));
    const text = (req.query.text || (req.body && req.body.text));
    const responseMessage = mailAddress
    ? "Success"
    : "This HTTP triggered function executed successfully.";
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SendGridApiKey)
    let msg = {};
    // test start
    if (fileName) {
        request(fileUrl, { encoding: null }, (err, res, body) => {
            if (err) {return err; }
            if (body) {
                const textBuffered = Buffer.from(body);
                msg = {
                    to: mailAddresses, // Change to your recipient
                    from: 'post@bevardovrefjell.no', // Change to your verified sender
                    subject: subject,
                    text: text,
                    // html: '<strong>' + text + '</strong>',
                    attachments: [
                        {
                        content: textBuffered.toString('base64'),
                        filename: fileName,
                        type: 'application/pdf',
                        disposition: 'attachment',
                        content_id: 'mytext',
                        },
                    ],
                    }
                    sgMail
                    .sendMultiple(msg)
                    // .then(() => {
                    //     context.log('Email sent to ', mailAddress)
                    // })
                    .catch((error) => {
                        context.log(error)
                    })
            }
        });
    }

    // if (fileName) {
    //     fs.readFile((fileName), (err, data) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         if (data) {
    //             msg = {
    //                 to: mailAddresses, // Change to your recipient
    //                 from: 'post@bevardovrefjell.no', // Change to your verified sender
    //                 subject: subject,
    //                 text: text,
    //                 // html: '<strong>' + text + '</strong>',
    //                 attachments: [
    //                     {
    //                     content: data.toString('base64'),
    //                     filename: fileName,
    //                     type: 'application/pdf',
    //                     disposition: 'attachment',
    //                     content_id: 'mytext',
    //                     },
    //                 ],
    //                 }
    //                 sgMail
    //                 .sendMultiple(msg)
    //                 // .then(() => {
    //                 //     context.log('Email sent to ', mailAddress)
    //                 // })
    //                 .catch((error) => {
    //                     context.log(error)
    //                 })
    //         }
    //     })
    // }
    else {
        msg = {
        to: mailAddresses, // Change to your recipient
        from: 'post@bevardovrefjell.no', // Change to your verified sender
        subject: subject,
        text: text,
        // html: '<strong>' + text + '</strong>',

        }
        await sgMail
        .sendMultiple(msg)
        // .then(() => {
        //     context.log('Email sent to ', mailAddress)
        // })
        .catch((error) => {
            context.log(error)
        })
    }

    // Test slutt
    
    // const msg = {
    // to: mailAddresses, // Change to your recipient
    // from: 'post@bevardovrefjell.no', // Change to your verified sender
    // subject: subject,
    // text: text,
    // // html: '<strong>' + text + '</strong>',

    // }
   
    context.res = {
        // status: 200, 200 is default
        body: responseMessage
    };

};