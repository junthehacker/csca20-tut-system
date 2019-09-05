const express            = require('express');
const dotenv             = require('dotenv');
const mongoose           = require('mongoose');
const path               = require('path');
const bodyParser         = require('body-parser');
const session            = require('express-session');
const TutZeroQuestions   = require('./resources/TutZeroQuestions');
const TutorialService    = require('./services/TutorialService');
const PairSessionService = require('./services/PairSessionService');

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

function absRoute(route) {
    return route;
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

app.use(session({secret: 'keyboard cat'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get(absRoute('/admin/login'), (req, res) => {
    res.render('login');
});

app.get(absRoute('/tut0'), withErrorHandler(async (req, res) => {
    const tutorial = await TutorialService.getOneByIdOrFail(req.query.tutorialId);
    res.render('tut0/setup', {tutorial});
}));

app.post(absRoute('/tut0'), withErrorHandler(async (req, res) => {
    const tutorial            = await TutorialService.getOneByIdOrFail(req.body.tutorialId);
    const session             = await PairSessionService.createPairSession(req.body.username1, req.body.username2, tutorial);
    req.session.pairSessionId = session._id.toString();
    res.redirect('/tut0/questions');
}));

app.get(absRoute('/tut0/questions'), withErrorHandler(async (req, res) => {
    const session = await PairSessionService.getOneByIdOrFail(req.session.pairSessionId);
    res.render('tut0/questions', {
        session,
        questions: TutZeroQuestions,
        absRoute
    });
}));

for (let i = 0; i < TutZeroQuestions.length; i++) {
    const question = TutZeroQuestions[i];
    app.get(absRoute('/tut0/questions/' + i), withErrorHandler(async (req, res) => {
        const session = await PairSessionService.getOneByIdOrFail(req.session.pairSessionId);
        res.render(question.path, {session, question});
    }));
}

app.listen(process.env.PORT, () => {
    console.log(`Application started on port ${process.env.PORT}.`);
});
