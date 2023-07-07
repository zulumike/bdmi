import React, { useState } from "react";
// import ReactModal from "react-modal";
// import Modal from "react-modal";
import checkIfMemberExist from "../functions/checkIfMemberExist";
import sendCodeByEmail from "../functions/sendCodeByEmail";
import writeNewMember from "../functions/writeNewMember";
import '../styles/default.css';
import salgsbetingelser from "../assets/Salgsbetingelser.pdf";
// import { vippsApiCall } from "../functions/vippsfunctions";


//*******************
// FUNCTION MemberForm
// Creates form and upon submit sends random code
// and asks for confirmation of that code.
// If code match call function addMemberToDB

function MemberForm() {
    // Modal.setAppElement('#root');
    // const [modalOpen, setModalOpen] = useState(false);
    const [formInputs, setFormInputs] = useState({});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    };

    // const [vippsConfirmationUrl, setVippsConfirmationUrl] = useState("")

    // const amount = '20000';
    // let vippsResponse = {};

    // function closeModal() {
    //     setModalOpen(false);
    //     console.log('CloseModal');
    // }

    // function redirectToVipps(url) {
    //     window.location.href = url;
    // }

    // async function activateVippsAgreement(memberId, phone) {
    //     const vippsResponseJson = await vippsApiCall({"vippsreqtype":"draft-agreement-with-initial", memberId, "amount": amount, "amountinitial": amount, "phonenumber": phone});
    //     vippsResponse = JSON.parse(vippsResponseJson);
    //     setVippsConfirmationUrl(vippsResponse.vippsConfirmationUrl);
    //     console.log(vippsResponse.vippsConfirmationUrl);
    //     redirectToVipps(vippsResponse.vippsConfirmationUrl);
    //     setModalOpen(true);
    // }



    //********************
    // FUNCTION submitForm
    // Creates random code, sends code by email
    // prompts for code and checks if identical
    // if ok calls addMemberToDB with data to be stored

    async function submitForm(event) {
        event.preventDefault();
        const randomCode = Math.floor(Math.random()*999999)+100001;
        const [memberExist, phoneOrEmail] = await checkIfMemberExist(formInputs.phone, formInputs.email);
        if (memberExist) alert(phoneOrEmail + ' er registert fra før!\nPrøv en annen eller kontakt post@bevardovrefjell.no')
        else {
            sendCodeByEmail([formInputs.email], randomCode);
            let abort = false;
            while (abort === false) {
                let userCode = "";
                userCode = prompt("Kode er nå sendt på e-post.\nSkriv inn tilsendt kode her.\nHvis ikke mottatt, sjekk spam.\nTrykk evt avbryt og send inn på nytt");
                if (parseInt(userCode) === randomCode) {
                    abort = true;
                    formInputs.id = new Date().toISOString() + Math.random().toString().substring(2, 10);
                    formInputs.createdby = formInputs.email;
                    formInputs.role = "Medlem";
                    formInputs.status = "Registrert";

                    const writeResult = writeNewMember(formInputs);
                    writeResult.then((responseMessage) => {
                        if (responseMessage.status === 200) {
                            localStorage.setItem('user', JSON.stringify({username: formInputs.email, userrole: formInputs.role }));
                            // activateVippsAgreement(formInputs.id, formInputs.phonenumber);
                            alert('Velkommen til Bevar Dovrefjell Mellom Istidene');
                            setFormInputs({});
                            window.location.reload(false);
                        }
                        else {
                            alert('Lagring feilet! Feilmelding: ', responseMessage.statusText);    
                        }
                         });
                }
                else if (userCode === null) {
                    abort = true;
                }
                else {
                    alert("Feil kode");
                }   
            };
        };
    };

    return (
        <div className='memberformtopdiv'>
            <h1>Registreringsskjema</h1>
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
                {/* <h4>Ønsker å betale via:</h4>
                <input
                    type="radio"
                    name="invoicechannel"
                    id="invoicechannelvipps"
                    value={formInputs.invoicechannel || "vipps"}
                    required
                    onChange={formChange}
                    />
                <label
                    htmlFor="invoicechannelvipps">Vipps</label>
                <input
                    type="radio"
                    name="invoicechannel"
                    id="invoicechannelemail"
                    value={formInputs.invoicechannel || "email"}
                    onChange={formChange}
                    />
                <label
                    htmlFor="invoicechannelvipps">E-post</label> */}
                <br/>    
                <input type="submit" value="Send inn" />
            </form>
            <p>Prisen for medlemsskapet er kr 200,- pr år. Ved å sende inn skjema godtar du at Bevar Dovrefjell Mellom Istidene lagrer
                opplysningene du har oppgitt. Opplysningene kan benyttes til å sende ut informasjon,
                samt kreve inn kontingent. <a href = {salgsbetingelser} target = "_blank" rel="noreferrer">Salgsbetingelser</a>
            </p>
            <h2>Kontakt: post@bevardovrefjell.no</h2>
            {/* <ReactModal 
                className='modal'
                ovarlayClassName='modaloverlay'
                isOpen={modalOpen}
                onRequestClose={closeModal}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
            >
                <iframe 
                    id="iframe"
                    src={vippsConfirmationUrl}
                    title="Vipps"
                    height="800"
                    width="100%"
                >

                </iframe>
            </ReactModal> */}
        </div>
    )
}

export default MemberForm;