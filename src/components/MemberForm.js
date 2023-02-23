import React from "react";

// const [addMemberFName, setaddMemberFName] = useState("");
// const [addMemberLName, setAddMemberLName] = useState("");
// const [addMemberEmail, setaddMemberEmail] = useState("");
// const [addMemberPhone, setaddMemberPhone] = useState("");
// const addMemberRole = "member";
// const addMemberStatus = "registered";
// let saveToDBOK = false;

function MemberForm() {
    return (
        <form id="memberform">
            <input 
                type="text" 
                name="firstname" 
                id="idfirstname" 
                autofocus="true" 
                maxlength="50" 
                placeholder="Fornavn" 
                required />
            <input 
                type="text" 
                name="lastname" 
                id="idlastname" 
                maxlength="50" 
                placeholder="Etternavn" 
                required />
            <input 
                type="email" 
                name="email" 
                id="idemail" 
                placeholder="E-post" 
                required />
            <input 
                type="tel" 
                name="phone" 
                id="idphone" 
                placeholder="Mobilnummer" 
                pattern="[0-9]{8}"
                required />
            <input type="submit" value="Send inn" />
        </form>

    )
}

export default MemberForm;