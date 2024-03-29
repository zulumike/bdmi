import readAllMembers from "../functions/readAllMembers";

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
    const memberList = await readAllMembers();
    for (let i = 0; i < memberList.length; i++) {
        if (phoneNumber !=='' &&  memberList[i].phone === phoneNumber) {
            memberExist = true;
            phoneOrEmail = 'Telefonnummer'
            role = memberList[i].role;
            id = memberList[i].id;
            token = memberList[i].token;
        }
        else if (memberList[i].email === emailAddress) {
            memberExist = true;
            phoneOrEmail = 'E-post adresse'
            role = memberList[i].role;
            id = memberList[i].id;
            token = memberList[i].token;
        };
    };
    return [memberExist, phoneOrEmail, role, id, token]
};

export default checkIfMemberExist;