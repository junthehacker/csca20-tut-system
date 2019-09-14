const PairSession = require('../models/PairSession');

module.exports = class PairSessionService {

    /**
     * Get one session or throw error.
     * @param id ID of the session.
     * @returns {Promise<PairSession>}
     */
    static async getOneByIdOrFail(id) {
        const session = await PairSession.findOne({_id: id});
        if (!session) {
            throw new Error("Session with ID " + id + " cannot be found.");
        }
        return session;
    }

    static async getAll() {
        return await PairSession.find({});
    }

    /**
     * Create a new pair session.
     * @param username1
     * @param username2
     * @param activityName
     * @returns {Promise<void>}
     */
    static async createPairSession(username1, username2, activityName = "") {
        const session = new PairSession({username1, username2, activityName});
        await session.save();
        return session;
    }

    static async getOneByUsername(username) {
        const session = await PairSession.findOne({
            $or: [
                {
                    username1: username,
                },
                {
                    username2: username,
                }
            ]
        });
        return session;
    }

    static async getOneByUsernameAndActivityName(username, activityName) {
        const session = await PairSession.findOne({
            $and: [
                {
                    $or: [
                        {
                            username1: username,
                        },
                        {
                            username2: username,
                        }
                    ]
                },
                {
                    activityName,
                }
            ]
        });
        return session;
    }

};
