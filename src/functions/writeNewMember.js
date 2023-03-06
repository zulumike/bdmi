
async function writeNewMember(newMember) {
    let apiBURL = '';
    if (process.env.NODE_ENV === 'production') {
        apiBURL = '/api/DBWrite';
    }
    else {
        apiBURL = 'http://localhost:7071/api/DBWrite';

    }
    newMember.memberid = "*";
    const data = await fetch(apiBURL, {
        method: "POST",
        body: JSON.stringify(newMember)
    });
    return (data);
}

export default writeNewMember;