import React, { useState } from "react";
import writeNewMember from "../functions/writeNewMember";

function LoginPrompt({codeToCheck, memberData}) {

    const [ data, setData ] = useState('');

    function dataChange(event) {
        setData(event.target.value);
    };

    function submitData() {

        if (codeToCheck === parseInt(data)) {
            memberData.id = new Date().toISOString() + Math.random().toString().substring(2, 5);
            memberData.createdby = memberData.email;
            memberData.role = "Medlem";
            memberData.status = "Registrert";
            memberData.token = new Date().toISOString() + Math.random().toString().substring(2, 10);
            const writeResult = writeNewMember(memberData);
            writeResult.then((responseMessage) => {
                if (responseMessage.status === 200) {
                    localStorage.setItem('user', JSON.stringify({username: memberData.email, userrole: memberData.role, token: memberData.token }));
                    alert('Velkommen til Bevar Dovrefjell Mellom Istidene');
                    window.location.reload(false);
                }
                else {
                    alert('Lagring feilet! Feilmelding: ', responseMessage.statusText);    
                }
                    });
        };
    };


    return (
        <div>
            <h2>Skriv inn tilsendt kode</h2>
            <input type="text" value={data} onChange={dataChange} />
            <button onClick={submitData}>OK</button>
        </div>
    )
};

export default LoginPrompt;