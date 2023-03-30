module.exports = async function (context, req) {
    let responseMessage = '';
    const fetch = require("node-fetch");
    async function vippsGetAxccessToken() {
        var myHeaders = new fetch.Headers();
        myHeaders.append("client_id", "2b45856c-55bb-4e22-8b7e-9859c3e07358");
        myHeaders.append("client_secret", "9H8AtrtN-Xp-ZCHCdPquuElvMkI=");
        myHeaders.append("Ocp-Apim-Subscription-Key", "5b2d3ebc429c42ac8d0806c9a8c46a55");
        myHeaders.append("Merchant-Serial-Number", "297975");
        myHeaders.append("Vipps-System-Name", "postman");
        myHeaders.append("Vipps-System-Version", "2.0");
        myHeaders.append("Vipps-System-Plugin-Name", "vipps-postman");
        myHeaders.append("Vipps-System-Plugin-Version", "2.0");
        myHeaders.append("Cookie", "fpc=AkoUlNbDbt9GhvK1fBIpH6GANjuQAQAAAJg4tdsOAAAA");
        myHeaders.append("Access-Control-Allow-Origin", "*");
        myHeaders.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
        var raw = "";
    
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };
    
        await fetch("https://apitest.vipps.no/accessToken/get", requestOptions)
        .then(response => response.text())
        // .then(result => context.log(result))
        .then(result => responseMessage = result)
        .catch(error => context.log('error', error));
    };



    context.log('JavaScript HTTP trigger function processed a request.');

    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
    await vippsGetAxccessToken();
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}