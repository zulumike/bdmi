import React, { useState } from "react";
import MemberList from './MemberList';
import checkIfMemberExist from "../functions/checkIfMemberExist";
import writeNewMember from "../functions/writeNewMember";
import '../styles/default.css';
import { vippsGetAxccessToken } from "../functions/vippsfunctions";




//*************************
// FUNCTION MemberFormAdmin
// Creates form and upon submit stores data to db

function MemberFormAdmin(user) {
    const [formInputs, setFormInputs] = useState({'status': 'Registrert', 'role': 'Medlem'});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    }

    //********************
    // FUNCTION submitForm
    // Calls addMemberToDB with data to be stored

    async function submitForm(event) {
        event.preventDefault();
        const [memberExist, phoneOrEmail] = await checkIfMemberExist(formInputs.phone, formInputs.email);
        if (memberExist) alert(phoneOrEmail + ' er registert fra før!')
        else {
            formInputs.createdby = user.userLoggedIn;
            formInputs.role = 'Medlem'
            const writeResult = writeNewMember(formInputs);
            writeResult.then((responseMessage) => {
                if (responseMessage.status !== 200) alert('Lagring feilet! Feilmelding: ', responseMessage.statusText);
                setFormInputs({'status': 'Registrert', 'role': 'Medlem'});
                document.location.reload();
            });
        };
    };

return (
    <div className='memberformadmintoppdiv'>
        <form className="memberadminform" id="memberform" onSubmit={submitForm}>
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
                required
                onChange={formChange}
                />
            <input 
                type="tel" 
                name="phone"
                value={formInputs.phone || ""}
                id="idphone" 
                placeholder="Mobilnummer" 
                pattern="[0-9]{8}"
                required
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
            <label htmlFor='idstatus'>Status: </label>
            <select 
                name="status"
                id="idstatus"
                form="memberform"
                required
                value={formInputs.status || ""}
                onChange={formChange}
                >
                <option value = "Registrert">Registrert</option>
                <option value = "Aktiv">Aktiv</option>
            </select>
            <br/>
            <br/>
            <input type="submit" value="Registrer" />
        </form>
        <button onClick={vippsGetAxccessToken}>Get Acces Token</button>
        <MemberList />
    </div>
)
}
export default MemberFormAdmin;