const absRoute            = require('../util/absRoute');
const withErrorHandler    = require('../util/withErrorHandler');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const PairSessionService  = require('../services/PairSessionService');
const TutOneQuestions     = require('../resources/TutOneQuestions');

const ACTIVITY_NAME = "tut1";

module.exports = function (app) {

    app.get(absRoute('/tut1'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
        if (session) req.session.pairSessionId = session._id.toString();
        res.render('tut1/setup', {user: req.user, session, absRoute});
    })]);

    app.post(absRoute('/tut1'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        await PairSessionService.createPairSession(req.user.username, req.body.username, ACTIVITY_NAME);
        res.redirect(absRoute('/tut1'));
    })]);

    app.post(absRoute('/tut1/leave'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
        if (session) await session.remove();
        res.redirect(absRoute('/tut1'));
    })]);

    app.get(absRoute('/tut1/questions'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
        if (!session) return res.redirect(absRoute('/tut1'));
        res.render('tut1/questions', {
            session,
            questions: TutOneQuestions,
            absRoute
        });
    })]);

    // Define routes for all questions in resource file.
    for (let i = 0; i < TutOneQuestions.length; i++) {
        const question = TutOneQuestions[i];
        app.get(absRoute('/tut1/questions/' + i), [ensureAuthenticated, withErrorHandler(async (req, res) => {
            const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
            if (!session) return res.redirect(absRoute('/tut1'));
            res.render(question.path, {session, question, absRoute, response: JSON.parse(session.responses)[i]});
        })]);

        app.post(absRoute('/tut1/questions/' + i), [ensureAuthenticated, withErrorHandler(async (req, res) => {
            const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
            if (!session) return res.redirect(absRoute('/tut1'));
            let responses     = JSON.parse(session.responses);
            responses[i]      = req.body.response;
            session.responses = JSON.stringify(responses);
            await session.save();
            res.redirect(absRoute('/tut1/questions'));
        })]);
    }


};

