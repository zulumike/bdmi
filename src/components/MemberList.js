import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import Modal from "react-modal";
import readAllMembers from "../functions/readAllMembers";
import readGivenMember from "../functions/readGivenMember";

function MemberList() {
    Modal.setAppElement('#root')
    const lasteTekst = 'Laster data......';
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [memberArray, setMemberArray] = useState({});
    const [modalOpen, setModalOpen] = useState(false);

    function editMember(memberID) {
        console.log(memberID);
        const givenMember = readGivenMember(memberID);
        console.log(givenMember);
        setModalOpen(true);
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
        // let readFromDBURL = '';
        // if (process.env.NODE_ENV === 'production') {
        //     readFromDBURL = '/api/DBRead';
        // }
        // else {
        //     readFromDBURL = 'http://localhost:7071/api/DBRead';
    
        // }
        
        // let xhr = new XMLHttpRequest();
        //     xhr.open("POST", readFromDBURL);
        //     xhr.setRequestHeader("Content-Type", "application/json");
        // try {
            
        //     xhr.onload = () => {
        //         setMemberArray(JSON.parse(xhr.responseText));  
        //         setIsLoading(false);
        //     };
        //     } catch(err) {
        //     console.error(err)
        //     }
        //     xhr.send();
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
                <button onClick={closeEditMember}>Lukk</button>
            </ReactModal>
    </div>
)
};

export default MemberList;