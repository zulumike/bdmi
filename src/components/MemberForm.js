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
            <button onClick="window.location.href='https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fqr.vipps.no%2F28%2F2%2F05%2F031%2FUj2HidstM&data=05%7C01%7Cole%40mifo.no%7C63518bbdf89e4f5df54808db255ff079%7C23086b93d7ef4e4ba9386faa948ee652%7C1%7C0%7C638144866236602358%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C2000%7C%7C%7C&sdata=p9nHjCdGdzjqPcgoOleykm93jrARulMkrXWMpqlp4U4%3D&reserved=0';">
                Vipps
            </button>
        </div>
    )
}

export default MemberForm;