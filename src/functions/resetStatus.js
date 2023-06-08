import readAllMembers from "../functions/readAllMembers";

async function resetStatus(id) {
    let apiURL = '';
    let member = [];
    if (process.env.NODE_ENV === 'production') {
        apiURL = '/api/DBWrite';
    }
    else {
        apiURL = 'http://localhost:7071/api/DBWrite';

    };
    if (id === 'all') {
        const allMembers = await readAllMembers();
        for (let i = 0; i < allMembers.length; i++) {
            member = allMembers[i];
            member.status = 'Registrert';
            await fetch(apiURL, {
                method: "POST",
                body: JSON.stringify(member)
            })
        };
    }
    else {
        member.id = id;
        member.name = member.lastname + ', ' + member.firstname;
        member.status = 'Registrert';
        const data = await fetch(apiURL, {
            method: "POST",
            body: JSON.stringify(member)
        });
        return (data);
    }
}

export default resetStatus;