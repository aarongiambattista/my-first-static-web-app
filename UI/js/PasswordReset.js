/**
 * Define eb_passwordReset class.
 * @class eb_passwordReset
 * */
var eb_passwordReset = eb_passwordReset || {};

/**
 * Control level setting: Site path.
 * @property eb_passwordReset.SitePath
 * @type {String}
 */
eb_passwordReset.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_passwordReset.TemplatePath
 * @type {String}
 */
eb_passwordReset.TemplatePath = "html/PasswordReset.html";

/**
 * The path to the eBusiness SOA layer.
 * @property eb_passwordReset.ServicePath
 * @type {String}
 */
eb_passwordReset.ServicePath = eb_Config.ServicePath;

/**
 * Authentication Method.
 * @property eb_passwordReset.AuthenticationMethod
 * @type {String}
 */
eb_passwordReset.AuthenticationMethod = "eBusinessWebUser";

/**
 * Password Reset service URL.
 * @property eb_passwordReset.PasswordResetService
 * @type {String}
 */
eb_passwordReset.PasswordResetService = eb_passwordReset.ServicePath + "/services/Authentication/PasswordReset/" + eb_passwordReset.AuthenticationMethod;

/*Validation Email*/
eb_passwordReset.validateEmail = "";

/**
 * Rendering public method to load HTML template.
 * @method eb_passwordReset.render
 * @param {any} options Object with data required for getting HTML template through Ajax call.
 * @param {String} options.SitePath Site path.
 * @param {Object} options.ServicePath  SOA path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * @returns {String} jQuery promise object which will return HTML template.
 * */
eb_passwordReset.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            options.templatePath = eb_passwordReset.SitePath + eb_passwordReset.ServicePath;
        }

        if (!options.domElement) {
            throw { type: "argument_mismatch", message: 'Missing domElement.  The object passed in must have a domElement property with a non-empty DOM object.', stack: Error().stack };
        }

        eBusinessJQObject.get(options.templatePath).done(function (data) {
            options.domElement.innerHTML = data;
            def.resolve(data);
        }).fail(def.reject);
    }
    return def.promise();
};

/**
 * Password reset request model for binding data.
 * @method eb_passwordReset.model
 * @param {Object} data Reset password service response data.
 * @param {Object} domElement DOM element.
 */
eb_passwordReset.model = function (data, domElement) {
    var _that = this;
    _that.domElement = domElement;

    if (typeof data === 'undefined') {
        data = {
            email: "",
            pwd: "",
            cfmPwd: "",
            showRequestSuccess: 0,
            showPasswordRequest: 1,
            showError: 0,
            token: ""
        };
    }

    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

    ko.validation.rules['confirmPasswordMatches'] = {
        getValue: function (o) {
            return typeof o === 'function' ? o() : o;
        },
        validator: function (val, otherField) {
            return val === this.getValue(otherField);
        },
        message: 'The confirm password field must have the same value'
    };
    ko.validation.registerExtenders();

    _that.showError = ko.observable(data.showError);
    _that.errorMessage = ko.observable();
    _that.email = ko.observable(data.email).extend({ email: true });
    _that.pwd = ko.observable(data.pwd).extend({ required: true, minlength: 12, message: "Password is required", maxLength: 120 });
    _that.cfmPwd = ko.observable(data.cfmPwd).extend({ confirmPasswordMatches: _that.pwd });
    _that.showRequestSuccess = ko.observable(data.showRequestSuccess);
    _that.showPasswordRequest = ko.observable(1);
    _that.token = ko.observable(data.token);

    _that.errors = ko.validation.group(_that);

    _that.passwordResetButtonClick = function () {
        _that.showError(0);
        if (!_that.token()) {
            _that.showError(1);
            _that.errorMessage("Hmmm, we're not sure how you got here but things do not look like we expect.  Try going back to your password reset email and clicking the link again.");
            return;
        }

        if (_that.errors().length === 0) {
            eb_passwordReset.requestPasswordReset(_that);
        } else {
            _that.errors.showAllMessages();
        }
    };
};

/**
 * This function is responsible for calling the password reset service.
 * @method eb_passwordReset.requestPasswordReset
 * @param {Object} model  eb_passwordReset.model Object.
 * @returns {String} jQuery promise object which will return user data.
 **/
eb_passwordReset.requestPasswordReset = function (model) {
    var data = {
        token: model.token(),
        username: model.email,
        password: model.pwd
    };

    var def = eBusinessJQObject.Deferred();
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_passwordReset.PasswordResetService,
            data: data,
            type: "POST",
            headers: headers
        }).done(function (result) {
            console.info(result);
            if (result.success === false) {
                var r = [];
                if (result.errorMessages)
                    for (var i = 0; i < result.errorMessages.length; i++)
                        r.push({
                            message: result.errorMessages[i]
                        });
                result.errorMessages = r;
                model.showPasswordRequest(1);
                model.showRequestSuccess(0);
                model.errorMessage("There was a problem reseting your password, please contact customer support.");
                model.showError(1);

                def.reject(result);
            } else {
                model.showPasswordRequest(0);
                model.showRequestSuccess(1);
                console.info("Password reset.");
            }
            def.resolve(result);
        }).fail(def.reject);
    });
    return def.promise();
};