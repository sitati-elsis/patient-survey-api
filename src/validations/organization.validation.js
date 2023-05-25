const Joi = require("joi");
const { objectId } = require("./custom.validation");
const { frequencies, reportTypes } = require("../config/report");
const { amenities } = require("../config/features");

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const createOrganization = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    description: Joi.string(),
    address: Joi.string(),
    phone: Joi.string(),
  }),
};

const getOrganizations = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrganization = {
  params: Joi.object().keys({
    organizationId: Joi.string().custom(objectId),
  }),
};

const updateOrganization = {
  params: Joi.object().keys({
    organizationId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
      description: Joi.string(),
      address: Joi.string(),
      phone: Joi.string(),
      reportNotificationSettings: Joi.object()
        .keys({
          organization: Joi.object()
            .keys({
              enablePeriodicReports: Joi.boolean(),
              reports: Joi.array().items(Joi.object().keys({
                name: Joi.string(),
                frequency: Joi.string().valid(...frequencies),
              })),
            }),
          practitioner: Joi.object()
            .keys({
              enablePeriodicReports: Joi.boolean(),
              reports: Joi.array().items(Joi.object().keys({
                name: Joi.string(),
                frequency: Joi.string().valid(...frequencies),
              })),
            }),
        }),
      accountNotificationSettings: Joi.object()
        .keys({
          enableMobilePush: Joi.boolean(),
          enableDesktopPush: Joi.boolean(),
          enableEmailNotification: Joi.boolean(),
          activeEmailNotification: Joi.boolean(),
        }),
      profile: Joi.object()
        .keys({
          showEmail: Joi.boolean(),
          showPhone: Joi.boolean(),
          amenities: Joi.array().items(Joi.string().valid(...amenities)),
          operationSchedule: Joi.array().items(Joi.object().keys({
            dayOfWeek: Joi.string().valid(...daysOfWeek),
            startTime: Joi.date(),
            endTime: Joi.date(),
          })),
        })
    })
    .min(1),
};

const updateSettings = {
  params: Joi.object().keys({
    organizationId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      reportNotificationSettings: Joi.object()
        .keys({
          organization: Joi.object()
            .keys({
              enablePeriodicReports: Joi.boolean(),
              reports: Joi.array().items(Joi.object().keys({
                name: Joi.string().valid(...reportTypes),
                frequency: Joi.string().valid(...frequencies),
              })),
            }),
          practitioner: Joi.object()
            .keys({
              enablePeriodicReports: Joi.boolean(),
              reports: Joi.array().items(Joi.object().keys({
                name: Joi.string().valid(...reportTypes),
                frequency: Joi.string().valid(...frequencies),
              })),
            }),
        })
    })
    .min(1),
};

const getSettings = {
  params: Joi.object().keys({
    organizationId: Joi.required().custom(objectId),
  }),
  query: Joi.object().keys({
    name: Joi.string().valid('reportNotificationSettings'),
  }),
};

const deleteOrganization = {
  params: Joi.object().keys({
    organizationId: Joi.string().custom(objectId),
  }),
};

const inviteMember = {
  params: Joi.object().keys({
    organizationId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      role: Joi.string(),
    })
    .min(1),
};

const getMembers = {
  params: Joi.object().keys({
    organizationId: Joi.required().custom(objectId),
  }),
  query: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    searchTerm: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  inviteMember,
  getMembers,
  updateSettings,
  getSettings
};
