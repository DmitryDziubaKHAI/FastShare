const userService = require('../services/UserService');

class UserController {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    addUser(req, res) {
        const {username, email, password} = req.body;
        const user = userService.createUser(username, email, password);
        req.session.user = user;
        res.status(201).json({success: true});
    }

    /**
     * @param {import('express').Request & {session: object}} req
     * @param {import('express').Response} res
     */
    login(req, res) {
        const {email, password} = req.body
        const user = userService.login(email, password);
        if(user) {
            req.session.user = user;
            res.status(201).json({success: true});
        } else {
            res.status(401).json({success: false});
        }
    }

    /**
     * @param {import('express').Request & {session: object}} req
     * @param {import('express').Response} res
     */
    logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({success: false});
            } else {
                res.status(201).json({success: true});
            }
        });
    }
}

module.exports = new UserController();
