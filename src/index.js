const express             = require('express');
const dotenv              = require('dotenv');
const mongoose            = require('mongoose');
const path                = require('path');
const bodyParser          = require('body-parser');
const session             = require('express-session');
const ensureAuthenticated = require('./middlewares/ensureAuthenticated');
const PairSessionService  = require('./services/PairSessionService');
const absRoute            = require('./util/absRoute');
const withErrorHandler    = require('./util/withErrorHandler');

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(session({secret: 'keyboard cat', name: "csca20.sid"}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get(absRoute('/admin'), [ensureAuthenticated, async (req, res) => {
    if (req.user.groups.indexOf("admin") < 0) {
        return res.redirect(absRoute("/tut0"));
    }
    res.render('admin', {user: req.user, sessions: await PairSessionService.getAll(), absRoute});
}]);

app.get(absRoute(`/admin/:sessionId`), [ensureAuthenticated, async (req, res) => {
    if (req.user.groups.indexOf("admin") < 0) {
        return res.redirect(absRoute("/tut0"));
    }
    const session = await PairSessionService.getOneByIdOrFail(req.params.sessionId);
    res.render('adminAnswers', {user: req.user, sessions: await PairSessionService.getAll(), absRoute, session});
}]);

// IA
app.get(absRoute('/ia/assert'), withErrorHandler(async (req, res) => {
    req.session.iaToken = req.query.token;
    res.redirect(absRoute('/tut0'));
}));

// Bind routes
require('./routes/tut0')(app);

app.listen(process.env.PORT, () => {
    console.log(`Application started on port ${process.env.PORT}.`);
});
