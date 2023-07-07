import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import Modal from "react-modal";
import updateMember from "../functions/updateMember";
import readGivenMember from "../functions/readGivenMember";
import FamilyMember from "./FamilyMembers";

function MemberFormUser(memberId) {
    
    const [formInputs, setFormInputs] = useState({'status': 'Registrert', 'role': 'Medlem'});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    };

    Modal.setAppElement('#root');
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        function readMember() {
            const givenMember = readGivenMember(memberId.userLoggedIn);
                givenMember.then((member) => {
                    setFormInputs(member[0]);
                })
        };
        readMember()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []
    );




    async function deleteMember() {
        const confirmDelete = window.confirm("Vil du virkelig melde deg ut av vårt register?");
        if (confirmDelete) {
            formInputs.firstname = 'Slettet';
            formInputs.lastname = 'Slettet';
            formInputs.email = 'slettet@slettet.no';
            formInputs.phone = '00000000';
            formInputs.deleted = 'true';
            const writeResult = await updateMember(memberId.userLoggedIn, formInputs);
            if (writeResult.status !== 200) alert('Lagring feilet! Feilmelding: ', writeResult.statusText);
            document.location.reload();
        };
    };

    async function submitForm(event) {
        event.preventDefault();
        const writeResult = await updateMember(memberId.userLoggedIn, formInputs);
        if (writeResult.status !== 200) alert('Lagring feilet! Feilmelding: ', writeResult.statusText);
        setFormInputs({});
        document.location.reload();
    };

    function closeEditMember() {
        document.location.reload();
    };

    function familyMembers() {
        setModalOpen(true);
    }

    return (
        <div className="memberformusertopdiv">
            <h3>Mine opplysninger</h3>
            <form id="editmemberform" onSubmit={submitForm}>
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
                {/* <input
                        type="radio"
                        name="invoicechannel"
                        id="invoicechannelvipps"
                        value={formInputs.invoicechannel || "vipps"}
                        required
                        onChange={formChange}
                        />
                    <label
                        htmlFor="invoicechannelvipps">Vipps</label>
                    <input
                        type="radio"
                        name="invoicechannel"
                        id="invoicechannelemail"
                        value={formInputs.invoicechannel || "email"}
                        onChange={formChange}
                        />
                    <label
                        htmlFor="invoicechannelvipps">E-post</label> */}
                <input type="submit" value="Lagre" />
            </form>
            <button onClick={deleteMember}>Slett meg</button>
            <button onClick={closeEditMember}>Avbryt</button>
            <button onClick={familyMembers}>Familiemedlemmer</button>
            {/* <ReactModal 
                className='modal'
                ovarlayClassName='modaloverlay'
                isOpen={modalOpen}
                onRequestClose={closeEmailSender}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={true}
                >
                <FamilyMember />
                <button onClick={closeEmailSender}>Lukk</button>
            </ReactModal> */}
        </div>
    )
}

export default MemberFormUser;