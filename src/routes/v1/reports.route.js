const express = require("express");
const auth = require("../../middlewares/auth");
const reportsControler = require("../../controllers/reports.controller");

const router = express.Router();

router
  .route("/")
  .get(auth("viewAdminReports"), reportsControler.getCampaignStatistics);

module.exports = router;
