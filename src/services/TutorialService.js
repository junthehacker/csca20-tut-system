const Tutorial = require('../models/Tutorial');

module.exports = class TutorialService {

    /**
     * Create a new tutorial.
     * @param name Name of the tutorial
     * @returns {Promise<Tutorial>}
     */
    static async createTutorial(name) {
        const tutorial = new Tutorial({name});
        await tutorial.save();
        return tutorial;
    }

    /**
     * Attempt to find a tutorial by ID or fail.
     * @param id ID of the tutorial.
     * @returns {Promise<void>}
     */
    static async getOneByIdOrFail(id) {
        const tutorial = await Tutorial.findOne({_id: id});
        if(!tutorial) {
            throw new Error("Tutorial with ID " + id + " cannot be found.");
        }
        return tutorial;
    }

};
