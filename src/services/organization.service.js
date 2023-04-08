const httpStatus = require('http-status');
const { Organization } = require('../models');
const ApiError = require('../utils/ApiError');
const { getUserById } = require('./user.service');

/**
 * Create a organization
 * @param {Object} organization
 * @returns {Promise<Organization>}
 */
const createOrganization = async (organization) => {
  if (await Organization.isEmailTaken(organization.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return Organization.create(organization);
};

/**
 * Query for organizations
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrganizations = async (filter, options) => {
  const organizations = await Organization.paginate(filter, options);
  return organizations;
};

/**
 * Get organization by id
 * @param {ObjectId} id
 * @returns {Promise<Organization>}
 */
const getOrganizatioById = async (id) => {
  return Organization.findById(id);
};

/**
 * Get organization by email
 * @param {string} email
 * @returns {Promise<Organization>}
 */
const getOrganizationByEmail = async (email) => {
  return Organization.findOne({ email });
};

/**
 * Update organization by id
 * @param {ObjectId} organizationId
 * @param {Object} updateBody
 * @returns {Promise<Organization>}
 */
const updateOrganizationById = async (organizationId, updateBody) => {
  const organization = await getOrganizatioById(organizationId);
  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  if (updateBody.email && (await Organization.isEmailTaken(updateBody.email, organizationId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(organization, updateBody);
  await organization.save();
  return organization;
};

/**
 * Add user to organization
 * @param {ObjectId} userId - The id of the user to be added
 * @param {ObjectId} organizationId - The id of the organization
 * @param {String} role - The role of the user in the organization
 * @returns {Promise<boolean>}
 */

const addUserById = async (userId, organizationId, role) => {
  const organization = await getOrganizatioById(organizationId);
  const user = await getUserById(userId);
  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (await Organization.userExists(userId, organizationId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }
  if (role === 'owner' && !organization.ownerId) {
    organization.ownerId = userId
  }
  organization.users.push({
    userId,
    role: role === 'owner' ? 'admin' : role
  })
  await organization.save();
  return organization;
};

/**
 * Delete organization by id
 * @param {ObjectId} organizationId
 * @returns {Promise<Organization>}
 */
const deleteOrganizationById = async (organizationId) => {
  const organization = await getOrganizatioById(organizationId);
  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  await organization.remove();
  return organization;
};

module.exports = {
  createOrganization,
  queryOrganizations,
  getOrganizatioById,
  getOrganizationByEmail,
  updateOrganizationById,
  addUserById,
  deleteOrganizationById,
};
