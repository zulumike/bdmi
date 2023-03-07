module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request to DBWrite Api.');
    const member = req.body;
    const responseMessage = req.body.firstname + " " + req.body.lastname
    ? "Success"
    : "This HTTP triggered function executed successfully.";
    if (member.memberid == "*") {
        delete member.memberid;
        member.id = new Date().toISOString() + Math.random().toString().substring(2, 10);
        context.bindings.outputDocument = JSON.stringify(member);
    }
    else {
        delete member.memberid;
        context.bindings.updateDocument = JSON.stringify(req.body)
    }
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}