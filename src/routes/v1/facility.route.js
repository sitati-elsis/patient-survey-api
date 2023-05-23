const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { facilityValidation } = require("../../validations");
const { facilityControler } = require("../../controllers");

const router = express.Router();

router
  .route("/")
  .post(
    auth("manageFacilities"),
    validate(facilityValidation.createFacility),
    facilityControler.createFacility
  )
  .get(
    auth("getFacilities"),
    validate(facilityValidation.getFacilities),
    facilityControler.getFacilities
  );

router
  .route("/:facilityId")
  .get(
    auth("getFacilities"),
    validate(facilityValidation.getFacility),
    facilityControler.getFacility
  )
  .patch(
    auth("manageFacilities"),
    validate(facilityValidation.updateFacility),
    facilityControler.updateFacility
  )
  .delete(
    auth("manageFacilities"),
    validate(facilityValidation.deleteFacility),
    facilityControler.deleteFacility
  );

module.exports = router;
