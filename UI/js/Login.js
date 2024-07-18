/**
 * Login class.
 * This control is dependent on the UserContext control to persist login locally between pages.
 * @class eb_Login
 * */
var eb_Login = eb_Login || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_Login.SitePath
 * @type {String}
 * */
eb_Login.SitePath = eb_Config.SitePath;

/**
 * Login template path.
 * @property eb_Login.TemplatePath
 * @type {String}
 * */
eb_Login.TemplatePath = "html/Login.html";

/**
 * SOA path.
 * @property eb_Login.ServicePath
 * @type {String}
 * */
eb_Login.ServicePath = eb_Config.ServicePath + "services/";

/**
 * Login service path.
 * @property eb_Login.LoginServicePath
 * @type {String}
 * */
eb_Login.LoginServicePath = eb_Login.ServicePath + "Authentication/Login/eBusinessWebUser";

/**
 * Default redirect page.
 * @property eb_Login.defaultRedirectPage
 * @type {String}
 * */
eb_Login.defaultRedirectPage = "ProductCatalog.html";

/**
 * SignUp page URL.
 * @property eb_Login.signUpPageURL
 * @type {String}
 * */
eb_Login.signUpPageURL = "SignUp.html";

/**
 * Product catalog URL for navigation.
 * @property eb_Login.defaultRedirectURL
 * @type {String}
 * */
eb_Login.defaultRedirectURL = eb_Config.getUrlParameter("RedirectPage") ? eb_Config.getUrlParameter("RedirectPage") : eb_Config.SitePath + eb_Login.defaultRedirectPage;

/* Input validations */
eb_Login.loginInputValidations = {
    "User name": "Please enter the email address that you used during signup process.",
    "Password": "Please enter your password."
};

/* Login error message */
eb_Login.loginFailureMessage = "Your username or password is incorrect";

/**
 * Default error message.
 * @property eb_Login.defaultErrorMessage
 * @type {String}
 * */
eb_Login.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/*user context object for set user context data.*/
eb_Login.userContext = function (userContext) {
    var self = this;
    self.userContext = userContext;
};

/**
 * Login model responsible for Login operation.
 * 
 * @method eb_Login.loginModel
 * @param {any} data Login data for binding if required.
 * @param {Object} domElement Login DOM element.
 * @param {Object} userContext eb_UserContext.model instance.
 * 
 * */
eb_Login.loginModel = function (data, domElement, userContext) {

    /*Knockout Validations*/
    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

    ko.validation.registerExtenders();

    var _that = this;
    eb_Login.domElement(domElement);
    _that.userContext = userContext;
    _that.userName = ko.observable("").extend({
        validation: [
            {
                validator: function (val) {                     /*checking for empty string*/
                    if (val === "") {

                        return false;
                    }

                    return true;
                },
                message: eb_Login.loginInputValidations['User name']
            }]
    });
    _that.password = ko.observable("").extend({
        validation: [
            {
                validator: function (val) {                     /*checking for empty string*/
                    if (val === "") {

                        return false;
                    }

                    return true;
                },
                message: eb_Login.loginInputValidations['Password']
            }]
    });
    _that.rememberMe = ko.observable(false);
    _that.errorMessage = ko.observable("");
    _that.showError = ko.observable(0);
    _that.showLogInForm = ko.observable(1);
    _that.result = ko.observableArray();
    _that.userErrorMessage = ko.observable();
    _that.showLoader = ko.observable(0);

    // SAML 
    _that.relayState = ko.observable("");
    _that.issuer = ko.observable("");
    _that.samlURL = ko.observable("");
    _that.saml = ko.observable("");

    /*Need to set error validation group after assigned all values.*/
    _that.errors = ko.validation.group(_that);

    /*user context set globally*/
    if (userContext) {
        eb_Login.userContext(userContext);
    }

    /*Login service*/
    _that.Login = function () {
        var defer = eBusinessJQObject.Deferred();
        if (_that.userName() !== "" & _that.password() !== "") {
            var useSAML = false;

            // Check for RelayState and Issuer, if found handle as SAML login
            var paramsString = window.location.toString().split("?")[1];

            if (paramsString != undefined) {
                var paramValues = paramsString.split("&");
                var params = new Array();
                for (var param in paramValues) {
                    var paramValue = paramValues[param].split("=");
                    params[paramValue[0]] = paramValue[1];
                }

                if (params['RelayState'] != undefined && params['Issuer'] != undefined && params['RelayState'] != '' && params['Issuer'] != '') {
                    useSAML = true;
                }
            }

            if (useSAML) {
                _that.relayState(params['RelayState']);
                _that.issuer(params['Issuer']);
                _that.samlURL(eb_Config.SamlloginPageURL + "?RelayState=" + _that.relayState() + "&Issuer=" + _that.issuer());
                eBusinessJQObject(eb_Login.domElement).find(".btn-login-saml").click();
            }
            else {
                if (eb_Login.userContext) {
                    _that.showLoader(1);
                    var loginParameters = {
                        UserName: ko.toJS(_that.userName()),
                        RememberMe: ko.toJS(_that.rememberMe()),
                        Password: ko.toJS(_that.password())
                    };
                    eb_Login.userContext.login(loginParameters).done(function (data) {
                        eb_Login.userContext.Load(data);
                        eb_Login.userContext.saveToCache();
                        _that.showLoader(0);
                        window.location.assign(eb_Login.defaultRedirectURL);
                    }).fail(function (data, msg, xhr) {
                        _that.userErrorMessage('');
                        _that.showLoader(0);
                        if (typeof data.responseJSON === 'undefined')
                            _that.userErrorMessage(eb_Login.defaultErrorMessage);
                        else
                            _that.userErrorMessage(data.responseJSON.LoginError);
                        _that.showError(1);
                    });
                }
                else {
                    console.error("UserContext object no more exist!");
                }
            }
        } else {
            _that.errors.showAllMessages();
            console.error("Enter UserName or Password");
        }
        return defer.promise();
    };

    /*logout service*/
    _that.Logout = function () {
        var defer = eBusinessJQObject.Deferred();
        if (eb_Login.userContext) {
            eb_Login.userContext.Logout().done(function () {
                _that.showLogInForm(1);
                _that.showLoader(1);
                defer.resolve();
            }).fail(function (data, msg, jhr) {
                _that.showLoader(0);
                console.info(msg);
                defer.reject();
            });
        }
        else {
            console.error("UserContext object no more exist!");
        }
        return defer.promise();
    };

    /*SignUp page URL redirection*/
    _that.signUpPage = function () {
        if (eb_Login.signUpPageURL) {
            window.location.assign(eb_Config.SitePath + eb_Login.signUpPageURL + "?" + encodeURIComponent("RedirectPage=" + eb_Login.defaultRedirectURL));
        } else {
            console.error("signUp Page URL need to configure.");
        }
    };
};

/**
* Render login page.
* @method eb_Login.render
* @param {any} options Array of required data.
* @param {String} options.templatePath Login template URL.
* @return {String} Login HTML template.
* */
eb_Login.render = function (options) {
    var defer = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            options.templatePath = eb_Login.SitePath + eb_Login.TemplatePath;
        }

        if (!options.domElement) {
            throw { type: "argument_mismatch", message: 'Missing domElement.  The object passed in must have a domElement property with a non-empty DOM object.', stack: Error().stack };
        }

        eBusinessJQObject.get(options.templatePath).done(function (data) {
            options.domElement.innerHTML = data;
            defer.resolve(data);
        }).fail(function (data, msg, jhr) {
            defer.reject(data, msg, jhr);
            console.info(msg);
        });
    }
    return defer.promise();
};

/**
 * Login page DOM element.
 * @method eb_Login.domElement
 * @param {object} domElement current DOM element.
 * */
eb_Login.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};