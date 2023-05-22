const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { patientValidation } = require("../../validations");
const { patientController } = require("../../controllers");

const router = express.Router();

router
  .route("/")
  .get(
    auth("getPatients"),
    validate(patientValidation.getPatients),
    patientController.getPatients
  );

router
  .route("/:patientId")
  .get(
    auth("getPatients"),
    validate(patientValidation.getPatient),
    patientController.getPatient
  )
  .patch(
    auth("managePatients"),
    validate(patientValidation.updatePatient),
    patientController.updatePatient
  )
  .delete(
    auth("managePatients"),
    validate(patientValidation.deletePatient),
    patientController.deletePatient
  );

module.exports = router;
