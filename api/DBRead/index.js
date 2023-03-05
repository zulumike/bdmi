module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(req.body);
    const member = req.body;
    context.log('funker?');
    context.log(member.memberid);
    const responseMessage = member.memberid
        ? "Success"
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
    
    if (member.memberid !== '*') {
        var allDocuments = context.bindings.givenMember;
    }
    else {
        var allDocuments = context.bindings.allDocuments;
    }
    // context.log(allDocuments);
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: allDocuments
    };
}