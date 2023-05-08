import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import Modal from "react-modal";
import readAllMembers from "../functions/readAllMembers";
import readGivenMember from "../functions/readGivenMember";
import updateMember from "../functions/updateMember";
import '../styles/default.css';

function MemberList() {
    Modal.setAppElement('#root')
    const [memberToEdit, setMemberToEdit] = useState();
    const lasteTekst = 'Laster data......';
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [memberArray, setMemberArray] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [formInputs, setFormInputs] = useState({});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    }

    async function submitForm(event) {
        event.preventDefault();
        const writeResult = await updateMember(memberToEdit, formInputs);
        if (writeResult.status !== 200) alert('Lagring feilet! Feilmelding: ', writeResult.statusText);
        setFormInputs({});
        setModalOpen(false);
        document.location.reload();
    };

    function editMember(memberId) {
        setMemberToEdit(memberId);
        const givenMember = readGivenMember(memberId);
        console.log(memberId);
        console.log(givenMember);
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


    function closeEditMember() {
        setModalOpen(false);
    };

    useEffect(() => {
        async function readMembers() {
            setMemberArray(await readAllMembers());
            if (memberArray) setIsLoading(false);
        };
        readMembers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []
    );

    function exportToCsv() {
        let rows = [['Etternavn', 'Fornavn', 'E-post', 'Mobil', 'Postnr', 'Status']];
        console.log(memberArray);
        for (let i = 0; i < memberArray.length; i++) {
            rows.push([memberArray[i].lastname, memberArray[i].firstname, memberArray[i].email, memberArray[i].phone, memberArray[i].zipcode, memberArray[i].status])
        }
        console.log(rows);
        let csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(";")).join("\n");
        var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
    }


if (isLoading) {
    return (
        <div>
            <h1>{lasteTekst}</h1>
        </div>
    )
}

return (
    <div>
        <button onClick={exportToCsv}>Eksporter til CSV</button>
        <table className="memberlisttable">
            <thead>
                <tr>
                    <th>Navn</th>
                    <th>E-post</th>
                    <th>Telefonnummer</th>
                    <th>Postnr</th>
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
            <h3>Rediger medlem</h3>
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
            <input type="submit" value="Lagre" />
        </form>
            <button onClick={deleteMember}>Slett medlem</button>
            <button onClick={closeEditMember}>Avbryt</button>
        </ReactModal>
    </div>
)
};

export default MemberList;