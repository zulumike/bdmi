import React, { useState, useEffect, useRef } from 'react';
import MemberForm from './MemberForm';
import MemberFormAdmin from './MemberFormAdmin';
import MemberFormUser from './MemberFormUser';
import hamburgerSymbol from '../icons/hamburger.svg';

import checkIfMemberExist from '../functions/checkIfMemberExist';
import sendCodeByEmail from '../functions/sendCodeByEmail';

import logo from '../img/bdmi_logo.png';

import '../styles/default.css';


function HomePage() {
  let loggedInUser = useRef('');
  const [loggedInUserId, setLoggedInUserId] = useState();
  const [ loggedInUserRole, setLoggedInUserRole ] = useState();
  const [ display, setDisplay ] = useState('none')

//*****************
// Check if user exist in local storage.
// also verifies that this user has rights.

useEffect(() => {
  async function checkLogin() {
    if (loggedInUserRole === '' || loggedInUserRole === undefined) {
      const userFromLocalStorage = localStorage.getItem('user');
      if (userFromLocalStorage) {
        const foundUser = JSON.parse(userFromLocalStorage);
        checkIfMemberExist('', foundUser.username).then(
          function(value) {
            if (value[0]) {
              loggedInUser.current = foundUser.username;
              setLoggedInUserId(value[3]);
              setLoggedInUserRole(value[2]);
            }
          }
        )
      }
    }
  };
  checkLogin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []
);


  

   function submitLogOut() {
    loggedInUser.current = null;
    setLoggedInUserId(null);
    setLoggedInUserRole('');
    localStorage.clear();
  }

  async function submitLogin() {
    const userEmailAddr = prompt('Skriv inn e-post adresse');
    if (userEmailAddr) {
      const [memberExist, , userRole, memberId] = await checkIfMemberExist('', userEmailAddr);
      const randomCode = Math.floor(Math.random()*999999)+100001;
      if (memberExist) {
        sendCodeByEmail([userEmailAddr], randomCode);
        console.log(randomCode);
        const userCode = prompt('Kode fra e-post: ');
        if (parseInt(userCode) === randomCode) {
          loggedInUser.current = userEmailAddr;
          setLoggedInUserRole(userRole);
          setLoggedInUserId(memberId);
          setLoggedInUserRole(loggedInUserRole);
          localStorage.setItem('user', JSON.stringify({username: userEmailAddr, userrole: userRole }));
          window.location.reload(false);
        }
        else alert('Feil kode!');
    }
    else alert('E-post eksisterer ikke');
    }
  }

  function hamburgerClick() {
    if ( display === 'none' ) {
        setDisplay( 'block' )
    } else {
        setDisplay( 'none' )
    }
}
  
  if (loggedInUserRole === "Admin" || loggedInUserRole === "Superuser") {
    return (
      <div className='homepagetopdiv'>
        <div className="homepageheaderdiv">
          <img src={logo} alt="Logo" className="topimage" />
          <div onClick={hamburgerClick} className="hamburgerdiv">
              <img src={hamburgerSymbol} height='50' width='50' alt='menu-icon' />
              <div className="hamburgerelementsdiv" style={{display:display}}>
                  <p>{loggedInUser.current}</p>
                  <button onClick={submitLogOut} >Logg ut</button>
              </div>
          </div>
        </div>
        <MemberFormAdmin userLoggedIn={loggedInUser.current} userRole={loggedInUserRole} />
      </div>
    )
  }

  if (loggedInUserRole === "Medlem") {
    return (
      <div className='homepagetopdiv'>
        <div className="homepageheaderdiv">
          <img src={logo} alt="Logo" className="topimage" />
          <div onClick={hamburgerClick} className="hamburgerdiv">
              <img src={hamburgerSymbol} height='50' width='50' alt='menu-icon' />
              <div className="hamburgerelementsdiv" style={{display:display}}>
                  <p>{loggedInUser.current}</p>
                  <button onClick={submitLogOut} >Logg ut</button>
              </div>
          </div>
        </div>
        <MemberFormUser userLoggedIn={loggedInUserId} />
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