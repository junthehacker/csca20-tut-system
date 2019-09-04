const PairSession = require('../models/PairSession');

module.exports = class PairSessionService {

    static async createPairSession(username1, username2, tutorial) {
        const session = new PairSession({username1, username2, tutorial});
        await session.save();
        return session;
    }

};
