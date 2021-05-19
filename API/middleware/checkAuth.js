const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (token) {
            const tokenData = jwt.verify(token, process.env.JWT_KEY);
            if (tokenData.userType === 'admin' || tokenData.userType === 'caretaker') {
                req.userData = tokenData;
                next();
            }
            else {
                return res.status(401).json({
                    err: "Un Authorized"
                });
            }
        } else {
            return res.status(401).json({
                err: "Un Authorized"
            });
        }
    }
    catch (err) {
        return res.status(401).json({
            err: "Un Authorized"
        });
    }
}