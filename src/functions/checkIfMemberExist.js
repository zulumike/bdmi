// import readAllMembers from "../functions/readAllMembers";

//***********************
// FUNCTION checkIfPhoneExist
// Params: 
//  phoneNumber: string
// 
// calls api to read all members into an array
// checks if emailaddress og phonenumber (from param) exists in array
// returns array with two values:
// memberExist: boolean
// phoneOrEmail: string

async function checkIfMemberExist(phoneNumber, emailAddress) {
    let memberExist = false;
    let phoneOrEmail = '';
    let role = 'medlem';
    let id = '';
    let token = '';

    let data = {};
    let dataBody = {};
    let apiURL = '';
    if (process.env.NODE_ENV === 'production') {
        apiURL = '/api/MemberExist';
    }
    else {
        apiURL = 'http://localhost:7071/api/MemberExist';

    }

    if (emailAddress !== '') {
        dataBody = JSON.stringify({"email": emailAddress, "phone": '', "id": ''});
    }
    else if (phoneNumber !== '') {
        dataBody = JSON.stringify({"phone": phoneNumber, "email": '', "id": ''});
    }

    data = await( await fetch(apiURL, {
        method: "POST",
        body: dataBody
    }
    )).json();
    console.log(data);
    if (data.result === 'no user') {
        memberExist = false;
    }
    else if (data.result === 'email exist') {
        memberExist = true;
        phoneOrEmail = 'E-post adresse';
        role = data.role;
        id = data.id;
        token = data.token;
    }
    else if (data.result === 'phone exist') {
        memberExist = true;
        phoneOrEmail = 'Telefonnummer';
        role = data.role;
        id = data.id;
        token = data.token;
    }

    // const memberList = await readAllMembers();
    // for (let i = 0; i < memberList.length; i++) {
    //     if (phoneNumber !=='' &&  memberList[i].phone === phoneNumber) {
    //         memberExist = true;
    //         phoneOrEmail = 'Telefonnummer'
    //         role = memberList[i].role;
    //         id = memberList[i].id;
    //         token = memberList[i].token;
    //     }
    //     else if (memberList[i].email === emailAddress) {
    //         memberExist = true;
    //         phoneOrEmail = 'E-post adresse'
    //         role = memberList[i].role;
    //         id = memberList[i].id;
    //         token = memberList[i].token;
    //     };
    // };
    return [memberExist, phoneOrEmail, role, id, token]
};

export default checkIfMemberExist;