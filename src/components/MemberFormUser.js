import React, { useState, useEffect, useRef } from "react";
import ReactModal from "react-modal";
import Modal from "react-modal";
import updateMember from "../functions/updateMember";
import readGivenMember from "../functions/readGivenMember";
import FamilyMembers from "./FamilyMembers";
import sendEmail from "../functions/sendEmail";
import { vippsCreateCharge, vippsDraftAgreement, vippsGetAgreement, vippsStopAgreement, vippsUpdateAgreement } from "../functions/vippsfunctions";
import calculateFamily from "../functions/calculateFamily";
import { dateToYYYY_MM_DD } from "../functions/generalFunctions";
import { writeLogToDB } from "../functions/chargeMembers";

function MemberFormUser(memberId) {
   
    const [formInputs, setFormInputs] = useState({'status': 'Registrert', 'role': 'Medlem'});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    };

    // const [ vippsPaymentStatus, setVippsPaymentStatus ] = useState({});

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
                            // const paymentStatus = vippsCheckIfAllPayed(vippsAgreementId);
                            // paymentStatus.then((vippsPayStatus) => {
                            //     setVippsPaymentStatus(vippsPayStatus);
                            // })
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
            writeLogToDB({'vippsagreementdeactivate': {'memberid': memberId.userLoggedIn, 'vippsresult': vippsResult}});
            if (vippsResult.status !== 'succeded') {
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
            writeLogToDB({'vippsagreementactivate': {'memberid': memberId.userLoggedIn, 'membername': formInputs.firstname + ' ' + formInputs.lastname, 'vippsAmount': vippsAmount, 'vippsresult': vippsResult}});
            if (vippsResult.agreementId === undefined) {
                alert('Noe gikk galt.\nFeilmelding: ' + vippsResult.detail);
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
                const vippsChargeAmount = familyPrice - vippsOldAmount.current;
                let vippsExtraText = 'Du vil i tillegg bli belastet for mellomlegget på ' + vippsChargeAmount + ',-';
                if (vippsChargeAmount < 1) {
                    vippsExtraText = 'Du vil ikke ble trekt for noe ekstra da årsbeløpet ikke har økt.';
                };
                if (window.confirm('Dette oppdaterer vippsavtalen til nytt årlig beløp: ' + vippsAmount / 100 + ',-\n' + vippsExtraText)) {
                    const vippsResult = await vippsUpdateAgreement(memberId.userLoggedIn, formInputs.vippsagreementid, vippsAmount);
                    writeLogToDB({'vippsagreementupdate': {'memberid': memberId.userLoggedIn, 'membername': formInputs.firstname + ' ' + formInputs.lastname,  'vippsAmount': vippsAmount, 'vippsresult': vippsResult}});
                    if (vippsResult.status !== 'succeded') {
                        alert('Noe gikk galt med oppdatering av vipps-avtalen, prøv igjen senere.\nFeilmelding: ' + vippsResult.detail);
                    }
                    else {
                    if (vippsChargeAmount > 0) {
                        const chargeId = new Date().toISOString() + Math.random().toString().substring(2, 10);
                        const today = new Date();
                        today.setDate(today.getDate() + 5);
                        const dueDate = dateToYYYY_MM_DD(today);
                        const vippsChargeAmountStr = (vippsChargeAmount * 100).toString();
                        const vippsResult2 = await vippsCreateCharge(vippsChargeAmountStr, "Medlemskontingent BDMI", dueDate, "7", formInputs.vippsagreementid, chargeId);
                        writeLogToDB({'vippsupdatecharge': {'memberid': memberId.userLoggedIn, 'membername': formInputs.firstname + ' ' + formInputs.lastname, 'chargeamount': vippsChargeAmountStr,  'vippsresult': vippsResult2}});
                        if (vippsResult2.detail !== undefined) {
                            alert('Noe gikk galt med belastning av ekstra-beløp, prøv igjen senere\nFeilmelding: ' + vippsResult2.detail);
                        };
                    };
                    };
                };
            }
            else if (formInputs.invoicechannel === "email") {
                const extraCharge = formInputs.price - familyPrice;
                const invoiceEmailTitle = 'Bevar Dovrefjell mellom istidene kontingent';
                let extraText = 'Vennligst betal inn mellomlegget ' + extraCharge + ',-';
                if (extraCharge < 1) {
                    extraText = 'Du trenger ikke betale inn noe, da årsbeløpet ikke har økt.';
                };
                const invoiceEmailBody = 'Tusen takk for at du er medlem og støtter oss.\nDu har endret antall familiemedlemmer.\nVennligst bruk vipps #551769.\nEller bankoverføring til konto 9365 19 94150.\nNytt års-beløp er ' + familyPrice + ',-\n' + extraText;
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
                <button className="vippsbtn" onClick={activateSubscription}>Registrer med <svg width="64" height="16" viewBox="0 0 64 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M64 3.83839C63.2798 1.09068 61.5314 0 59.1447 0C57.2111 0 54.7842 1.09068 54.7842 3.71715C54.7842 5.41401 55.9565 6.7476 57.8694 7.09117L59.6797 7.41418C60.9141 7.63629 61.2639 8.1011 61.2639 8.72741C61.2639 9.43447 60.5027 9.83844 59.3713 9.83844C57.8904 9.83844 56.9646 9.31324 56.8205 7.83828L54.2081 8.24247C54.6193 11.0908 57.17 12.2629 59.4739 12.2629C61.6547 12.2629 63.9792 11.0101 63.9792 8.48494C63.9792 6.76751 62.9298 5.51533 60.9756 5.15119L58.9805 4.78792C57.8694 4.58593 57.4993 4.04038 57.4993 3.51517C57.4993 2.84837 58.2191 2.42449 59.2066 2.42449C60.4616 2.42449 61.3461 2.84837 61.3872 4.24236L64 3.83839ZM5.925 8.16128L8.6399 0.302869H11.8283L7.09686 11.9594H4.73146L0 0.303088H3.18843L5.925 8.16128ZM22.6084 3.6364C22.6084 4.56558 21.8678 5.21202 21.0037 5.21202C20.1397 5.21202 19.3994 4.56558 19.3994 3.6364C19.3994 2.70701 20.1397 2.06078 21.0037 2.06078C21.8678 2.06078 22.6086 2.70701 22.6086 3.6364H22.6084ZM23.102 7.75775C22.0321 9.13111 20.9007 10.0806 18.9053 10.0807C16.8693 10.0807 15.2849 8.86856 14.0507 7.09095C13.5568 6.36354 12.7957 6.20204 12.2402 6.58588C11.726 6.94959 11.6028 7.71726 12.0757 8.38406C13.783 10.9497 16.1486 12.4443 18.9051 12.4443C21.4356 12.4443 23.4106 11.2324 24.9532 9.21213C25.5291 8.46481 25.5085 7.69713 24.9532 7.27281C24.4388 6.8684 23.6777 7.01042 23.102 7.75775ZM30.2 6.10094C30.2 8.48494 31.5989 9.73756 33.1625 9.73756C34.6434 9.73756 36.1659 8.56569 36.1659 6.10094C36.1659 3.67645 34.6434 2.50502 33.1828 2.50502C31.5989 2.50502 30.2 3.61605 30.2 6.10094ZM30.2 1.91941V0.323002H27.2996V16H30.2V10.424C31.1669 11.7172 32.4217 12.2629 33.8409 12.2629C36.495 12.2629 39.0868 10.2021 39.0868 5.95979C39.0868 1.89884 36.392 0.000218836 34.0879 0.000218836C32.257 0.000218836 31.0024 0.828296 30.2 1.91941ZM44.1275 6.10094C44.1275 8.48494 45.5262 9.73756 47.0898 9.73756C48.5707 9.73756 50.093 8.56569 50.093 6.10094C50.093 3.67645 48.5707 2.50502 47.1102 2.50502C45.5262 2.50502 44.1273 3.61605 44.1273 6.10094H44.1275ZM44.1275 1.91941V0.323002H44.1273H41.2269V16H44.1273V10.424C45.0943 11.7172 46.349 12.2629 47.7683 12.2629C50.4222 12.2629 53.0142 10.2021 53.0142 5.95979C53.0142 1.89884 50.3194 0.000218836 48.0152 0.000218836C46.1843 0.000218836 44.9298 0.828296 44.1275 1.91941Z" fill="#FFFFFF"/>
</svg> (NOK {formInputs.price},-)</button>
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
                <button className="vippsbtn" onClick={updateSubscription}>Fortsett <svg width="64" height="16" viewBox="0 0 64 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M64 3.83839C63.2798 1.09068 61.5314 0 59.1447 0C57.2111 0 54.7842 1.09068 54.7842 3.71715C54.7842 5.41401 55.9565 6.7476 57.8694 7.09117L59.6797 7.41418C60.9141 7.63629 61.2639 8.1011 61.2639 8.72741C61.2639 9.43447 60.5027 9.83844 59.3713 9.83844C57.8904 9.83844 56.9646 9.31324 56.8205 7.83828L54.2081 8.24247C54.6193 11.0908 57.17 12.2629 59.4739 12.2629C61.6547 12.2629 63.9792 11.0101 63.9792 8.48494C63.9792 6.76751 62.9298 5.51533 60.9756 5.15119L58.9805 4.78792C57.8694 4.58593 57.4993 4.04038 57.4993 3.51517C57.4993 2.84837 58.2191 2.42449 59.2066 2.42449C60.4616 2.42449 61.3461 2.84837 61.3872 4.24236L64 3.83839ZM5.925 8.16128L8.6399 0.302869H11.8283L7.09686 11.9594H4.73146L0 0.303088H3.18843L5.925 8.16128ZM22.6084 3.6364C22.6084 4.56558 21.8678 5.21202 21.0037 5.21202C20.1397 5.21202 19.3994 4.56558 19.3994 3.6364C19.3994 2.70701 20.1397 2.06078 21.0037 2.06078C21.8678 2.06078 22.6086 2.70701 22.6086 3.6364H22.6084ZM23.102 7.75775C22.0321 9.13111 20.9007 10.0806 18.9053 10.0807C16.8693 10.0807 15.2849 8.86856 14.0507 7.09095C13.5568 6.36354 12.7957 6.20204 12.2402 6.58588C11.726 6.94959 11.6028 7.71726 12.0757 8.38406C13.783 10.9497 16.1486 12.4443 18.9051 12.4443C21.4356 12.4443 23.4106 11.2324 24.9532 9.21213C25.5291 8.46481 25.5085 7.69713 24.9532 7.27281C24.4388 6.8684 23.6777 7.01042 23.102 7.75775ZM30.2 6.10094C30.2 8.48494 31.5989 9.73756 33.1625 9.73756C34.6434 9.73756 36.1659 8.56569 36.1659 6.10094C36.1659 3.67645 34.6434 2.50502 33.1828 2.50502C31.5989 2.50502 30.2 3.61605 30.2 6.10094ZM30.2 1.91941V0.323002H27.2996V16H30.2V10.424C31.1669 11.7172 32.4217 12.2629 33.8409 12.2629C36.495 12.2629 39.0868 10.2021 39.0868 5.95979C39.0868 1.89884 36.392 0.000218836 34.0879 0.000218836C32.257 0.000218836 31.0024 0.828296 30.2 1.91941ZM44.1275 6.10094C44.1275 8.48494 45.5262 9.73756 47.0898 9.73756C48.5707 9.73756 50.093 8.56569 50.093 6.10094C50.093 3.67645 48.5707 2.50502 47.1102 2.50502C45.5262 2.50502 44.1273 3.61605 44.1273 6.10094H44.1275ZM44.1275 1.91941V0.323002H44.1273H41.2269V16H44.1273V10.424C45.0943 11.7172 46.349 12.2629 47.7683 12.2629C50.4222 12.2629 53.0142 10.2021 53.0142 5.95979C53.0142 1.89884 50.3194 0.000218836 48.0152 0.000218836C46.1843 0.000218836 44.9298 0.828296 44.1275 1.91941Z" fill="#FFFFFF"/>
</svg></button>
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

    // function PaymentStatus() {
    //     if (!vippsPaymentStatus.allPayed) {
    //         return (
    //             <div>
    //                 <h2>Gjenstående å betale: { vippsPaymentStatus.remainingAmount }</h2>
    //             </div>
    //         )
    //     }
    //     else return null
    // };
   
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
            {/* <PaymentStatus /> */}
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