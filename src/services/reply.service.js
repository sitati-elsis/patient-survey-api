const httpStatus = require('http-status');
const { Campaign, Reply } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a survey reply
 * @param {ObjectId} campaignId
 * @param {Object} replyBody
 * @returns {Promise<Reply>}
 */
const createReply = async (campaignId, replyBody) => {
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    throw new ApiError(httpStatus.NOT_FOUND, `Campaign not found`);
  }
  const reply = Object.assign(replyBody, { campaignId })
  return Reply.create(reply);
};

/**
 * Query for replies
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReplies = async (filter, options) => {
  const replies = await Reply.paginate(filter, Object.assign(options, {
    populate: 'campaignId.surveyId'
  }));
  return replies;
};

/**
 * Get reply by id
 * @param {ObjectId} id
 * @returns {Promise<Reply>}
 */
const getReplyById = async (id) => {
  return Reply.findById(id);
};

/**
 * Update reply by id
 * @param {ObjectId} replyId
 * @param {Object} updateBody
 * @returns {Promise<Reply>}
 */
const updateReplyById = async (replyId, updateBody) => {
  const reply = await getReplyById(replyId);
  if (!reply) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reply not found');
  }
  Object.assign(reply, updateBody);
  await reply.save();
  return reply;
};

/**
 * Delete reply by id
 * @param {ObjectId} replyId
 * @returns {Promise<Reply>}
 */
const deleteReplyById = async (replyId) => {
  const reply = await getReplyById(replyId);
  if (!reply) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reply not found');
  }
  await reply.deleteOne();
  return reply;
};

module.exports = {
  createReply,
  queryReplies,
  getReplyById,
  updateReplyById,
  deleteReplyById,
};
