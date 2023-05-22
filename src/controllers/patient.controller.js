const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { patientService } = require('../services');

const getPatients = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['firstName', 'middleName', 'lastName', 'email', 'patientMrn']);
  const { searchTerm } = req.query
  if (searchTerm) {
    filter = Object.assign(filter, {
      $or: [
        { email: new RegExp('.*' + searchTerm + '.*', "i") },
        { firstName: new RegExp('.*' + searchTerm + '.*', "i") },
        { lastName: new RegExp('.*' + searchTerm + '.*', "i") },
        { middleName: new RegExp('.*' + searchTerm + '.*', "i") }
      ]
    })
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await patientService.queryPatients(filter, options);
  res.send(result);
});

const getPatient = catchAsync(async (req, res) => {
  const patient = await patientService.getPatientById(req.params.patientId);
  if (!patient) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Patient not found');
  }
  res.send(patient);
});

const updatePatient = catchAsync(async (req, res) => {
  const patient = await patientService.updatePatientById(req.params.patientId, req.body);
  res.send(patient);
});

const deletePatient = catchAsync(async (req, res) => {
  await patientService.deletePatientById(req.params.patientId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
};
