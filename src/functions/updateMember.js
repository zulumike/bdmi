async function updateMember(id, member) {
    let apiBURL = '';
    if (process.env.NODE_ENV === 'production') {
        apiBURL = '/api/DBWrite';
    }
    else {
        apiBURL = 'http://localhost:7071/api/DBWrite';

    }
    member.memberid = id;
    const data = await fetch(apiBURL, {
        method: "POST",
        body: JSON.stringify(member)
    });
    return (data);
}

export default updateMember;