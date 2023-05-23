const mongoose = require("mongoose");
const validator = require("validator");
const { toJSON, paginate } = require("./plugins");

const patientSchema = mongoose.Schema(
  {
    patientMrn: {
      type: String,
      required: true,
      trim: true,
    },
    patientFhirId: {
      type: String,
      trim: true,
    },
    patientEpid: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    mobilePhone: {
      type: String,
      trim: true,
    },
    homePhone: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    address1: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipcode: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
patientSchema.plugin(toJSON);
patientSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The patient's email
 * @param {ObjectId} [excludePatientId] - The id of the patient to be excluded
 * @returns {Promise<boolean>}
 */
patientSchema.statics.isEmailTaken = async function (email, excludePatientId) {
  const patient = await this.findOne({ email, _id: { $ne: excludePatientId } });
  return !!patient;
};

/**
 * @typedef Patient
 */
const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
