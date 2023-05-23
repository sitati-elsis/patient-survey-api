const httpStatus = require('http-status');
const { EventLog } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a event
 * @param {Object} eventBody
 * @returns {Promise<EventLog>}
 */
const createEvent = async (eventBody) => {
  if (Object.keys(eventBody).length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Empty event body');
  }
  return EventLog.create(eventBody);
};


module.exports = {
  createEvent,
};
