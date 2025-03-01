const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { facilityService } = require("../services");
const pick = require("../utils/pick");

const createFacility = catchAsync(async (req, res) => {
  const organizationId = req.organizationId
  const facility = await facilityService.createFacility(organizationId, req.body);
  res.status(httpStatus.CREATED).send(facility);
});

const getFacilities = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "fhirId", "status"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const organizationId = req.organizationId
  const result = await facilityService.queryFacilities(Object.assign(filter, { organizationId }), options);
  res.send(result);
});

const getFacility = catchAsync(async (req, res) => {
  const facility = await facilityService.getFacilityById(
    req.params.facilityId
  );
  if (!facility) {
    throw new ApiError(httpStatus.NOT_FOUND, "Campaign not found");
  }
  res.send(facility);
});

const updateFacility = catchAsync(async (req, res) => {
  const facility = await facilityService.updateFacilityById(
    req.params.facilityId,
    req.body
  );
  res.send(facility);
});

const deleteFacility = catchAsync(async (req, res) => {
  await facilityService.deleteFacilityById(req.params.facilityId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFacility,
  getFacilities,
  getFacility,
  updateFacility,
  deleteFacility,
};
