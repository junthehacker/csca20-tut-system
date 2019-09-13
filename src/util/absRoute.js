/**
 * Given a relative route, return the absolute route prepended by BASE_PATH.
 * For example: "/users" -> "{BASE_PATH}/users"
 * @param route
 * @returns {string}
 */
function absRoute(route) {
    return process.env.BASE_PATH + route;
}

module.exports = absRoute;
