const fs = require('fs');
const path = require('path');
const User = require('../models/User');

class UserService {
    /**
     * @type {User[]}
     * @protected
     */
    users;

    /**
     * @type {string}
     * @protected
     */
    usersFile;

    constructor() {
        this.usersFile = path.join(__dirname, '..', 'runtime', 'users.json');
        this.users = this.loadUsers();
    }

    /**
     *
     * @param {string} username
     * @param {string} email
     * @param {string} password
     * @returns {boolean}
     */
    createUser(username, email, password) {
        if (this.users.some(user => user.email === email)) {
            return false;
        }

        const newUser = new User();
        newUser.id = this.users.length + 1;
        newUser.username = username;
        newUser.email = email;
        newUser.password = this.hashPassword(password);
        newUser.roles = ['user'];
        newUser.createdAt = new Date();

        this.users.push(newUser);
        this.saveUsers();
        return true;
    }

    /**
     * @param {string} email
     * @param {string} password
     * @returns {User|null}
     */
    login(email, password) {
        const user = this.users.find(user => user.email === email);
        if(user && this.verifyPassword(password, user.password)) {
            return user;
        }
        return null;
    }

    /**
     * @param {string} password
     * @returns {string}
     */
    hashPassword(password) {
        return `hashed_${password}`;
    }

    /**
     * @param {string} password
     * @param {string} hashedPassword
     * @returns {boolean}
     */
    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }

    /**
     * @returns {User[]}
     */
    loadUsers() {
        if (fs.existsSync(this.usersFile)) {
            const data = fs.readFileSync(this.usersFile).toString();
            return JSON.parse(data);
        }
        return [];
    }

    saveUsers() {
        fs.writeFileSync(this.usersFile, JSON.stringify(this.users, null, 2));
    }
}

module.exports = new UserService();
