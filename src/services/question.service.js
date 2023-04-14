const httpStatus = require('http-status');
const { Question, Survey } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a question
 * @param {Object} questionBody
 * @returns {Promise<Question>}
 */
const createQuestion = async (surveyId, questionBody) => {
  const survey = await Survey.findById(surveyId);
  if (!survey) {
    throw new ApiError(httpStatus.NOT_FOUND, `Survey not found`);
  }
  if (await Question.nameExists(questionBody.name, surveyId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'A question with the name already exists for this survey');
  }
  const question = Object.assign(questionBody, { surveyId })
  return Question.create(question);
};

/**
 * Query for questions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryQuestions = async (filter, options) => {
  const questions = await Question.paginate(filter, options);
  return questions;
};

/**
 * Get question by id
 * @param {ObjectId} id
 * @returns {Promise<Question>}
 */
const getQuestionById = async (id) => {
  return Question.findById(id);
};

/**
 * Update question by id
 * @param {ObjectId} questionId
 * @param {Object} updateBody
 * @returns {Promise<Question>}
 */
const updateQuestionById = async (questionId, updateBody) => {
  const question = await getQuestionById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  if (updateBody.name && (await Question.nameExists(updateBody.name, question.surveyId, questionId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'A question with the name already exists for this survey');
  }
  Object.assign(question, updateBody);
  await question.save();
  return question;
};

/**
 * Delete question by id
 * @param {ObjectId} questionId
 * @returns {Promise<Question>}
 */
const deleteQuestionById = async (questionId) => {
  const question = await getQuestionById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  await question.deleteOne();
  return question;
};

module.exports = {
  createQuestion,
  queryQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
};
