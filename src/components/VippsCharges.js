import React from "react";

function VippsCharges({charges}) {
    return (
        <div>
            <table>
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
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
};

export default VippsCharges;