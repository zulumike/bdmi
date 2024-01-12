import readAllMembers from "./readAllMembers"
import updateMember from "./updateMember";
import { vippsListAgreements } from "./vippsfunctions";

export async function checkAllVippsAgreements() {
    const members = await readAllMembers();
    let vippsActiveCount = 0;

    const vippsAgreements = await vippsListAgreements();

    for (let i=0; i < members.length; i++ ) {
        let memberStatus = 'Registrert';
        if (members[i].vippsagreementid) {
            const vippsStatus = vippsAgreements.find(o => o.id === members[i].vippsagreementid).status;
            if (vippsStatus === 'ACTIVE') {
                memberStatus = 'Aktiv';
                vippsActiveCount++;
            };
            members[i].status = memberStatus;
            await updateMember(members[i].id, members[i]);
        };
    };



    return 'Aktive Vipps-avtaler: ' + vippsActiveCount;
};