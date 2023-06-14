import React, { useState } from "react";
import ReactModal from "react-modal";
import Modal from "react-modal";
import MemberList from './MemberList';
import checkIfMemberExist from "../functions/checkIfMemberExist";
import writeNewMember from "../functions/writeNewMember";
import EmailSending from "./EmailSending";
import '../styles/default.css';
// import { vippsApiCall } from "../functions/vippsfunctions";




//*************************
// FUNCTION MemberFormAdmin
// Creates form and upon submit stores data to db

function MemberFormAdmin(user) {
    const [formInputs, setFormInputs] = useState({'status': 'Registrert', 'role': 'Medlem'});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    };

    Modal.setAppElement('#root');
    const [modalOpen, setModalOpen] = useState(false);

    function openEmailSender() {
        setModalOpen(true);
    };

    function closeEmailSender() {
        setModalOpen(false);
    };

    //********************
    // FUNCTION submitForm
    // Calls addMemberToDB with data to be stored

    async function submitForm(event) {
        event.preventDefault();
        const [memberExist, phoneOrEmail] = await checkIfMemberExist(formInputs.phone, formInputs.email);
        console.log(formInputs.phone);
        if ((memberExist) && (formInputs.phone !== undefined)) alert(phoneOrEmail + ' er registert fra før!')
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
    // function vippsCreateAgreementInit() {
    //     vippsApiCall({"vippsreqtype":"draft-agreement-with-initial", "memberid":"2023-03-07T14:08:53.130Z61102729", "amount":"20000", "amountinitial":"20000", "phonenumber":"99576014"})
    // };

    // // Call a function in vippsfunctions.js
    // // Creates an agreement and charges an initial amount
    // function vippsCreateAgreement() {
    //     vippsApiCall({"vippsreqtype":"draft-agreement-without-initial", "memberid":"2023-03-07T14:08:53.130Z61102729", "amount":"20000", "phonenumber":"99576014"})
    // };

    // // Call a function in vippsfunctions.js
    // // Updates an agreement
    // function vippsUpdateAgreement() {
    //     vippsApiCall({"vippsreqtype":"agreement-update", "agreementid":"agr_67YUBv4", "requestid":"2023-03-07T14:08:53.130Z61102729-2023", "amount":"40000", "status":"active"});
    // };
    
    // // call a function in vippsfunction.js
    // // Gets agreement info by agreement id
    // function vippsGetAgreementInfo() {
    //     vippsApiCall({"vippsreqtype":"get-agreement", "agreementid":"agr_67YUBv4"});
    // };

    // // call a function in vippsfunction.js
    // // Charges an agreement
    // function vippsCharge() {
    //     vippsApiCall({"vippsreqtype": "charge", "amount": "20000", "description": "Medlemskontingent BDMI", "due": "2023-04-03", "retryDays": "3", "agreementid": "agr_67YUBv4", "requestid": "2023-03-07T14:08:53.130Z61102729-2023"});
    // };
    
    // // call a function in vippsfunction.js
    // // Gets charge info by charge id
    // function vippsGetChargeInfo() {
    //     vippsApiCall({"vippsreqtype": "get-charge","agreementid": "agr_67YUBv4", "chargeid": "chr-QDXp8rf"});
    // };

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
        {/* <button onClick={vippsCreateAgreementInit}>Draft agreement with initial</button>
        <button onClick={vippsCreateAgreement}>Draft agreement</button>
        <button onClick={vippsGetAgreementInfo}>Get Agreement</button>
        <button onClick={vippsUpdateAgreement}>Update Agreement</button>
        <button onClick={vippsCharge}>Charge Agreement</button>
        <button onClick={vippsGetChargeInfo}>Get Charge</button> */}
        <button onClick={openEmailSender}>E-post utsending</button>
        <MemberList />
        <ReactModal 
            className='modal'
            ovarlayClassName='modaloverlay'
            isOpen={modalOpen}
            onRequestClose={closeEmailSender}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={true}
            >
            <EmailSending />
            <button onClick={closeEmailSender}>Avbryt</button>
            </ReactModal>
    </div>
)
}
export default MemberFormAdmin;