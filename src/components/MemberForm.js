import React, { useState } from "react";

//***********************
// FUNCTION addMemberToDB
// params: 
//      formData: String, Data input from form
//      memberRole: String, role of member (rights)
//      memberStatus: String, status of member (registered, active)
// Called from function submitForm
// 
// Creates a JSON string of data to be stored and calls api with this data

function addMemberToDB(formData, memberRole, memberStatus) {
    // const saveToDBURL = "http://localhost:7071/api/DBWrite";
    let saveToDBURL = '';
    if (process.env.NODE_ENV === 'production') {
        saveToDBURL = process.env.REACT_APP_saveToDBURL
    }
    else {
        saveToDBURL = process.env.REACT_APP_saveToDBURL_local

    }
    console.log("SaveToDBURL: " + saveToDBURL);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", saveToDBURL);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => console.log(xhr.responseText);
    formData.createddate = new Date();
    formData.status = "registered";
    formData.role = "member";
    let data = JSON.stringify(formData);
    console.log(data);
    xhr.send(data);
};

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
    }

    //********************
    // FUNCTION submitForm
    // Creates random code, sends code by email
    // prompts for code and checks if identical
    // if ok calls addMemberToDB with data to be stored

    const submitForm = (event) => {
        event.preventDefault();
        console.log("Registered data: ", formInputs);
        const randomCode = Math.floor(Math.random()*1000000)+100001;
        console.log(randomCode);
        let abort = false;
        while (abort === false) {
            let userCode = "";
            userCode = prompt("Kode er nå sendt på e-post.\nSkriv inn tilsendt kode her.\nHvis ikke mottatt, sjekk spam.\nTrykk evt avbryt og send inn på nytt");
            if (parseInt(userCode) === randomCode) {
                console.log("Code match");
                abort = true;
                addMemberToDB(formInputs, "Member", "Registered");
                alert("Velkommen som medlem i Bevar Dovrefjell mellom istidene")
                setFormInputs("");
            }
            else if (userCode === null) {
                abort = true;
            }
            else {
                alert("Feil kode");
            }   
        }
    }

    return (
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

    )
}

export default MemberForm;