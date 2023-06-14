import React, { useState } from "react";
import readAllMembers from "../functions/readAllMembers";
import sendEmail from "../functions/sendEmail";
import '../styles/default.css';

function EmailSending() {
    const [formInputs, setFormInputs] = useState({});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    };

    async function sendingMail(event) {
        event.preventDefault();
        const allMembers = await readAllMembers();
        let mailAddressesReg = [];
        let mailAddressesActive = [];
        let mailAddresses = [];
        for (let i = 0; i < allMembers.length; i++) {
            if (allMembers[i].deleted === "false") {
                if (allMembers[i].status === "Registrert") {
                    mailAddressesReg.push(allMembers[i].email)
                }
                else if (allMembers[i].status === "Aktiv") {
                    mailAddressesActive.push(allMembers[i].email)
                };
            };
        };
        if (formInputs.emailrec === "Alle") {
            mailAddresses = mailAddressesActive.concat(mailAddressesReg);
        }
        else if (formInputs.emailrec === "Registrerte") {
            mailAddresses = mailAddressesReg;
        }
        else if (formInputs.emailrec === "Aktive") {
            mailAddresses = mailAddressesActive;
        };
        const sendMailResponse = await sendEmail(formInputs.emailtitle, formInputs.emailbody, mailAddresses)
        console.log(sendMailResponse);
    };

    return (
        <div className="emailsendingtopdiv">
            <h3>E-post utsendelse</h3>
            <form id="emailsendform" onSubmit={sendingMail}>
                <input
                    type="text" 
                    name="emailtitle"
                    value={formInputs.emailtitle || ""}
                    id="idemailtitle" 
                    autoFocus={true}
                    maxLength="50" 
                    placeholder="Tittel" 
                    required
                    onChange={formChange}
                />
                <br/>
                <textarea 
                    id="idemailbody"
                    name="emailbody"
                    value={formInputs.emailbody || ""}
                    cols="100"
                    rows="50"
                    form="emailsendingform"
                    onChange={formChange}
                />
                <br/>
                <input
                    type="radio" 
                    name="emailrec"
                    value={formInputs.emailrec || "Alle"}
                    id="idemailrecall" 
                    defaultChecked
                    onChange={formChange}
                />
                <label htmlFor="idemailrecall"> Alle</label>
                <br/>
                <input
                    type="radio" 
                    name="emailrec"
                    value={formInputs.emailrec || "Registrerte"}
                    id="idemailrecreg" 
                    onChange={formChange}
                />
                <label htmlFor="idemailrecreg"> Registrerte</label>
                <br/>
                <input
                    type="radio" 
                    name="emailrec"
                    value={formInputs.emailrec || "Aktive"}
                    id="idemailrecactive" 
                    onChange={formChange}
                />
                <label htmlFor="idemailrecactive"> Aktive</label>
                <br/>
                <input type="submit" value="Start utsending" />
            </form>
        </div>
    )
}


export default EmailSending;