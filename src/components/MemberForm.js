import React, { useState } from "react";
import checkIfMemberExist from "../functions/checkIfMemberExist";
import sendCodeByEmail from "../functions/sendCodeByEmail";

//***********************
// FUNCTION addMemberToDB
// params: 
//      formData: String, Data input from form
//      memberRole: String, role of member (rights)
//      memberStatus: String, status of member (registered, active)
// Called from function submitForm
// 
// Creates a JSON string of data to be stored and calls api with this data

function addMemberToDB(formData) {
    
    let saveToDBURL = '';
    if (process.env.NODE_ENV === 'production') {
        saveToDBURL = '/api/DBWrite';
    }
    else {
        saveToDBURL = 'http://localhost:7071/api/DBWrite';

    }
    let xhr = new XMLHttpRequest();
    xhr.open("POST", saveToDBURL);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
        console.log('WriteDB api status: ', xhr.responseText);
        if (xhr.responseText === 'Success') {
            alert("Velkommen som medlem i Bevar Dovrefjell mellom istidene");
        }
        else {
            alert("Noe gikk galt! Prøv igjen eller kontakt post@bevardovrefjell.no");
        }
    };
    formData.createddate = new Date();
    let data = JSON.stringify(formData);
    xhr.send(data);
};

// //*************************
// // FUNCTION sendCodeByEmail
// // params: 
// //      mailaddress: string from memberForm
// //      code: string with random code from memberForm
// // Calls api to send random code by email

// function sendCodeByEmail(mailAddress, code) {
//     let sendMailURL = '';
//     if (process.env.NODE_ENV === 'production') {
//         sendMailURL = '/api/SendEmail';
//     }
//     else {
//         sendMailURL = 'http://localhost:7071/api/SendEmail';

//     }
//     let messageData = {};
//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", sendMailURL);
//     xhr.setRequestHeader("Content-Type", "application/json");
//     xhr.onload = () => console.log('sendEmail api status: ', xhr.responseText);
//     messageData.mailAddress = mailAddress;
//     messageData.subject = 'Velkommen til Bevar Dovrefjell';
//     messageData.text = 'Tast inn følgende kode for å fullføre registreringen: ' + code;
//     let data = JSON.stringify(messageData);
//     xhr.send(data);
// };

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
        const randomCode = Math.floor(Math.random()*1000000)+100001;
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
                    addMemberToDB(formInputs);
                    setFormInputs("");
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
        <div>
        <form id="memberform" onSubmit={submitForm}>
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
            <input type="submit" value="Send inn" />
        </form>
        </div>
    )
}

export default MemberForm;