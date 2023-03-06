
async function readAllMembers() {
    let data = {};
    let readFromDBURL = '';
    if (process.env.NODE_ENV === 'production') {
        readFromDBURL = '/api/DBRead';
    }
    else {
        readFromDBURL = 'http://localhost:7071/api/DBRead';

    }

    data = await( await fetch(readFromDBURL, {
        method: "POST",
        body: JSON.stringify({"memberid": "*"})
    }
    )).json();

    return data;
}

export default readAllMembers;