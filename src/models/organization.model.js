const mongoose = require("mongoose");
const validator = require("validator");
const { toJSON, paginate } = require("./plugins");
const { roles } = require("../config/roles");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
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
        ownerId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
        },
        users: [{
            userId: ObjectId,
            role: {
                type: String,
                enum: roles,
                default: "admin",
            }
        }],
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
