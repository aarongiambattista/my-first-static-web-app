﻿/**
 * Define eb_adminReviewOrder class.
 * @class eb_adminReviewOrder
 * */
var eb_adminReviewOrder = eb_adminReviewOrder || {};

/**
 * Control level setting: Site path.
 * @property eb_adminReviewOrder.SitePath
 * @type {String}
 */
eb_adminReviewOrder.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_adminReviewOrder.TemplatePath
 * @type {String}
 */
eb_adminReviewOrder.TemplatePath = "../html/admin/ReviewOrder.html";

/**
 * The path to the eBusiness SOA layer.
 * @property eb_adminReviewOrder.ServicePath
 * @type {String}
 */
eb_adminReviewOrder.ServicePath = eb_Config.ServicePathV1;

/**
 * Navigate to BillingShippingAddress Page
 * @property eb_adminReviewOrder.changeBillingShippingAddressUrl
 * @type {String}
 */
eb_adminReviewOrder.changeBillingShippingAddressUrl = 'BillingShippingAddress.html';

/**
 * GET address record.
 * @property eb_adminReviewOrder.getShippingAddressService
 * @type {String}
 */
eb_adminReviewOrder.getShippingAddressService = eb_Config.ServicePath + "/Addresses";

/**
 * Rendering public method to load HTML template. Based on page level configuration it will select the template and load in DOM
 * @method eb_adminReviewOrder.render
 * @param {any} options options contains different parameter like Sitepath, templatePath and domElement..
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * @returns {String} jQuery return promise object which when resolved returns HTML template.
 * */
eb_adminReviewOrder.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_adminReviewOrder.SitePath + eb_adminReviewOrder.TemplatePath;
        options.templatePath = finalPath;
    }

    if (!options.domElement) {
        throw { type: "argument_mismatch", message: 'Missing domElement.  The object passed in must have a domElement property with a non-empty DOM object.', stack: Error().stack };
    }

    eBusinessJQObject.get(options.templatePath).done(function (data) {
        options.domElement.innerHTML = data;
        defer.resolve(data);
    }).fail(defer.reject);
    return defer.promise();
};


/* To get the address data */
eb_adminReviewOrder.getAddressData = function (parameter) {
    var deferred = eBusinessJQObject.Deferred();
    var serviceUrl = eb_adminReviewOrder.getShippingAddressService;
    if (parameter) {
        serviceUrl = eb_adminReviewOrder.getShippingAddressService + "/" + parameter;
    }
    eBusinessJQObject.get(
        {
            url: serviceUrl,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }
    ).done(function (data) {
        deferred.resolve(data);
        }).fail(deferred.reject);
    return deferred.promise();
};

/**
 * ReviewOrder Model for binding data
 * @method eb_adminReviewOrder.model
 * @param {any} options Options parameter
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL
 * @param {Object} options.shoppingCart Shopping Cart Object.
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 */
eb_adminReviewOrder.model = function (options) {
    var _that = this;
    _that.reviewShowError = ko.observable(options.showPaymentError);
    _that.reviewErrorMessage = ko.observable(options.paymentErrorMessage);
    _that.domElement = options.domElement;
    _that.shoppingCart = options.shoppingCart;
    _that.shippingName = ko.observable();
    _that.shippingLine1 = ko.observable();
    _that.shippingLine2 = ko.observable();
    _that.shippingCity = ko.observable();
    _that.shippingStateProvince = ko.observable();
    _that.shippingPostalCode = ko.observable();
    _that.shippingCountryCode = ko.observable();
    _that.billingName = ko.observable();
    _that.billingLine1 = ko.observable();
    _that.billingLine2 = ko.observable();
    _that.billingCity = ko.observable();
    _that.billingStateProvince = ko.observable();
    _that.billingPostalCode = ko.observable();
    _that.billingCountryCode = ko.observable();
    _that.shippingAddressId = ko.observable(0);
    _that.billingAddressId = ko.observable(0);
    _that.billingSameAsShipping = ko.observable(0);
    _that.billingSameAsShippingCheck = ko.observable(0);
    eb_adminReviewOrder.domElement(_that.domElement);

    /*Name of the company being handled currently.*/
    _that.companyName = ko.observable(options.companyName);

    /* Pass change shipping address URL */
    if (options.changeShippingAddressUrl) {
        eb_adminReviewOrder.changeBillingShippingAddressUrl = options.changeShippingAddressUrl;
    }

    /* Loading the billing shipping data */
    _that.loadBillingShippingAddress = function (data) {
        _that.shippingLine1(data.shipToLine1());
        _that.shippingLine2(data.shipToLine2());
        _that.shippingCity(data.shipToCity());
        _that.shippingStateProvince(data.shipToState());
        _that.shippingPostalCode(data.shipToZipCode());
        _that.shippingCountryCode(data.shipToCountry());
        _that.billingLine1(data.billToLine1());
        _that.billingLine2(data.billToLine2());
        _that.billingCity(data.billToCity());
        _that.billingStateProvince(data.billToState());
        _that.billingPostalCode(data.billToZipCode());
        _that.billingCountryCode(data.billToCountry());
    };

    /* Check billingSameAsShipping and set billing same as shipping ID. */
    if (_that.shoppingCart) {
        if (_that.shoppingCart.shippingAddressId()) {
            _that.shippingAddressId(_that.shoppingCart.shippingAddressId());
        }
        if (_that.shoppingCart.billingAddressId()) {
            _that.billingAddressId(_that.shoppingCart.billingAddressId());
        }

        if (_that.shippingAddressId() === _that.billingAddressId()) {
            _that.billingSameAsShipping(1);
        }
        else {
            _that.billingSameAsShippingCheck(1);
        }
        _that.loadBillingShippingAddress(_that.shoppingCart);
    }

    /* Change Shipping Address redirection. */
    _that.changeShippingAddress = function () {
        if (eb_adminReviewOrder.changeBillingShippingAddressUrl) {
            window.location.replace(eb_adminReviewOrder.changeBillingShippingAddressUrl + "?navigateTo=" + encodeURIComponent("ShippingAddress"));
        }
        else {
            console.error("Failed to redirect to change shipping address Url.");
        }
    };

    /* Change Billing Address redirection. */
    _that.changeBillingAddress = function () {
        if (eb_adminReviewOrder.changeBillingShippingAddressUrl) {
            window.location.replace(eb_adminReviewOrder.changeBillingShippingAddressUrl + "?navigateTo=" + encodeURIComponent("BillingAddress"));
        }
        else {
            console.error("Failed to redirect to change shipping address Url.");
        }
    };

    /* Back To BillingShipping address page */ 
    _that.backToAddress = function () {
        if (eb_adminReviewOrder.changeBillingShippingAddressUrl) {
            window.location.replace(eb_adminReviewOrder.changeBillingShippingAddressUrl);
        }
        else {
            console.error("Failed to redirect to change shipping address Url.");
        }
    };
};

/**
* Page DOM element.
* @method eb_adminReviewOrder.domElement
* @param {object} domElement current DOM element.
* */
eb_adminReviewOrder.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_adminReviewOrder.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminReviewOrder);
});