async function readAllMembers() {
    let memberArray = {};
    let readFromDBURL = '';
    if (process.env.NODE_ENV === 'production') {
        readFromDBURL = '/api/DBRead';
    }
    else {
        readFromDBURL = 'http://localhost:7071/api/DBRead';

    }
    
    let xhr = new XMLHttpRequest();
        xhr.open("POST", readFromDBURL);
        xhr.setRequestHeader("Content-Type", "application/json");
    try {
        
        xhr.onload = () => {
            memberArray = JSON.parse(xhr.responseText);
            console.log('onload: ', memberArray);
        };
        } catch(err) {
        console.error(err)
        }
        xhr.send();
        console.log('end of function: ', memberArray);
        return memberArray
};

export default readAllMembers;
