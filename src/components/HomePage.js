import React, { useState, useEffect } from 'react';
import MemberForm from './MemberForm';
import MemberFormAdmin from './MemberFormAdmin';
import hamburgerSymbol from '../icons/hamburger.svg';

import checkIfMemberExist from '../functions/checkIfMemberExist';
import sendCodeByEmail from '../functions/sendCodeByEmail';

import logo from '../img/bdmi_logo.png';

import '../styles/default.css';


function HomePage() {
  const [loggedInUser, setLoggedInUser] = useState();
  const [loggedInUserRole, setLoggedInUserRole] = useState();

  const [ display, setDisplay ] = useState( 'none' )
   

//*****************
// Check if user exist in local storage.
// also verifies that this user has rights.

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      const foundUser = JSON.parse(userFromLocalStorage);
      async function checkIfAuthenticated() {
        const [memberExist, , userRole] = await checkIfMemberExist('', foundUser.username);
        if (memberExist && (userRole === "Admin" || userRole === "Superuser")) {
          setLoggedInUser(foundUser.username);
          setLoggedInUserRole(userRole);
        }
      } 
      checkIfAuthenticated();    
    }
  }, []);

  function submitLogOut(event) {
    // event.preventDefault();
    setLoggedInUser(null);
    setLoggedInUserRole(null);
    localStorage.clear();
  }

  async function submitLogin(event) {
    // event.preventDefault();
    const userEmailAddr = prompt('Skriv inn e-post adresse');
    if (userEmailAddr) {
      const [memberExist, , userRole] = await checkIfMemberExist('', userEmailAddr);
      const randomCode = Math.floor(Math.random()*999999)+100001;
      if (memberExist && (userRole === 'Admin' || userRole === 'Superuser')) {
        sendCodeByEmail(userEmailAddr, randomCode);
      }
      const userCode = prompt('Kode fra e-post: ');
      if (parseInt(userCode) === randomCode) {
        setLoggedInUser(userEmailAddr);
        setLoggedInUserRole(userRole);
        localStorage.setItem('user', JSON.stringify({username: userEmailAddr, userrole: userRole }));
      }
      else alert('Feil kode!');
    }
  }

  function hamburgerClick() {
    if ( display === 'none' ) {
        setDisplay( 'block' )
    } else {
        setDisplay( 'none' )
    }
}
  
  if (loggedInUser) {
    return (
      <div className='homepagetopdiv'>
        <div className="homepageheaderdiv">
          <img src={logo} alt="Logo" className="topimage" />
          <div onClick={hamburgerClick} className="hamburgerdiv">
              <img src={hamburgerSymbol} height='50' width='50' alt='menu-icon' />
              <div className="hamburgerelementsdiv" style={{display:display}}>
                  <p>{loggedInUser}</p>
                  <button onClick={submitLogOut} >Logg ut</button>
              </div>
          </div>
        </div>
        <MemberFormAdmin userLoggedIn={loggedInUser} userRole={loggedInUserRole} />
      </div>
    )
  }
  
  return (
    <div className='homepagetopdiv'>
      <div className="homepageheaderdiv">
        <img src={logo} alt="Logo" className="topimage" />
        <div onClick={hamburgerClick} className="hamburgerdiv">
            <img src={hamburgerSymbol} height='50' width='50' alt='menu-icon' />
            <div className="hamburgerelementsdiv" style={{display:display}}>
                <button onClick={submitLogin} >Logg inn</button>
            </div>
        </div>
      </div>
      <MemberForm />
    </div>
  )
}

export default HomePage;