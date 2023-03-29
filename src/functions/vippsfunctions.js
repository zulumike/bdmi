
function vippsGetAxccessToken() {
    var myHeaders = new Headers();
    myHeaders.append("client_id", "2b45856c-55bb-4e22-8b7e-9859c3e07358");
    myHeaders.append("client_secret", "9H8AtrtN-Xp-ZCHCdPquuElvMkI=");
    myHeaders.append("Ocp-Apim-Subscription-Key", "5b2d3ebc429c42ac8d0806c9a8c46a55");
    myHeaders.append("Merchant-Serial-Number", "297975");
    myHeaders.append("Vipps-System-Name", "postman");
    myHeaders.append("Vipps-System-Version", "2.0");
    myHeaders.append("Vipps-System-Plugin-Name", "vipps-postman");
    myHeaders.append("Vipps-System-Plugin-Version", "2.0");
    myHeaders.append("Cookie", "fpc=AkoUlNbDbt9GhvK1fBIpH6GANjuQAQAAAJg4tdsOAAAA");

    var raw = "";

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("https://apitest.vipps.no/accessToken/get", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};

export { vippsGetAxccessToken };