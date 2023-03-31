
// calls the vipps api with given data
async function vippsApiCall(data) {
    let apiURL = '';
    if (process.env.NODE_ENV === 'production') {
        apiURL = '/api/Vipps';
    }
    else {
        apiURL = 'http://localhost:7071/api/Vipps';

    }

    fetch(apiURL,{
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};


export { vippsApiCall };