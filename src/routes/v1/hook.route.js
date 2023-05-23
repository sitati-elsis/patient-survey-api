const express = require("express");
const { eventController } = require("../../controllers");

const router = express.Router();

router
  .route("/mirth")
  .post(function authentication(req, res, next) {
    const authheader = req.headers.authorization;
    console.log(req.headers);
 
    if (!authheader) {
        let err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err)
    }
 
    const auth = new Buffer.from(authheader.split(' ')[1],
        'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];
 
    if (user == process.env.MIRTH_USER && pass == process.env.MIRTH_API_KEY) {
 
        // If Authorized user
        next();
    } else {
        let err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }
 
}, eventController.createEvent);
  .post( async (req, res) => {
    console.log(req.body)
    res.send({message: "success"});
  });

module.exports = router;
