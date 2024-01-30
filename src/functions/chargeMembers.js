import readAllMembers from "./readAllMembers";
import sendEmail from "./sendEmail";
import { vippsCreateCharge } from "./vippsfunctions";

export async function writeLogToDB(data) {
    let apiURL = '';
    if (process.env.NODE_ENV === 'production') {
        apiURL = '/api/DBChargeWrite';
    }
    else {
        apiURL = 'http://localhost:7071/api/DBChargeWrite';

    };

    data.id = new Date().toISOString() + Math.random().toString().substring(2, 5);
    
    await fetch(apiURL, {
        method: "POST",
        body: JSON.stringify(data)
    });

};

export async function chargeMembers(chargeDescription, chargeDueDate) {

    const members = await readAllMembers();
    const vippsMembers = members.filter((data) => data.invoicechannel === 'vipps');
    const emailMembers = members.filter((data) => data.invoicechannel === 'email');
    let vippsCharges = [];
    let emailCharges = [];
    let emailSuccessCount = 0;
    let emailFailCount = 0;
    let vippsSuccessCount = 0;
    let vippsFailCount = 0;
    

    for (let i = 0; i < vippsMembers.length; i++) {
        if (!vippsMembers[i].vippsagreementid) {
            emailMembers.push(vippsMembers[i]);
        }
        else {
            let charged = false;
            const uniqueId = new Date().toISOString() + Math.random().toString().substring(2, 10);
            const vippsResult = await vippsCreateCharge(vippsMembers[i].price * 100, chargeDescription, chargeDueDate, '7', vippsMembers[i].vippsagreementid, uniqueId);
            if (vippsResult.chargeId) {
                charged = true;
                vippsSuccessCount++;
            }
            else vippsFailCount++;
            vippsCharges.push({'memberid': vippsMembers[i].id, 'membername': vippsMembers[i].firstname + ' ' + vippsMembers[i].lastname, 'charged': charged, 'vippsresult': vippsResult});
        };
    };

    for (let i = 0; i < emailMembers.length; i++) {
        let emailed = false;
        const invoiceEmailTitle = 'Bevar Dovrefjell mellom istidene kontingent';
        const invoiceEmailBody = 'Tusen takk for at du er medlem og støtter oss.\nBetalingen gjelder: ' + chargeDescription + '.\nVennligst bruk vipps #551769.\nEller bankoverføring til konto 9365 19 94150.\nBeløp som skal betales inn er ' + emailMembers[i].price + ',-';
        const emailResult = await sendEmail(invoiceEmailTitle, invoiceEmailBody, [emailMembers[i].email], '', '');
        if (emailResult === 'Success') {
            emailed = true;
            emailSuccessCount++;
        }
        else emailFailCount++;
        emailCharges.push({'memberid': emailMembers[i].id, 'membername': emailMembers[i].firstname + ' ' + emailMembers[i].lastname, 'emailed': emailed, 'emailresult': emailResult});
    };
    
    const chargeLog = {'vipps': vippsCharges, 'email': emailCharges};
    writeLogToDB(chargeLog);

    const chargeSummary = 'Vipps: ' + vippsSuccessCount + ' vellykket, ' + vippsFailCount + ' feilet.\nE-post: ' + emailSuccessCount + ' vellykket, ' + emailFailCount + ' feilet.';
  
    return chargeSummary;

};