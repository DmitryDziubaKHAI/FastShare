const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const initializeDatabase = require('./db/initDatabase');
const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./routes/loginRoute');
const uploadRoute = require('./routes/uploadRoute');
const downloadRoute = require('./routes/downloadRoute');
const removeFilesRoute = require('./routes/removeFilesRoute');
const myFilesRoute = require('./routes/myFilesRoute');
const jwt = require('jsonwebtoken');
const userRepository = require('./repositories/UserRepository');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const app = express();
const port = 3000;
 
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS policy'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Disposition']    
}));
 
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
 
app.use((req, res, next) => {
    if (req.path === '/login' || req.path === '/register') {
        return next();
    }
    
    const authToken = req.cookies.authToken;
    if (!authToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
});

app.get('/check-auth', async (req, res) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await userRepository.getUserByEmail(decoded.email);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

initializeDatabase().then(() => {
    console.log('Database initialized.');

    app.use(registerRoute);
    app.use(loginRoute);
    app.use(uploadRoute);
    app.use(downloadRoute);
    app.use(removeFilesRoute);
    app.use(myFilesRoute);

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
});

