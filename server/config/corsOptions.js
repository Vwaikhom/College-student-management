const allowedOrigins = require('./allowedOrigins');

// const corsOptionsDelegate  = (req, callback) => {
//     let corsOptions;

//     let isDomainAllowed = allowedOrigins.indexOf(req.header('Origin')) !== -1;
    
//     if(isDomainAllowed){
//         corsOptions = { origin: true };
//     } else{
//         corsOptions = { origin: false };
//     }

//     callback(null, corsOptions);
// }

// module.exports = corsOptionsDelegate ;

const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        } else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    allowedHeaders: ['sessionId', 'Content-Type','Authorization'],
    credentials: true
    //rigin: origin
}

module.exports = corsOptions;