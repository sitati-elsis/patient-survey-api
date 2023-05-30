const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    WEB_APP_URL: Joi.string().required().description('url of the web client application'),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_SURVEY_RESPONSE_EXPIRATION_DAYS: Joi.number()
      .default(1440)
      .description('minutes after which verify email token expires'),
    JWT_SURVEY_RESPONSE_EXPIRATION_HOURS: Joi.number()
      .default(48)
      .description('hours within which recipients can answer to the surveys'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    SENDGRID_API_KEY: Joi.string().required().description('Sendgrid Mail Web Api Key for sending emails'),
    SENDGRID_VERIFY_EMAIL_TEMPLATE_ID: Joi.string().required().description('id of Sendgrid email template sent for user email verification'),
    SENDGRID_RESET_PASSWORD_TEMPLATE_ID: Joi.string().required().description('id of Sendgrid email template sent for user password reset'),
    SENDGRID_JOIN_TEAM_TEMPLATE_ID: Joi.string().required().description('id of Sendgrid email template sent for user to join an organization'),
    SENDGRID_TAKE_SURVEY_TEMPLATE_ID: Joi.string().required().description('id of Sendgrid email template sent to patients to take a survey'),
    CAMPAIGNS_LIMIT_PER_ORGANIZATION: Joi.string().required().description('The maximum number of active campaigns an organization can have at a time'),
    GOOGLE_RECAPTCHA_SECRET: Joi.string().required().description('Google recaptcha secret key to be used to verify recaptcha tokens')
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  webUrl: envVars.WEB_APP_URL,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {},
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    surveyResponseExpirationHours: envVars.JWT_SURVEY_RESPONSE_EXPIRATION_HOURS,
  },
  email: {
    sendgrid: {
      apiKey: envVars.SENDGRID_API_KEY,
      templates: {
        verifyEmail: envVars.SENDGRID_VERIFY_EMAIL_TEMPLATE_ID,
        resetPassword: envVars.SENDGRID_RESET_PASSWORD_TEMPLATE_ID,
        joinTeamInvitation: envVars.SENDGRID_JOIN_TEAM_TEMPLATE_ID,
        takeSurveyInvitation: envVars.SENDGRID_TAKE_SURVEY_TEMPLATE_ID
      }
    },
    from: envVars.EMAIL_FROM,
  },
  campaigns: {
    limitPerOrganization: envVars.CAMPAIGNS_LIMIT_PER_ORGANIZATION
  },
  google: {
    recaptcha: {
      secret: envVars.GOOGLE_RECAPTCHA_SECRET
    }
  }
};
