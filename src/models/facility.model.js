const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    fhirId: {
      type: String,
      trim: true,
    },
    organizationId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Organization',
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
facilitySchema.plugin(toJSON);
facilitySchema.plugin(paginate);

/**
 * @typedef Facility
 */
const Facility = mongoose.model("Facility", facilitySchema);

module.exports = Facility;
