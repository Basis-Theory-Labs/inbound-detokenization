const {
    BadRequestError,
} = require("@basis-theory/basis-theory-reactor-formulas-sdk-js");

module.exports = async function (req) {
    const { bt, args } = req;
    const { body, headers } = args;

    try {
        const { json } = body; // format returned by echo Server
        const { ssn } = json; // look for the token to detokenize
        const token = await bt.tokens.retrieve(ssn); // detokenization step
        return {
            body: { // transformed body
                ssn: token.data, // replace token id with plaintext data
            },
            headers, // original headers are not altered
        };
    } catch (e) {
        if (typeof e.status === "number") {
            // if there is a status code in the error
            // throwing this exception will cause Client to receive a 400
            throw new BadRequestError(e);
        }
        // otherwise, serialize the error back to the requester
        return {
            body: {
                error: JSON.stringify(e)
            },
            headers,
        };
    }
};