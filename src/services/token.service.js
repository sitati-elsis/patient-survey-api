const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = ({ userId, expires, type, secret = config.jwt.secret, metadata = {} }) => {
  const payload = {
    sub: userId,
    iat: dayjs().unix(),
    exp: expires.unix(),
    type,
    metadata
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async ({ token, userId, expires, type, blacklisted = false, metadata }) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    metadata,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = dayjs().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken({
    userId: user.id,
    expires: accessTokenExpires,
    type: tokenTypes.ACCESS
  });

  const refreshTokenExpires = dayjs().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken({
    userId: user.id,
    expires: refreshTokenExpires,
    type: tokenTypes.REFRESH
  });
  await saveToken({ token: refreshToken, userId: user.id, expires: refreshTokenExpires, type: tokenTypes.REFRESH });

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = dayjs().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken({
    userId: user.id, expires, type: tokenTypes.RESET_PASSWORD
  });
  await saveToken({ token: resetPasswordToken, userId: user.id, expires, type: tokenTypes.RESET_PASSWORD });
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
  const expires = dayjs().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken({ userId: user.id, expires, type: tokenTypes.VERIFY_EMAIL });
  await saveToken({ token: verifyEmailToken, userId: user.id, expires, type: tokenTypes.VERIFY_EMAIL });
  return verifyEmailToken;
};

/**
 * Generate join team invitation token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateTeamInvitationToken = async (user) => {
  const expires = dayjs().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const teamInvitationToken = generateToken({
    userId: user.id, expires,
    type: tokenTypes.JOIN_TEAM,
    metadata: {
      role: user.role,
      email: user.email,
      organizationId: user.organizationId
    }
  });
  await saveToken({ token: teamInvitationToken, userId: user.id, expires, type: tokenTypes.JOIN_TEAM });
  return teamInvitationToken;
};

/**
 * Generate survey response token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateSurveyResponseToken = async (userId, metadata) => {
  const expires = dayjs().add(config.jwt.surveyResponseExpirationHours, 'hours');
  const surveyResponseToken = generateToken({ userId, expires, type: tokenTypes.SURVEY_RESPONSE, metadata });
  await saveToken({ token: surveyResponseToken, userId, expires, type: tokenTypes.SURVEY_RESPONSE, metadata });
  return surveyResponseToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  generateTeamInvitationToken,
  generateSurveyResponseToken
};
