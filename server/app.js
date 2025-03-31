const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');
const fileController = require('./controllers/FileController');
const userController = require('./controllers/UserController');

const app = express();
const upload = multer();

/**
 * @todo config
 * @type {string}
 */
const sessionKey = 'MySuperKey@todo-config';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// /**
//  * @todo config
//  */
// app.use((req, res, next) => {
//     const auth = {login: 'test12345', password: 'test12345'}
//
//     const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
//     const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
//
//     if (login && password && login === auth.login && password === auth.password) {
//         return next()
//     }
//
//     res.set('WWW-Authenticate', 'Basic realm="401"')
//     res.status(401).send('Authentication required.');
// })

app.use(logger('dev'));
app.use(express.json());
app.use(session({
    secret: sessionKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post(
    '/upload',
    upload.single('file'),
    /**
     * @param {import('express').Request & {file: UploadFileDescription} & {session: object}} req
     * @param {import('express').Response} res
     */
    (req, res) => {
        const {password} = req.body
        req.file.password = password;
        req.file.userId = req.session.user.id;
        req.file.originalname = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
        return fileController.uploadFile(req, res);
    }
);

app.get(
    '/files',
    (req, res) => {
        return fileController.listFiles(req, res);
    }
);

app.get(
    '/download/:id/:key',
    (req, res) => {
        return fileController.downloadFile(req, res);
    }
);

app.get(
    '/download/:id',
    (req, res) => {
        return fileController.downloadPage(req, res);
    }
);
app.post(
    '/download/:id',
    (req, res) => {
        return fileController.downloadPage(req, res);
    }
);

app.post(
    '/signup',
    (req, res) => {
        return userController.addUser(req, res);
    }
);
app.post(
    '/login',
    (req, res) => {
        return userController.login(req, res);
    }
);
app.post(
    '/logout',
    (req, res) => {
        return userController.logout(req, res);
    }
);

app.get('/', (req, res) => {
    res.render('layout', {
        content: 'index',
        user: req.session.user
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('layout', {
        content: 'error',
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;
