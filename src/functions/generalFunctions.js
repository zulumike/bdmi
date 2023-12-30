
export function dateToYYYY_MM_DD(date) {
    // const year = date.toLocaleString("default", { year: "numeric" });
    const year = date.getFullYear();
    // const month = date.toLocaleString("default", { month: "long" });
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    // const day = date.toLocaleString("default", { day: "numeric" });
    const day = ("0" + date.getDate()).slice(-2)
    const returnDate = year + '-' + month + '-' + day;
    return returnDate;
}

export async function addPayment(memberId, amount, dateTime, channel) {
    let apiURL = '';
    if (process.env.NODE_ENV === 'production') {
        apiURL = '/api/DBWrite';
    }
    else {
        apiURL = 'http://localhost:7071/api/DBWrite';

    }
    const data = {};
   
    data.id = memberId;
    data.charges.datetime = dateTime;
    data.charges.datetime.channel = channel;
    data.charges.datetime.amount = amount;
    const dbMessage = await fetch(apiURL, {
        method: "POST",
        body: JSON.stringify(data)
    });
    return dbMessage
}