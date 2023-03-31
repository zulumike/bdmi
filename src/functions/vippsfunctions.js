
async function vippsGetAxccessToken() {
    
    let apiURL = '';
    if (process.env.NODE_ENV === 'production') {
        apiURL = '/api/Vipps';
    }
    else {
        apiURL = 'http://localhost:7071/api/Vipps';

    }

    fetch(apiURL,{
        method: "POST",
        body: {"vippsreqtype":"getaxxesstoken"}
    })
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};

async function vippsDraftAgreementWithInitialCharge(data) {
    
    let apiURL = '';
    if (process.env.NODE_ENV === 'production') {
        apiURL = '/api/Vipps';
    }
    else {
        apiURL = 'http://localhost:7071/api/Vipps';

    }

    fetch(apiURL,{
        method: "POST",
        body: JSON.stringify({"vippsreqtype":"draft-agreement-with-initial", "memberid":"2023-03-07T14:08:53.130Z61102729", "amount":"200", "amountinitial":"200", "phonenumber":"99576014"})
    })
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};




export { vippsGetAxccessToken, vippsDraftAgreementWithInitialCharge };