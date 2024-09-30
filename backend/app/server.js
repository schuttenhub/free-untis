const HTTP_PORT = process.env.PORT || 8000;
const TOPLEVELPATH = "/"

try {
    // connect database
    console.log('Connect database...');
    const Database = require('better-sqlite3');
    const dbOptions = { verbose: console.log };
    const dbFile = './db/freeuntis.db';
    const dbConnection = new Database(dbFile, dbOptions);

    require('dotenv').config();

    // create server
    const express = require('express');

    const cors = require('cors');
    const bodyParser = require('body-parser');
    const morgan = require('morgan');
    console.log('Creating and configuring Web Server...');
    const app = express();

    // jwt
    const jwt = require('jsonwebtoken');

    
    const cookieParser = require("cookie-parser");
    app.use(cookieParser());
    
    // provide service router with database connection / store the database connection in global server environment
    app.locals.dbConnection = dbConnection;

    // Binding Middleware
    console.log('Binding middleware...');
    app.use(express.static(__dirname + '/public'));

    const corsOptions = {
        origin: function (origin, callback) {
          // Allow requests with no origin (like mobile apps or curl requests)
          if (!origin) return callback(null, true);
      
          // Check if the origin starts with 'localhost' or '127.0.0.1'
          if (/^http:\/\/(localhost|127\.0\.0\.1):3000$/.test(origin) || /^http:\/\/(localhost|127\.0\.0\.1):8000$/.test(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true
      };
      
    app.use(cors(corsOptions));

    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(bodyParser.json());
    app.use(function(request, response, next) {
        //response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000'); 
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.use(morgan('dev'));

    // binding endpoints
    console.log('Binding enpoints, top level Path at ' + TOPLEVELPATH);

    var serviceRouter = require('./services/user.js')
    app.use(TOPLEVELPATH, serviceRouter)

    serviceRouter = require('./services/calendar.js')
    app.use(TOPLEVELPATH, serviceRouter)


    // send default error message if no matching endpoint found
    app.use(function (request, response) {
        console.log('Error occured, 404, resource not found');
        response.status(404).json({'fehler': true, 'nachricht': 'Resource nicht gefunden'});
    });

    // starting the Web Server
    var webServer = app.listen(HTTP_PORT, () => {
        console.log('Listening at localhost, port ' + HTTP_PORT);
        console.log('\nUsage: http://localhost:' + HTTP_PORT + TOPLEVELPATH + "/SERVICENAME/SERVICEMETHOD/....");
        console.log('\nVersion 4.0, 21.02.2023\nSommersemester 2023, HS Albstadt-Sigmaringen, INF');
        console.log('\n\n-----------------------------------------');
        console.log('exit / stop Server by pressing 2 x CTRL-C');
        console.log('-----------------------------------------\n\n');
    });

    const UntisDbFetcher = require('./untisDbFetcher.js');
    var fetcher = new UntisDbFetcher(app.locals.dbConnection);
    fetcher.fetchDb();

} catch (ex) {
    console.error(ex);
}
