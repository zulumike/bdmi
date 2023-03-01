import React, { useEffect } from 'react';

import MemberForm from './components/MemberForm.js';

function App() {
  console.log(process.env.NODE_ENV);
  console.log(process.env.REACT_APP_saveToDBURL);
  return (
    <MemberForm />
  )
}

export default App;
