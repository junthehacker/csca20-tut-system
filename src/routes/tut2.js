const absRoute            = require('../util/absRoute');
const withErrorHandler    = require('../util/withErrorHandler');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const PairSessionService  = require('../services/PairSessionService');
const TutTwoQuestions     = require('../resources/TutTwoQuestions');

const ACTIVITY_NAME = "tut2";

module.exports = function (app) {
    app.get(absRoute('/tut2'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
        if (session) req.session.pairSessionId = session._id.toString();
        res.render('tut2/setup', {user: req.user, session, absRoute});
    })]);

    app.post(absRoute('/tut2'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        await PairSessionService.createPairSession(req.user.username, req.body.username, ACTIVITY_NAME);
        res.redirect(absRoute('/tut2'));
    })]);

    app.post(absRoute('/tut2/leave'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
        if (session) await session.remove();
        res.redirect(absRoute('/tut2'));
    })]);

    app.get(absRoute('/tut2/questions'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
        if (!session) return res.redirect(absRoute('/tut2'));
        res.render('tut2/questions', {
            session,
            questions: TutTwoQuestions,
            absRoute
        });
    })]);

    // Define routes for all questions in resource file.
    for (let i = 0; i < TutTwoQuestions.length; i++) {
        const question = TutTwoQuestions[i];
        app.get(absRoute('/tut2/questions/' + i), [ensureAuthenticated, withErrorHandler(async (req, res) => {
            const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
            if (!session) return res.redirect(absRoute('/tut2'));
            res.render(question.path, {session, question, absRoute, response: JSON.parse(session.responses)[i]});
        })]);

        app.post(absRoute('/tut2/questions/' + i), [ensureAuthenticated, withErrorHandler(async (req, res) => {
            const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
            if (!session) return res.redirect(absRoute('/tut2'));
            let responses     = JSON.parse(session.responses);
            responses[i]      = req.body.response;
            session.responses = JSON.stringify(responses);
            await session.save();
            res.redirect(absRoute('/tut2/questions'));
        })]);
    }

};
