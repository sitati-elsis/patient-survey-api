const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, organizationService } = require('../services');

const register = catchAsync(async (req, res) => {
  const {accountName, recaptcha, ...userBody} = req.body
  const organizationBody = {
    name: accountName,
    email: req.body.email
  }
  const organization = await organizationService.createOrganization(organizationBody)
  const user = await userService.createUser(userBody);
  const token = await tokenService.generateVerifyEmailToken(user);
  
  organizationService.addUserById(user._id, organization._id, 'owner')
  emailService.sendVerificationEmail(user, token);
  res.status(httpStatus.CREATED).send({ user, token });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  const userOrganization = await userService.getOrganiation(user.id)
  const role = userOrganization.users.find(u => u.userId.toString() === user.id)?.role
  const organization = pick(userOrganization, ['id', 'name', 'email'])
  res.send({ user, tokens, organization, role });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const acceptTeamInvite = catchAsync(async (req, res) => {
  await authService.acceptInvitation(req.query.token, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  acceptTeamInvite
};
