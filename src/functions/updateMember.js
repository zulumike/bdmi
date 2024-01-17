import calculateFamily from "./calculateFamily";

async function updateMember(id, member) {
    let apiURL = '';
    if (process.env.NODE_ENV === 'production') {
        apiURL = '/api/DBWrite';
    }
    else {
        apiURL = 'http://localhost:7071/api/DBWrite';

    }

    const [familyCount, familyPrice] = calculateFamily(member.family);

    member.price = familyPrice;
    member.familycount = familyCount;

    member.id = id;
    member.email = member.email.toLowerCase();
    member.name = member.lastname + ', ' + member.firstname;
    const data = await fetch(apiURL, {
        method: "POST",
        body: JSON.stringify(member)
    });
    return (data);
}

export default updateMember;