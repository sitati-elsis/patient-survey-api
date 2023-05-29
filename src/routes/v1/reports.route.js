const express = require("express");
const auth = require("../../middlewares/auth");
const reportsControler = require("../../controllers/reports.controller");
const validate = require("../../middlewares/validate");
const { reportsValidation } = require("../../validations");

const router = express.Router();

router
  .route("/campaignReports")
  .get(
    auth("viewAdminReports"),
    validate(reportsValidation.getCampaignStatistics),
    reportsControler.getCampaignStatistics
  );

router
  .route("/practionerReports")
  .get(
    auth("viewAdminReports"),
    validate(reportsValidation.getPractionerEngagements),
    reportsControler.getPractionerEngagements
  );
module.exports = router;
