const { Facility } = require("../models");

/**
 * Create a facility
 * @param {ObjectId} organizationId
 * @param {Object} facility
 * @returns {Promise<Facility>}
 */
const createFacility = async (organizationId, facility) => {
  //curently not checking to see if a facility has a unique
  //name since it is my assumption that facilityId is the unique identifier

  return await Facility.create(Object.assign(facility, { organizationId }));
};

/**
 * Query for facilities
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFacilities = async (filter, options) => {
  const facilities = await Facility.paginate(filter, options);
  return facilities;
};

/**
 * Get facility by id
 * @param {string} id
 * @returns {Promise<Facility>}
 */
const getFacilityById = async (id) => {
  return await Facility.findById(id);
};

/**
 * Update facility by id
 * @param {string} facilityId
 * @param {Object} updateBody
 * @returns {Promise<Facility>}
 */
const updateFacilityById = async (facilityId, updateBody) => {
  const facility = await getFacilityById(facilityId);
  if (!facility) {
    throw new ApiError(httpStatus.NOT_FOUND, "Facility not found");
  }
  Object.assign(facility, updateBody);
  await facility.save();
  return facility;
};

/**
 * Delete facility by id
 * @param {string} facilityId
 * @returns {Promise<Facility>}
 */
const deleteFacilityById = async (facilityId) => {
  const facility = await getFacilityById(facilityId);
  if (!facility) {
    throw new ApiError(httpStatus.NOT_FOUND, "Facility not found");
  }
  await facility.deleteOne();
  return facility;
};

module.exports = {
  createFacility,
  queryFacilities,
  getFacilityById,
  updateFacilityById,
  deleteFacilityById,
};
