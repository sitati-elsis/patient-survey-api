const { Facility } = require("../models");

/**
 * Create a organization
 * @param {Object} facility
 * @returns {Promise<Facility>}
 */
const createFacility = async (facility) => {
  //curently not checking to see if a facility has a unique
  //name since it is my assumption that facilityId is the unique identifier

  return await Facility.create(facility);
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
 * Get facility by name
 * @param {string} facilityName
 * @returns {Promise<Facility>}
 */
const getFacilityByName = async (facilityName) => {
  //currently getting facility by name since
  // we don't have facility ids
  return await Facility.findOne({ facilityName });
};

/**
 * Update facility by name
 * @param {string} facilityName
 * @param {Object} updateBody
 * @returns {Promise<Facility>}
 */
const updateFacilityByName = async (facilityName, updateBody) => {
  const facility = await getFacilityByName(facilityName);
  if (!facility) {
    throw new ApiError(httpStatus.NOT_FOUND, "Facility not found");
  }
  Object.assign(facility, updateBody);
  await facility.updateOne(facility);
  return facility;
};

/**
 * Delete facility by Name
 * @param {string} facilityName
 * @returns {Promise<Facility>}
 */
const deleteFacilityByName = async (facilityName) => {
  const facility = await getFacilityByName(facilityName);
  if (!facility) {
    throw new ApiError(httpStatus.NOT_FOUND, "Facility not found");
  }
  await facility.deleteOne();
  return facility;
};

module.exports = {
  createFacility,
  queryFacilities,
  getFacilityByName,
  updateFacilityByName,
  deleteFacilityByName,
};
