// app.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const initializeDatabase = require('./db/initDatabase');

const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./routes/loginRoute');
const uploadRoute = require('./routes/uploadRoute');
const downloadRoute = require('./routes/downloadRoute');
const downloadPageRoute = require('./routes/downloadPageRoute');
const removeFilesRoute = require('./routes/removeFilesRoute');
const myFilesRoute = require('./routes/myFilesRoute');

const app = express();
const port = 3000;

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost',
];

app.use(cors({
    origin: (origin, callback) => {
        callback(null, true);
        // if (!origin || allowedOrigins.includes(origin)) {
        //     callback(null, true);
        // } else {
        //     callback(new Error('Not allowed by CORS'));
        // }
    },
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // → true якщо HTTPS
        sameSite: 'lax'
    }
}));

// Маршрути
app.use(registerRoute);
app.use(loginRoute);
app.use(uploadRoute);
app.use(downloadRoute);
app.use(downloadPageRoute);
app.use(removeFilesRoute);
app.use(myFilesRoute);

// Чек автентифікації
app.get('/check-auth', (req, res) => {
    if (req.session.userId) {
        return res.json({ authenticated: true, userId: req.session.userId });
    }
    res.status(401).json({ authenticated: false });
});
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});
initializeDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
});

