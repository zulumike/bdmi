async function updateMember(id, member) {
    let apiURL = '';
    if (process.env.NODE_ENV === 'production') {
        apiURL = '/api/DBWrite';
    }
    else {
        apiURL = 'http://localhost:7071/api/DBWrite';

    }
    member.memberid = id;
    const data = await fetch(apiURL, {
        method: "POST",
        body: JSON.stringify(member)
    });
    return (data);
}

export default updateMember;