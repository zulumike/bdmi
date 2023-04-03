module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request to DBWrite Api.');
    const member = req.body;
    const responseMessage = req.body.firstname + " " + req.body.lastname
    ? "Success"
    : "This HTTP triggered function executed successfully.";
    if (member.type == "new") {
        delete member.type;
        member.id = new Date().toISOString() + Math.random().toString().substring(2, 10);
        context.bindings.outputDocument = JSON.stringify(member);
    }
    else {
        delete member.type;
        context.bindings.updateDocument = JSON.stringify(member)
    }
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}