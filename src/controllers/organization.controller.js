const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { organizationService } = require('../services');

const createOrganization = catchAsync(async (req, res) => {
  const organization = await organizationService.createOrganization(req.body);
  res.status(httpStatus.CREATED).send(organization);
});

const getOrganizations = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'email']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await organizationService.queryOrganizations(filter, options);
  res.send(result);
});

const getOrganization = catchAsync(async (req, res) => {
  const organization = await organizationService.getOrganizatioById(req.params.organizationId);
  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  res.send(organization);
});

const updateOrganization = catchAsync(async (req, res) => {
  const organization = await organizationService.updateOrganizationById(req.params.organizationId, req.body);
  res.send(organization);
});

const deleteOrganization = catchAsync(async (req, res) => {
  await organizationService.deleteOrganizationById(req.params.organizationId);
  res.status(httpStatus.NO_CONTENT).send();
});

const inviteMember = catchAsync(async (req, res) => {
  const { email, role } = req.body
  const { organizationId } = req.params
  await organizationService.inviteUserByEmail(email, organizationId, role);
  res.status(httpStatus.NO_CONTENT).send();
});

const getOrganizationMembers = catchAsync(async (req, res) => {
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
  const { organizationId } = req.params
  const result = await organizationService.queryOrganizationMembers(organizationId, filter, options);
  res.send(result);
});

const getOrganizationSettings = catchAsync(async (req, res) => {
  const organization = await organizationService.getOrganizatioById(req.params.organizationId);
  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  const settings = pick(organization, [req.query.name])
  res.send(settings);
});

module.exports = {
  createOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  inviteMember,
  getOrganizationMembers,
  getOrganizationSettings
};
