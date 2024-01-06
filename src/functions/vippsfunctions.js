
// calls the vipps api with given data
export async function vippsApiCall(data) {
    let apiURL = '';
    if (process.env.NODE_ENV === 'production') {
        apiURL = '/api/Vipps';
    }
    else {
        apiURL = 'http://localhost:7071/api/Vipps';

    }

    let vippsResponse = {};

    await fetch(apiURL,{
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(result => {
        vippsResponse = result;
    })
    .catch(error => console.log('error', error));
    return (vippsResponse);
};

export async function vippsDraftAgreement(memberId, amount, initialAmount, phone, idempotencyKey) {
    const vippsResponse = await vippsApiCall({"vippsreqtype":"draft-agreement-with-initial", "memberid":memberId, "amount":amount, "amountinitial":initialAmount, "phonenumber":phone, "idempotencykey":idempotencyKey});
    const vippsResult = JSON.parse(vippsResponse);
    return (vippsResult);
};

export async function vippsGetAgreement(agreementId) {
    const vippsResponse = await vippsApiCall({"vippsreqtype":"get-agreement", "agreementid":agreementId});
    const vippsResult = JSON.parse(vippsResponse);
    return (vippsResult);
};

export async function vippsUpdateAgreement(memberId, agreementId, amount){
    const vippsResponse = await vippsApiCall({"vippsreqtype":"agreement-update", "memberid":memberId, "agreementid":agreementId, "amount":amount});
    if (vippsResponse) {
        return (JSON.parse(vippsResponse));
    }
    else return ({status: 'succeded'});
};

export async function vippsStopAgreement(memberId,agreementId) {
    const vippsResponse = await vippsApiCall({"vippsreqtype":"agreement-stop", "memberid":memberId, "agreementid":agreementId});
    if (vippsResponse) {
        return (JSON.parse(vippsResponse));
    }
    else return ({status: 'succeded'});
};

export async function vippsCreateCharge(amount, description, dueDate, retryDays, agreementId, chargeId) {
    const vippsResponse = await vippsApiCall({"vippsreqtype": "charge", "amount": amount, "description": description, "due": dueDate, "retryDays": retryDays, "agreementid": agreementId, "chargeid": chargeId}); // chargeid here is used for idempotency-key NOT vipps chargeId
    const vippsResult = JSON.parse(vippsResponse);
    return (vippsResult);
};

export async function vippsListCharges(agreementId) {
    const vippsResponse = await vippsApiCall({"vippsreqtype":"list-charges", "agreementid":agreementId});
    const vippsResult = JSON.parse(vippsResponse);
    return (vippsResult);
};

export async function vippsGetCharge(agreementId, chargeId) {
    const vippsResponse = await vippsApiCall({"vippsreqtype":"get-charge", "agreementid":agreementId, "chargeid":chargeId});
    const vippsResult = JSON.parse(vippsResponse);
    return (vippsResult);
};

export async function vippsRefundCharge(amount, description, agreementId, chargeId) {
    const vippsResponse = await vippsApiCall({"vippsreqtype": "refund-charge", "amount": amount, "description": description, "agreementid": agreementId, "chargeid": chargeId});
    const vippsResult = JSON.parse(vippsResponse);
    return (vippsResult);
};

export async function vippsCancelCharge(agreementId, chargeId) {
    const vippsResponse = await vippsApiCall({"vippsreqtype": "cancel-charge", "agreementid": agreementId, "chargeid": chargeId});
    if (vippsResponse) {
        return (JSON.parse(vippsResponse));
    }
    else return ({status: 'succeded'});
};

export async function vippsCheckIfAllPayed(agreementId) {
    let allPayed = true;
    let dueAmount = 0;
    let pendingAmount = 0;
    let reservedAmount = 0;
    let chargedAmount = 0;
    let partiallyCapturedAmount = 0;
    let failedAmount = 0;
    let cancelledAmount = 0;
    let partiallyRefundedAmount = 0;
    let refundedAmount = 0;
    let processingAmount = 0;

    const vippsResponse = await vippsApiCall({"vippsreqtype":"list-charges", "agreementid":agreementId});
    const vippsResult = JSON.parse(vippsResponse);
    for (let i = 0; i < vippsResult.length; i++) {
        if (vippsResult[i].status === 'PENDING') {
            allPayed = false;
            pendingAmount += (vippsResult[i].amount / 100);
        }
        else if (vippsResult[i].status === 'DUE') {
            allPayed = false;
            dueAmount += (vippsResult[i].amount / 100);
        }
        else  if (vippsResult[i].status === 'RESERVED') {
            allPayed = false;
            reservedAmount += (vippsResult[i].amount / 100);
        }
        else  if (vippsResult[i].status === 'CHARGED') {
            allPayed = true;
            chargedAmount += (vippsResult[i].amount / 100);
        }
        else if (vippsResult[i].status === 'PARTIALLY_CAPTURED') {
            allPayed = false;
            partiallyCapturedAmount += (vippsResult[i].amount / 100);
        }
        else  if (vippsResult[i].status === 'FAILED') {
            allPayed = false;
            failedAmount += (vippsResult[i].amount / 100);
        }
        else  if (vippsResult[i].status === 'CANCELLED') {
            cancelledAmount += (vippsResult[i].amount / 100);
        }
        else  if (vippsResult[i].status === 'PARTIALLY_REFUNDED') {
            allPayed = false;
            partiallyRefundedAmount += (vippsResult[i].amount / 100);
        }
        else  if (vippsResult[i].status === 'REFUNDED') {
            refundedAmount += (vippsResult[i].amount / 100);
        }
        else  if (vippsResult[i].status === 'PROCESSING') {
            allPayed = false;
            processingAmount += (vippsResult[i].amount / 100);
        };    
    };
    const payedAmount = chargedAmount - partiallyRefundedAmount - refundedAmount;
    const remainingAmount = dueAmount + reservedAmount + partiallyCapturedAmount + failedAmount + processingAmount;
    const chargeData = { allPayed, payedAmount, remainingAmount, pendingAmount, dueAmount, reservedAmount, chargedAmount, partiallyCapturedAmount, failedAmount, cancelledAmount, partiallyRefundedAmount, refundedAmount, processingAmount };
    return chargeData;
};
