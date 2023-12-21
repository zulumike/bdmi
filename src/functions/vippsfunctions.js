
// calls the vipps api with given data
async function vippsApiCall(data) {
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


export { vippsApiCall };