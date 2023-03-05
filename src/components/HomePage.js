import React from 'react';

import MemberForm from './MemberForm';
import MemberFormAdmin from './MemberFormAdmin';
import Login from './Login';

function HomePage() {
  let userAdmin = true;
  let userSuperUser = false;
  console.log(process.env.NODE_ENV);
  console.log('Autentisert: ', global.authenticated);
  if (global.authenticated){
    return (
      <div>
          <MemberFormAdmin />
      </div>
    )
  }
  return (
    <div>
          <MemberForm />
          <Login />
      </div>
  )
}

export default HomePage;