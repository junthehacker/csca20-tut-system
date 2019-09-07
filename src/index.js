const express             = require('express');
const dotenv              = require('dotenv');
const mongoose            = require('mongoose');
const path                = require('path');
const bodyParser          = require('body-parser');
const session             = require('express-session');
const ensureAuthenticated = require('./middlewares/ensureAuthenticated');
const TutZeroQuestions    = require('./resources/TutZeroQuestions');
const PairSessionService  = require('./services/PairSessionService');

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

function absRoute(route) {
    return process.env.BASE_PATH + route;
}

function withErrorHandler(procedure) {
    return async (req, res, next) => {
        try {
            await procedure(req, res, next)
        } catch (e) {
            next(e);
        }
    }
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(session({secret: 'keyboard cat', name: "csca20.sid"}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get(absRoute('/admin'), [ensureAuthenticated, async (req, res) => {
    if(req.user.groups.indexOf("admin") < 0) {
        return res.redirect(absRoute("/tut0"));
    }
    res.render('admin', {user: req.user, sessions: await PairSessionService.getAll(), absRoute});
}]);

app.get(absRoute(`/admin/:sessionId`), [ensureAuthenticated, async (req, res) => {
    if(req.user.groups.indexOf("admin") < 0) {
        return res.redirect(absRoute("/tut0"));
    }
    const session = await PairSessionService.getOneByIdOrFail(req.params.sessionId);
    res.render('adminAnswers', {user: req.user, sessions: await PairSessionService.getAll(), absRoute, session});
}]);

app.get(absRoute('/tut0'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
    const session = await PairSessionService.getOneByUsername(req.user.username);
    if (session) req.session.pairSessionId = session._id.toString();
    res.render('tut0/setup', {user: req.user, session, absRoute});
})]);

app.post(absRoute('/tut0'), [ensureAuthenticated, withErrorHandler(async (req, res) => {
    const session = await PairSessionService.createPairSession(req.user.username, req.body.username);
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

for (let i = 0; i < TutZeroQuestions.length; i++) {
    const question = TutZeroQuestions[i];
    app.get(absRoute('/tut0/questions/' + i), [ensureAuthenticated, withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByUsername(req.user.username);
        if (!session) return res.redirect(absRoute('/tut0'));
        res.render(question.path, {session, question});
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

// IA
app.get(absRoute('/ia/assert'), withErrorHandler(async (req, res) => {
    req.session.iaToken = req.query.token;
    res.redirect(absRoute('/tut0'));
}));

app.listen(process.env.PORT, () => {
    console.log(`Application started on port ${process.env.PORT}.`);
});
