const absRoute            = require('../util/absRoute');
const withErrorHandler    = require('../util/withErrorHandler');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const PairSessionService  = require('../services/PairSessionService');
const TutThreeQuestions   = require('../resources/TutThreeQuestions');

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

    app.get(absRoute('/tut3/questions'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
        if (!session) return res.redirect(absRoute('/tut3'));
        res.render('tut3/questions', {
            session,
            questions: TutThreeQuestions,
            absRoute
        });
    })]);

    // Define routes for all questions in resource file.
    for (let i = 0; i < TutThreeQuestions.length; i++) {
        const question = TutThreeQuestions[i];
        app.get(absRoute('/tut3/questions/' + i), [ensureAuthenticated, withErrorHandler(async (req, res) => {
            const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
            if (!session) return res.redirect(absRoute('/tut3'));
            res.render(question.path, {session, question, absRoute, response: JSON.parse(session.responses)[i], activityName: 'tut3'});
        })]);

        app.post(absRoute('/tut3/questions/' + i), [ensureAuthenticated, withErrorHandler(async (req, res) => {
            const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
            if (!session) return res.redirect(absRoute('/tut3'));
            let responses     = JSON.parse(session.responses);
            responses[i]      = req.body.response;
            session.responses = JSON.stringify(responses);
            await session.save();
            res.redirect(absRoute('/tut3/questions'));
        })]);
    }

};

