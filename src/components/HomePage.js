import React, { useState, useEffect } from 'react';
import MemberForm from './MemberForm';
import MemberFormAdmin from './MemberFormAdmin';
import checkIfMemberExist from '../functions/checkIfMemberExist';
import sendCodeByEmail from '../functions/sendCodeByEmail';

function HomePage() {
  console.log(process.env.NODE_ENV);
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
    const randomCode = Math.floor(Math.random()*1000000)+100001;
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
    console.log(loggedInUser, ' innlogget');
    return (
      <div>
        <h1>{loggedInUser}</h1>
        <button onClick={submitLogOut}>Logg ut</button>
        <MemberFormAdmin userLoggedIn={loggedInUser} userRole={loggedInUserRole} />
      </div>
    )
  }
  
  console.log(loggedInUser, ' utlogget');
  return (
    <div>
      <MemberForm />
      <button onClick={submitLogin}>Logg inn</button>
    </div>
  )
}

export default HomePage;