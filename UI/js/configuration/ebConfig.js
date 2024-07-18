/**
 * Define eb_Config class.
 * @class eb_Config
 * */
var eb_Config = eb_Config || {};

/**
 * Configuration setting: This is site URL.
 * @property eb_Config.SitePath
 * @type {String}
 */
eb_Config.SitePath = 'https://ebiz7.giambattista.io/UI/';
eb_Config.adminSitePath = eb_Config.SitePath + "admin/";

/**
 * Configuration setting: This is Service URL.
 * @property eb_Config.ServicePath
 * @type {String}
 */
eb_Config.ServicePath = 'https://ebiz7.giambattista.io/SOA/';
eb_Config.ServicePathV1 = eb_Config.ServicePath + "v1/";

/**
 * Configuration setting: Login page URL path.
 * @property eb_Config.loginPageURL
 * @type {String}
 */
eb_Config.loginPageURL = eb_Config.SitePath + "login.html";

/**
 * Configuration setting: SAML Login page URL path.
 * @property eb_Config.SamlloginPageURL
 * @type {String}
 */
eb_Config.SamlloginPageURL = eb_Config.ServicePathV1 + "SAMLAuthentication";

/**
 * Configuration setting: Thumbnail image folder path.
 * @property eb_Config.thumbnailImageURL
 * @type {String}
 */
eb_Config.thumbnailImageURL = eb_Config.SitePath + 'images/thumbnail/';

/**
 * Configuration setting: Large image folder path.
 * @property eb_Config.largeImageURL
 * @type {String}
 */
eb_Config.largeImageURL = eb_Config.SitePath + 'images/large/';

/**
 * Configuration setting: Thumbnail and Large image extension.
 * @property eb_Config.imageExtension
 * @type {String}
 */
eb_Config.imageExtension = '.jpg';

/**
 * Configuration setting: This property will load default image [No Photo Available Image] instead original one for product.
 * @property eb_Config.loadDefaultImage
 * @type {String}
 */
eb_Config.loadDefaultImage = true;

/**
 * Configuration setting: CSRF Defense In Depth Token Key.
 * @property eb_Config.CSRFDefenseInDepthToken
 * @type {String}
 */
eb_Config.CSRFDefenseInDepthToken = "CSRFDefenseInDepthToken";

/**
 * Configuration setting: CSRF Defense In Depth Token Value.
 * @property eb_Config.CSRFDefenseInDepthTokenValue
 * @type {String}
 */
eb_Config.CSRFDefenseInDepthTokenValue = "";

/**
 * Configuration setting: request verification token key
 * @property eb_Config.__requestverificationtoken
 * @type {String}
 */
eb_Config.__requestverificationtoken = "__requestverificationtoken";

/**
 * Configuration setting: request verification token value
 * @property eb_Config.__requestverificationtokenValue
 * @type {String}
 */
eb_Config.__requestverificationtokenValue = "";

/**
 * Configuration setting: Bluepay HPP credit card expiry date default settings
 * @property eb_Config.bluepayHPPCreditCardExpiryMonth
 * @type {String}
 */
eb_Config.bluepayHPPCreditCardExpiryMonth = (new Date).getMonth() + 1;

/**
 * Configuration setting: Bluepay HPP credit card expiry date default settings
 * @property eb_Config.bluepayHPPCreditCardExpiryYear
 * @type {String}
 */
eb_Config.bluepayHPPCreditCardExpiryYear = (new Date).getFullYear() + 1;

/**
 * Configuration setting: company admin show more functionality on UI, max char length
 * @property eb_Config.companyAdmin_descriptionCharLength
 * @type {String}
 */
eb_Config.companyAdmin_descriptionCharLength = 450;

/**
 * Configuration setting: CompanyAdmin Dashboard URL path.
 * @property eb_Config.companyAdminDashboardURL
 * @type {String}
 */
eb_Config.companyAdminDashboardURL = eb_Config.SitePath + "admin/Dashboard.html";

/**
 * Configuration setting: CompanyAdmin timeOut, typically for Search functionality. When user stops typing in search text-box, then search function will be called with 500 milliseconds delay.
 * @property eb_Config.companyAdminTimeOut
 * @type {String}
 */
eb_Config.companyAdminSearchTimeOut = 500;

/**
 * Configuration setting: Maximum character length for product description displayed on related products widget. Recommended value is 80 characters.
 * @property eb_Config.relatedProductsDescriptionCharLength
 * @type {String}
 */
eb_Config.relatedProductsDescriptionCharLength = 80;

/**
 * Configuration setting: Maximum character length for product name displayed on related products widget. Recommended value is 18 characters.
 * @property eb_Config.relatedProductsNameCharLength
 * @type {String}
 */
eb_Config.relatedProductsNameCharLength = 18;


/**
 * Configuration setting: CardPointe Hosted Tokenizer path.
 * @property eb_Config.cardPointeHostedTokenizer
 * @type {String}
 */
eb_Config.cardPointeHostedTokenizerTemplatePath = eb_Config.SitePath + "html/HostedTokenizerPaymentForm.html";

/**
 * Configuration setting: Company image folder path.
 * @property eb_Config.companyImageURL
 * @type {String}
 */
eb_Config.companyImageURL = eb_Config.SitePath + 'images/company/';

/**
 * Configuration setting: Pass site level configuration to a control on page startup.
 * Site Path and Service Path will be passed in by default if not explicitly specified in options.
 * @method eb_Config.config 
 * @param {any} options options contains different parameter like templatePath and domElement..
 * @param {any} controlCollection It contains the details of control 
 */
eb_Config.config = function (options, controlCollection) {
    if (typeof options !== 'undefined' && typeof controlCollection !== 'undefined') {
        if (typeof options.SitePath === 'undefined') {
            options.SitePath = eb_Config.SitePath;
        }
        if (typeof options.ServicePath === 'undefined') {
            options.ServicePath = eb_Config.ServicePath;
        }
        /*Loop through options and set them on the control collection.*/
        eBusinessJQObject.map(options, function (option) {
            /*domElement is control instance specific.*/
            if (option !== 'domElement') controlCollection[option] = options[option];
        });
    } else console.error("Please pass in the options collection and the control collection");
};

/**
 * Configuration setting: Get URL Parameter.
 * @method eb_Config.getUrlParameter
 * @param {String} parmName parmName
 * @return {object} jQuery return promise object which contain the url parameter
 */
eb_Config.getUrlParameter = function (parmName) {
    var res = {};
    var tempUrl = decodeURIComponent(location.search);

    if (tempUrl.length === 0)
        return;

    if (tempUrl.charAt(0) === "?")
        tempUrl = tempUrl.slice(1);

    var params = tempUrl;

    eBusinessJQObject.each(params.split("&"), function (i, val) {
        var split = val.split("=");
        if (split.length === 2) {
            res[split[0].toLowerCase()] = split[1];
        } else if (split.length === 3) {
            res[split[0].toLowerCase()] = split[1] + "=" + split[2];
        }
    });

    _urlParameters = res;
    _currentUrl = tempUrl;
    return _urlParameters[parmName.toLowerCase()];
};

/**
 * Configuration setting: Consistent date format (MM/DD/YYYY) on all the pages.
 * @property eb_Config.defaultDateFormat
 * @type {String}
 */
eb_Config.defaultDateFormat = "MM/DD/YYYY";

/**
 * Configuration setting: Consistent date format for events pages.
 * @property eb_Config.eventsDateFormat
 * @type {String}
 */
eb_Config.eventsDateFormat = "MM/DD/YYYY hh:mm A";

/**
 * Configuration setting: Digit after decimal number.
 * @property eb_Config.roundOffDigitsAfterDecimal
 * @type {number}
 */
eb_Config.roundOffDigitsAfterDecimal = 2;

/**
 * Configuration setting: service error type.
 * @property eb_Config.serviceErrorType
 * @type {object}
 */
eb_Config.serviceErrorType = {
    'Security Requirement Failed': 'securityrequirementfailed',
    'Http Response': 'httpresponse',
    'Shopping Cart': { useServerMessage: false, errorCode: 681, type: 'ShoppingCart', frontEndMessage: 'The logged-in user has two shopping carts open, hence please contact the system administrator.' }
};

/**
 * Method to return error string.
 * In case of error, the control will call this method to get proper error message.
 * Method will return error message depending on the type of error code.
 * 
 * @method eb_Config.getErrorMessageForControl
 * @param {Object} xhrResponseJSON Error response object returned by service after failure.Contains 'errorCode' and 'message' fields.
 * @param {Object} control Calling control object.
 * @return {String} Error message.
 */
eb_Config.getErrorMessageForControl = function (xhrResponseJSON, control) {
    var _that = this;
    _that.errorMessage = '';
    if (typeof xhrResponseJSON !== 'undefined' && (xhrResponseJSON.type.toLowerCase() === eb_Config.serviceErrorType['Security Requirement Failed'] || xhrResponseJSON.type.toLowerCase() === eb_Config.serviceErrorType['Http Response'])) {
        sessionStorage.clear();
        window.location.assign(eb_Config.loginPageURL);
    }
    else if (typeof xhrResponseJSON !== 'undefined' && xhrResponseJSON.errorCode === eb_Config.serviceErrorType['Shopping Cart'].errorCode && xhrResponseJSON.type === eb_Config.serviceErrorType['Shopping Cart'].type) {
        alert(eb_Config.serviceErrorType['Shopping Cart'].frontEndMessage);
    }
    else if (xhrResponseJSON && typeof control.errorResponses !== 'undefined' && xhrResponseJSON.errorCode in control.errorResponses) {

        if (control.errorResponses[xhrResponseJSON.errorCode].useServerMessage) {
            _that.errorMessage = xhrResponseJSON.message;
        }

        if (_that.errorMessage === '' && typeof control.errorResponses[xhrResponseJSON.errorCode].frontEndMessage !== 'undefined')
            _that.errorMessage = control.errorResponses[xhrResponseJSON.errorCode].frontEndMessage;

        if (_that.errorMessage === '')
            _that.errorMessage = control.defaultErrorMessage || 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';
    }
    else {
        _that.errorMessage = control.defaultErrorMessage || 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';
    }
    return _that.errorMessage;
};

/**
 * Configuration setting: Allow wait list meeting registration, default value would be true. Value of this attribute should be same as service web.config attribute value.
 * @property eb_Config. AllowWaitListMeetingRegistration
 * @type {bool}
 */
eb_Config.AllowWaitListMeetingRegistration = true;

/**
 * Retrive CSRF Tokens method used to get tokens from user information service and set to the jqXHR.
 * 
 * @method eb_Config.retrieveCSRFTokens
 * @return {Object} a promise that resolves with an object containing the headers __requestverificationtokenValue and CSRFDefenseInDepthTokenValue to add and their values to the non-get calls.
 */
eb_Config.retrieveCSRFTokens = function () {
    //If the promise is available then return it instead get it from user information service call.
    if (eb_Config.csrfPromise !== undefined)
        return eb_Config.csrfPromise;

    var defer = eBusinessJQObject.Deferred();
    eb_UserContext.getUserInformation().done(function () {
        var headers = {};
        console.log("XSRF is ready " + new Date());
        headers[eb_Config.__requestverificationtoken] = eb_Config.__requestverificationtokenValue;
        headers[eb_Config.CSRFDefenseInDepthToken] = eb_Config.CSRFDefenseInDepthTokenValue;
        defer.resolve(headers);
    });

    //Property is availabe in eb_Config for refernace.
    eb_Config.csrfPromise = defer.promise();
    return defer.promise();
};

/**
 * Session expired in minutes.
 * @property eb_Config.sessionExpirationInMin
 * @type {bool}
 * */
eb_Config.sessionExpirationInMin = 10;

/**
 * Array for Expiration Years in areas concerning CC expiration like Payments/SPM, etc.
 * @property eb_Config.expirationYearOptions
 * @type {Array}
 * */
eb_Config.expirationYearOptions = ["Year", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040", "2041", "2042"];

eb_Config.CardConnectMerchantId = '890000000095';
eb_Config.CardConnectMerchantName = 'aptify';
eb_Config.GPayButtonSettings = {
    buttonColor: 'black',
    buttonType: 'pay',
};