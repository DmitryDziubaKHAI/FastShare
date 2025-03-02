const User = require('../models/User');

class ACLService {
    constructor() {

    }

    /**
     * @param {User} user
     * @param {string[]} roles
     * @returns {boolean}
     */
    checkRole(user, roles) {
        for (const role of user.roles || []) {
            if(roles.includes(role)) {
                return true;
            }
        }
        return false;
    }
}

module.exports = new ACLService();
