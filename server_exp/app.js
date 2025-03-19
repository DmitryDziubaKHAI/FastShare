const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const initializeDatabase = require('./db/initDatabase');
const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./routes/loginRoute');
const uploadRoute = require('./routes/uploadRoute');
const downloadRoute = require('./routes/downloadRoute');
const removeFilesRoute = require('./routes/removeFilesRoute');

const app = express();
const port = 3000;

// Розширюємо список дозволених origins
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
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Додаємо обробку OPTIONS запитів
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initializeDatabase().then(() => {
    console.log('Database initialized.');

    app.use(registerRoute);
    app.use(loginRoute);
    app.use(uploadRoute);
    app.use(downloadRoute);
    app.use(removeFilesRoute);

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
});

