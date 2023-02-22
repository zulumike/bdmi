import React from "react";

function MemberForm() {
    return (
        <form id="memberform" action="javascript:addMember()">
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