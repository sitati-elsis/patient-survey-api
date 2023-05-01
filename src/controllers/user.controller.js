const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, organizationService } = require('../services');
const { Organization } = require('../models');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

// test purpose only
const createMDummyUsers = catchAsync(async (req, res) => {
  const { users } = req.body
  const response = []
  const organizations = await Organization.find()
  const organizationIds = organizations.map(org => org.id)
  for (let item of users) {
    const user = await userService.createUser(item);
    for (let orgId of organizationIds) {
      await organizationService.addUserById(user.id, orgId, 'physician')
    }

    response.push(user)
  }
  res.status(httpStatus.CREATED).send(organizationIds);
});

const getUsers = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['firstName', 'lastName', 'email', 'role']);
  const { searchTerm } = req.query
  if (searchTerm) {
    filter = Object.assign(filter, {
      $or: [
        { email: new RegExp('.*' + searchTerm + '.*', "i") },
        { firstName: new RegExp('.*' + searchTerm + '.*', "i") },
        { lastName: new RegExp('.*' + searchTerm + '.*', "i") }
      ]
    })
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  createMDummyUsers,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
