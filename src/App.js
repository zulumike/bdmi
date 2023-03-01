import React from 'react';

import MemberForm from './components/MemberForm.js';

function App() {
  console.log(process.env.NODE_ENV);
  return (
    <MemberForm />
  )
}

export default App;
