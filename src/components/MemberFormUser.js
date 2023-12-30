import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import Modal from "react-modal";
import updateMember from "../functions/updateMember";
import readGivenMember from "../functions/readGivenMember";
import FamilyMembers from "./FamilyMembers";
import sendEmail from "../functions/sendEmail";
import { vippsApiCall } from "../functions/vippsfunctions";
import calculateFamily from "../functions/calculateFamily";
import { dateToYYYY_MM_DD } from "../functions/generalFunctions";

function MemberFormUser(memberId) {

    // const mainMemberPrice = 200;
    // const familyMemberPrice = 200;
    
    const [formInputs, setFormInputs] = useState({'status': 'Registrert', 'role': 'Medlem'});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    };

    const [vippsAgreementStatus, setVippsAgreementStatus] = useState('')

    Modal.setAppElement('#root');
    const [modalOpen, setModalOpen] = useState(false);

    const [vippsUrl, setVippsUrl] = useState('');

    // const [familyMemberAmount, setFamilyMemberAmount] = useState(0);

    const [vippsUpdateNeeded, setVippsUpdateNeeded] = useState(false);

    let vippsOldAmount = 0;
    

    // #####################################################################
    // function objectLength
    // Counts number of objects and returns the number
    // #####################################################################

    // function objectLength( object ) {
    //     var length = 0;
    //     for (var key in object) {
    //         if (object.hasOwnProperty(key)) {
    //             ++length;
    //         };
    //     };
    //     return length;
    // };

     useEffect(() => {
        function readMember() {
            const givenMember = readGivenMember(memberId.userLoggedIn);
                givenMember.then((member) => {
                    setFormInputs(member[0]);
                    // setFamilyMemberAmount(objectLength(member[0].family));
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

    async function activateSubscription() {
        // const totalAmount = mainMemberPrice + (familyMemberAmount * familyMemberPrice);
        if (formInputs.invoicechannel === "vipps") {            
            // const vippsAmount = (totalAmount * 100).toString();
            const vippsAmount = (formInputs.price * 100).toString();
            // Call a function in vippsfunctions.js
            // Creates an agreement and charges an initial amount
            const vippsResult = await vippsApiCall({"vippsreqtype":"draft-agreement-with-initial", "memberid":memberId.userLoggedIn, "amount":vippsAmount, "amountinitial":vippsAmount, "phonenumber":formInputs.phone});
            console.log(vippsResult);
            setVippsUrl(JSON.parse(vippsResult).vippsConfirmationUrl);
            formInputs.vippsagreementid = JSON.parse(vippsResult).agreementId;
            const writeResult = await updateMember(memberId.userLoggedIn, formInputs);
            if (writeResult.status !== 200) alert('Lagring feilet! Feilmelding: ', writeResult.statusText);
            // document.location.href = vippsUrl;
            console.log(vippsUrl);
        }
        else if (formInputs.invoicechannel === "email") {
            const invoiceEmailTitle = 'Bevar Dovrefjell mellom istidene kontingent';
            const invoiceEmailBody = 'Tusen takk for at du er medlem og støtter oss.\nFor å betale årets kontingent vennligst bruk vipps #551769.\nEller bankoverføring til konto 9365 19 94150.\nBeløpet som skal betales er ' + formInputs.price.toString() + ',-';
            await sendEmail(invoiceEmailTitle, invoiceEmailBody, [formInputs.email], '', '');
            document.location.reload();
        };
    };

    async function updateSubscription() {
        // const totalAmount = mainMemberPrice + (familyMemberAmount * familyMemberPrice);
        const [ , familyPrice] = calculateFamily(formInputs.family);
        if (formInputs.invoicechannel === "vipps") {
            // const vippsAmount = (totalAmount * 100).toString();
            const vippsAmount = (familyPrice * 100).toString();
            console.log('old amount: ', vippsOldAmount);
            console.log('familyprice: ', familyPrice);
            const vippsChargeAmount = familyPrice - vippsOldAmount;
            const vippsResult = await vippsApiCall({"vippsreqtype":"agreement-update", "memberid":memberId.userLoggedIn, "agreementid":formInputs.vippsagreementid, "amount":vippsAmount});
            console.log(vippsResult);
            console.log(vippsChargeAmount);
            if (vippsChargeAmount > 0) {
                console.log('Ekstra betaling');
                const chargeId = new Date().toISOString() + Math.random().toString().substring(2, 10);
                const today = new Date();
                today.setDate(today.getDate() + 1);
                const dueDate = dateToYYYY_MM_DD(today);
                const vippsChargeAmountStr = (vippsChargeAmount * 100).toString();
                const vippsResult2 = await vippsApiCall({"vippsreqtype": "charge", "amount": vippsChargeAmountStr, "description": "Medlemskontingent BDMI", "due": dueDate, "retryDays": "3", "agreementid": formInputs.vippsagreementid, "chargeid": chargeId});
                console.log(vippsResult2);
            }
        }
        else if (formInputs.invoicechannel === "email") {
            const extraCharge = formInputs.price - familyPrice;
            const invoiceEmailTitle = 'Bevar Dovrefjell mellom istidene kontingent';
            const invoiceEmailBody = 'Tusen takk for at du er medlem og støtter oss.\nDu har endret antall familiemedlemmer.\nVennligst bruk vipps #551769.\nEller bankoverføring til konto 9365 19 94150.\nNytt års-beløp er ' + familyPrice + ',-\nVennligst betal inn mellomlegget ' + extraCharge + ',-';
            await sendEmail(invoiceEmailTitle, invoiceEmailBody, [formInputs.email], '', '');
            document.location.reload();
        };
    };


    async function deActivateSubscription () {
        const confirmCancel = window.confirm("Er du sikker på at du vil kansellere vipps-avtalen?\nDitt medlemsskap vil da avsluttes ved årets slutt!");
        if (confirmCancel) {
            const vippsResult = await vippsApiCall({"vippsreqtype":"agreement-stop", "memberid":memberId.userLoggedIn, "agreementid":formInputs.vippsagreementid});
            console.log(vippsResult);
            document.location.reload();
        };
    };

    function familyMembers() {
        setModalOpen(true);
    };

    function closeFamilyMembers() {
        setModalOpen(false);
    };

    function TextIfNotActive() {
        // const totalAmount = mainMemberPrice + (familyMemberAmount * familyMemberPrice);
        return (
            <div className="subscriptionnotactivediv">
                <h2>Du må aktivere for å være medlem</h2>
                <h3>Om du allerede har aktivert og betalt via e-post, kan det ta litt tid før status oppdateres her</h3>
                <button className="centerbtn" onClick={activateSubscription}>Aktiver (NOK {formInputs.price},-)</button>
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

    function TextIfPending() {
        return (
            <div className="subscriptionactivediv">
                <h2>Vipps avtale/krav er under utførelse. Oppdater siden når fullført</h2>
                <button className="centerbtn" onClick={activateSubscription}>Start aktivering på nytt</button>
            </div>
        )
    };

    function TextIfVippsUpdateNeeded() {
        return (
            <div className="subscriptionactivediv">
                <h2>Det er endringer i abonnement som krever oppdatering av Vipps avtalen</h2>
                <button className="centerbtn" onClick={updateSubscription}>Oppdater Vipps</button>
            </div>
        )
    };


    function SubscriptionText() {
        if (formInputs.invoicechannel === 'email' && formInputs.status === 'Registrert') {
            return <TextIfNotActive />
        }
        else if (vippsUpdateNeeded) {
            return <TextIfVippsUpdateNeeded/>
        }
        else if (vippsAgreementStatus === "ACTIVE") {
            return <TextIfActive />
        }
        else if (vippsAgreementStatus === "PENDING") {
            return <TextIfPending/>
        }
        else if (formInputs.invoicechannel === 'vipps')
        return <TextIfNotActive />
        else return null
    };

    async function checkVippsAgreementStatus() {
        const vippsAgreementId = formInputs.vippsagreementid;
        if (typeof(vippsAgreementId) !== 'undefined') {
            const vippsResult = await vippsApiCall({"vippsreqtype":"get-agreement", "agreementid":vippsAgreementId});
            setVippsAgreementStatus(JSON.parse(vippsResult).status);
            if (vippsAgreementStatus ==='ACTIVE' && (formInputs.price * 100) !== JSON.parse(vippsResult).pricing.amount) {
                setVippsUpdateNeeded(true);
                vippsOldAmount = JSON.parse(vippsResult).pricing.amount / 100;
            }
            const vippsResult2 = await vippsApiCall({"vippsreqtype":"list-charges", "agreementid":vippsAgreementId});
            console.log(vippsResult2);
        }
    };


    if (formInputs.invoicechannel === "vipps") {
        checkVippsAgreementStatus();
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
            <button onClick={familyMembers}>Familiemedlemmer ( {formInputs.familycount - 1} )</button>
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