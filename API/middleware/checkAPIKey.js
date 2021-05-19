let API_KEYS = process.env.API_KEYS;
API_KEYS = API_KEYS.split(",");
module.exports = (req, res, next) => {
    try {
        const apiKey = req.headers.api_key;
        if (apiKey) {
            if (API_KEYS.includes(apiKey)) {
                next();
            } else {
                res.status(401).json({
                    err: "Un Authorised"
                })
            }
        }
        else {
            res.status(401).json({
                err: "Un Authorised"
            })
        }
    }
    catch (err) {
        return res.status(401).json({
            err: "Un Authorized"
        });
    }
}