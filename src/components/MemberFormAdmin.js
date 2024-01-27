import React, { useState } from "react";
import ReactModal from "react-modal";
import Modal from "react-modal";
import MemberList from './MemberList';
import checkIfMemberExist from "../functions/checkIfMemberExist";
import writeNewMember from "../functions/writeNewMember";
import EmailSending from "./EmailSending";
import sendEmail from "../functions/sendEmail";
import '../styles/default.css';
import { checkAllVippsAgreements } from "../functions/checkAllVippsAgreements";
import { chargeMembers } from "../functions/chargeMembers";
import { dateToYYYY_MM_DD } from "../functions/generalFunctions";


//***********************
// FUNCTION updateStatusFromVipps
// reads all members from database
// if vipps agreement id exist, check the agreement status and
// write back to db

async function updateStatusFromVipps() {
    const result = await checkAllVippsAgreements();
    alert(result);
    document.location.reload();
};

async function chargeAnnual() {
    const chargeDescription = prompt('Skriv inn beskrivelse av betalingen, f.eks Medlemskontingent 2024');
    if (chargeDescription) {
        const today = new Date();
        today.setDate(today.getDate() + 5);
        const dueDate = dateToYYYY_MM_DD(today);
        const chargeSummary = await chargeMembers(chargeDescription, dueDate);
        alert(chargeSummary);
    };
};




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

    async function emailNewMember(emailAddr, totalPrice) {
        if (window.confirm('Skal det sendes e-post med betalingsinfo til medlem?')) {
            const invoiceEmailTitle = 'Bevar Dovrefjell mellom istidene kontingent';
            const invoiceEmailBody = 'Tusen takk for at du er medlem og støtter oss.\nDu har blitt registrert inn av ' + user.userLoggedIn + '.Ta kontakt med vedkommende hvis spørsmål.\nFor å betale årets kontingent vennligst bruk vipps #551769.\nEller bankoverføring til konto 9365 19 94150.\nBeløpet som skal betales er ' + totalPrice + ',-';
            await sendEmail(invoiceEmailTitle, invoiceEmailBody, [emailAddr], '', '');
        };
        document.location.reload();
    };
    

    //********************
    // FUNCTION submitForm
    // Calls addMemberToDB with data to be stored

    async function submitForm(event) {
        event.preventDefault();
        const [memberExist, phoneOrEmail] = await checkIfMemberExist(formInputs.phone, formInputs.email);
        if ((memberExist) && (formInputs.phone !== undefined)) alert(phoneOrEmail + ' er registert fra før!')
        else {
            formInputs.id = new Date().toISOString() + Math.random().toString().substring(2, 5);
            formInputs.createdby = user.userLoggedIn;
            formInputs.role = 'Medlem';
            formInputs.invoicechannel = 'email';
            const writeResult = writeNewMember(formInputs);
            writeResult.then((responseMessage) => {
                if (responseMessage.status !== 200) alert('Lagring feilet! Feilmelding: ', responseMessage.statusText)
                else emailNewMember(formInputs.email, formInputs.price)
                setFormInputs({'status': 'Registrert', 'role': 'Medlem'});
                document.location.reload();
            });
        };
    };

    function testMail() {
        const testAdresses = ['ole@zmmaskin.no', 'ole@mifo.no'];
        sendEmail('Tittel', 'Dette er en test', testAdresses, '', '');
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
            <br/>
            <input type="submit" value="Registrer" />
        </form>
        <button onClick={openEmailSender}>E-post utsending</button>
        <button onClick={updateStatusFromVipps}>Sjekk Vipps status</button>
        <button onClick={chargeAnnual}>Krev inn årets kontingent</button>
        <button onClick={testMail}>Test epost</button>

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
            <button onClick={closeEmailSender}>Lukk</button>
        </ReactModal>
    </div>
)
}
export default MemberFormAdmin;