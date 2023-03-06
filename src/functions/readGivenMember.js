
async function readGivenMember(memberId) {
    let data = {};
    let apiURL = '';
    if (process.env.NODE_ENV === 'production') {
        apiURL = '/api/DBRead';
    }
    else {
        apiURL = 'http://localhost:7071/api/DBRead';

    }

    data = await( await fetch(apiURL, {
        method: "POST",
        body: JSON.stringify({"memberid": memberId})}
        )).json();

    return data;
}

export default readGivenMember;