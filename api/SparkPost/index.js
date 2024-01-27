module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request to SparkPost Api.');

    const SparkPost = require('sparkpost');
    const client = new SparkPost("7f47b822bbffacdd0eb626fff07688523bc8f8f3", { origin: 'https://api.eu.sparkpost.com:443' });

    // If you have a SparkPost EU account you will need to pass a different `origin` via the options parameter:
    // const euClient = new SparkPost('<YOUR API KEY>', { origin: 'https://api.eu.sparkpost.com:443' });

    const mailAddress = (req.query.mailAddress || (req.body && req.body.mailAddress));
    const mailAddresses = Object.values(mailAddress);
    // const fileName = (req.query.fileName || (req.body && req.body.fileName));
    // const fileUrl = (req.query.fileUrl || (req.body && req.body.fileUrl));
    const subject = (req.query.subject || (req.body && req.body.subject));
    const text = (req.query.text || (req.body && req.body.text));

    let responseMessage = '';
    let status = 0;

    context.log(mailAddress);
    context.log(mailAddresses);
    

async function testing() {
    await client.transmissions.send({
        options: {
        sandbox: false
        },
        content: {
        from: 'post@bevardovrefjell.no',
        name: 'Bevar Dovrefjell mellom istidene',
        subject: subject,
        html:'<html><body><p>' + text + '</p></body></html>'
        },
        recipients: mailAddresses
    })
    .then(data => {
        status = 200;
        responseMessage = data;
        context.log(data);
    })
    .catch(err => {
        responseMessage = err;
        status = 400;
        context.log(err);
    });
};

    await testing();





    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        status: status,
        body: responseMessage
    };
}