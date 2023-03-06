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
    let role = 'member';
    const memberList = await readAllMembers();
    for (let i = 0; i < memberList.length; i++) {
        if (memberList[i].phone === phoneNumber) {
            memberExist = true;
            phoneOrEmail = 'Telefonnummer'
            role = memberList[i].role;
        }
        else if (memberList[i].email === emailAddress) {
            memberExist = true;
            phoneOrEmail = 'E-post adresse'
            role = memberList[i].role;
        };
    };
    return [memberExist, phoneOrEmail, role]
};

export default checkIfMemberExist;