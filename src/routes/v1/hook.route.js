const express = require("express");

const router = express.Router();

router
  .route("/mirth")
  .post( async (req, res) => {
    console.log(req.body)
    res.send({message: req.body});
  });

module.exports = router;
