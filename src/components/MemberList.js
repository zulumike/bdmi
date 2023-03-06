import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import Modal from "react-modal";
import readAllMembers from "../functions/readAllMembers";
import readGivenMember from "../functions/readGivenMember";
import updateMember from "../functions/updateMember";

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
    }

    function editMember(memberId) {
        setMemberToEdit(memberId);
        const givenMember = readGivenMember(memberId);
        givenMember.then((member) => {
            setFormInputs(member[0]);
            setModalOpen(true);
        })
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

if (isLoading) {
    return (
        <div>
            <h1>{lasteTekst}</h1>
        </div>
    )
}

return (
    <div>
        <table>
            <thead>
                <tr>
                    <th>Navn</th>
                    <th>E-post</th>
                    <th>Telefonnummer</th>
                    <th>Status</th>
                    <th>Rolle</th>
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
                        <td>{item.status}</td>
                        <td>{item.role}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <ReactModal 
            isOpen={modalOpen}
            onRequestClose={closeEditMember}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={true}
            >
            <h1>Testing</h1>
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
            <select 
                name="role"
                id="idrole"
                required
                value={formInputs.role || ""}
                onChange={formChange}
                >
                <option value = "Medlem">Medlem</option>
                <option value = "Superbruker">Superbruker</option>
                <option value = "Administrator">Administrator</option>
            </select>
            <input type="submit" value="Lagre" />
        </form>
                <button onClick={closeEditMember}>Avbryt</button>
            </ReactModal>
    </div>
)
};

export default MemberList;