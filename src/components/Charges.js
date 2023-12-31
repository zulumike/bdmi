import React, { useState, useEffect } from "react";
import updateMember from "../functions/updateMember";
import { dateToYYYY_MM_DD } from "../functions/generalFunctions";


function Charges({member}) {

    const todayDate = dateToYYYY_MM_DD(new Date());
    
    const [formInputs, setFormInputs] = useState({});
    const formChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormInputs(values => ({...values, [name]: value}))
    };

    const [ charges, setCharges ] = useState([]);
    useEffect(() => {
        if (member.charges) {
            setCharges(Object.values(member.charges));
        }
        else {
            setCharges([]);
        };
        setFormInputs({payeddate: todayDate});
    // eslint-disable-next-line
    }, [member.charges]
    );

    const chargesChange = (index, event) => {
        let data = [...charges];
        data[index][event.target.name] = event.target.value;
        setCharges(data);
    };

    function submitForm(event) {
        event.preventDefault();
        const chargeId = new Date().toISOString() + Math.random().toString().substring(2, 10);
        const memberData = member;
        if (!memberData.charges) {
            memberData.charges = {};
        };
        formInputs.method = "Manuell";
        formInputs.status = "CHARGED";
        memberData.charges[chargeId] = formInputs;
        member = memberData;
        setCharges(Object.values(memberData.charges));
        setFormInputs({});
        if (memberData.status === "Registrert") {
            const activateMember = window.confirm("Vil du sette status til aktiv?");
            if (activateMember) {
                memberData.status = "Aktiv";
            };
        };
    };
    
    function deleteCharge(index, event) {
        event.preventDefault();
        const chargeCopy = charges.slice(0, index).concat(charges.slice(index+1));
        setCharges(chargeCopy);

        const deleteKey = Object.keys(member.charges)[index];
        delete member.charges[deleteKey];
    };

    async function saveMember(event) {
        event.preventDefault();
        const writeResult = await updateMember(member.id, member);
        if (writeResult.status !== 200) alert('Lagring feilet! Feilmelding: ', writeResult.statusText);
        document.location.reload();
    };

    return (
        <div>
            <form className="chargesform" id="chargesform" onSubmit={submitForm}>
                <input 
                    type="number" 
                    name="payedamount"
                    value={formInputs.payedamount || ""}
                    id="idpayedamount" 
                    placeholder="Beløp" 
                    required
                    onChange={formChange}
                    />
                <input 
                    type="date" 
                    name="payeddate" 
                    value={formInputs.payeddate || ""}
                    id="idpayeddate" 
                    required
                    onChange={formChange}
                    />
                <br/>    
                <input type="submit" value="Legg til" />
            </form>
            <br/>
            <form>
                {charges.map((chargesData, index) => {
                    return (
                        <div key={index}>
                            <button className="deletebtn" onClick={event => deleteCharge(index, event)}>Slett</button>
                            <input
                            type="date"
                            name='date'
                            placeholder='Dato'
                            required
                            value={chargesData.payeddate}
                            onChange={event => chargesChange(index, event)}
                            />
                            <input
                            type="number"
                            name='payedamount'
                            placeholder='Beløp'
                            required
                            value={chargesData.payedamount}
                            onChange={event => chargesChange(index, event)}
                            />
                            <input
                            type="text"
                            name='method'
                            readOnly
                            value={chargesData.method}
                            />
                            <input
                            type="text"
                            name='status'
                            readOnly
                            value={chargesData.status}
                            />
                        </div>
                    )
                } )}
                <br/>
                <button onClick={saveMember}>Lagre</button>
                <br/>
            </form>
        </div>
    )
}

export default Charges;