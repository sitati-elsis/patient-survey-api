const mongoose = require("mongoose");
const validator = require("validator");
const { toJSON, paginate } = require("./plugins");
const { roles } = require("../config/roles");
const { reportTypes, frequencies } = require("../config/report");
const { amenities } = require("../config/features");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const reportSchema = mongoose.Schema({
    _id: false,
    name: {
        type: String,
        enum: reportTypes
    },
    frequency: {
        type: String,
        enum: frequencies
    }
})
const reportSettingsSchema = mongoose.Schema(
    {
        _id: false,
        enablePeriodicReports: {
            type: Boolean,
            default: false
        },
        reports: {
            type: [reportSchema],
        },
    }
)

const operationScheduleSchema = mongoose.Schema({
    _id: false,
    dayOfWeek: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    }
})
const publicProfileSchema = mongoose.Schema({
    _id: false,
    showEmail: {
        type: Boolean,
        default: false
    },
    showPhone: {
        type: Boolean,
        default: false
    },
    amenities: {
        type: [String],
        enum: amenities
    },
    operationSchedule: {
        type: [operationScheduleSchema]
    }
})


const organizationSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email");
                }
            },
        },
        description: {
            type: String,
        },
        address: {
            type: String,
        },
        phone: {
            type: String,
        },
        ownerId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
        },
        profile: {
            type: publicProfileSchema
        },
        users: [{
            userId: ObjectId,
            role: {
                type: String,
                enum: roles,
                default: "admin",
            }
        }],
        reportNotificationSettings: {
            type: mongoose.Schema({
                _id: false,
                organization: {
                    type: reportSettingsSchema
                },
                practitioner: {
                    type: reportSettingsSchema
                }
            })
        },
        accountNotificationSettings: {
            type: mongoose.Schema({
                _id: false,
                enableMobilePush: {
                    type: Boolean,
                    default: false
                },
                enableDesktopPush: {
                    type: Boolean,
                    default: false
                },
                enableEmailNotification: {
                    type: Boolean,
                    default: false
                },
                activeEmailNotification: {
                    type: Boolean,
                    default: false
                }
            })
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
organizationSchema.plugin(toJSON);
organizationSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The organization's email
 * @param {ObjectId} [excludeOrganizationId] - The id of the organization to be excluded
 * @returns {Promise<boolean>}
 */
organizationSchema.statics.isEmailTaken = async function (email, excludeOrganizationId) {
    const organization = await this.findOne({ email, _id: { $ne: excludeOrganizationId } });
    return !!organization;
};

/**
 * Check if user exists as a member
 * @param {ObjectId} userId - The user's id
 * @param {ObjectId} organizationId - The id of the organization
 * @returns {Promise<boolean>}
 */
organizationSchema.statics.userExists = async function (userId, organizationId) {
    const organization = await this.findOne({ 'users.userId': userId, _id: organizationId });
    return !!organization;
};

/**
 * @typedef Organization
 */
const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
