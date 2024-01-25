import React, { useState, useEffect, useRef } from 'react';
import MemberForm from './MemberForm';
import MemberFormAdmin from './MemberFormAdmin';
import MemberFormUser from './MemberFormUser';
import hamburgerSymbol from '../icons/hamburger.svg';

import checkIfMemberExist from '../functions/checkIfMemberExist';
import sendCodeByEmail from '../functions/sendCodeByEmail';

import logo from '../img/bdmi_logo.png';

import '../styles/default.css';
import updateMember from '../functions/updateMember';
import readGivenMember from '../functions/readGivenMember';
import Donation from './Donation';


function HomePage() {
  let loggedInUser = useRef('');
  const [ loggedInUserId, setLoggedInUserId ] = useState();
  const [ loggedInUserRole, setLoggedInUserRole ] = useState();
  const [ display, setDisplay ] = useState('none');
  const [ loginState, setLoginState ] = useState(0);

  let userEmailAddr = '';

  const randomCode = useRef(Math.floor(Math.random()*999999)+100001);

//*****************
// Check if user exist in local storage.
// also verifies that this user has rights.

useEffect(() => {
  async function checkLogin() {
    if (loggedInUserRole === '' || loggedInUserRole === undefined) {
      const userFromLocalStorage = localStorage.getItem('user');
      if (userFromLocalStorage) {
        const foundUser = JSON.parse(userFromLocalStorage);
        const dateFromToken = foundUser.token.substring(0,24);
        const today = new Date();
        const tokenTimeDiffDays = (today.getTime() - Date.parse(dateFromToken)) / 1000 / 3600 / 24;
        if (tokenTimeDiffDays < 7) {
          checkIfMemberExist('', foundUser.username).then(
            function(value) {
              if (value[0] && value[4] === foundUser.token) {
                loggedInUser.current = foundUser.username;
                setLoggedInUserId(value[3]);
                setLoggedInUserRole(value[2]);
              }
            }
          )
        }
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
  };

  function LoginUserPrompt() {

    const [ data, setData ] = useState('');

    function dataChange(event) {
        setData(event.target.value);
    };

    async function submitData(e) {
      e.preventDefault();
      if (parseInt(data) === randomCode.current) {
        loggedInUser.current = userEmailAddr;
        const memberData = await readGivenMember(loggedInUserId);
        setLoggedInUserRole(memberData[0].role);
        setLoggedInUserId(memberData[0].id);
        memberData[0].token = new Date().toISOString() + Math.random().toString().substring(2, 10);
        updateMember(memberData[0].id, memberData[0]);
        localStorage.setItem('user', JSON.stringify({username: memberData[0].email, userrole: memberData[0].role, token: memberData[0].token }));
        // window.location.reload(false);
      }
      else alert('Feil kode angitt!');
      setLoginState(2);
     
  };

  function closeLoginuserPrompt() {
    setLoginState(0);
  };

    return (
      <div>
            <h2>Skriv inn tilsendt kode</h2>
            <form onSubmit={submitData}>
              <input type="text" value={data} onChange={dataChange} autoFocus />
              <button type="submit">Logg inn</button>
              <button onClick={closeLoginuserPrompt}>Avbryt</button>
            </form>
      </div>
    )
  };
  
  async function submitLogin() {
    userEmailAddr = prompt('Skriv inn e-post adresse').toLowerCase();
    if (userEmailAddr) {
      const [memberExist, , , memberId] = await checkIfMemberExist('', userEmailAddr);
      setLoggedInUserId(memberId);
      if (memberExist) {
        sendCodeByEmail([userEmailAddr], randomCode.current);
        console.log(randomCode.current);
        setLoginState(1);
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
  if (loginState === 1) {
    return (
      <LoginUserPrompt />
    )
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
        <Donation />
      <div className="homepagebottomdiv">
        <h4>Kontakt: post@bevardovrefjell.no</h4>
      </div>
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
      <Donation />
      <div className="homepagebottomdiv">
        <h4>Kontakt: post@bevardovrefjell.no</h4>
      </div>
    </div>
  )
}

export default HomePage;