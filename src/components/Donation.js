import React from "react"
import vippsQR from '../assets/vippsqr.png';

function Donation() {

    return (
        <div className="donationdiv">
            <h1>Ønsker du å støtte vårt arbeid utover å være medlem?</h1>
            <h2>Et utdrag fra vedtektene våre:</h2>
            <p>Foreningens formål er å arbeide for å bevare, eventuelt reetablere, et intakt økosystem i fjellområdet avgrenset av sør i Romsdalen til Dombås, 
                og i nord Sunndalen til Oppdal. Formålet søkes primært nådd ved saklig informasjonsarbeid og deltagelse i prosesser knyttet til utnyttelse av Dovrefjell, 
                samt ved å legge til rette for samarbeid mellom foreningen, institusjoner og miljøer som ønsker å bidra til måloppnåelsen.</p>
            <h2>Om du ønsker å bidra med støtte til vårt arbeid kan dette gjøres slik:</h2>
            <h3>Bankkonto: 9365 19 94150</h3>
            <h3>Eller Vipps: </h3>
            <img src={vippsQR} alt="VippsQR" className="vippsqrimg" ></img>
            
        </div>
    )
};

export default Donation;