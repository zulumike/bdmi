import React, { useState } from "react";
import checkIfMemberExist from "../functions/checkIfMemberExist";
import sendCodeByEmail from "../functions/sendCodeByEmail";

function Login() {
    global.authenticated = false;
    global.role = 'member'
    const [formInputs, setFormInputs] = useState({});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    }

    async function submitForm(event) {
        event.preventDefault();
        const [memberExist, phoneOrEmail, role] = await checkIfMemberExist('', formInputs.email);
        if (memberExist) {
            if (role === 'Member') {
                alert(phoneOrEmail + ' har ikke rettigheter');
            }
            else {
                const randomCode = Math.floor(Math.random()*999999)+100001;
                sendCodeByEmail(formInputs.email, randomCode);
                let abort = false;
                while (abort === false) {
                    let userCode = "";
                    userCode = prompt("Kode er nå sendt på e-post.\nSkriv inn tilsendt kode her.\nHvis ikke mottatt, sjekk spam.\nTrykk evt avbryt og send inn på nytt");
                    if (parseInt(userCode) === randomCode) {
                        abort = true;
                        global.authenticated = true
                        global.role = role;
                        }
                    else if (userCode === null) {
                        abort = true;
                    }
                    else {
                        alert("Feil kode");
                    }   
                };
            }
        }
        else {
            alert('Bruker eksisterer ikke!')
        };
    };

    return (
        <form id="loginform" onSubmit={submitForm}>
            <input 
                type="email" 
                name="email"
                value={formInputs.email || ""}
                id="idloginemail" 
                autoFocus={true}
                maxLength="50" 
                placeholder="E-post adresse" 
                required
                onChange={formChange}
                />
            <input type="submit" value="Få engangskode" />
        </form>
    )
}

export default Login;