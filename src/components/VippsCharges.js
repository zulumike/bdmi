import React, { useState, useEffect } from "react";
import { vippsListCharges } from "../functions/vippsfunctions";

function VippsCharges({agreementId}) {

    const [ charges, setCharges ] = useState([]);
    
    useEffect(() => {
        async function readCharges() {
            // setCharges(await vippsListCharges(agreementId));
            const chargesFromVipps = await vippsListCharges(agreementId);
            for (let i = 0; i < chargesFromVipps.length; i++) {
                if (chargesFromVipps[i].status === 'PENDING' || chargesFromVipps[i].status === 'DUE' || chargesFromVipps[i].status === 'RESERVED') {
                    chargesFromVipps[i].action = 'Kanseller';
                }
                else if (chargesFromVipps[i].status === 'CHARGED') {
                    chargesFromVipps[i].action = 'Refunder';
                }
                else {
                    chargesFromVipps[i].action = '';
                };
            };
            setCharges(chargesFromVipps);
        };
        readCharges();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []
    );

    async function chargeAction(chargeData) {
        console.log(chargeData);
        
    };

    return (
        <div>
            <table className='vippschargestable'>
                <thead>
                <tr>
                    <th>Dato</th>
                    <th>Beløp</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {charges.map((data, index) => {
                    return (
                        <tr key={index}>
                            <td>{data.due}</td>
                            <td>{data.amount / 100}</td>
                            <td>{data.status}</td>
                            <td><button onClick={() => chargeAction(data)}>{data.action}</button></td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
};

export default VippsCharges;