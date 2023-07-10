import React, { useState } from "react";
import updateMember from "../functions/updateMember";


function FamilyMembers({member}) {
    
    const [formInputs, setFormInputs] = useState({});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    };
    console.log(member.family);
    const testData = Object.entries(member.family);
    testData.map((members, index) => console.log(members))
    
    async function submitForm(event) {
        event.preventDefault();
        const familyMemberId = new Date().toISOString() + Math.random().toString().substring(2, 10);
        const memberData = member;
        if (!memberData.family) {
            memberData.family = {};
        };
        memberData.family[familyMemberId] = formInputs;
        console.log(memberData);
        const writeResult = await updateMember(member.id, memberData);
        if (writeResult.status !== 200) alert('Lagring feilet! Feilmelding: ', writeResult.statusText);
        setFormInputs({});
        // document.location.reload();
    };


    return (
        <div>
            <form className="memberform" id="memberform" onSubmit={submitForm}>
                <input 
                    type="text" 
                    name="firstname"
                    value={formInputs.firstname || ""}
                    id="idfirstname" 
                    autoFocus={true}
                    maxLength="50" 
                    placeholder="Fornavn" 
                    required
                    onChange={formChange}
                    />
                <input 
                    type="text" 
                    name="lastname" 
                    value={formInputs.lastname || ""}
                    id="idlastname" 
                    maxLength="50" 
                    placeholder="Etternavn" 
                    required
                    onChange={formChange}
                    />
                <input 
                    type="email" 
                    name="email"
                    value={formInputs.email || ""}
                    id="idemail" 
                    placeholder="E-post" 
                    onChange={formChange}
                    />
                <input 
                    type="tel" 
                    name="phone"
                    value={formInputs.phone || ""}
                    id="idphone" 
                    placeholder="Mobilnummer" 
                    pattern="[0-9]{8}"
                    onChange={formChange}
                    />
                <input 
                    type="text" 
                    name="zipcode"
                    value={formInputs.zipcode || ""}
                    id="idzipcode" 
                    placeholder="Postnr" 
                    pattern="\d{4}"
                    required
                    onChange={formChange}
                    />
                <br/>    
                <input type="submit" value="Legg til" />
            </form>
            <br/>
            
        </div>
    )
}

export default FamilyMembers;