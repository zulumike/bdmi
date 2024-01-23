import React, { useRef, useState } from "react";
import ReactModal from "react-modal";
import Modal from "react-modal";
import checkIfMemberExist from "../functions/checkIfMemberExist";
import sendCodeByEmail from "../functions/sendCodeByEmail";
import '../styles/default.css';
import salgsbetingelser from "../assets/Salgsbetingelser.pdf";
import LoginPrompt from "./LoginPrompt";


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

    const randomCode = useRef(Math.floor(Math.random()*999999)+100001);

    Modal.setAppElement('#root');
    const [ modalOpen, setModalOpen ] = useState(false);

    function closeDialog() {
        setModalOpen(false);
    };


    //********************
    // FUNCTION submitForm
    // Creates random code, sends code by email
    // prompts for code and checks if identical
    // if ok calls addMemberToDB with data to be stored

    async function submitForm(event) {
        event.preventDefault();
        const [memberExist, phoneOrEmail] = await checkIfMemberExist(formInputs.phone, formInputs.email);
        if (memberExist) alert(phoneOrEmail + ' er registert fra før!\nPrøv en annen eller kontakt post@bevardovrefjell.no')
        else {
            sendCodeByEmail([formInputs.email], randomCode.current);
            setModalOpen(true);
        };
    };

    return (
        <div className='memberformtopdiv'>
            <h1>Registreringsskjema</h1>
            <form className="memberform" id="memberform" onSubmit={submitForm} autoComplete="on">
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
                <h4>Ønsker å betale via:</h4>
                <input
                    type="radio"
                    name="invoicechannel"
                    id="invoicechannelvipps"
                    value="vipps"
                    required
                    checked={formInputs.invoicechannel === "vipps"}
                    onChange={formChange}
                    />
                <label
                    htmlFor="invoicechannelvipps"> Vipps  </label>
                <input
                    type="radio"
                    name="invoicechannel"
                    id="invoicechannelemail"
                    value="email"
                    checked={formInputs.invoicechannel === "email"}
                    onChange={formChange}
                    />
                <label
                    htmlFor="invoicechannelvipps"> E-post</label>
                <br/>    
                <input type="submit" value="Send inn" />
            </form>
            <p>Prisen for medlemsskapet er kr 200,- pr år. Ved å sende inn skjema godtar du at Bevar Dovrefjell Mellom Istidene lagrer
                opplysningene du har oppgitt. Opplysningene kan benyttes til å sende ut informasjon,
                samt kreve inn kontingent. <a href = {salgsbetingelser} target = "_blank" rel="noreferrer">Salgsbetingelser</a>
            </p>
            <h2>Kontakt: post@bevardovrefjell.no</h2>
            <ReactModal 
                className='modal'
                ovarlayClassName='modaloverlay'
                isOpen={modalOpen}
                onRequestClose={closeDialog}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                >
                <LoginPrompt codeToCheck={randomCode.current} memberData={formInputs}/>
                <button onClick={closeDialog}>Avbryt</button>
            </ReactModal>
        </div>
    )
}

export default MemberForm;