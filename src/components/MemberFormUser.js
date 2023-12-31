import React, { useState, useEffect, useRef } from "react";
import ReactModal from "react-modal";
import Modal from "react-modal";
import updateMember from "../functions/updateMember";
import readGivenMember from "../functions/readGivenMember";
import FamilyMembers from "./FamilyMembers";
import sendEmail from "../functions/sendEmail";
import { vippsCheckIfAllPayed, vippsCreateCharge, vippsDraftAgreement, vippsGetAgreement, vippsStopAgreement, vippsUpdateAgreement } from "../functions/vippsfunctions";
import calculateFamily from "../functions/calculateFamily";
import { dateToYYYY_MM_DD } from "../functions/generalFunctions";

function MemberFormUser(memberId) {
   
    const [formInputs, setFormInputs] = useState({'status': 'Registrert', 'role': 'Medlem'});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    };

    const [ vippsPaymentStatus, setVippsPaymentStatus ] = useState({});

    const [vippsAgreementStatus, setVippsAgreementStatus] = useState('')

    Modal.setAppElement('#root');
    const [modalOpen, setModalOpen] = useState(false);

    const [vippsUpdateNeeded, setVippsUpdateNeeded] = useState(false);

    const vippsOldAmount = useRef(0);

     useEffect(() => {
        function readMember() {
            const givenMember = readGivenMember(memberId.userLoggedIn);
                givenMember.then((member) => {
                    setFormInputs(member[0]);
                    const vippsAgreementId = member[0].vippsagreementid;
                    if (typeof(vippsAgreementId) !== 'undefined') {
                        const vippsResult = vippsGetAgreement(vippsAgreementId);
                        vippsResult.then((vippsAgreement) => {
                            if (vippsAgreement.status ==='ACTIVE' && (member[0].price * 100) !== vippsAgreement.pricing.amount) {
                                vippsOldAmount.current = vippsAgreement.pricing.amount / 100;
                                setVippsUpdateNeeded(true);
                            }
                            else setVippsUpdateNeeded(false);
                            setVippsAgreementStatus(vippsAgreement.status);
                            const paymentStatus = vippsCheckIfAllPayed(vippsAgreementId);
                            paymentStatus.then((vippsPayStatus) => {
                                setVippsPaymentStatus(vippsPayStatus);
                            })
                        })
                    };

                })
        };
        readMember()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []
    );

    async function deActivateSubscription () {
        const confirmCancel = window.confirm("Er du sikker på at du vil kansellere vipps-avtalen?\nDitt medlemsskap vil da avsluttes ved årets slutt!");
        if (confirmCancel) {
            const vippsResult = await vippsStopAgreement(memberId.userLoggedIn, formInputs.vippsagreementid);
            if (!vippsResult === undefined) {
                alert('Noe gikk galt. Prøv igjen senere.\nFeilmelding: ' + vippsResult.detail);
            };
            document.location.reload();
        };
    };


    async function deleteMember() {
        const confirmDelete = window.confirm("Vil du virkelig melde deg ut av vårt register?\nNB: registrerte familiemedlemmer blir også slettet!\nHar du valgt Vipps vil du få eget spørsmål om å avslutte avtalen der.");
        if (confirmDelete) {
            if (formInputs.invoicechannel === "vipps") {
                deActivateSubscription();
            };
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
        if (formInputs.invoicechannel === "vipps") {            
            const vippsAmount = (formInputs.price * 100).toString();
            let vippsIdempotencyKey = memberId.userLoggedIn;
            if (formInputs.vippsagreementid !== undefined) {
                vippsIdempotencyKey = memberId.userLoggedIn + '_' + Math.random().toString().substring(2, 5);
            };
            const vippsResult = await vippsDraftAgreement(memberId.userLoggedIn, vippsAmount, vippsAmount, formInputs.phone, vippsIdempotencyKey);
            console.log('testing', vippsResult.agreementId);
            if (vippsResult.agreementId === undefined) {
                alert('Noe gikk galt.\nFeilmelding:s' + vippsResult.detail);
                console.log(vippsResult);
            }
            else {
                formInputs.vippsagreementid = vippsResult.agreementId;
                const writeResult = await updateMember(memberId.userLoggedIn, formInputs);
                if (writeResult.status !== 200) alert('Lagring feilet! Feilmelding: ', writeResult.statusText);
                document.location.replace(vippsResult.vippsConfirmationUrl);
                };
            }
        else if (formInputs.invoicechannel === "email") {
            const invoiceEmailTitle = 'Bevar Dovrefjell mellom istidene kontingent';
            const invoiceEmailBody = 'Tusen takk for at du er medlem og støtter oss.\nFor å betale årets kontingent vennligst bruk vipps #551769.\nEller bankoverføring til konto 9365 19 94150.\nBeløpet som skal betales er ' + formInputs.price.toString() + ',-';
            await sendEmail(invoiceEmailTitle, invoiceEmailBody, [formInputs.email], '', '');
            document.location.reload();
        };
    };

    async function updateSubscription() {
        const [ , familyPrice] = calculateFamily(formInputs.family);
        if (formInputs.invoicechannel === "vipps") {
            const vippsAmount = (familyPrice * 100).toString();
            const vippsChargeAmount = familyPrice - vippsOldAmount;
            const vippsResult = await vippsUpdateAgreement(memberId.userLoggedIn, formInputs.vippsagreementid, vippsAmount);
            if (!vippsResult.detail === undefined) {
                alert('Noe gikk galt, prøv igjen senere.\nFeilmelding: ' + vippsResult.detail);
            }
            else {
            if (vippsChargeAmount > 0) {
                const chargeId = new Date().toISOString() + Math.random().toString().substring(2, 10);
                const today = new Date();
                today.setDate(today.getDate() + 5);
                const dueDate = dateToYYYY_MM_DD(today);
                const vippsChargeAmountStr = (vippsChargeAmount * 100).toString();
                const vippsResult2 = await vippsCreateCharge(vippsChargeAmountStr, "Medlemskontingent BDMI", dueDate, "3", formInputs.vippsagreementid, chargeId);
                if (!vippsResult2 === undefined) {
                    alert('Noe gikk galt, prøv igjen senere\nFeilmelding: ' + vippsResult2.detail);
                };
            };
            };
        }
        else if (formInputs.invoicechannel === "email") {
            const extraCharge = formInputs.price - familyPrice;
            const invoiceEmailTitle = 'Bevar Dovrefjell mellom istidene kontingent';
            const invoiceEmailBody = 'Tusen takk for at du er medlem og støtter oss.\nDu har endret antall familiemedlemmer.\nVennligst bruk vipps #551769.\nEller bankoverføring til konto 9365 19 94150.\nNytt års-beløp er ' + familyPrice + ',-\nVennligst betal inn mellomlegget ' + extraCharge + ',-';
            await sendEmail(invoiceEmailTitle, invoiceEmailBody, [formInputs.email], '', '');
        };
        document.location.reload();
    };

    function familyMembers() {
        setModalOpen(true);
    };

    function closeFamilyMembers() {
        setModalOpen(false);
    };

    function TextIfNotActive() {
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

    function PaymentStatus() {
        if (!vippsPaymentStatus.allPayed) {
            return (
                <div>
                    <h2>Gjenstående å betale: { vippsPaymentStatus.remainingAmount }</h2>
                </div>
            )
        }
        else return null
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
            <PaymentStatus />
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