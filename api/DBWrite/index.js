module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request to DBWrite Api.');
    const firstName = (req.query.firstname || (req.body && req.body.firstname));
    const lastName = (req.query.lastname || (req.body && req.body.lastname));
    const email = (req.query.email || (req.body && req.body.email));
    const phone = (req.query.phone || (req.body && req.body.phone));
    const role = (req.query.role || (req.body && req.body.role));
    const createdDate = (req.query.createddate || (req.body && req.body.createddate));
    const deactivatedDate = (req.query.deactivateddate || (req.body && req.body.deactivateddate));
    const status = (req.query.status || (req.body && req.body.status));
    const responseMessage = firstName + " " + lastName
    ? "Success"
    : "This HTTP triggered function executed successfully.";
    context.bindings.outputDocument = JSON.stringify({
            // create a random ID
            id: new Date().toISOString() + Math.random().toString().substring(2, 10),
            name: lastName + ", " + firstName,
            firstname: firstName,
            lastname: lastName,
            email: email,
            phone: phone,
            role: role,
            createddate: createdDate,
            deactivateddate: deactivatedDate,
            status: status
        });

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}