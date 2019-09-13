module.exports = function withErrorHandler(procedure) {
    return async (req, res, next) => {
        try {
            await procedure(req, res, next)
        } catch (e) {
            next(e);
        }
    }
};
