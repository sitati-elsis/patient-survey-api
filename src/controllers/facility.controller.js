const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { facilityService } = require("../services");
const pick = require("../utils/pick");

const createFacility = catchAsync(async (req, res) => {
  const facility = await facilityService.createFacility(req.body);
  res.status(httpStatus.CREATED).send(facility);
});

const getFacilities = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["facilityName", "facilityId"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await facilityService.queryFacilities(filter, options);
  res.send(result);
});

const getFacility = catchAsync(async (req, res) => {
  const facility = await facilityService.getFacilityByName(
    req.params.facilityName
  );
  if (!facility) {
    throw new ApiError(httpStatus.NOT_FOUND, "Campaign not found");
  }
  res.send(facility);
});

const updateFacility = catchAsync(async (req, res) => {
  const facility = await facilityService.updateFacilityByName(
    req.params.facilityName,
    req.body
  );
  res.send(facility);
});

const deleteFacility = catchAsync(async (req, res) => {
  await facilityService.deleteFacilityByName(req.params.facilityName);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFacility,
  getFacilities,
  getFacility,
  updateFacility,
  deleteFacility,
};
