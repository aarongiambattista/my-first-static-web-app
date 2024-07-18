/**
 * SignUp class.
 * @class eb_SignUp
 * */
var eb_SignUp = eb_SignUp || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_SignUp.SitePath
 * @type {String}
 * */
eb_SignUp.SitePath = eb_Config.SitePath;

/**
 * Sign up control template path.
 * @property eb_SignUp.TemplatePath
 * @type {String}
 * */
eb_SignUp.TemplatePath = "html/SignUp.html";

/**
 * SOA path.
 * It would be set from configuration file.
 * @property eb_SignUp.ServicePath
 * @type {String}
 * */
eb_SignUp.ServicePath = eb_Config.ServicePathV1;

/**
 * User registration service URL.
 * @property eb_SignUp.UserRegistration
 * @type {String}
 * */
eb_SignUp.UserRegistration = eb_SignUp.ServicePath + "user/register";

/**
 * Default page after successful sign-up.
 * @property eb_SignUp.defaultRedirectPage
 * @type {String}
 * @default ProductCatalog.html.
 * */
eb_SignUp.defaultRedirectPage = "ProductCatalog.html";

/**
 * Login page for redirection.
 * @property eb_SignUp.loginPageURL
 * @type {String}
 * @default Login.html.
 * */
eb_SignUp.loginPageURL = "Login.html";

/* Product login URL for navigation. */
eb_SignUp.defaultRedirectURL = eb_Config.getUrlParameter("RedirectPage") ? eb_Config.getUrlParameter("RedirectPage") : eb_Config.SitePath + eb_SignUp.defaultRedirectPage;

/**
 * Globally defined error codes object for the control.
 * Every error code should have boolean 'useServerMessage' attribute, which when true suggests we are
 * showing service error message on the UI.
 * If the 'useServerMessage' is defined as false, then provide another attribute 'frontEndMessage' with
 * the error string which will be shown on UI.
 * If 'useServerMessage' is false and 'frontEndMessage' is not defined, default error message will be shown.
 * If service error response contains error code not defined in this object then default error message will be shown.
 * 
 * @property eb_SignUp.errorResponses
 * @type {Object}
 * */
eb_SignUp.errorResponses = {
    520: { useServerMessage: true },
    521: { useServerMessage: true },
    523: { useServerMessage: true }
};

/**
 * Default error message.
 * @property eb_SignUp.defaultErrorMessage
 * @type {String}
 * */
eb_SignUp.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/* Error message when sign-up is successful but login failed. */
eb_SignUp.loginErrorMessage = 'Unable to login. Please login again.';

/* Invalid email messages. */
eb_SignUp.invalidEmail = "Please enter a valid Email address (eg. johdoe@communitybrands.com).";

/* Input validations */
eb_SignUp.signUpFormValidations = {
    "First name": "Please enter your First Name.",
    "Last name": "Please enter your Last Name.",
    "Password": "Please enter the password.",
    "Confirm password": "Please re-enter the password.",
    "Password didn't match": "The passwords didn't match. Please try again."
};

/**
 * Sign up method. 
 * After success, call login service with user name and password.
 * @method eb_SignUp.callSignUpService
 * @param {Object} model Instance of eb_SignUp.model
 * @return {Object} Login promise object.
 */
eb_SignUp.callSignUpService = function (model) {
    var defer = eBusinessJQObject.Deferred();
    console.info('calling sign up service');
    model.showLoader(1);
    var data = {
        firstName: model.firstName(),
        lastName: model.lastName(),
        email: model.email(),
        password: model.pwd()
    };

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.post({
            url: eb_SignUp.UserRegistration,
            contentType: "application/json",
            data: JSON.stringify(data),
            headers: headers
        }).fail(function (data, message, xhr) {
            model.showError(1);
            model.errorMessage('');
            model.showLoader(0);
            defer.reject();
            if (data && typeof data.responseJSON !== 'undefined') {
                model.errorMessage(eb_Config.getErrorMessageForControl(data.responseJSON, eb_SignUp));
            }
            else {
                model.errorMessage(eb_SignUp.defaultErrorMessage);
            }

        }).done(function (data, message, xhr) {
            if (model.userContext) {
                var loginParameters = {
                    UserName: ko.toJS(model.email()),
                    RememberMe: ko.toJS(false),
                    Password: ko.toJS(model.pwd())
                };
                model.userContext.login(loginParameters).done(function (data) {
                    model.showLoader(0);
                    model.userContext.Load(data);
                    model.userContext.saveToCache();
                    defer.resolve(data);
                    window.location.assign(eb_SignUp.defaultRedirectURL);
                }).fail(function (data, msg, jhr) {
                    model.showLoader(0);
                    model.showError(1);
                    model.errorMessage(eb_SignUp.loginErrorMessage);
                    console.error(jhr);
                    defer.reject();
                });
            }
            else {
                console.error('UserContext object no more exist!');
                defer.reject();
            }
        });
    });
    return defer.promise();
};

/**
 * Sign-Up model responsible to all sign up operations.
 * 
 * @method eb_SignUp.model
 * @param {Object} data Object of sign up data.
 * @param {Object} domElement Sign up DOM element.
 * @param {Object} userContext Instance of eb_UserContext.model.
 * 
 * */
eb_SignUp.model = function (data, domElement, userContext) {
    var _that = this;
    _that.domElement = domElement;

    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

    if (typeof data === 'undefined') {
        data = { firstName: "", lastName: "", email: "", pwd: "", cfmPwd: "", showAlreadyRegistered: 0, showError: 0, showSignup: 1 };/* default data */
    }

    _that.showLoader = ko.observable(0);
    _that.firstName = ko.observable(data['firstName']).extend({ required: { params: true, message: eb_SignUp.signUpFormValidations['First name'] } });
    _that.lastName = ko.observable(data['lastName']).extend({ required: { params: true, message: eb_SignUp.signUpFormValidations['Last name'] } });
    /* Email validations */
    _that.email = ko.observable(data['email']).extend({ email: { params: true, message: eb_SignUp.invalidEmail } });
    _that.pwd = ko.observable(data['pwd']).extend({ required: { params: true, message: eb_SignUp.signUpFormValidations['Password'] } });
    _that.cfmPwd = ko.observable(data['cfmPwd']).extend({
        validation: [
            {
                validator: function (val) {
                    if (val === "") {
                        return false;
                    }
                    return true;
                },
                message: eb_SignUp.signUpFormValidations['Confirm password']
            },
            {
                validator: function (val) {
                    if (val !== _that.pwd()) {
                        return false;
                    }
                    return true;
                },
                message: eb_SignUp.signUpFormValidations["Password didn't match"]
            }
        ]
    });
    _that.showAlreadyRegistered = ko.observable(data['showAlreadyRegistered']);
    _that.showError = ko.observable(data['showError']);
    _that.showSignup = ko.observable(data['showSignup']);
    _that.errorMessage = ko.observable();

    _that.hideErrorMessage = function () {
        _that.showError(0);
        _that.errorMessage('');
    };

    /*Need to set error validation group after assigned all values.*/
    _that.errors = ko.validation.group(_that);

    if (userContext) {
        _that.userContext = userContext;
    }

    /*Click event of sign up button.*/
    _that.clickSignMeUp = function () {
        _that.showError(0);
        _that.errorMessage('');
        if (_that.errors().length === 0) {
            eb_SignUp.callSignUpService(_that);
        } else {
            _that.errors.showAllMessages();
        }
    };

    /*Redirect to login page*/
    _that.loginPage = function () {
        if (eb_SignUp.loginPageURL) {
            window.location.assign(eb_Config.SitePath + eb_SignUp.loginPageURL + "?" + encodeURIComponent("RedirectPage=" + eb_SignUp.defaultRedirectURL));
        } else {
            console.error("Login page URL need to configure.");
        }
    };
};

/**
 * Responsible for pulling the HTML source for this control.
 * Template Path is optional. If none is provided, the default for the control is used.
 * 
 * @method eb_SignUp.render
 * @param {Object} domElement DOM object of sign up page.
 * @param {String} templatePath Sign-up template URL.
 * @return {String} Sign up HTML template.
 * */
eb_SignUp.render = function (domElement, templatePath) {
    var defer = eBusinessJQObject.Deferred();
    var finalPath = eb_SignUp.SitePath + eb_SignUp.TemplatePath;
    if (typeof templatePath !== 'undefined' && templatePath !== '') {
        finalPath = templatePath;
    }
    eBusinessJQObject.get(finalPath).done(function (data) {
        domElement.innerHTML = data;
        defer.resolve(data);
    }).fail(defer.reject);
    return defer.promise();
};

/**
 * page DOM element.
 * @method eb_SignUp.domElement
 * @param {object} domElement current DOM element.
 **/
eb_SignUp.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};