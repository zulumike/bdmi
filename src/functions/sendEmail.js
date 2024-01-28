//*************************
// FUNCTION senEmail
// params: 
//      title, body: string from EmailSending form
//      file: file attachement from EmailSending form
//      rec: recievers. All, Active or Registered members
// Calls api to send email to members

async function sendEmail(title, body, mailAddress, fileName, fileUrl) {
    let apiURL = '';
    if (process.env.NODE_ENV === 'production') {
        apiURL = '/api/SparkPost';
    }
    else {
        apiURL = 'http://localhost:7071/api/SparkPost';

    };

    
    // if (process.env.NODE_ENV === 'production') {
        //     apiURL = '/api/SendEmail';
        // }
        // else {
            //     apiURL = 'http://localhost:7071/api/SendEmail';
            
            // };
            
    let messageData = {};
    messageData.mailAddress = [];

    for (let i = 0; i < mailAddress.length; i++) {
        messageData.mailAddress.push({'address': mailAddress[i]});
    };

    console.log(messageData.mailAddress);
    
    messageData.subject = title;
    messageData.text = body;
    // messageData.mailAddress = 'ole@zmmaskin.no';
    messageData.fileName = fileName;
    messageData.fileUrl = fileUrl;
    const responseMessage = await fetch(apiURL, {
        method: "POST",
        body: JSON.stringify(messageData)
    });
    const emailResult = await responseMessage.text();
    return (emailResult);
};

export default sendEmail;