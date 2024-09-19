const crypto = require('crypto');

const config = {};

config.domain = 'peerwave.org';
config.buymeacoffee = true;
config.documentation = true;
config.quickhost = true;
config.github = true;
config.about = true;
config.iceserver = "turn:localhost:19302" // stun:stun.l.google.com:19302
config.turn = true;
config.turnSecret = "my_secret";
config.turnMiddleware = function(req, res, next) {
    if (!config.turn) {
        res.locals.iceServers = [
            {
                urls: config.iceserver
            }
        ];
        next();
    } else {
        let unixTimeStamp = parseInt(Date.now()/1000) + 4*3600,   // this credential would be valid for the next 4 hours
        username = [unixTimeStamp, crypto.randomUUID()].join(':'),
            password,
            hmac = crypto.createHmac('sha1', config.turnSecret);
        hmac.setEncoding('base64');
        hmac.write(username);
        hmac.end();
        password = hmac.read();
        res.locals.iceServers = [
            {
                urls: config.iceserver,
                username: username,
                credential: password
            }
        ];
        next();
    }
}

module.exports = config;