import React, { useState } from "react";
import MemberList from './MemberList';
import checkIfMemberExist from "../functions/checkIfMemberExist";
import writeNewMember from "../functions/writeNewMember";
import '../styles/default.css';
import { vippsApiCall } from "../functions/vippsfunctions";




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

    // Call a function in vippsfunctions.js
    // Creates an agreement and charges an initial amount
    function vippsCreateAgreementInit() {
        vippsApiCall({"vippsreqtype":"draft-agreement-with-initial", "memberid":"2023-03-07T14:08:53.130Z61102729", "amount":"20000", "amountinitial":"20000", "phonenumber":"99576014"})
    };

    // Call a function in vippsfunctions.js
    // Creates an agreement and charges an initial amount
    function vippsCreateAgreement() {
        vippsApiCall({"vippsreqtype":"draft-agreement-without-initial", "memberid":"2023-03-07T14:08:53.130Z61102729", "amount":"20000", "phonenumber":"99576014"})
    };

    // call a function in vippsfunction.js
    // Gets agreement info by agreement id
    function vippsGetAgreementInfo() {
        vippsApiCall({"vippsreqtype":"get-agreement", "agreementid":"agr_67YUBv4"});
    };
    
    // call a function in vippsfunction.js
    // Gets charge info by charge id
    function vippsGetChargeInfo() {
        vippsApiCall({"vippsreqtype": "get-charge","agreementid": "agr_67YUBv4", "chargeid": "chr-QDXp8rf"});
    };

    // call a function in vippsfunction.js
    // Charges an agreement
    function vippsCharge() {
        vippsApiCall({"vippsreqtype": "charge", "amount": "20000", "description": "Medlemskontingent BDMI", "due": "2023-04-01", "retryDays": "3", "agreementid": "agr_67YUBv4"});
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
        <button onClick={vippsCreateAgreementInit}>Draft agreement with initial</button>
        <button onClick={vippsCreateAgreement}>Draft agreement</button>
        <button onClick={vippsGetAgreementInfo}>Get Agreement</button>
        <button onClick={vippsCharge}>Charge Agreement</button>
        <button onClick={vippsGetChargeInfo}>Get Charge</button>
        <MemberList />
    </div>
)
}
export default MemberFormAdmin;