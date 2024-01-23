import React, { useState, useEffect } from "react";
import updateMember from "../functions/updateMember";
import calculateFamily from "../functions/calculateFamily";
import sendEmail from "../functions/sendEmail";

function FamilyMembers({member}) {
    const oldMemberData = member;
    const [formInputs, setFormInputs] = useState({});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    };

    const [ familyData, setFamilyData ] = useState([]);
    useEffect(() => {
        if (member.family) {
            setFamilyData(Object.values(member.family));
        }
        else {
            setFamilyData([]);
    
        };
    }, [member.family]
    );

    const familyChange = (index, event) => {
        let data = [...familyData];
        data[index][event.target.name] = event.target.value;
        setFamilyData(data);
    };

    async function emailIfUpdateRequired(newPrice) {
        if (member.invoicechannel === "email" && newPrice !== oldMemberData.price) {
            const extraCharge = newPrice - oldMemberData.price;
            const invoiceEmailTitle = 'Bevar Dovrefjell mellom istidene kontingent';
            let extraText = 'Vennligst betal inn mellomlegget ' + extraCharge + ',-\nBruk vipps #551769.\nEller bankoverføring til konto 9365 19 94150.\n';
            if (extraCharge < 1) {
                extraText = 'Du trenger ikke betale inn noe, da årsbeløpet ikke har økt.';
            };
            const invoiceEmailBody = 'Tusen takk for at du er medlem og støtter oss.\nDu har endret antall familiemedlemmer.\nNytt års-beløp er ' + newPrice + ',-\n' + extraText;
            await sendEmail(invoiceEmailTitle, invoiceEmailBody, [member.email], '', '');
        };
    };

    function submitForm(event) {
        event.preventDefault();
        const familyMemberId = new Date().toISOString() + Math.random().toString().substring(2, 10);
        const memberData = member;
        if (!memberData.family) {
            memberData.family = {};
        };
        memberData.family[familyMemberId] = formInputs;
        member = memberData;
        setFamilyData(Object.values(memberData.family));
        setFormInputs({});
    };
    
    function deleteFamilyMember(index, event) {
        event.preventDefault();
        const familyDataCopy = familyData.slice(0, index).concat(familyData.slice(index+1));
        setFamilyData(familyDataCopy);

        const deleteKey = Object.keys(member.family)[index];
        delete member.family[deleteKey];
    };

    async function saveMember(event) {
        event.preventDefault();
        const [ newFamilyCount, newFamilyPrice ] = calculateFamily(familyData);
        member.familycount = newFamilyCount;
        emailIfUpdateRequired(newFamilyPrice);
        const writeResult = await updateMember(member.id, member);
        if (writeResult.status !== 200) alert('Lagring feilet! Feilmelding: ', writeResult.statusText);
        document.location.reload();
    };

    return (
        <div>
            <form className="familymemberform" id="memberform" onSubmit={submitForm}>
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
                <input type="submit" value="Legg til" />
            </form>
            <br/>
            <form>
                {familyData.map((familyMemberData, index) => {
                    return (
                        <div key={index}>
                            <button className="deletebtn" onClick={event => deleteFamilyMember(index, event)}>Slett</button>
                            <input
                            name='firstname'
                            placeholder='Fornavn'
                            required
                            value={familyMemberData.firstname}
                            onChange={event => familyChange(index, event)}
                            />
                            <input
                            name='lastname'
                            placeholder='Etternavn'
                            required
                            value={familyMemberData.lastname}
                            onChange={event => familyChange(index, event)}
                            />
                            <input
                            type="email"
                            name='email'
                            placeholder='E-post'
                            value={familyMemberData.email}
                            onChange={event => familyChange(index, event)}
                            />
                            <input
                            type="tel"
                            name='phone'
                            placeholder='Mobilnummer'
                            pattern="[0-9]{8}"
                            value={familyMemberData.phone}
                            onChange={event => familyChange(index, event)}
                            />
                            <input
                            name='zipcode'
                            placeholder='Postnr'
                            pattern="\d{4}"
                            required
                            value={familyMemberData.zipcode}
                            onChange={event => familyChange(index, event)}
                            />
                        </div>
                    )
                } )}
                <button onClick={saveMember}>Lagre</button>
                <br/>
            </form>
        </div>
    )
}

export default FamilyMembers;