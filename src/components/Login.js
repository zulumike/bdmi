import React, { useState } from "react";
import checkIfMemberExist from "../functions/checkIfMemberExist";

function Login() {
    global.authenticated = false;
    const [formInputs, setFormInputs] = useState({});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    }

    async function submitForm(event) {
        event.preventDefault();
        const [memberExist, phoneOrEmail, role] = await checkIfMemberExist('', formInputs.email);
        console.log('rolle: ',role);
        if (memberExist) {
            if (role == 'member') {
                alert(phoneOrEmail + ' har ikke rettigheter');
            }
            else if (role == 'superuser') {
                console.log('superuser');
                global.authenticated = true;
            }
            else if (role == 'admin') {
                console.log('Admin');
                global.authenticated = true;
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
            <input 
                type="password" 
                name="password"
                value={formInputs.password || ""}
                id="idpassword" 
                autoFocus={true}
                maxLength="50" 
                placeholder="Passord" 
                required
                onChange={formChange}
                />
            <input type="submit" value="Logg inn" />
        </form>
    )
}

export default Login;