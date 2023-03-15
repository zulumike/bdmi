import React, { useState } from "react";
import checkIfMemberExist from "../functions/checkIfMemberExist";
import sendCodeByEmail from "../functions/sendCodeByEmail";
import writeNewMember from "../functions/writeNewMember";
import '../styles/default.css';


//*******************
// FUNCTION MemberForm
// Creates form and upon submit sends random code
// and asks for confirmation of that code.
// If code match call function addMemberToDB

function MemberForm() {
    const [formInputs, setFormInputs] = useState({});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    };

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
            sendCodeByEmail(formInputs.email, randomCode);
            let abort = false;
            while (abort === false) {
                let userCode = "";
                userCode = prompt("Kode er nå sendt på e-post.\nSkriv inn tilsendt kode her.\nHvis ikke mottatt, sjekk spam.\nTrykk evt avbryt og send inn på nytt");
                if (parseInt(userCode) === randomCode) {
                    abort = true;
                    formInputs.createdby = formInputs.email;
                    formInputs.role = "Medlem";
                    formInputs.status = "Registrert";

                    const writeResult = writeNewMember(formInputs);
                    writeResult.then((responseMessage) => {
                        if (responseMessage.status === 200) {
                            alert('Velkommen til Bevar Dovrefjell Mellom Istidene');
                            setFormInputs({});
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

    function goVipps() {
        window.location.replace('https//qr.vipps.no/28/2/05/031/Uj2HidstM');
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
                <input type="submit" value="Send inn" />
            </form>
            <p>Ved å sende inn skjema godtar du at Bevar Dovrefjell Mellom Istidene lagrer
                opplysningene du har oppgitt. Opplysningene kan benyttes til å sende ut informasjon,
                samt kreve inn kontingent.
            </p>
            <a href='https//qr.vipps.no/28/2/05/031/Uj2HidstM' target='_blank'>Vipps</a>
            <button onClick={goVipps}>
                Vipps
            </button>
        </div>
    )
}

export default MemberForm;