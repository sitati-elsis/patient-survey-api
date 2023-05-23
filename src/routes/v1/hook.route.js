const express = require("express");
const { eventController } = require("../../controllers");

const router = express.Router();

router
  .route("/mirth")
  .post(eventController.createEvent);

module.exports = router;
