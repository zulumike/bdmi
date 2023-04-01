module.exports = async function (context, req) {
  let responseMessage = '';
  let vippsAccessToken = '';
  const fetch = require("node-fetch");

  const vippsReqType = req.body.vippsreqtype;
  const vippsApiURL = "https://apitest.vipps.no";

  var myHeaders = new fetch.Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Ocp-Apim-Subscription-Key", process.env.VippsOcpKey);
  myHeaders.append("Merchant-Serial-Number", "297975");
  myHeaders.append("Vipps-System-Name", "ZMSoftWare");
  myHeaders.append("Vipps-System-Version", "1.0");
  myHeaders.append("Vipps-System-Plugin-Name", "vipps-ZMSoftWare");
  myHeaders.append("Vipps-System-Plugin-Version", "1.0");
  myHeaders.append("Cookie", "fpc=AkoUlNbDbt9GhvK1fBIpH6GANjuQAQAAAJg4tdsOAAAA");
  myHeaders.append("Access-Control-Allow-Origin", "*");
  myHeaders.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


//************************************************************
  // FUNCTION vippsGetAccessToken
  // params: none
  // This function provides access token to vipps api
  // Token lasts 1 hour in test environment, 24h in production
  //*************************************************************

  async function vippsGetAccessToken() {
    myHeaders.append("client_id", process.env.VippsClientId);
    myHeaders.append("client_secret", process.env.VippsClientSecret);
    
    var raw = "";

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    await fetch(vippsApiURL + "/accessToken/get", requestOptions)
    .then(response => response.text())
    .then(result => {
        context.log(JSON.parse(result));
        vippsAccessToken = JSON.parse(result).access_token;
    })
    .catch(error => context.log('error', error));
  };

//**********************************************
  // FUNCTION vippsDraftAgreementWithInitalCharge
  // params:
  //    memberId: unique id of member from db
  //    amount: amount in nok to be charged each interval
  //    amountInitial: amout in nok to be initially charged
  //    phoneNumber: phonenumber to be charged
  // This functions drafts an agreement and gives back an agreement id and a url that 
  // user gets redirected to or if on smarphone opens vipps app
  // user can then accept agreement and initial charge

  async function vippsDraftAgreementWithInitialCharge(requestId, amount, amountInitial, phoneNumber) {
    myHeaders.append("Authorization", "bearer " + vippsAccessToken);
    myHeaders.append("Idempotency-Key", requestId);

    var raw = JSON.stringify({
        "initialCharge": {
          "amount": amountInitial,
          "description": "Betaling gjelder første medlemsår BDMI",
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
      
      await fetch(vippsApiURL + "/recurring/v3/agreements", requestOptions)
        .then(response => response.text())
        .then(result => {
          responseMessage = result;
          context.log(result);
        })
        .catch(error => context.log('error', error));
    };

//**********************************************
  // FUNCTION vippsDraftAgreementWithoutInitalCharge
  // params:
  //    memberId: unique id of member from db
  //    amount: amount in nok to be charged each interval
  //    phoneNumber: phonenumber to be charged
  // This functions drafts an agreement and gives back an agreement id and a url that 
  // user gets redirected to or if on smarphone opens vipps app
  // user can then accept agreement

  async function vippsDraftAgreementWithoutInitialCharge(requestId, amount, phoneNumber) {
    myHeaders.append("Authorization", "bearer " + vippsAccessToken);
    myHeaders.append("Idempotency-Key", requestId);

    var raw = JSON.stringify({
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
      
      await fetch(vippsApiURL + "/recurring/v3/agreements", requestOptions)
        .then(response => response.text())
        .then(result => {
          responseMessage = result;
          context.log(result);
        })
        .catch(error => context.log('error', error));
  };

//**********************************************
  // FUNCTION vippsAgreementUpdate
  // params:
  //    agreementId: id of agreement from vipps
  //    requestid: unique id for this request
  //    amount: amount in nok to be charged each interval
  //    status: status of the agreement. Only valid change is stopped
  //    
  // This functions drafts an agreement and gives back an agreement id and a url that 
  // user gets redirected to or if on smarphone opens vipps app
  // user can then accept agreement

  async function vippsAgreementUpdate(agreementId, requestId, amount, status) {
    myHeaders.append("Authorization", "bearer " + vippsAccessToken);
    myHeaders.append("Idempotency-Key", requestId);

    var raw = JSON.stringify({
        "pricing": {
          "amount": amount,
          "currency": "NOK"
        }
      });

      var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      await fetch(vippsApiURL + "/recurring/v3/agreements/" + agreementId, requestOptions)
        .then(response => response.text())
        .then(result => {
          responseMessage = result;
          context.log(result);
        })
        .catch(error => context.log('error', error));
  };

//*************************************************************
  // FUNCTION vippsGetAgreement
  // params:
  //    agreementId: agreementid from vipps
  // This function calls the vipps api to get status of agreement

  async function vippsGetAgreement(agreementId) {
    myHeaders.append("Authorization", "bearer " + vippsAccessToken);
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    await fetch(vippsApiURL + "/recurring/v3/agreements/" + agreementId, requestOptions)
      .then(response => response.text())
      .then(result => responseMessage = result)
      .catch(error => context.log('error', error));

  };

  async function vippsCharge(agreementId, amount, description, due, retryDays, requestID) {
    myHeaders.append("Authorization", "bearer " + vippsAccessToken);
    myHeaders.append("Idempotency-Key", requestID);
    
    var raw = JSON.stringify({
      "amount": amount,
      "description": description,
      "due": due,
      "retryDays": retryDays,
      "transactionType": "DIRECT_CAPTURE"
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    await fetch(vippsApiURL + "/recurring/v3/agreements/" + agreementId + "/charges", requestOptions)
      .then(response => response.text())
      .then(result => responseMessage = result)
      .catch(error => context.log('error', error));

  };

//*************************************************************
  // FUNCTION vippsGetCharge
  // params:
  //    chargeId: chargeid from vipps
  // This function calls the vipps api to get status and history of charge

  async function vippsGetCharge(agreementId, chargeId) {
    myHeaders.append("Authorization", "bearer " + vippsAccessToken);
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    await fetch(vippsApiURL + "/recurring/v3/agreements/" + agreementId + "/charges/" + chargeId, requestOptions)
      .then(response => response.text())
      .then(result => responseMessage = result)
      .catch(error => context.log('error', error));

  };

  await vippsGetAccessToken();
  context.log(vippsReqType);
  if (vippsReqType === 'draft-agreement-with-initial') {
    context.log('Vipps draft agreement with initial ', req.body.phonenumber);
    await vippsDraftAgreementWithInitialCharge(req.body.memberid, req.body.amount, req.body.amountinitial, req.body.phoneNumber);
  }
  else if (vippsReqType === 'draft-agreement-without-initial') {
    context.log('Vipps draft agreement without initial ', req.body.phonenumber);
    await vippsDraftAgreementWithoutInitialCharge(req.body.memberid, req.body.amount, req.body.phoneNumber)
  }
  else if (vippsReqType === 'agreement-update') {
    context.log('Vipps agreement update ', req.body.agreementid);
    await vippsAgreementUpdate(req.body.agreementid, req.body.requestid, req.body.amount, req.body.status);
  }
  else if (vippsReqType === 'get-agreement') {
    context.log('Vipps get agreement ', req.body.agreementid);
    await vippsGetAgreement(req.body.agreementid);
  }
  else if (vippsReqType === 'charge') {
    context.log('Vipps charge ', req.body.chargeid);
    await vippsCharge(req.body.agreementid, req.body.amount, req.body.description, req.body.due, req.body.retryDays, req.body.requestid);
  }
  else if (vippsReqType === 'get-charge') {
    context.log('Vipps get charge ', req.body.chargeid);
    await vippsGetCharge(req.body.agreementid, req.body.chargeid);
  }
  context.res = {
      // status: 200, /* Defaults to 200 */
      body: responseMessage
  };
}