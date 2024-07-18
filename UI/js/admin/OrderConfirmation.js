/**
 * Define eb_adminOrderConfirmation class.
 * @class eb_adminOrderConfirmation
 * */
var eb_adminOrderConfirmation = eb_adminOrderConfirmation || {};

/**
 * Control level setting: Site path.
 * @property eb_adminOrderConfirmation.SitePath
 * @type {String}
 */
eb_adminOrderConfirmation.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_adminOrderConfirmation.TemplatePath
 * @type {String}
 */
eb_adminOrderConfirmation.TemplatePath = "../html/admin/OrderConfirmation.html";

/**
 * The path to the eBusiness SOA layer.
 * @property eb_adminOrderConfirmation.ServicePath
 * @type {String}
 */
eb_adminOrderConfirmation.ServicePath = eb_Config.ServicePathV1;

/**
 * GET service to get orderConfirmation
 * @property eb_adminOrderConfirmation.getOrderConfirmation
 * @type {String}
 */
eb_adminOrderConfirmation.getOrderConfirmation = eb_adminOrderConfirmation.ServicePath + "admin/company/{id}";

/**
 * GET service to get subscriptionCartItem
 * @property eb_adminOrderConfirmation.subscriptionCartItemsService
 * @type {String}
 */
eb_adminOrderConfirmation.subscriptionCartItemsService = eb_adminOrderConfirmation.ServicePath + "admin/company/{id}/OrderHistory/{orderId}/Items/SubscriptionGeneralProduct";

/**
 * GET service to get subscriptionCartItem with orderline
 * @property eb_adminOrderConfirmation.subscriptionCartItemService
 * @type {String}
 */
eb_adminOrderConfirmation.subscriptionCartItemService = eb_adminOrderConfirmation.ServicePath + "admin/company/{id}/OrderHistory/{orderId}/Items/{orderLineSequence}/SubscriptionGeneralProduct";

/**
 * GET service to get eventCartItem
 * @property eb_adminOrderConfirmation.eventCartItemsService
 * @type {String}
 */
eb_adminOrderConfirmation.eventCartItemsService = eb_adminOrderConfirmation.ServicePath + "admin/company/{id}/OrderHistory/{orderId}/Items/EventProduct";

/**
 * Order history
 * @property eb_adminOrderConfirmation.orderHistory
 * @type {String}
 */
eb_adminOrderConfirmation.orderHistory = "orderHistory";

/* TODO : Need order confirmation actual service. */
/**
 * Post Service to Send the Email
 * @property eb_adminOrderConfirmation.postEmailConfirmationService
 * @type {String}
 */
eb_adminOrderConfirmation.postEmailConfirmationService = eb_adminOrderConfirmation.ServicePath + "admin/company/{id}";

/**
 * For Redirecting to ReviewOrder page
 * @property eb_adminOrderConfirmation.reviewOrderUrl
 * @type {String}
 */
eb_adminOrderConfirmation.reviewOrderUrl = eb_adminOrderConfirmation.SitePath + "admin/ReviewOrder.html";

/**
 * For Redirecting to Billing shipping address page
 * @property eb_adminOrderConfirmation.shippingAddressUrl
 * @type {String}
 */
eb_adminOrderConfirmation.shippingAddressUrl = eb_adminOrderConfirmation.SitePath + "admin/BillingShippingAddress.html";

/**
 * For Redirecting to Checkout page
 * @property eb_adminOrderConfirmation.checkoutUrl
 * @type {String}
 */
eb_adminOrderConfirmation.checkoutUrl = eb_adminOrderConfirmation.SitePath + "admin/Checkout.html";

/**
 * Get orderID from URL
 * @property eb_adminOrderConfirmation.orderId
 * @type {String}
 */
eb_adminOrderConfirmation.orderId = eb_Config.getUrlParameter("orderId");

/**
 * Get donationSuccess from URL
 * @property eb_adminOrderConfirmation.donationSuccess
 * @type {String}
 */
eb_adminOrderConfirmation.donationSuccess = eb_Config.getUrlParameter("donationSuccess");

/**
 * Get membershipSuccess from URL
 * @property eb_adminOrderConfirmation.membershipSuccess
 * @type {String}
 */
eb_adminOrderConfirmation.membershipSuccess = eb_Config.getUrlParameter("membershipSuccess");
/**
 * Get userContext link personID.
 * @property eb_adminOrderConfirmation.personId
 * @type {String}
 */
eb_adminOrderConfirmation.personId = "";

/* Invalid email messages. */
eb_adminOrderConfirmation.invalidEmail = {
    "Invalid email": "Please enter a valid Email address (eg. johdoe@communitybrands.com instead '{email}').",
    "No email": "Please provide email address(s)"
};

/* Email service success messages. */
eb_adminOrderConfirmation.successMessage = 'Order Confirmation has been sent.';

/* Email service failure messages. */
eb_adminOrderConfirmation.failureMessage = 'Sorry, we were not able to send the order confirmation email. Please check the email address provided and retry. If the problem persists, please contact customer support for further assistance.';

/**
 * Rendering public method to load HTML template.
 * Template path and DOM element are required parameters.
 * GET the template by Ajax call using template path and then assign it to DOM element.
 * @method eb_adminOrderConfirmation.render
 * @param {Object} options Object with data required for getting HTML template through Ajax call.
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * 
 * @returns {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_adminOrderConfirmation.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            var finalPath = eb_adminOrderConfirmation.SitePath + eb_adminOrderConfirmation.TemplatePath;
            options.templatePath = finalPath;
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

/** 
 * GET service call method for orderConfirmation Data
 * @method eb_adminOrderConfirmation.getOrderConfirmationData
 * @param {String} orderId Id of order.
 * @param {String} personId personId.
 * @return {Object} jQuery promise object which when resolved returns order confirmation data.
 * */
eb_adminOrderConfirmation.getOrderConfirmationData = function (orderId, companyId) {
    var deferred = eBusinessJQObject.Deferred();
    var service = eb_adminOrderConfirmation.getOrderConfirmation;

    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }

    if (companyId && companyId > 0) {
        service = eb_adminOrderConfirmation.getOrderConfirmation.replace("{id}", companyId) + "/OrderHistory";
        if (orderId && orderId > 0) {
            service = service + "/{orderId}".replace("{orderId}", orderId);
        }
    }
    eBusinessJQObject.get(
        {
            url: service,
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
 * GET service call method for orderItems
 * @method eb_adminOrderConfirmation.getOrderItems
 * @param {String} orderId Id of order
 * @param {String} personId personId
 * @param {Number} orderLineSequence Order line sequence.
 * @return {Object} jQuery promise object which when resolved returns order items list.
 * */
eb_adminOrderConfirmation.getOrderItems = function (orderId, companyId, orderLineSequence) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }

    var service = eb_adminOrderConfirmation.getOrderConfirmation;
    if (companyId && companyId > 0) {
        service = eb_adminOrderConfirmation.getOrderConfirmation.replace("{id}", companyId);
        if (orderId && orderId > 0) {
            service = service + "/OrderHistory/" + orderId + "/Items";
            if (orderLineSequence && orderLineSequence > 0) {
                service = service + "/" + orderLineSequence;
            }
        }
    }

    eBusinessJQObject.get(
        {
            url: service,
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
 * GET service call method for subscriptionCartItems
 * @method eb_adminOrderConfirmation.getSubscriptionCartItems
 * @param {String} orderId Id of order.
 * @param {String} personId personId.
 * @param {Number} orderLineSequence Order line sequence.
 * @return {Object} jQuery promise object which when resolved returns subscription products list.
 * */
eb_adminOrderConfirmation.getSubscriptionCartItems = function (orderId, companyId, orderLineSequence) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }

    if (!orderId) {
        throw { type: "argument_null", message: "orderId property is required.", stack: Error().stack };
    }

    var service = eb_adminOrderConfirmation.getOrderConfirmation;
    if (companyId && companyId > 0) {
        if (orderId && orderId > 0) {
            service = eb_adminOrderConfirmation.subscriptionCartItemsService.replace("{id}", companyId).replace("{orderId}", orderId);
            if (orderLineSequence && orderLineSequence > 0) {
                service = eb_adminOrderConfirmation.subscriptionCartItemService.replace("{id}", companyId).replace("{orderId}", orderId).replace("{orderLineSequence}", orderLineSequence);
            }
        }
    }

    eBusinessJQObject.get(
        {
            url: service,
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
 * GET service call method for event carts
 * @method eb_adminOrderConfirmation.getEventCartItems
 * @param {String} orderId Id of order.
 * @param {String} personId personId.
 * @param {Number} orderLineSequence Order line sequence.
 * @return {Object} jQuery promise object which when resolved returns event products list.
 * */
eb_adminOrderConfirmation.getEventCartItems = function (orderId, companyId, orderLineSequence) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }

    if (!orderId) {
        throw { type: "argument_null", message: "orderId property is required.", stack: Error().stack };
    }

    var service = eb_adminOrderConfirmation.getOrderConfirmation;
    if (companyId && companyId > 0) {
        if (companyId && companyId > 0) {
            service = eb_adminOrderConfirmation.eventCartItemsService.replace("{id}", companyId).replace("{orderId}", orderId);
        }
    }

    eBusinessJQObject.get(
        {
            url: service,
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
 * Post Service for Email Order Confirmation.
 * @method eb_adminOrderConfirmation.postEmailConfirmation
 * @param {String} personId personId.
 * @param {String} orderId Id of order.
 * @param {String} data email address of person.
 * @return {Object} jQuery promise object which will return undefined.
 * */
eb_adminOrderConfirmation.postEmailConfirmation = function (companyId, orderId, data) {
    var deferred = eBusinessJQObject.Deferred();
    var service = eb_adminOrderConfirmation.postEmailConfirmationService;
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (!companyId) {
        throw { type: "argument_null", message: "orderId property is required.", stack: Error().stack };
    }
    if (companyId && companyId > 0) {
        if (orderId && orderId > 0) {
            service = (eb_adminOrderConfirmation.postEmailConfirmationService + "/OrderHistory/" + orderId + "/SendConfirmationEmail").replace("{id}", companyId);
        }
    }
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax(
            {
                url: service,
                type: "POST",
                data: data,
                contentType: "application/json",   
                xhrFields: {
                    withCredentials: true
                },
                headers: headers
            }
        ).done(function (data) {
            deferred.resolve(data);
        }).fail(deferred.reject);
    });
    return deferred.promise();
};

/**
 * Get event items data.
 * @method eb_adminOrderConfirmation.getEventCartItemsFromServer
 * @param {Object} orderLinesItems Order lines for event related product.
 * @param {String} orderId Id of order.
 * @param {String} companyId companyId.
 * @return {Object} jQuery promise object which will return event product detail.
 * */
eb_adminOrderConfirmation.getEventCartItemsFromServer = function (orderLinesItems, orderId, companyId) {
    var def = eBusinessJQObject.Deferred();
    var value = true;
    var subItems = [];
    var cartItem = ko.utils.arrayFirst(orderLinesItems, function (item) {
        return item.productType.toLowerCase() === "meeting";
    });
    if (cartItem) {
        eb_adminOrderConfirmation.getEventCartItems(orderId, companyId).done(function (result) {
            def.resolve(result);
        }).fail(def.reject);
    } else { def.resolve(subItems); }
    return def.promise();
};

/**
 * Get subscription items data.
 * @method eb_adminOrderConfirmation.getSubscriptionCartItemsFromServer
 * @param {Object} orderLinesItems Order lines for subscription related product.
 * @param {String} orderId Id of order.
 * @param {String} companyId companyId.
 * @param {Number} orderLineSequence Order line sequence.
 * @return {Object} jQuery promise object which will return subscription product detail.
 * */
eb_adminOrderConfirmation.getSubscriptionCartItemsFromServer = function (orderLinesItems, orderId, companyId, orderLineSequence) {
    var def = eBusinessJQObject.Deferred();
    var value = true;
    var subItems = [];
    var cartItem = ko.utils.arrayFirst(orderLinesItems, function (item) {
        return item.isSubscription === value;
    });
    if (cartItem) {
        eb_adminOrderConfirmation.getSubscriptionCartItems(orderId, companyId, orderLineSequence).done(function (result) {
            def.resolve(result);
        }).fail(def.reject);
    } else { def.resolve(subItems); }
    return def.promise();
};

/**
 * Order Confirmation Model for binding data.
 * The model contains observable properties to hold corresponding data returned from services.
 * Also, model contains computed properties and methods to support Order functionality.
 * @method eb_adminOrderConfirmation.model
 * @param {Object} data All the profile related information of user.
 * @param {Object} options Contains necessary data which is required for Order functionality.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL.
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 * @param {Object} options.userContext userContext Object.
 */
eb_adminOrderConfirmation.model = function (data, options) {
    var _that = this;
    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement property is required.", stack: Error().stack };
    }
    _that.domElement = options.domElement;
    eb_adminOrderConfirmation.domElement(_that.domElement);
    var emailIds = "";
    var emailRegex = eb_adminOrderConfirmation.emailRegex;

    _that.orderId = ko.observable();
    _that.personId = ko.observable();/* Person id is set when user's log in.*/
    _that.emailTo = ko.observable();/* Email id is set when user's log in into it.*/
    _that.orderType = ko.observable();
    _that.orderStatus = ko.observable();
    _that.currencySymbol = ko.observable();
    _that.grandTotal = ko.observable();
    _that.shipType = ko.observable();
    _that.payType = ko.observable();
    _that.shipToName = ko.observable();
    _that.shipToAddress = ko.observable();
    _that.shipToCity = ko.observable();
    _that.shipToState = ko.observable();
    _that.shipToZipCode = ko.observable();
    _that.shipToCountry = ko.observable();
    _that.billToName = ko.observable();
    _that.billToAddress = ko.observable();
    _that.billToCity = ko.observable();
    _that.billToState = ko.observable();
    _that.billToZipCode = ko.observable();
    _that.billToCountry = ko.observable();
    _that.subTotal = ko.observable();
    _that.email = ko.observable("");
    _that.emailSend = ko.observable(1);
    _that.hideStepsWizard = ko.observable(eb_adminOrderConfirmation.donationSuccess);
    _that.hideStepsWizardMembership = ko.observable(eb_adminOrderConfirmation.membershipSuccess);
    _that.hideStepsWizardVisible = ko.observable();

    if (_that.hideStepsWizard() === 0 || _that.hideStepsWizardMembership() === 0) {
        _that.hideStepsWizardVisible(0);
    }
    else {
        _that.hideStepsWizardVisible(1)
    }
    if (options.userContext) {
        _that.userContext = options.userContext;
        eb_adminOrderConfirmation.personId = _that.userContext.LinkId();
    }

    /* Get order confirmation data. */
    _that.getOrderConfirmationDataFromServer = function () {
        return eb_adminOrderConfirmation.getOrderConfirmationData(eb_adminOrderConfirmation.orderId, eb_adminOrderConfirmation.personId);
    };

    /* Load data on order confirmation page. */
    _that.loadOrderConfirmationDataFromServer = function (data) {
        _that.orderId(data['id']);
        _that.personId(eb_adminOrderConfirmation.personId); /* Here the data is coming from the personId of whichever the user is login */
        _that.orderType(data['orderType']);
        /* Date Format */
        _that.orderDate = ko.computed(function () {
            return moment(data['orderDate']).format(eb_Config.defaultDateFormat);
        });
        _that.orderStatus(data['orderStatus']);
        if (data['currencySymbol']) {
            _that.currencySymbol(data['currencySymbol'].trim());
        }
        _that.grandTotal(parseFloat(data['grandTotalBeforeDiscount']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        _that.shipType(data['shipmentMethod']);
        _that.payType(data['paymentType']);
        _that.shipToName(data['shipToName']);
        _that.shipToAddress(data['shipToLine1'] + data['shipToLine2']);
        _that.shipToCity(data['shipToCity']);
        _that.shipToState(data['shipToState']);
        _that.shipToZipCode(data['shipToZipCode']);
        _that.shipToCountry(data['shipToCountry']);
        _that.billToName(data['billToName']);
        _that.billToAddress(data['billToLine1'] + data['billToLine2']);
        _that.billToCity(data['billToCity']);
        _that.billToState(data['billToState']);
        _that.billToZipCode(data['billToZipCode']);
        _that.billToCountry(data['billToCountry']);
        _that.subTotal(parseFloat(data['subTotal']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        _that.emailTo(_that.userContext.Email());
    };

    staticData = {
        showSuccessEmail: 0,
        showFailureEmail: 0,
        successEmailMessage: "",
        failureEmailMessage: ""
    };

    if (typeof data === 'undefined') {
        /* Calling get Order Confirmation Data From Server. */
        _that.getOrderConfirmationDataFromServer().done(function (loadData) {
            _that.loadOrderConfirmationDataFromServer(loadData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getOrderConfirmationDataFromServer failed:  " + xhr.responseText);
        });
    }
    else {
        _that.loadOrderConfirmationDataFromServer(data);
    }

    _that.showSuccessEmail = ko.observable(staticData.showSuccessEmail);
    _that.showFailureEmail = ko.observable(staticData.showFailureEmail);
    _that.successEmailMessage = ko.observable(staticData.successEmailMessage);
    _that.failureEmailMessage = ko.observable(staticData.failureEmailMessage);

    /* Email validation */
    _that.checkEmailValidation = function () {
        var emails = _that.email().trim();
        if (emails !== "") {
            var emailList = emails.split(",");
            var emailrule = ko.validation.rules['email'];
            var isValid;
            for (var i = 0; i < emailList.length; i++) {
                isValid = emailrule.validator(emailList[i].trim(), true)
                if (!isValid) {
                    _that.showFailureEmail(1);
                    _that.failureEmailMessage(eb_adminOrderConfirmation.invalidEmail['Invalid email'].replace('{email}', emailList[i].trim()));
                    return isValid;
                }
            }
            return isValid;
        } else {
            _that.showFailureEmail(1);
            _that.failureEmailMessage(eb_adminOrderConfirmation.invalidEmail['No email']);
            return false;
        }
    };

    /* Send email. */
    _that.sendEmail = function () {
        _that.showSuccessEmail(0);
        _that.showFailureEmail(0);
        if (!_that.checkEmailValidation()) {
            return false;
        }
        /* Create array object of email address. */
        var dataToAdd = [];
        var x = _that.email().trim();
        var emails = x.split(",");
        emails.forEach(function (email) {
            dataToAdd.push(email.trim());
        });

        dataToAdd = JSON.stringify(dataToAdd);
        var emailData = '{"addresses":' + dataToAdd + '}';

        /* Post the order confirmation mail. */
        eb_adminOrderConfirmation.postEmailConfirmation(eb_adminShoppingCart.companyId, eb_adminOrderConfirmation.orderId, emailData).done(function (result) {
            _that.showFailureEmail(0);
            _that.showSuccessEmail(1);
            _that.successEmailMessage(eb_adminOrderConfirmation.successMessage);
        }).fail(function (xhr, textStatus, errorThrow) {
            _that.showSuccessEmail(0);
            _that.showFailureEmail(1);
            _that.failureEmailMessage(eb_adminOrderConfirmation.failureMessage);
            console.info("postEmailConfirmation failed:  " + xhr.responseText);
        });
    };

    /* Review page redirection */
    _that.backToReviewOrder = function () {
        if (eb_adminOrderConfirmation.reviewOrderUrl) {
            window.location.assign(eb_adminOrderConfirmation.reviewOrderUrl);
        }
        else {
            console.error("Failed to redirect to review order page.");
        }
    };

    /* Address page redirection */
    _that.backToAddress = function () {
        if (eb_adminOrderConfirmation.shippingAddressUrl) {
            window.location.assign(eb_adminOrderConfirmation.shippingAddressUrl);
        }
        else {
            console.error("Failed to redirect to address order page.");
        }
    };

    /* checkout page redirection. */
    _that.backToCheckout = function () {
        if (eb_adminOrderConfirmation.checkoutUrl) {
            window.location.assign(eb_adminOrderConfirmation.checkoutUrl);
        }
        else {
            console.error("Failed to redirect to checkout page.");
        }
    };
};

/**
 * Page DOM element.
 * @method eb_adminOrderConfirmation.domElement
 * @param {object} domElement current DOM element.
 * */
eb_adminOrderConfirmation.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_adminOrderConfirmation.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminOrderConfirmation);
});


