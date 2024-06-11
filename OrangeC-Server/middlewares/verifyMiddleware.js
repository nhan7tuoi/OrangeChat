const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyToken = asyncHandler(async (req, res, next) => {
    const acccessToken = req.headers.authorization.startsWith('Bearer') && req.headers.authorization;
    const token = acccessToken && acccessToken.split(' ')[1];
    if (!token) {
        return res.status(401).json(
            { message: 'Unauthorized' }
        );
        throw new Error('Unauthorized');
    } else {
        const verify = jwt.verify(token, process.env.SECRETKEY);
        if (verify) {
            next();
        } else {
            return res.status(401).json(
                { message: 'Access token is not valid' }
            );
            throw new Error('Access token is not valid');
        }
    }
});

module.exports = verifyToken;