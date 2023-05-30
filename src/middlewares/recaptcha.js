const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

const recatpcha =
    () =>
        async (req, res, next) => {
            const response_key = req.body.recaptcha;
            const secret_key = config.google.recaptcha.secret;
            const url =
                `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

            fetch(url, {
                method: "post",
            })
                .then((response) => response.json())
                .then((google_response) => {
                    if (google_response.success == true) {
                        console.log('captcha was verified')
                        return next();
                    } else {
                        console.log('captcha was NOT verified')
                        return next(new ApiError(httpStatus.BAD_REQUEST, 'Unable to verify if you are human. Please try again'));
                    }
                })
                .catch((error) => {
                    console.error(error)
                    return next(new ApiError(httpStatus.BAD_REQUEST, "Please verify you're human"));
                });
        };

module.exports = recatpcha;
