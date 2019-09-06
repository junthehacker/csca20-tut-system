const IdentityService = require('../services/IdentityService');

module.exports = async function(req, res, next) {
    console.log(req.session.iaToken);
    if(!req.session.iaToken) {
        return res.redirect(`${process.env.IA_ROOT}/login?id=${process.env.IA_APP_ID}`);
    } else {
        req.user = (await IdentityService.getUserByToken(req.session.iaToken)).user;
        next();
    }
};
