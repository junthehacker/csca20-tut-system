const axios = require('axios');

/**
 * @typedef Tutorial
 * @property {string} _id
 * @property {string} name
 * @property {string} courseName
 * @property {string} courseDisplayName
 * @property {Object} content
 */


async function runGetRequest(path) {
    return (await axios.get(process.env.IA_ROOT + path, {
        headers: {
            'authorization': `Bearer ${process.env.IA_SECRET_KEY}`
        }
    })).data;
}

module.exports = class IdentityService {


    static async getAllTutorials() {

    }

    /**
     * Attempt to get user by token.
     * @param token
     * @returns {Promise<*>}
     */
    static async getUserByToken(token) {
        return await runGetRequest(`/api/auth_tokens/${token}`);
    }



};
