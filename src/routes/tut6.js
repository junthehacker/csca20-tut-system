const absRoute            = require('../util/absRoute');
const withErrorHandler    = require('../util/withErrorHandler');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const PairSessionService  = require('../services/PairSessionService');
const TutSixQuestions    = require('../resources/TutSixQuestions');

const ACTIVITY_NAME = "tut6";

module.exports = function (app) {

    app.get(absRoute(`/${ACTIVITY_NAME}`), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
        if (session) req.session.pairSessionId = session._id.toString();
        res.render(`${ACTIVITY_NAME}/setup`, {user: req.user, session, absRoute});
    })]);

    app.post(absRoute(`/${ACTIVITY_NAME}`), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        await PairSessionService.createPairSession(req.user.username, req.body.username, ACTIVITY_NAME);
        res.redirect(absRoute(`/${ACTIVITY_NAME}`));
    })]);

    app.post(absRoute(`/${ACTIVITY_NAME}/leave`), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
        if (session) await session.remove();
        res.redirect(absRoute(`/${ACTIVITY_NAME}`));
    })]);

    app.get(absRoute(`/${ACTIVITY_NAME}/questions`), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
        if (!session) return res.redirect(absRoute(`/${ACTIVITY_NAME}`));
        res.render(`${ACTIVITY_NAME}/questions`, {
            session,
            questions: TutSixQuestions,
            absRoute
        });
    })]);

    // Define routes for all questions in resource file.
    for (let i = 0; i < TutSixQuestions.length; i++) {
        const question = TutSixQuestions[i];
        app.get(absRoute(`/${ACTIVITY_NAME}/questions/` + i), [ensureAuthenticated, withErrorHandler(async (req, res) => {
            const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
            if (!session) return res.redirect(absRoute(`/${ACTIVITY_NAME}`));
            res.render(question.path, {session, question, absRoute, response: JSON.parse(session.responses)[i], activityName: ACTIVITY_NAME});
        })]);

        app.post(absRoute(`/${ACTIVITY_NAME}/questions/` + i), [ensureAuthenticated, withErrorHandler(async (req, res) => {
            const session = await PairSessionService.getOneByUsernameAndActivityName(req.user.username, ACTIVITY_NAME);
            if (!session) return res.redirect(absRoute(`/${ACTIVITY_NAME}`));
            let responses     = JSON.parse(session.responses);
            responses[i]      = req.body.response;
            session.responses = JSON.stringify(responses);
            await session.save();
            res.redirect(absRoute(`/${ACTIVITY_NAME}/questions`));
        })]);
    }

};

