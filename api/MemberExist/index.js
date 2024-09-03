module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(req.body);
    // const member = req.body;
    // const responseMessage = member.email
    //     ? "Success"
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
    // context.log(responseMessage);
    var responseBody = {result: 'no user'};
    if (req.body.email != '') {
        var existingEmail = context.bindings.emailCheck;
        if (existingEmail.length > 0) {
            responseBody = {result: 'email exist', id: existingEmail[0].id, role: existingEmail[0].role, token: existingEmail[0].token};
        }
    }
    else if (req.body.phone != '') {
        var existingPhone = context.bindings.phoneCheck;
        if (existingPhone.length > 0) {
            responseBody = {result: 'phone exist'};
        }
    }
    else if (req.body.id != '') {
        var memberData = context.bindings.givenMember;
        responseBody = memberData;
    }
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseBody
    };
}