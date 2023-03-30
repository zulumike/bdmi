module.exports = async function (context, req) {
    let responseMessage = '';
    const fetch = require("node-fetch");

    const VippsReqType = req.body.vippsreqtype;

    async function vippsGetAccessToken() {
        var myHeaders = new fetch.Headers();
        myHeaders.append("client_id", process.env.VippsClientId);
        myHeaders.append("client_secret", process.env.VippsClientSecret);
        myHeaders.append("Ocp-Apim-Subscription-Key", process.env.VippsOcpKey);
        myHeaders.append("Merchant-Serial-Number", "297975");
        myHeaders.append("Vipps-System-Name", "ZMSoftWare");
        myHeaders.append("Vipps-System-Version", "1.0");
        myHeaders.append("Vipps-System-Plugin-Name", "vipps-ZMSoftWare");
        myHeaders.append("Vipps-System-Plugin-Version", "1.0");
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
        .then(result => {
            responseMessage = result;
            return responseMessage;
        })
        .catch(error => context.log('error', error));
    };

    async function VippsDraftAgreementWithInitialCharge(memberId, amount, amountInitial, phoneNumber) {
        var myHeaders = new fetch.Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "bearer {{access_token}}");
        myHeaders.append("Ocp-Apim-Subscription-Key", process.env.VippsOcpKey);
        myHeaders.append("Merchant-Serial-Number", "297975");
        myHeaders.append("Vipps-System-Name", "ZMSoftWare");
        myHeaders.append("Vipps-System-Version", "1.0");
        myHeaders.append("Vipps-System-Plugin-Name", "vipps-ZMSoftWare");
        myHeaders.append("Vipps-System-Plugin-Version", "1.0");
        myHeaders.append("Cookie", "fpc=AkoUlNbDbt9GhvK1fBIpH6GANjuQAQAAAJg4tdsOAAAA");
        myHeaders.append("Access-Control-Allow-Origin", "*");
        myHeaders.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        myHeaders.append("Idempotency-Key", memberId);

        var raw = JSON.stringify({
            "initialCharge": {
              "amount": amountInitial,
              "description": "Denne betalingen gjelder første medlemsår BDMI",
              "transactionType": "DIRECT_CAPTURE"
            },
            "interval": {
              "unit": "YEAR",
              "count": "1"
            },
            "pricing": {
              "amount": amount,
              "currency": "NOK"
            },
            "merchantRedirectUrl": "https://medlem.bevardovrefjell.no",
            "merchantAgreementUrl": "https://medlem.bevardovrefjell.no",
            "phoneNumber": phoneNumber,
            "productName": "Medlemskontingent BDMI"
          });
          
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };
          
          fetch("https://apitest.vipps.no/recurring/v3/agreements", requestOptions)
            .then(response => response.text())
            .then(result => responseMessage = result)
            .catch(error => context.log('error', error));
    }

    context.log('JavaScript HTTP trigger function processed a request.');

    if (VippsReqType === 'draft-agreement-with-initial') {
        context.log('Vipps draft agreement with initial ', req.body.phonenumber);
        const vippsAccessToken = await vippsGetAccessToken();
        await VippsDraftAgreementWithInitialCharge(vippsAccessToken, req.body.memberid, req.body.amount, req.body.amountinitial, req.body.phoneNumber);
    }

    await vippsGetAccessToken();
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}