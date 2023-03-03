import React from 'react';

import MemberForm from './MemberForm';
import MemberFormAdmin from './MemberFormAdmin';

function HomePage() {
  console.log(process.env.NODE_ENV);
  return (
    <div>
        <MemberForm />
        <MemberFormAdmin />
    </div>
  )
}

export default HomePage;