import React, { useState } from "react";
import MemberList from './MemberList';
import checkIfMemberExist from "../functions/checkIfMemberExist";

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
        console.log(xhr.responseText);
    };
    formData.createddate = new Date();
    let data = JSON.stringify(formData);
    xhr.send(data);
};

//*************************
// FUNCTION MemberFormAdmin
// Creates form and upon submit stores data to db

function MemberFormAdmin() {
    const [formInputs, setFormInputs] = useState({'status': 'registered', 'role': 'member'});
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
            addMemberToDB(formInputs);
            setFormInputs({'status': 'registered', 'role': 'member'});
        };
    };
    // readAllMembers();
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
                <select 
                    name="status"
                    id="idstatus"
                    form="memberform"
                    required
                    value="registered"
                    onChange={formChange}
                    >
                    <option value = "registered">Registrert</option>
                    <option value = "active">Aktiv</option>
                </select>
                <select 
                    name="role"
                    id="idrole"
                    required
                    value="member"
                    onChange={formChange}
                    >
                    <option value = "member">Medlem</option>
                    <option value = "superuser">Superbruker</option>
                    <option value = "admin">Administrator</option>
                </select>
                <input type="submit" value="Registrer" />
            </form>
            <MemberList />
        </div>
    )
}

export default MemberFormAdmin;