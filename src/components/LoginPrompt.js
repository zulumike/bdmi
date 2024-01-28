import React, { useState } from "react";
import writeNewMember from "../functions/writeNewMember";

function LoginPrompt({codeToCheck, memberData}) {

    const [ data, setData ] = useState('');

    function dataChange(event) {
        setData(event.target.value);
    };

    function submitData(e) {
        e.preventDefault();
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
        }
        else alert('Feil kode angitt!')
    };


    return (
        <div>
            <h2>Vi har sendt deg en kode via e-post. Om den ikke kommer innen kort tid, sjekk søppelpost.</h2>
            <h2>Skriv inn tilsendt kode</h2>
            <form onSubmit={submitData}>
              <input type="text" value={data} onChange={dataChange} autoFocus />
              <button type="submit">Logg inn</button>
            </form>
      </div>
    )
};

export default LoginPrompt;