const config = require('../config/config');
const sgMail = require('@sendgrid/mail')

/**
 * Send an email
 * @param {string} to
 * @param {string} template_id
 * @param {Object} template_data
 * @returns {Promise}
 */
const sendEmail = async (to, template_id, template_data) => {
  sgMail.setApiKey(config.email.sendgrid.apiKey)
  const msg = {
    from: config.email.from,
    template_id,
    personalizations: [{
      to,
      dynamic_template_data: template_data,
    }],

  };
  await sgMail.send(msg)
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const reset_password_url = `${config.webUrl}/reset-password?token=${token}`;
  const template_id = config.email.sendgrid.templates.resetPassword
  const template_data = { reset_password_url }
  await sendEmail(to, template_id, template_data );
};

/**
 * Send verification email
 * @param {User} user
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (user, token) => {
  const { email: to, firstName } = user;
  const verify_email_account_link = `${config.webUrl}/verify-email?token=${token}`;
  const template_id = config.email.sendgrid.templates.verifyEmail
  const template_data = { verify_email_account_link, firstName }
  await sendEmail(to, template_id, template_data);
};

/**
 * Send team invitation email
 * @param {User} user
 * @param {string} token
 * @returns {Promise}
 */
const sendTeamInvitationEmail = async (user, token) => {
  const { email: to } = user;
  const accept_invite_link = `${config.webUrl}/accept-invite?token=${token}`;
  const template_id = config.email.sendgrid.templates.joinTeamInvitation
  const template_data = { accept_invite_link }
  await sendEmail(to, template_id, template_data);
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendTeamInvitationEmail
};
