const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({}, { strict: false });
/**
 * @typedef EventLog
 */
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
