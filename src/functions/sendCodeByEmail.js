//*************************
// FUNCTION sendCodeByEmail
// params: 
//      mailaddress: string from memberForm
//      code: string with random code from memberForm
// Calls api to send random code by email

async function sendCodeByEmail(mailAddress, code) {
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

    // }

    let messageData = {};
    messageData.mailAddress = [{'address': mailAddress}];
    messageData.subject = 'Velkommen til Bevar Dovrefjell';
    messageData.text = 'Tast inn følgende kode for å fullføre innlogging/registrering: ' + code;
    
    const responseMessage = await fetch(apiURL, {
        method: "POST",
        body: JSON.stringify(messageData)
    });
    const emailResult = await responseMessage.text();
    return (emailResult);
};

export default sendCodeByEmail;