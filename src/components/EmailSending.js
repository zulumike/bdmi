import React, { useState } from "react";
import { client } from "filestack-react"
import readAllMembers from "../functions/readAllMembers";
import sendEmail from "../functions/sendEmail";
import '../styles/default.css';

function EmailSending() {
    const [formInputs, setFormInputs] = useState({emailrec: "Alle"});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    };

    const [ fileName, setFileName] = useState('');
    const [ fileUrl, setFileUrl ] = useState('');

    const filePickerOptions = {
        accept: '.pdf',
        maxSize: 10 * 1024 * 1024,
        maxFiles: 1,
        uploadInBackground: false,
        onUploadDone: (file) => {
            setFileName(file.filesUploaded[0].filename); 
            setFileUrl(file.filesUploaded[0].url);
        },
    };
   
    const handleFilePicker = () => {
        const filestackApikey = 'Ax9hyvjrQMGgaZz2KXPPRz';
        const filestack = client.init(filestackApikey, filePickerOptions);

        const picker = filestack.picker(filePickerOptions);
        picker.open();
    };


    async function sendingMail(event) {
        event.preventDefault();
        const allMembers = await readAllMembers();
        console.log(allMembers);
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
        console.log(formInputs.emailrec);
        console.log(mailAddresses);
        await sendEmail(formInputs.emailtitle, formInputs.emailbody, mailAddresses, fileName, fileUrl,)        
    };

    function tesTing(event) {
        // event.preventDefault();
        console.log(formInputs.emailrec);
        console.log(formInputs.emailrec.checked);
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
                    rows="30"
                    form="emailsendingform"
                    onChange={formChange}
                />
                <br/>
                <input
                    type="radio" 
                    name="emailrec"
                    value="Alle"
                    id="idemailrecall" 
                    checked={formInputs.emailrec === "Alle"}
                    onChange={formChange}
                />
                <label htmlFor="idemailrecall"> Alle</label>
                <br/>
                <input
                    type="radio" 
                    name="emailrec"
                    value="Registrerte"
                    id="idemailrecreg" 
                    checked={formInputs.emailrec === "Registrerte"}
                    onChange={formChange}
                />
                <label htmlFor="idemailrecreg"> Registrerte</label>
                <br/>
                <input
                    type="radio" 
                    name="emailrec"
                    value="Aktive"
                    id="idemailrecactive" 
                    checked={formInputs.emailrec === "Aktive"}
                    onChange={formChange}
                />
                <label htmlFor="idemailrecactive"> Aktive</label>
                <br/>
                <button type="button" className="filepickerbtn" onClick={() => handleFilePicker()}>Legg til filvedlegg</button>
                <label className="filepickerlbl"><a href={fileUrl}>{fileName}</a></label>
                <br/>
                <input style={{marginRight: 0}} type="submit" value="Start utsending" />

                <button type="button" className="filepickerbtn" onClick={() => tesTing()}>Testing</button>

            </form>
        </div>
    )
};


export default EmailSending;