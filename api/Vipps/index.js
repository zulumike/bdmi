module.exports = async function (context, req) {
  let responseMessage = '';
  let vippsAccessToken = '';
  const fetch = require("node-fetch");

  const vippsReqType = req.body.vippsreqtype;
  const vippsApiURL = process.env.VippsApiUrl;

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

  async function vippsDraftAgreementWithInitialCharge(amount, amountInitial, phoneNumber, idempotencyKey) {
    myHeaders.append("Authorization", "bearer " + vippsAccessToken);
    myHeaders.append("Idempotency-Key", idempotencyKey);
    context.log('Idempotency-Key', idempotencyKey);

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

  async function vippsDraftAgreementWithoutInitialCharge(amount, phoneNumber, idempotencyKey) {
    myHeaders.append("Authorization", "bearer " + vippsAccessToken);
    myHeaders.append("Idempotency-Key", idempotencyKey);

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
  //    memberId: unique id for this request
  //    amount: amount in nok to be charged each interval
  //    status: status of the agreement. Only valid change is stopped
  //    
  // This functions drafts an agreement and gives back an agreement id and a url that 
  // user gets redirected to or if on smarphone opens vipps app
  // user can then accept agreement

  async function vippsAgreementUpdate(agreementId, memberId, amount, status) {
    myHeaders.append("Authorization", "bearer " + vippsAccessToken);
    myHeaders.append("Idempotency-Key", memberId);

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

//**********************************************
  // FUNCTION vippsAgreementStop
  // params:
  //    agreementId: id of agreement from vipps
  //    
  // This functions stops an agreement

  async function vippsAgreementStop(agreementId, memberId) {
    myHeaders.append("Authorization", "bearer " + vippsAccessToken);
    myHeaders.append("Idempotency-Key", memberId);

    var raw = JSON.stringify({
        "status": "STOPPED"
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

//*************************************************************
  // FUNCTION vippsListAgreements
  // This function calls the vipps api to get a list of agreements

  async function vippsListAgreements() {
    myHeaders.append("Authorization", "bearer " + vippsAccessToken);
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    await fetch(vippsApiURL + "/recurring/v3/agreements", requestOptions)
      .then(response => response.text())
      .then(result => responseMessage = result)
      .catch(error => context.log('error', error));

  };

  async function vippsCharge(agreementId, amount, description, due, retryDays, chargeId) {
    myHeaders.append("Authorization", "bearer " + vippsAccessToken);
    myHeaders.append("Idempotency-Key", chargeId);
    
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

  async function vippsListCharges(agreementId) {
    myHeaders.append("Authorization", "bearer " + vippsAccessToken);
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    await fetch(vippsApiURL + "/recurring/v3/agreements/" + agreementId + "/charges/", requestOptions)
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

//**************************************************
  // FUNCTION vippsRefundCharge
  //params:
  //    agreementId, chargeId, amount, description
  // This function calls the vipps api to refund a charge

  async function vippsRefundCharge(agreementId, chargeId, amount, description) {
    myHeaders.append("Authorization", "bearer " + vippsAccessToken);
    myHeaders.append("Idempotency-Key", chargeId);
    
    var raw = JSON.stringify({
      "amount": amount,
      "description": description
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    await fetch(vippsApiURL + "/recurring/v3/agreements/" + agreementId + "/charges/" + chargeId + "/refund", requestOptions)
      .then(response => response.text())
      .then(result => responseMessage = result)
      .catch(error => context.log('error', error));

  };


  //**************************************************
  // FUNCTION vippsCancelCharge
  //params:
  //    agreementId, chargeId
  // This function calls the vipps api to refund a charge

  async function vippsCancelCharge(agreementId, chargeId) {
    myHeaders.append("Authorization", "bearer " + vippsAccessToken);
    myHeaders.append("Idempotency-Key", chargeId);

    var requestOptions = {
      method: 'DELETE',
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
    await vippsDraftAgreementWithInitialCharge(req.body.amount, req.body.amountinitial, req.body.phonenumber, req.body.idempotencykey);
  }
  else if (vippsReqType === 'draft-agreement-without-initial') {
    context.log('Vipps draft agreement without initial ', req.body.phonenumber);
    await vippsDraftAgreementWithoutInitialCharge(req.body.amount, req.body.phoneNumber, req.body.idempotencykey)
  }
  else if (vippsReqType === 'agreement-update') {
    context.log('Vipps agreement update ', req.body.agreementid);
    await vippsAgreementUpdate(req.body.agreementid, req.body.memberid, req.body.amount, req.body.status);
  }
  else if (vippsReqType === 'agreement-stop') {
    context.log('Vipps stop agreement ', req.body.agreementid);
    await vippsAgreementStop(req.body.agreementid), req.body.memberid;
  }
  else if (vippsReqType === 'get-agreement') {
    context.log('Vipps get agreement ', req.body.agreementid);
    await vippsGetAgreement(req.body.agreementid);
  }
  else if (vippsReqType === 'list-agreements') {
    context.log('Vipps list agreements ');
    await vippsListAgreements();
  }
  else if (vippsReqType === 'charge') {
    context.log('Vipps charge ', req.body.chargeid);
    await vippsCharge(req.body.agreementid, req.body.amount, req.body.description, req.body.due, req.body.retryDays, req.body.chargeid);
  }
  else if (vippsReqType === 'get-charge') {
    context.log('Vipps get charge ', req.body.chargeid);
    await vippsGetCharge(req.body.agreementid, req.body.chargeid);
  }
  else if (vippsReqType === 'list-charges') {
    context.log('Vipps list charges ', req.body.agreementid);
    await vippsListCharges(req.body.agreementid);
  }
  else if (vippsReqType === 'refund-charge') {
    context.log('Vipps refund charge ', req.body.chargeid);
    await vippsRefundCharge(req.body.agreementid, req.body.chargeid, req.body.amount, req.body.description);
  }
  else if (vippsReqType === 'cancel-charge') {
    context.log('Vipps cancel charge ', req.body.chargeid);
    await vippsCancelCharge(req.body.agreementid, req.body.chargeid);
  }

  context.res = {
      // status: 200, /* Defaults to 200 */
      body: responseMessage
  };
}