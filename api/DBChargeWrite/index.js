module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request to DBWrite Api.');
    const data = req.body;
    const responseMessage = req.body.firstname + " " + req.body.lastname
    ? "Success"
    : "This HTTP triggered function executed successfully.";
    context.bindings.outputDocument = JSON.stringify(data);
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}