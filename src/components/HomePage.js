import React, { useState, useEffect } from 'react';
import MemberForm from './MemberForm';
import MemberFormAdmin from './MemberFormAdmin';
import Hamburger from './Hamburger';

import checkIfMemberExist from '../functions/checkIfMemberExist';
import sendCodeByEmail from '../functions/sendCodeByEmail';

import logo from '../img/bdmi_logo.png';

import '../styles/default.css';


function HomePage() {
  const [loggedInUser, setLoggedInUser] = useState();
  const [loggedInUserRole, setLoggedInUserRole] = useState();

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
    event.preventDefault();
    setLoggedInUser(null);
    setLoggedInUserRole(null);
    localStorage.clear();
  }

  async function submitLogin(event) {
    event.preventDefault();
    const userEmailAddr = prompt('Skriv inn e-post adresse');
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
  
  if (loggedInUser) {
    return (
      <div className='homepagetopdiv'>
        <Hamburger loggedInuser={loggedInUser} />
        <p>{loggedInUser}</p>
        <button onClick={submitLogOut}>Logg ut</button>
        <MemberFormAdmin userLoggedIn={loggedInUser} userRole={loggedInUserRole} />
      </div>
    )
  }
  
  return (
    <div className='homepagetopdiv'>
      <div className="homepageheaderdiv">
        <img src={logo} alt="Logo" className="topimage" />
        <Hamburger loggedInUser='Ikke innlogget' />
      </div>
      <button onClick={submitLogin}>Logg inn</button>
      <MemberForm />
    </div>
  )
}

export default HomePage;