const {
    BadRequestError,
} = require("@basis-theory/basis-theory-reactor-formulas-sdk-js");

module.exports = async function (req) {
    const { bt, args } = req;
    const { body, headers } = args;

    try {
        const { json } = body; // format returned by httpbin
        const { ssn } = json; // look for tokens to detokenize
        const token = await bt.tokens.retrieve(ssn);
        return {
            body: {
                ...body,
                json: {
                    ...json,
                    ssn: token.data
                }
            },
            headers,
        };
    } catch (e) {
        if (typeof e.status === "number") {
            throw new BadRequestError(e);
        }
        return {
            body,
            headers,
        };
    }
};
