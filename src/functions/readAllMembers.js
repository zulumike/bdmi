import React, { useEffect } from 'react';

async function readAllMembers() {
    let data = {};
    let readFromDBURL = '';
    if (process.env.NODE_ENV === 'production') {
        readFromDBURL = '/api/DBRead';
    }
    else {
        readFromDBURL = 'http://localhost:7071/api/DBRead';

    }

    data = await( await fetch(readFromDBURL)).json();

    return data;
}

export default readAllMembers;