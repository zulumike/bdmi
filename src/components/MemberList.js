import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import Modal from "react-modal";
import FamilyMembers from "./FamilyMembers";
import readAllMembers from "../functions/readAllMembers";
import readGivenMember from "../functions/readGivenMember";
import updateMember from "../functions/updateMember";
import resetStatus from "../functions/resetStatus";
import '../styles/default.css';
import Charges from "./Charges";
import VippsCharges from "./VippsCharges";
import { vippsStopAgreement } from "../functions/vippsfunctions";

function MemberList() {
    Modal.setAppElement('#root')
    const [memberToEdit, setMemberToEdit] = useState();
    const lasteTekst = 'Laster data......';
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [memberArray, setMemberArray] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [formInputs, setFormInputs] = useState({});
    const [revenue, setRevenue] = useState({'activeMembers': 0, 'registeredMembers': 0, 'totalMembers': 0, 'amountVipps': 0, 'amountEmail': 0, 'amountTotal': 0});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}));
    };
     
    async function submitForm(event) {
        event.preventDefault();
        const writeResult = await updateMember(memberToEdit, formInputs);
        if (writeResult.status !== 200) alert('Lagring feilet! Feilmelding: ', writeResult.statusText)
        setFormInputs({});
        setModalOpen(false);
        document.location.reload();
    };

    function editMember(memberId) {
        setMemberToEdit(memberId);
        const givenMember = readGivenMember(memberId);
        givenMember.then((member) => {
            setFormInputs(member[0]);
            setModalOpen(true);
        })
    };

    async function deleteMember() {
        const confirmDelete = window.confirm("Vil du virkelig slette?");
        if (confirmDelete) {
            formInputs.firstname = 'Slettet';
            formInputs.lastname = 'Slettet';
            formInputs.email = 'slettet@slettet.no';
            formInputs.phone = '00000000';
            formInputs.deleted = 'true';
            const writeResult = await updateMember(memberToEdit, formInputs);
            if (writeResult.status !== 200) alert('Lagring feilet! Feilmelding: ', writeResult.statusText);
            setModalOpen(false);
            document.location.reload();
        };
    };

    async function stopVippsAgreement() {
        const confirmStopVipps = window.confirm("Dette avslutter medlemmets vippsavtale");
        if (confirmStopVipps) {
            vippsStopAgreement(memberToEdit, formInputs.vippsagreementid);
            document.location.reload();
        };
    }

    function closeEditMember() {
        setModalOpen(false);
    };

    useEffect(() => {
        async function readMembers() {
            const memberArrayTemp = await readAllMembers();
            setMemberArray(memberArrayTemp);
            if (memberArray) setIsLoading(false);
            let revenueTemp = {'activeMembers': 0, 'registeredMembers': 0, 'totalMembers': 0, 'amountVipps': 0, 'amountEmail': 0, 'amountTotal': 0};
            for (let i = 0; i < memberArrayTemp.length; i++) {
                if (memberArrayTemp[i].status === 'Aktiv') {
                    revenueTemp.activeMembers = revenueTemp.activeMembers + memberArrayTemp[i].familycount;
                    if (memberArrayTemp[i].invoicechannel === 'vipps') revenueTemp.amountVipps = revenueTemp.amountVipps + memberArrayTemp[i].price
                    else revenueTemp.amountEmail = revenueTemp.amountEmail + memberArrayTemp[i].price;
                }
                else {
                    revenueTemp.registeredMembers = revenueTemp.registeredMembers + memberArrayTemp[i].familycount;
                };
                revenueTemp.totalMembers = revenueTemp.activeMembers + revenueTemp.registeredMembers;
                revenueTemp.amountTotal = revenueTemp.amountVipps + revenueTemp.amountEmail;
            };
            setRevenue(revenueTemp);
        };
        readMembers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []
    );

    function exportToCsv() {
        let rows = [['Etternavn', 'Fornavn', 'E-post', 'Mobil', 'Postnr', 'Status', 'Hovedmedlem']];
        for (let i = 0; i < memberArray.length; i++) {
            rows.push([memberArray[i].lastname, memberArray[i].firstname, memberArray[i].email, memberArray[i].phone, memberArray[i].zipcode, memberArray[i].status])
            if (memberArray[i].family) {
                const familyMembers = Object.values(memberArray[i].family);
                for (let y = 0; y < familyMembers.length; y++) {
                    rows.push([familyMembers[y].lastname, familyMembers[y].firstname, familyMembers[y].email, familyMembers[y].phone, familyMembers[y].zipcode, 'Familie', memberArray[i].email]);
                };
            };
        };
        let csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(";")).join("\n");
        var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
    };

    async function resetStatusAll() {
        if (window.confirm('Vil du sette alle medlemmer til status "Registrert" (ikke betalt)?')) {
            await resetStatus('all');
            document.location.reload();
        };
    };

    function VippsAgreementExist() {
        if (formInputs.vippsagreementid !== undefined) {
            return (
                <VippsCharges agreementId={formInputs.vippsagreementid} />
            )
        }
        else 
        return null
    };


if (isLoading) {
    return (
        <div>
            <h1>{lasteTekst}</h1>
        </div>
    )
};


return (
    <div>
        <button onClick={exportToCsv}>Eksporter til CSV</button>
        <button onClick={resetStatusAll}>Nullstill status</button>

        <table className="memberlisttable">
            <thead>
                <tr>
                    <th>Navn</th>
                    <th>E-post</th>
                    <th>Mobil</th>
                    <th>Postnr</th>
                    <th>Betaling</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {memberArray.map((item) => (
                    <tr 
                    onClick={() => editMember(item.id)}
                        key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.zipcode}</td>
                        <td>{item.invoicechannel}</td>
                        <td>{item.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <ReactModal 
            className='modal'
            ovarlayClassName='modaloverlay'
            isOpen={modalOpen}
            onRequestClose={closeEditMember}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={true}
            >
            <h2>Rediger medlem</h2>
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
            <select 
                name="status"
                id="idstatus"
                form="memberform"
                required
                value={formInputs.status || ""}
                onChange={formChange}
                >
                <option value = "Registrert">Registrert</option>
                <option value = "Aktiv">Aktiv</option>
            </select>
        </form>
        <h3>Familiemedlemmer:</h3>
        <FamilyMembers member={formInputs} />
        <h3>Innbetalinger:</h3>
        <Charges member={formInputs}/>
        <VippsAgreementExist />
        <button onClick={stopVippsAgreement}>Stopp Vipps avtale</button>
        <button onClick={deleteMember}>Slett medlem</button>
        <button onClick={closeEditMember}>Avbryt</button>
        </ReactModal>
        <br/>
        <h2>Medlemstall:</h2>
        <h4>Antall aktive medlemmer: {revenue.activeMembers}</h4>
        <h4>Antall medlemmer totalt: {revenue.totalMembers} </h4>
        <h4>Inntektsgrunnlag Vipps: {revenue.amountVipps},-</h4>
        <h4>Inntektsgrunnlag E-post: {revenue.amountEmail},-</h4>
        <h3>Inntektsgrunnlag totalt: {revenue.amountTotal},- </h3>
    </div>
)
};

export default MemberList;