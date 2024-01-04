import React, { useState, useEffect } from "react";
import { vippsCancelCharge, vippsGetAgreement, vippsListCharges, vippsRefundCharge } from "../functions/vippsfunctions";

function VippsCharges({agreementId}) {

    const [ charges, setCharges ] = useState([]);
    const [ agreement, setAgreement ] = useState('');
    
    useEffect(() => {
        async function readCharges() {
            setAgreement(await vippsGetAgreement(agreementId));
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
        if (chargeData.action === "Refunder") {
            const refundDescription = prompt('Skriv inn beskrivelse for refunderingen');
            if (refundDescription !== '' && refundDescription !== null) {
                const vippsResult = await vippsRefundCharge(chargeData.amount, refundDescription, chargeData.agreementId, chargeData.id);
                if (vippsResult.status > 299 ) {
                    alert('Noe gikk galt\nFeilmelding: ' + vippsResult.detail);
                } else {
                    document.location.reload();
                };
            };
        } else if (chargeData.action === "Kanseller") {
            const cancelConfirmed = window.confirm('Er du sikker på at du vil kansellere betalingen?');
            if (cancelConfirmed) {
                const vippsResult = await vippsCancelCharge(chargeData.agreementId, chargeData.id);
                if (vippsResult.status > 299 ) {
                    alert('Noe gikk galt\nFeilmelding: ' + vippsResult.detail);
                } else {
                    document.location.reload();
                };
            };
        }
    };

    return (
        <div>
            <h2>Vipps Status: {agreement.status}</h2>
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