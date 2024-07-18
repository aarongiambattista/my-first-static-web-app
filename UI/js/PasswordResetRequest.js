/**
 * Password Reset Request class.
 * @class eb_passwordResetRequest
 * */
var eb_passwordResetRequest = eb_passwordResetRequest || {};

/**
 * Control level setting: Site path.
 * @property eb_passwordResetRequest.sitePath
 * @type {String}
 */
eb_passwordResetRequest.sitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_passwordResetRequest.templatePath
 * @type {String}
 */
eb_passwordResetRequest.templatePath = "html/PasswordResetRequest.html";

/**
 * The path to the eBusiness SOA layer.
 * @property eb_passwordResetRequest.servicePath
 * @type {String}
 */
eb_passwordResetRequest.servicePath = eb_Config.ServicePath;

/**
 * Password Reset Service.
 * @property eb_passwordResetRequest.passwordResetService
 * @type {String}
 */
eb_passwordResetRequest.passwordResetService = eb_passwordResetRequest.servicePath + "services/Authentication/PasswordResetRequest/";

/**
 * Authentication Method.
 * @property eb_passwordResetRequest.authenticationMethod
 * @type {String}
 */
eb_passwordResetRequest.authenticationMethod = "eBusinessWebUser";

/*Validation Email*/
eb_passwordResetRequest.validateEmail = "";

/*Redirect to Home Page*/
eb_passwordResetRequest.returnToHomePageURL = eb_passwordResetRequest.sitePath + "index.html";

/**
 * Rendering public method to load HTML template.
 * Template path and DOM element are required parameters.
 * @method eb_passwordResetRequest.render
 * @param {any} options Array of required data.
 * @param {String} options.SitePath Site path.
 * @param {Object} options.ServicePath  SOA path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * @return {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_passwordResetRequest.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            options.templatePath = eb_passwordResetRequest.SitePath + eb_passwordResetRequest.TemplatePath;
        }

        if (!options.domElement) {
            throw { type: "argument_mismatch", message: 'Missing domElement.  The object passed in must have a domElement property with a non-empty DOM object.', stack: Error().stack };
        }

        eBusinessJQObject.get(options.templatePath).done(function (data) {
            options.domElement.innerHTML = data;
            def.resolve(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            def.reject(xhr, textStatus, errorThrown);
        });
    }
    return def.promise();
};

/* A list of known service responses and the messages that should be displayed to the user in the event that they are received. */
eb_passwordResetRequest.knownEmailErrors = [
    { code: "Valid Email", message: "Please enter a valid Email address (eg. johndoe@yourassociation.com)." }
];

/**
 * Password reset request model for binding data.
 * @method eb_passwordResetRequest.model
 * @param {Object} data Reset password service response data.
 * @param {Object} domElement DOM element.
 */
eb_passwordResetRequest.model = function (data, domElement) {
    var _that = this;
    _that.domElement = domElement;

    if (typeof data === 'undefined') {
        data = {
            email: "",
            showError: 0,
            showPasswordRequest: 1,
            showRequestSuccess: 0
        };
    }

    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

    _that.invalid = ko.observable("");
    _that.email = ko.observable(data.email).extend({
        validation: [
            {
                validator: function (val) {                     /*checking for empty string*/
                    if (val === "") {
                        _that.invalid("invalid");
                        return false;
                    }
                    _that.invalid("");
                    return true;
                },
                message: eb_passwordResetRequest.knownEmailErrors[0].message
            },
            {
                validator: function (val) {                    /*checking for spaces*/
                    var count = val.split(' ').length - 1;
                    if (count > 0) {
                        _that.invalid("invalid");
                        return false;
                    }
                    _that.invalid("");
                    return true;
                },
                message: eb_passwordResetRequest.knownEmailErrors[0].message
            },
            {
                validator: function (val) {                     /*Checking for '@' sign*/
                    var count = val.split('@').length - 1;
                    if (count > 1 || count === 0) {
                        _that.invalid("invalid");
                        return false;
                    }
                    _that.invalid("");
                    return true;
                },
                message: eb_passwordResetRequest.knownEmailErrors[0].message
            },
            {
                validator: function (val) {                     /*checking for local part*/
                    var em = val.split('@');
                    var nameRegex = /^[\w$#!% '&\/\\_\-+={}()~]+(((\.)[\w$#!%' &\/\\_\-+=~{}()]+)*)?$/;
                    if (nameRegex.test(em[0].trim()) === false) {
                        _that.invalid("invalid");
                        return false;
                    }
                    _that.invalid("");
                    return true;
                },
                message: eb_passwordResetRequest.knownEmailErrors[0].message
            },
            {
                validator: function (val) {                     /*checking for domain part*/
                    var em = val.split('@');
                    var domainRegex = /^[\w$#!%'&\/\\_\-+=~{}]+(((\.)[\w$#!%'&\/\\_\-+=~{}]+)*)?\.(([A-Za-z])(([0-9])*)?){2,5}$/;
                    if (domainRegex.test(em[1].trim()) === false) {
                        _that.invalid("invalid");
                        return false;
                    }
                    _that.invalid("");
                    return true;
                },
                message: eb_passwordResetRequest.knownEmailErrors[0].message
            },
            {
                validator: function (val) {                     /*syntax validator*/
                    var emailRegex = /^[\w$#!%'&\/\\_\-+={}()~]+(((\.)[\w$#!%'&\/\\_\-+=~{}()]+)*)?@[\w$#!%'&\/\\_\-+=~{}]+(((\.)[\w$#!%'&\/\\_\-+=~{}]+)*)?\.(([A-Za-z])(([0-9])*)?){2,5}$/;
                    if (emailRegex.test(val.trim()) === false) {
                        _that.invalid("invalid");
                        return false;
                    }
                    _that.invalid("");
                    return true;
                },
                message: eb_passwordResetRequest.knownEmailErrors[0].message
            }
        ]
    });

    _that.userName = ko.observable();
    _that.showError = ko.observable(data.showError);
    _that.errorMessage = ko.observable();
    _that.showPasswordRequest = ko.observable(data.showPasswordRequest);
    _that.showRequestSuccess = ko.observable(data.showRequestSuccess);

    ko.validation.registerExtenders();
    _that.errors = ko.validation.group(_that);

    _that.passwordResetRequestClick = function () {
        _that.showError(0);
        if (_that.errors().length === 0) {
            /*Proceed further for password reset.*/
            eb_passwordResetRequest.requestPasswordReset(_that);
        } else {
            _that.errors.showAllMessages();
        }
    };

    /*Return to home page*/
    _that.returnToHomePage = function () {
        if (eb_passwordResetRequest.returnToHomePageURL) {
            window.location.assign(eb_passwordResetRequest.returnToHomePageURL);
        }
    };
};

/**
 * This function is responsible for calling the password reset service.
 * @method eb_passwordResetRequest.requestPasswordReset
 * @param {Object} model  eb_passwordResetRequest.model Object.
 * @return {Object} jQuery promise object.
 **/
eb_passwordResetRequest.requestPasswordReset = function (model) {
    var data = { email: model.email(), username: model.email() };
    //Need to have waitIndicator

    eb_Config.retrieveCSRFTokens().always(function (headers) {
    return eBusinessJQObject.ajax({
        url: eb_passwordResetRequest.passwordResetService + eb_passwordResetRequest.authenticationMethod,
        data: data,
        type: "POST",
        headers: headers,
        success: function (data) {
            if (data.status === "success") {
                // do something with response.message or whatever other data on success
            } else if (data.status === "error") {
                // do something with response.message or whatever other data on error
            }
            eb_passwordResetRequest.requestPasswordResetSuccess(model);
        },
        error: function (data) {
            eb_passwordResetRequest.requestPasswordResetSuccess(model);
        }
        }).promise();
    });
};

/**
 * This function is responsible for showing failed message.
 * @method eb_passwordResetRequest.requestPasswordResetFailed
 * @param {Object} model  eb_passwordResetRequest.model Object.
 * */
eb_passwordResetRequest.requestPasswordResetFailed = function (model) {
    model.showError(1);
    model.errorMessage("Password reset request failed.");
};

/**
 * This function is responsible for showing success message.
 * @method eb_passwordResetRequest.requestPasswordResetSuccess
 * @param {Object} model  eb_passwordResetRequest.model Object.
 * */
eb_passwordResetRequest.requestPasswordResetSuccess = function (model) {
    model.showPasswordRequest(0);
    model.showRequestSuccess(1);
};