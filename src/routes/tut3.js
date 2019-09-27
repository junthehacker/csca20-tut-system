const absRoute            = require('../util/absRoute');
const withErrorHandler    = require('../util/withErrorHandler');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const PairSessionService  = require('../services/PairSessionService');

const ACTIVITY_NAME = "tut3";

module.exports = function (app) {

    app.get(absRoute('/tut3'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
        if (session) req.session.pairSessionId = session._id.toString();
        res.render('tut3/setup', {user: req.user, session, absRoute});
    })]);

    app.post(absRoute('/tut3'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        await PairSessionService.createPairSession(req.user.username, req.body.username, ACTIVITY_NAME);
        res.redirect(absRoute('/tut3'));
    })]);

    app.post(absRoute('/tut3/leave'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
        if (session) await session.remove();
        res.redirect(absRoute('/tut3'));
    })]);

};

