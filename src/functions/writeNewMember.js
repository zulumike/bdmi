
import calculateFamily from "./calculateFamily";

async function writeNewMember(newMember) {

    let apiURL = '';
    if (process.env.NODE_ENV === 'production') {
        apiURL = '/api/DBWrite';
    }
    else {
        apiURL = 'http://localhost:7071/api/DBWrite';

    }

    const [familyCount, familyPrice] = calculateFamily(newMember.family);

    newMember.price = familyPrice;
    newMember.familycount = familyCount;

    newMember.type = "new";
    newMember.email = newMember.email.toLowerCase();
    newMember.name = newMember.lastname + ', ' + newMember.firstname;
    newMember.deleted = "false";
    const data = await fetch(apiURL, {
        method: "POST",
        body: JSON.stringify(newMember)
    });
    return (data);
}

export default writeNewMember;