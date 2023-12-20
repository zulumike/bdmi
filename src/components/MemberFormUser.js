import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import Modal from "react-modal";
import updateMember from "../functions/updateMember";
import readGivenMember from "../functions/readGivenMember";
import FamilyMembers from "./FamilyMembers";

function MemberFormUser(memberId) {

    const mainMemberPrice = 200;
    const familyMemberPrice = 200;
    
    const [formInputs, setFormInputs] = useState({'status': 'Registrert', 'role': 'Medlem'});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
        console.log(formInputs.invoicechannel);
    };

    Modal.setAppElement('#root');
    const [modalOpen, setModalOpen] = useState(false);

    const [familyMemberAmount, setFamilyMemberAmount] = useState(0);
    

    // #####################################################################
    // function objectLength
    // Counts number of objects and returns the number
    // #####################################################################

    function objectLength( object ) {
        var length = 0;
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                ++length;
            };
        };
        return length;
    };

     useEffect(() => {
        function readMember() {
            const givenMember = readGivenMember(memberId.userLoggedIn);
                givenMember.then((member) => {
                    setFormInputs(member[0]);
                    setFamilyMemberAmount(objectLength(member[0].family));
                    console.log(familyMemberAmount);
                })
        };
        readMember()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []
    );




    async function deleteMember() {
        const confirmDelete = window.confirm("Vil du virkelig melde deg ut av vårt register?\nNB: registrerte familiemedlemmer blir også slettet!");
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

    function activateSubscription() {

    };

    function deActivateSubscription () {

    };

    function familyMembers() {
        setModalOpen(true);
    }

    function closeFamilyMembers() {
        setModalOpen(false);
    }

    function TextIfNotActive() {
        const totalAmount = mainMemberPrice + (familyMemberAmount * familyMemberPrice);
        return (
            <div className="subscriptionnotactivediv">
                <h2>Du må aktivere abonnement for å være medlem</h2>
                <button className="centerbtn" onClick={activateSubscription}>Aktiver (NOK {totalAmount},-)</button>
            </div>
        )
    };

    function TextIfActive() {
        return (
            <div className="subscriptionactivediv">
                <h2>Abonnementet er aktivt</h2>
                <button className="centerbtn" onClick={deActivateSubscription}>Deaktiver</button>
            </div>
        )
    };

    function SubscriptionText() {
        if (formInputs.status === "Aktiv") {
            return <TextIfActive />
        }
        else 
        return <TextIfNotActive />
    };

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
                <input type="submit" value="Lagre" />
            </form>
            <button onClick={familyMembers}>Familiemedlemmer ( {familyMemberAmount} )</button>
            <button onClick={deleteMember}>Slett meg</button>
            <SubscriptionText />
            <ReactModal 
                className='modal'
                ovarlayClassName='modaloverlay'
                isOpen={modalOpen}
                onRequestClose={closeFamilyMembers}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={true}
                >
                <FamilyMembers member={formInputs} />
                <button onClick={closeFamilyMembers}>Lukk</button>
            </ReactModal>
        </div>
    )
}

export default MemberFormUser;