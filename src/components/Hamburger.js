import React, { useState } from "react";
import hamburgerSymbol from '../icons/hamburger.svg';

import '../styles/default.css';

function Hamburger(loggedInUser) {
    let loginLogout = 'Logg Inn';
    const [ display, setDisplay ] = useState( 'none' )
    if (loggedInUser.loggedInUser !== 'Ikke innlogget') {
        loginLogout = 'Logg ut'
    }
    function handleClick() {
        console.log(loggedInUser.loggedInUser);
        if ( display === 'none' ) {
            setDisplay( 'block' )
        } else {
            setDisplay( 'none' )
        }
    }

    return (
        <div onClick={handleClick} className="hamburgerdiv">
            <img src={hamburgerSymbol} height='50' width='50' alt='menu-icon' />
            <div className="hamburgerelementsdiv" style={{display:display}}>
                <p>{loggedInUser.loggedInUser}</p>
                <button>{loginLogout}</button>
            </div>
        </div>
    )
}

export default Hamburger;