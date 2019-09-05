const PairSession = require('../models/PairSession');

module.exports = class PairSessionService {

    /**
     * Get one session or throw error.
     * @param id ID of the session.
     * @returns {Promise<PairSession>}
     */
    static async getOneByIdOrFail(id) {
        const session = await PairSession.findOne({_id: id});
        if(!session) {
            throw new Error("Session with ID " + id + " cannot be found.");
        }
        return session;
    }

    /**
     * Create a new pair session.
     * @param username1
     * @param username2
     * @param tutorial
     * @returns {Promise<void>}
     */
    static async createPairSession(username1, username2, tutorial) {
        const session = new PairSession({username1, username2, tutorial});
        await session.save();
        return session;
    }

};
