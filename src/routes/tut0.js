const absRoute            = require('../util/absRoute');
const withErrorHandler    = require('../util/withErrorHandler');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const PairSessionService  = require('../services/PairSessionService');
const TutZeroQuestions    = require('../resources/TutZeroQuestions');

module.exports = function (app) {

    app.get(absRoute('/tut0'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsername(req.user.username);
        if (session) req.session.pairSessionId = session._id.toString();
        res.render('tut0/setup', {user: req.user, session, absRoute});
    })]);

    app.post(absRoute('/tut0'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        await PairSessionService.createPairSession(req.user.username, req.body.username);
        res.redirect(absRoute('/tut0'));
    })]);

    app.post(absRoute('/tut0/leave'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsername(req.user.username);
        if (session) await session.remove();
        res.redirect(absRoute('/tut0'));
    })]);

    app.get(absRoute('/tut0/questions'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsername(req.user.username);
        if (!session) return res.redirect(absRoute('/tut0'));
        res.render('tut0/questions', {
            session,
            questions: TutZeroQuestions,
            absRoute
        });
    })]);

    // Define routes for all questions in resource file.
    for (let i = 0; i < TutZeroQuestions.length; i++) {
        const question = TutZeroQuestions[i];
        app.get(absRoute('/tut0/questions/' + i), [ensureAuthenticated, withErrorHandler(async (req, res) => {
            const session = await PairSessionService.getOneByUsername(req.user.username);
            if (!session) return res.redirect(absRoute('/tut0'));
            res.render(question.path, {session, question, absRoute});
        })]);

        app.post(absRoute('/tut0/questions/' + i), [ensureAuthenticated, withErrorHandler(async (req, res) => {
            const session = await PairSessionService.getOneByUsername(req.user.username);
            if (!session) return res.redirect(absRoute('/tut0'));
            let responses     = JSON.parse(session.responses);
            responses[i]      = req.body.response;
            session.responses = JSON.stringify(responses);
            await session.save();
            res.redirect(absRoute('/tut0/questions'));
        })]);
    }

};
