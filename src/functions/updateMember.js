async function updateMember(id, member) {
    let apiURL = '';
    if (process.env.NODE_ENV === 'production') {
        apiURL = '/api/DBWrite';
    }
    else {
        apiURL = 'http://localhost:7071/api/DBWrite';

    }
    member.id = id;
    member.name = member.lastname + ', ' + member.firstname;
    console.log(member);
    const data = await fetch(apiURL, {
        method: "POST",
        body: JSON.stringify(member)
    });
    return (data);
}

export default updateMember;