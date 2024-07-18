/**
 * Define eb_BillingShippingAddressAdmin class.
 * @class eb_BillingShippingAddressAdmin
 * */
var eb_BillingShippingAddressAdmin = eb_BillingShippingAddressAdmin || {};

/**
 * Control level setting: Site path.
 * @property eb_BillingShippingAddressAdmin.SitePath
 * @type {String}
 */
eb_BillingShippingAddressAdmin.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_BillingShippingAddressAdmin.TemplatePath
 * @type {String}
 */
eb_BillingShippingAddressAdmin.TemplatePath = "html/admin/BillingShippingAddress.html";

/**
 * The path to the eBusiness SOA layer.
 * @property eb_BillingShippingAddressAdmin.ServicePath
 * @type {String}
 */
eb_BillingShippingAddressAdmin.ServicePath = eb_Config.ServicePathV1;

/**
 * Redirect to review order Page.
 * @property eb_BillingShippingAddressAdmin.orderReviewUrl
 * @type {String}
 */
eb_BillingShippingAddressAdmin.orderReviewUrl = "ReviewOrder.html";

/**
 * Redirect to billing or shipping address
 * @property eb_BillingShippingAddressAdmin.selectedAddress
 * @type {String}
 */
eb_BillingShippingAddressAdmin.selectedAddress = eb_Config.getUrlParameter("navigateTo");

/**
 * Shipping Address
 * @property eb_BillingShippingAddressAdmin.shippingAddress
 * @type {String}
 */
eb_BillingShippingAddressAdmin.shippingAddress = "ShippingAddress";

/**
 * GET service to get all State/Province record.
 * @property eb_BillingShippingAddressAdmin.getProvinceService
 * @type {String}
 */
eb_BillingShippingAddressAdmin.getProvinceService = eb_BillingShippingAddressAdmin.ServicePath + "country/{country}/states";

/**
 * GET service to get all countries records.
 * @property eb_BillingShippingAddressAdmin.getCountriesService
 * @type {String}
 */
eb_BillingShippingAddressAdmin.getCountriesService = eb_BillingShippingAddressAdmin.ServicePath + "countries";

/**
 * GET company's profile address service.
 * @property eb_BillingShippingAddressAdmin.getCompanyProfileAddressService
 * @type {String}
 */
eb_BillingShippingAddressAdmin.getCompanyProfileAddressService = eb_BillingShippingAddressAdmin.ServicePath + "admin/company/{id}/ProfileAddresses";

/**
 * GET company's custom address service.
 * @property eb_BillingShippingAddressAdmin.getCompanyAddressService
 * @type {String}
 */
eb_BillingShippingAddressAdmin.getCompanyAddressService = eb_BillingShippingAddressAdmin.ServicePath + "admin/company/{id}/CompanyAddresses";

/**
 * GET new address service.
 * @property eb_BillingShippingAddressAdmin.newAddressService
 * @type {String}
 */
eb_BillingShippingAddressAdmin.newAddressService = eb_BillingShippingAddressAdmin.ServicePath + "admin/company/{id}/CompanyAddresses";

/**
 * Update company's profile address service.
 * @property eb_BillingShippingAddressAdmin.updateCompanyProfileAddressService
 * @type {String}
 */
eb_BillingShippingAddressAdmin.updateCompanyProfileAddressService = eb_BillingShippingAddressAdmin.ServicePath + "admin/company/{id}/ProfileAddresses/{addressName}";

/**
 * Update company's custom address service.
 * @property eb_BillingShippingAddressAdmin.updateCompanyAddressService
 * @type {String}
 */
eb_BillingShippingAddressAdmin.updateCompanyAddressService = eb_BillingShippingAddressAdmin.ServicePath + "admin/company/{id}/CompanyAddresses/{addressName}";

/**
 * Delete company's custom address
 * @property eb_BillingShippingAddressAdmin.deleteCompanyAddressService
 * @type {String}
 */
eb_BillingShippingAddressAdmin.deleteCompanyAddressService = eb_BillingShippingAddressAdmin.ServicePath + "admin/company/{id}/CompanyAddresses/{addressName}";

/**
 * Delete company's profile address
 * @property eb_BillingShippingAddressAdmin.deleteProfileAddressService
 * @type {String}
 */
eb_BillingShippingAddressAdmin.deleteCompanyProfileAddressService = eb_BillingShippingAddressAdmin.ServicePath + "admin/company/{id}/ProfileAddresses/{addressName}";

/**
 * Get All Shipment types service URL.
 * @property eb_BillingShippingAddressAdmin.getAllShipmentTypesURL
 * @type {String}
 */
eb_BillingShippingAddressAdmin.getAllShipmentTypesURL = "admin/company/{id}/ShoppingCarts/ShipmentTypes";

/**
 * Company Id
 * @property eb_BillingShippingAddressAdmin.companyId
 * @type {String}
 */
eb_BillingShippingAddressAdmin.companyId = "";

/**
 * skipPageRedirection
 * @property eb_BillingShippingAddressAdmin.skipPageRedirection
 * @type {bool}
 */
eb_BillingShippingAddressAdmin.skipPageRedirection = false;

/* Success Responses */
eb_BillingShippingAddressAdmin.successResponses = {
    'Address saved': 'The new address has been saved successfully.',
    'Address updated': 'Your address has been updated successfully.',
    'Address deleted': 'Your address has been deleted successfully.'
};

/**
 * Globally defined error codes object for the control.
 * Every error code should have boolean 'useServerMessage' attribute, which when true suggests we are
 * showing service error message on the UI.
 * If the 'useServerMessage' is defined as false, then provide another attribute 'frontEndMessage' with
 * the error string which will be shown on UI.
 * If 'useServerMessage' is false and 'frontEndMessage' is not defined, default error message will be shown.
 * If service error response contains error code not defined in this object then default error message will be shown.
 * 
 * @property eb_BillingShippingAddressAdmin.errorResponses
 * @type {Object}
 * */
eb_BillingShippingAddressAdmin.errorResponses = {
    689: { useServerMessage: true },
    688: { useServerMessage: true },
    687: { useServerMessage: true }
};

/**
 * Default error message.
 * @property eb_BillingShippingAddressAdmin.defaultErrorMessage
 * @type {String}
 * */
eb_BillingShippingAddressAdmin.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/* Input validations */
eb_BillingShippingAddressAdmin.addressValidations = {
    "Address name": "Please enter address name.",
    "Line1": "Please enter address line1 details.",
    "City": "Please enter city.",
    "Country": "Please select the country.",
    "Select Billing": "Please select a Billing address.",
    "Select Shipping": "Please select a Shipping address."
};

/**
 * Gets all web-enabled shipment types.
 * @method eb_BillingShippingAddressAdmin.getAllShipmentTypes
 * @return {Object} jQuery promise object which when resolved returns shipment type list.
 * */
eb_BillingShippingAddressAdmin.getAllShipmentTypes = function (companyId) {
    var defer = eBusinessJQObject.Deferred();
    console.info('get all shipment types');
    var serviceURL = eb_BillingShippingAddressAdmin.ServicePath + eb_BillingShippingAddressAdmin.getAllShipmentTypesURL.replace("{id}", companyId);
    eBusinessJQObject.get({
        url: serviceURL,
        xhrFields: {
            withCredentials: true
        }
    }).done(function (result) {
        defer.resolve(result);
    }).fail(defer.reject);
    return defer.promise();
};

/**
 * Rendering public method to load HTML template.
 * Based on page level configuration it will select the template and load in DOM.
 * Template path and DOM element are required parameters.
 * GET the template by Ajax call using template path and then assign it to DOM element.
 * @method eb_BillingShippingAddressAdmin.render
 * @param {Object} options Object with data required for getting HTML template through Ajax call.
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * 
 * @returns {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_BillingShippingAddressAdmin.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_BillingShippingAddressAdmin.SitePath + eb_BillingShippingAddressAdmin.TemplatePath;
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


/** 
 * Get State/Province list from the server through the get service call.
 * @method eb_BillingShippingAddressAdmin.getProvinceData
 * @param {String} country All the state in specified country
 * @return {Object} Return Array of state
 * */
eb_BillingShippingAddressAdmin.getProvinceData = function (country) {
    var deferred = eBusinessJQObject.Deferred();
    if (!country) {
        throw { type: "argument_null", message: "country property is required.", stack: Error().stack };
    }
    var servicePath = eb_BillingShippingAddressAdmin.getProvinceService;
    if (country) {
        servicePath = eb_BillingShippingAddressAdmin.getProvinceService.replace("{country}", country);
    }
    eBusinessJQObject.get(
        {
            url: servicePath,
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
 * Public method to get countries data list from the server.
 * @method eb_BillingShippingAddressAdmin.getCountriesData
 * @return {Object} Return Array of All Countries
 * */
eb_BillingShippingAddressAdmin.getCountriesData = function () {
    var deferred = eBusinessJQObject.Deferred();
    eBusinessJQObject.get(
        {
            url: eb_BillingShippingAddressAdmin.getCountriesService,
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
 * Public method to get Profile Addresses data list from the server
 * @method eb_BillingShippingAddressAdmin.getCompanyProfileAddresses
 * @param {Number} companyId companyId to get profile addresses
 * @return {Object} Addresses of person
 * */
eb_BillingShippingAddressAdmin.getCompanyProfileAddresses = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId || companyId <= 0) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    var service = eb_BillingShippingAddressAdmin.getCompanyProfileAddressService.replace("{id}", companyId);
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
 * Public method to get custom Company Addresses data list from the server
 * @method eb_BillingShippingAddressAdmin.getCompanyAddresses
 * @param {Number} companyId companyId to get company addresses
 * @return {Object} Addresses of company
 * */
eb_BillingShippingAddressAdmin.getCompanyAddresses = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId || companyId <= 0) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    var service = eb_BillingShippingAddressAdmin.getCompanyAddressService.replace("{id}", companyId);

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
 * POST service call method.
 * @method eb_BillingShippingAddressAdmin.createAddressRecord
 * @param {Number} companyId companyId 
 * @param {Object} data Address related information[ State, City, Country ...]
 * @return {Object} New address promise object with City, Id, Country, State, line1, line2, name, postal code, StateProvience fields.
 * */
eb_BillingShippingAddressAdmin.createAddressRecord = function (data, companyId) {
    var defer = eBusinessJQObject.Deferred();
    console.info('create address record...');

    if (!companyId || companyId <= 0) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (!data) {
        throw { data: "argument_null", message: "data property is required.", stack: Error().stack };
    }
    var service = eb_BillingShippingAddressAdmin.newAddressService.replace("{id}", companyId);
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: service,
            crossDomain: true,
            type: "POST",
            data: data,
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (result) {
            defer.resolve(result);
        }).fail(defer.reject);
    });
    return defer.promise();
};


/** 
 * PATCH service call method.
 * @method eb_BillingShippingAddressAdmin.updateCompanyProfileAddressRecord
 * @param {Number} companyId companyId
 * @param {Object} data Address related information[ State, City, Country ...]
 * @param {String} addressName Updated information of profile address
 * @return {Object} Return Updated Address
 * */
eb_BillingShippingAddressAdmin.updateCompanyProfileAddressRecord = function (data, addressName, companyId) {
    var defer = eBusinessJQObject.Deferred();
    if (!companyId || companyId <= 0) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }

    if (!addressName) {
        throw { type: "argument_null", message: "addressName property is required.", stack: Error().stack };
    }

    if (!data) {
        throw { data: "argument_null", message: "data property is required.", stack: Error().stack };
    }

    console.info('update address...');
    var service = eb_BillingShippingAddressAdmin.updateCompanyProfileAddressService.replace("{id}", companyId).replace("{addressName}", addressName);
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: service,
            type: "PATCH",
            contentType: "application/json",
            data: JSON.stringify(data),
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (result) {
            defer.resolve(result);
        }).fail(defer.reject);
    });
    return defer.promise();
};

/** 
 * PATCH service call method.
 * @method eb_BillingShippingAddressAdmin.updateCompanyAddressRecord
 * @param {Number} companyId companyId
 * @param {Object} data Address related information[ State, City, Country ...]
 * @param {String} addressName Updated information of company Address
 * @return {Object}  Return Updated Address
 * */
eb_BillingShippingAddressAdmin.updateCompanyAddressRecord = function (data, addressName, companyId) {
    var defer = eBusinessJQObject.Deferred();
    if (!companyId || companyId <= 0) {
        throw ({ type: "argument_null", message: "companyId property is required.", stack: Error().stack });
    }

    if (!addressName) {
        throw ({ type: "argument_null", message: "addressName property is required.", stack: Error().stack });
    }

    if (!data) {
        throw ({ data: "argument_null", message: "data property is required.", stack: Error().stack });
    }

    console.info('update address...');
    var service = eb_BillingShippingAddressAdmin.updateCompanyAddressService.replace("{id}", companyId).replace("{addressName}", addressName);
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: service,
            type: "PATCH",
            data: data,
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (result) {
            defer.resolve(result);
        }).fail(defer.reject);
    });
    return defer.promise();
};


/** 
 * Delete custom Company Address Service call
 * @method eb_BillingShippingAddressAdmin.deleteCompanyAddressRecord
 * @param {Number} companyId  companyID
 * @param {String} addressName Address name to delete particular address
 * */
eb_BillingShippingAddressAdmin.deleteCompanyAddressRecord = function (addressName, companyId) {
    var defer = eBusinessJQObject.Deferred();
    if (!companyId || companyId <= 0) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }

    if (!addressName) {
        throw { type: "argument_null", message: "addressName property is required.", stack: Error().stack };
    }

    console.info('delete address...');
    var service = eb_BillingShippingAddressAdmin.deleteCompanyAddressService.replace("{id}", companyId).replace("{addressName}", addressName);
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: service,
            type: "DELETE",
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (result) {
            defer.resolve(result);
        }).fail(defer.reject);
    });
    return defer.promise();
};


/** 
 * Delete Company Profile Address Service call
 * @method eb_BillingShippingAddressAdmin.deleteCompanyProfileAddressRecord
 * @param {Number} companyId companyID
 * @param {String} addressName Address name to delete particular address
 * */
eb_BillingShippingAddressAdmin.deleteCompanyProfileAddressRecord = function (addressName, companyId) {
    var defer = eBusinessJQObject.Deferred();
    if (!companyId || companyId <= 0) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }

    if (!addressName) {
        throw { type: "argument_null", message: "addressName property is required.", stack: Error().stack };
    }

    console.info('delete address...');
    var service = eb_BillingShippingAddressAdmin.deleteCompanyProfileAddressService.replace("{id}", companyId).replace("{addressName}", addressName);
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: service,
            type: "DELETE",
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (result) {
            defer.resolve(result);
        }).fail(defer.reject);
    });
    return defer.promise();
};


/**
 * BillingShippingAddressAdmin Model for binding data.
 * The model contains observable properties to hold corresponding data returned from services.
 * Also, model contains computed properties and methods to support Billing and Shipping Address functionality.
 * @method eb_BillingShippingAddressAdmin.model
 * @param {Object} options Contains necessary data which is required for Billing and Shipping Address functionality.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL.
 * @param {Object} options.data Contains data returned from service which is used to construct BillingShippingAddress model.
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 **/
eb_BillingShippingAddressAdmin.model = function (options) {
    var _that = this;

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement property is required.", stack: Error().stack };
    }

    if (options.data) {
        _that.data = options.data;
    }
    else { _that.data = {}; }

    _that.domElement = options.domElement;
    eb_BillingShippingAddressAdmin.domElement(_that.domElement);

    _that.errors = ko.validation.group(_that);

    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

    _that.companyName = ko.observable();
    _that.showError = ko.observable(0);
    _that.errorMessage = ko.observable();
    _that.showSuccess = ko.observable(0);
    _that.successMessage = ko.observable();
    _that.billingAddress = ko.observableArray();
    _that.shippingAddress = ko.observableArray();
    _that.shipTodiffrentAddress = ko.observable(0);
    _that.addressStateOptions = ko.observableArray().extend({ rateLimit: 500 });
    _that.phoneCountryCodeOptions = ko.observableArray();
    _that.addressDialog = ko.observableArray();
    _that.newAddress = ko.observableArray();
    _that.defaultChecked = ko.observable(1);
    _that.addressNext = ko.observable(0);
    _that.isProfileAddress = ko.observable();
    _that.addressName = ko.observable();
    _that.selectedId = ko.observable();
    _that.allowLoader = ko.observable(0);

    /* for Collapsing billing and shipping address */
    _that.billingAddressCollapse = ko.observable(1);
    _that.shippingAddressCollapse = ko.observable(0);

    /* Shipment Type */
    _that.shipmentTypesList = ko.observableArray();
    _that.shipmentType = ko.observable(options.shoppingCart.shipmentTypeName());
    _that.shipmentTypeName = ko.observableArray();

    /* Gets triggered when shipment type is changed to re-calculate shipping charges. */
    _that.shipmentTypeChange = function (val) {
        if (typeof val() != "undefined" && val() != options.shoppingCart.shipmentTypeName()) {
            var newShip = ko.utils.arrayFirst(_that.shipmentTypesList(), function (record) {
                return record.name() === val();
            });
            var shipmentId = { "shipmentTypeId": newShip.id() };
            _that.shoppingCart.updateShoppingCart(shipmentId).done(function (result) {
                _that.paymentSummaryObject.loadShoppingCartData(_that.shoppingCart);
            }).fail(function (data, msg, jhr) {
                console.error("Failed to update shipping type " + newShip.id());
            });
        }
    };

    /**
     * Shipment type model.
     * @param {Object} shiptype
     */
    _that.shipmentTypeModel = function (shiptype) {
        var self = this;
        self.id = ko.observable(shiptype["id"]);
        self.name = ko.observable(shiptype["name"]);
    };

    /* Loads shipment types */
    _that.loadShipmentTypes = function (shipTypeList) {
        for (i = 0; i < shipTypeList.length; i++) {
            var x = new _that.shipmentTypeModel(shipTypeList[i]);
            _that.shipmentTypesList.push(x);
            _that.shipmentTypeName.push(x.name());
        }
    };

    if (options.shoppingCart) {
        eb_BillingShippingAddressAdmin.shoppingCart = options.shoppingCart;
    }

    if (options.shipmentTypeList) {
        _that.shoppingCart = options.shoppingCart;
    }

    if (options.paymentSummaryObject) {
        _that.paymentSummaryObject = options.paymentSummaryObject;
    }

    if (options.shipmentTypeList) {
        _that.loadShipmentTypes(options.shipmentTypeList);
    }

    if (options.userContext) {
        eb_BillingShippingAddressAdmin.userContext = options.userContext;
        eb_BillingShippingAddressAdmin.companyId = eb_BillingShippingAddressAdmin.userContext.companyId();
        _that.companyName(eb_BillingShippingAddressAdmin.userContext.CompanyName());
    }


    _that.isBillingSameAsShipping = ko.observable(false);
    _that.billingCheck = ko.observable();
    _that.shippingCheck = ko.observable();

    _that.billingCheck.subscribe(function (val) {
        if (val != null && _that.billingCheck() != undefined && !_that.isBillingSameAsShipping() && _that.shippingCheck() != undefined) {
            if (eb_BillingShippingAddressAdmin.shoppingCart) {
                var billinData = { billingAddressId: _that.billingCheck() || null };
                eb_BillingShippingAddressAdmin.shoppingCart.updateShoppingCart(billinData).done(function (result) {
                    console.info("BillingAddress updated.");
                }).fail(function (xhr, textStatus, errorThrow) {
                    eb_BillingShippingAddressAdmin.skipPageRedirection = true;
                    _that.showSuccess(0);
                    _that.showError(1);
                    _that.errorMessage("Please select the billing address and the shipping address.");
                    console.log(xhr);
                });
            }
        }
    });

    _that.shippingCheck.subscribe(function (val) {
        if (val != null && _that.billingCheck() != undefined && _that.shippingCheck() != undefined) {
            if (eb_BillingShippingAddressAdmin.shoppingCart) {
                var billinData = { billingAddressId: _that.billingCheck() || null, shippingAddressID: _that.shippingCheck() || null };
                eb_BillingShippingAddressAdmin.shoppingCart.updateShoppingCart(billinData).done(function (result) {
                    _that.paymentSummaryObject.loadShoppingCartData(_that.shoppingCart);
                    console.info("ShippingAddress updated.");
                }).fail(function (xhr, textStatus, errorThrow) {
                    eb_BillingShippingAddressAdmin.skipPageRedirection = true;
                    _that.showSuccess(0);
                    _that.showError(1);
                    _that.errorMessage("Please select the billing address and the shipping address.");
                    console.log(xhr);
                });
            }
        }
    });

    /* Toggle of Shipping Address */
    _that.toggleShipping = function () {
        _that.shippingAddressCollapse(!_that.shippingAddressCollapse());
    };

    /* Toggle of Billing Address */
    _that.toggleBilling = function () {
        _that.billingAddressCollapse(!_that.billingAddressCollapse());
    };

    /* Check in URL parameter for billing and shipping address */
    if (eb_BillingShippingAddressAdmin.selectedAddress === eb_BillingShippingAddressAdmin.shippingAddress) {
        _that.billingAddressCollapse(0);
        _that.shippingAddressCollapse(1);
    } else {
        _that.billingAddressCollapse(1);
        _that.shippingAddressCollapse(0);
    }

    /* If the Billing address is same as shipping address then this method will be triggered. */
    _that.sameBillingShippingAddress = function (item) {
        _that.showError(0);
        _that.showSuccess(0);
        if (_that.isBillingSameAsShipping() && _that.billingAddress().length > 0) {
            if (item) {
                var address = ko.utils.arrayFirst(_that.shippingAddress(), function (addressRecord) {
                    addressRecord.shippingCheck(0);
                });

                var id = _that.billingCheck();
                if (id != undefined) {
                    var addressRecord = ko.utils.arrayFirst(_that.shippingAddress(), function (address) {
                        return address.id() === Number(id);
                    });
                    if (addressRecord) {
                        addressRecord.shippingCheck(id);
                        _that.shippingCheck(id);
                    }
                }
                return true;
            }
        }
        return true;
    };

    /* Get person data from the server. */
    _that.getProvinceDataFromServer = function (countryId) {
        return eb_BillingShippingAddressAdmin.getProvinceData(countryId);
    };

    /* Get countries data from the server. */
    _that.getCountriesDataFromServer = function () {
        return eb_BillingShippingAddressAdmin.getCountriesData();
    };

    /*load countries data*/
    if (options.countriesData) {
        _that.phoneCountryCodeOptions(options.countriesData);
    } else {
        /* Call getCountriesDataFromServer method. */
        _that.getCountriesDataFromServer()
            .done(function (countriesData) {
                _that.phoneCountryCodeOptions(countriesData);
            })
            .fail(function (xhr, textStatus, errorThrow) {
                console.info("getCountriesDataFromServer failed:  " + xhr.responseText);
            });
    }

    /* Get address data from the server. */
    _that.getCompanyProfileAddressDataFromServer = function () {
        return eb_BillingShippingAddressAdmin.getCompanyProfileAddresses(eb_BillingShippingAddressAdmin.companyId);
    };

    /* Get address data from the server. */
    _that.getCompanyAddressDataFromServer = function () {
        return eb_BillingShippingAddressAdmin.getCompanyAddresses(eb_BillingShippingAddressAdmin.companyId);
    };

    /* getAddressRecords method. */
    getAddressRecords();

    billingSameAsShipping();

    /* call getCompanyProfileAddressDataFromServer and getCompanyAddressDataFromServer methods. */
    function getAddressRecords() {
        var def = eBusinessJQObject.Deferred();
        eBusinessJQObject.when(_that.getCompanyProfileAddressDataFromServer(),
            _that.getCompanyAddressDataFromServer()).done(function (profileAddress, companyAddress) {
                if (profileAddress.length === 0) {
                    _that.addressNext(1);
                } else {
                    _that.billingAddress.removeAll();
                    _that.shippingAddress.removeAll();
                }
                eBusinessJQObject.map(profileAddress, function (row) {
                    /* Service returns all records. */
                    if (row["id"] && row["id"] > 0) {
                        var addressData = new _that.addressModel(row, _that);
                        addressData.isPreferredBilling = ko.observable(row["isPreferredBillingAddress"]);
                        addressData.isPreferredShipping = ko.observable(row["isPreferredShippingAddress"]);
                        addressData.profileAddresses = true;
                        _that.billingAddress.push(addressData);
                        _that.shippingAddress.push(addressData);
                    }
                });
                eBusinessJQObject.map(companyAddress, function (row) {
                    var addressData = new _that.addressModel(row, _that);
                    addressData.profileAddresses = false;
                    _that.billingAddress.push(addressData);
                    _that.shippingAddress.push(addressData);
                });

                var addressRecord = ko.utils.arrayFirst(_that.shippingAddress(), function (address) {
                    return address.id() == _that.selectedId();
                });

                if (addressRecord) {
                    addressRecord.shippingCheck(_that.selectedId());
                    addressRecord.billingCheck(_that.selectedId())
                    _that.shippingCheck(_that.selectedId());
                    _that.billingCheck(_that.selectedId());
                }
                def.resolve(addressRecord);
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getCompanyProfileAddressDataFromServer failed:  " + xhr.responseText);
                def.reject(xhr, textStatus, errorThrow);
            });
        return def.promise();
    }

    /* Billing same as shipping check */
    function billingSameAsShipping() {
        if (eb_BillingShippingAddressAdmin.shoppingCart) {
            var billingAddressID = eb_BillingShippingAddressAdmin.shoppingCart.billingAddressId();
            var shippingAddressID = eb_BillingShippingAddressAdmin.shoppingCart.shippingAddressId();
        } else "shopping cart object doesn't exist.";
    }

    /* show edit dialog */
    _that.showEditDialog = function (data) {
        _that.addressDialog.removeAll();
        var addressDialog = new _that.addressDialogModel(data, _that);
        _that.addressDialog.push(addressDialog);
    };

    /* Address model */
    _that.addressModel = function (data) {
        var self = this;
        if (data["isPreferredBillingAddress"]) { self.isPreferredBilling = ko.observable(data["isPreferredBillingAddress"]); }
        if (data["isPreferredShippingAddress"]) { self.isPreferredShipping = ko.observable(data["isPreferredShippingAddress"]); }
        self.id = ko.observable(data["id"]);
        self.name = ko.observable(data["name"]);
        self.line2 = ko.observable(data["line2"]);
        self.line1 = ko.observable(data["line1"]);
        self.city = ko.observable(data["city"]);
        self.stateProvince = ko.observable(data["stateProvince"]);
        self.postalCode = ko.observable(data["postalCode"]);
        //self.countryCode = ko.observable(data["countryCode"]);
        self.country = ko.observable(data["country"]);
        self.fullAddress = ko.computed(function () {
            var stateProvince = "";
            if (self.stateProvince()) {
                stateProvince = ", " + self.stateProvince();
            }
            var postalCode = "";
            if (self.postalCode()) {
                postalCode = ", " + self.postalCode();
            }
            var country = "";
            if (self.country()) {
                country = ", " + self.country();
            }
            return self.city() + stateProvince + postalCode + country;
        });

        self.phoneCountryCodeOptions = _that.phoneCountryCodeOptions();
        self.addressStateOptions = _that.addressStateOptions();

        self.billingCheck = ko.observable();
        self.shippingCheck = ko.observable();

        /* Need to persist current selected billing addressID. */
        if (eb_BillingShippingAddressAdmin.shoppingCart.billingAddressId() === data["id"]) {
            self.billingCheck(data["id"]);
            _that.billingCheck(data["id"]);
            var billingAddressId = eb_BillingShippingAddressAdmin.shoppingCart.billingAddressId();
            var shippingAddressId = eb_BillingShippingAddressAdmin.shoppingCart.shippingAddressId();

            if (billingAddressId > 0 && billingAddressId == shippingAddressId) {
                _that.isBillingSameAsShipping(true);
            }
        }
        else if (self.isPreferredBilling && self.isPreferredBilling()) {
            self.billingCheck(data["id"]);
            _that.billingCheck(data["id"]);
        }

        /* Need to persist current selected shipping addressID. */
        if (eb_BillingShippingAddressAdmin.shoppingCart.shippingAddressId() === data["id"]) {
            self.shippingCheck(data["id"]);
            _that.shippingCheck(data["id"]);
            var billingAddressId = eb_BillingShippingAddressAdmin.shoppingCart.billingAddressId();
            var shippingAddressId = eb_BillingShippingAddressAdmin.shoppingCart.shippingAddressId();

            if (billingAddressId > 0 && billingAddressId == shippingAddressId) {
                _that.isBillingSameAsShipping(true);
            }
        } else if (self.isPreferredShipping && self.isPreferredShipping()) {
            self.shippingCheck(data["id"]);
            _that.shippingCheck(data["id"]);
        }

        self.billingClick = function (item) {
            _that.billingCheck(item.id());
            _that.selectedId(item.id());
            _that.showError(0);
            _that.showSuccess(0);
            if (_that.isBillingSameAsShipping()) {
                var address = ko.utils.arrayFirst(_that.shippingAddress(), function (addressRecord) {
                    addressRecord.shippingCheck(0);
                });

                var addressRecord = ko.utils.arrayFirst(_that.shippingAddress(), function (address) {
                    return address.id() == _that.selectedId();
                });

                if (addressRecord) {
                    addressRecord.shippingCheck(_that.selectedId());
                    self.shippingCheck(_that.selectedId());
                    _that.shippingCheck(_that.selectedId());
                }
            }
            return true;
        };

        self.shippingClick = function (item) {
            _that.shippingCheck(item.id());
            _that.showError(0);
            _that.showSuccess(0);
            return true;
        };
    };

    /* Address Dialog Model */
    _that.addressDialogModel = function (data, model) {
        var self = this;
        self.phoneCountryCodeOptions = _that.phoneCountryCodeOptions();
        self.addressStateOptions = ko.observableArray();
        loadStateProvince(data);

        self.name = data.name();
        self.line1 = ko.observable(data.line1()).extend({ required: { params: true, message: eb_BillingShippingAddressAdmin.addressValidations['Line1'] } });
        self.line2 = data.line2();
        self.city = ko.observable(data.city()).extend({ required: { params: true, message: eb_BillingShippingAddressAdmin.addressValidations['City'] } });
        if (data.country()) { self.country = ko.observable(data.country().trim()).extend({ required: { params: true, message: eb_BillingShippingAddressAdmin.addressValidations['Country'] } }); }
        self.postalCode = data.postalCode();
        self.id = data.id();
        self.profileAddresses = data.profileAddresses;
        self.stateProvince = ko.observable();
        self.errors = ko.validation.group(self);

        /* Country value change event method. */
        self.selectionChanged = function (data) {
            loadStateProvince(data);
        };

        /* Load state province model methods. */
        self.stateAndProvince = function (data) {
            var self = this;
            self.id = ko.observable(data["id"]);
            self.state = ko.observable(data["state"]);
            self.stateName = ko.observable(data["stateName"]);
        };

        /* Update address record method. */
        self.updateAddress = function (data) {
            _that.selectedId(data.id);
            var dataToUpdate = {
                id: data.id,
                line1: data.line1(),
                line2: data.line2,
                city: data.city(),
                stateProvince: data.stateProvince(),
                postalCode: data.postalCode,
                country: data.country()
            };

            _that.showSuccess(0);
            _that.showError(0);
            _that.allowLoader(1);
            if (dataToUpdate) {
                if (data.profileAddresses) {
                    eb_BillingShippingAddressAdmin.updateCompanyProfileAddressRecord(dataToUpdate, data.name, eb_BillingShippingAddressAdmin.companyId)
                        .done(function (result) {
                            getAddressRecords().done(function () {
                                _that.showSuccess(1);
                                _that.successMessage(eb_BillingShippingAddressAdmin.successResponses['Address updated']);
                                _that.allowLoader(0);
                            });
                        })
                        .fail(function (xhr, textStatus, errorThrow) {
                            _that.showError(1);
                            _that.errorMessage("The address was not updated.");
                            _that.allowLoader(0);
                        });
                } else {
                    eb_BillingShippingAddressAdmin.updateCompanyAddressRecord(dataToUpdate, data.name, eb_BillingShippingAddressAdmin.companyId)
                        .done(function (result) {
                            getAddressRecords().done(function () {
                                _that.showSuccess(1);
                                /*ERROR HANDLING*/
                                _that.successMessage(eb_BillingShippingAddressAdmin.successResponses['Address updated']);
                                _that.allowLoader(0);
                            });
                        })
                        .fail(function (xhr, textStatus, errorThrow) {
                            _that.showError(1);
                            /*ERROR HANDLING*/
                            _that.errorMessage("The address was not updated.");
                            _that.allowLoader(0);
                        });
                }
            }
        };

        /* Load state province data in array. */
        function loadStateProvince(data) {
            var item = ko.utils.arrayFirst(_that.phoneCountryCodeOptions(), function (itemRecord) {
                if (ko.isObservable(data.country)) {
                    return itemRecord.country === data.country().trim();
                } else if (data.country) {
                    return itemRecord.country === data.country.trim();
                }
            });
            if (item) {
                /* call getProvinceDataFromServer method. */
                self.addressStateOptions.removeAll();
                _that.getProvinceDataFromServer(item.id)
                    .done(function (provinceData) {
                        eBusinessJQObject.map(provinceData, function (row) {
                            self.addressStateOptions.push(new self.stateAndProvince(row));
                        });
                        self.stateProvince(data.stateProvince());
                    }).fail(function (xhr, textStatus, errorThrow) {
                        console.info("getProvinceDataFromServer " + xhr.responseText);
                    });
            }
        }
    };

    /* show delete address dialog. */
    _that.deleteAddressDialog = function (data) {
        _that.isProfileAddress(data.profileAddresses);
        _that.addressName(data.name());
    };

    /* Remove Address */
    _that.removeAddress = function (data) {
        _that.showError(0);
        _that.showSuccess(0);
        _that.allowLoader(1);
        if (_that.isProfileAddress() === true) {
            eb_BillingShippingAddressAdmin.deleteCompanyProfileAddressRecord(_that.addressName(), eb_BillingShippingAddressAdmin.companyId)
                .done(function (result) {
                    getAddressRecords().done(function () {
                        if (_that.shippingAddress().length === 0) {
                            _that.billingCheck(undefined);
                            _that.shippingCheck(undefined);
                            _that.isBillingSameAsShipping(false);
                        }
                        _that.allowLoader(0);
                        _that.showSuccess(1);
                        _that.successMessage(eb_BillingShippingAddressAdmin.successResponses['Address deleted']);
                    });
                })
                .fail(function (xhr, textStatus, errorThrow) {
                    _that.showError(1);
                    /*ERROR HANDLING*/
                    _that.errorMessage("The address was not deleted.");
                    _that.allowLoader(0);
                    console.error(xhr.responseJSON.errorCode);
                });
        } else {
            eb_BillingShippingAddressAdmin.deleteCompanyAddressRecord(_that.addressName(), eb_BillingShippingAddressAdmin.companyId)
                .done(function (result) {
                    getAddressRecords().done(function () {
                        if (_that.shippingAddress().length === 0) {
                            _that.billingCheck(undefined);
                            _that.shippingCheck(undefined);
                            _that.isBillingSameAsShipping(false);
                        }
                        _that.showSuccess(1);
                        _that.allowLoader(0);
                        _that.successMessage(eb_BillingShippingAddressAdmin.successResponses['Address deleted']);
                    });
                })
                .fail(function (xhr, textStatus, errorThrow) {
                    _that.showError(1);
                    /*ERROR HANDLING*/
                    _that.errorMessage("The address was not deleted.");
                    _that.allowLoader(0);
                    console.error(xhr.responseJSON.errorCode);
                });
        }
    };

    /* Add new billing / shipping address  */
    _that.addNewAddress = function (data) {
        _that.showSuccess(0);
        _that.newAddress.removeAll();
        var newAddress = new _that.newAddressModel();
        _that.newAddress.push(newAddress);
    };

    /* Update billing and shipping addressID in shopping cart service.*/
    _that.selectNext = function () {
        if (_that.billingCheck() != undefined && _that.shippingCheck() != undefined) {
            window.location.replace(eb_BillingShippingAddressAdmin.orderReviewUrl);
        }
    };

    /* New address model */
    _that.newAddressModel = function () {
        var self = this;
        self.phoneCountryCodeOptions = _that.phoneCountryCodeOptions();
        self.addressStateOptions = ko.observableArray();
        self.name = ko.observable('').extend({ required: { params: true, message: eb_BillingShippingAddressAdmin.addressValidations['Address name'] } });
        self.line1 = ko.observable('').extend({ required: { params: true, message: eb_BillingShippingAddressAdmin.addressValidations['Line1'] } });
        self.line2 = ko.observable();
        self.city = ko.observable('').extend({ required: { params: true, message: eb_BillingShippingAddressAdmin.addressValidations['City'] } });
        self.stateProvince = ko.observable();
        self.postalCode = ko.observable();
        self.id = ko.observable();
        self.countryCode = ko.observable();
        self.country = ko.observable().extend({ required: { params: true, message: eb_BillingShippingAddressAdmin.addressValidations['Country'] } });
        self.selectedCountry = ko.observable();

        self.errors = ko.validation.group(self);

        /* Country value selection changed. */
        self.selectionChanged = function (data) {
            var item = ko.utils.arrayFirst(_that.phoneCountryCodeOptions(), function (itemRecord) {
                return itemRecord.country === data.country();
            });
            if (item) {
                /* call getProvinceDataFromServer method. */
                self.addressStateOptions.removeAll();
                _that.getProvinceDataFromServer(item.id)
                    .done(function (provinceData) {
                        eBusinessJQObject.map(provinceData, function (row) {
                            self.addressStateOptions.push(new self.stateAndProvince(row));
                        });
                    }).fail(function (xhr, textStatus, errorThrow) {
                        console.info("getProvinceDataFromServer " + xhr.responseText);
                    });
            }
        };

        /* state province model array. */
        self.stateAndProvince = function (data) {
            var self = this;
            self.id = ko.observable(data["id"]);
            self.state = ko.observable(data["state"]);
            self.stateName = ko.observable(data["stateName"]);
        };

        /* Add address method */
        self.addAddress = function (data) {
            var dataToAdd = {
                addressName: data.name(),
                line1: data.line1(),
                line2: data.line2(),
                city: data.city(),
                stateProvince: data.stateProvince(),
                postalCode: data.postalCode(),
                country: data.country()
            };
            _that.showSuccess(0);
            _that.showError(0);
            _that.allowLoader(1);
            if (dataToAdd) {
                eb_BillingShippingAddressAdmin.createAddressRecord(dataToAdd, eb_BillingShippingAddressAdmin.companyId)
                    .done(function (result) {
                        getAddressRecords().done(function () {
                            _that.showError(0);
                            _that.showSuccess(1);
                            _that.allowLoader(0);
                            _that.successMessage(eb_BillingShippingAddressAdmin.successResponses['Address saved']);
                        });
                    })
                    .fail(function (xhr, textStatus, errorThrow) {
                        _that.showError(1);
                        _that.allowLoader(0);
                        if (xhr && typeof xhr.responseJSON !== 'undefined')
                            _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_BillingShippingAddressAdmin));
                        else
                            _that.errorMessage(eb_BillingShippingAddressAdmin.defaultErrorMessage);

                    });
            }
        };
    };
};


/**
 * Shopping cart object
 * @method eb_BillingShippingAddressAdmin.shoppingCart
 * @param {Object} shoppingCart  shopping cart object.
 * */
eb_BillingShippingAddressAdmin.shoppingCart = function (shoppingCart) {
    var self = this;
    self.shoppingCart = shoppingCart;
};

/**
 * User context object 
 * @method eb_BillingShippingAddressAdmin.userContext
 * @param {Object} userContext  userContext object.
 * */
eb_BillingShippingAddressAdmin.userContext = function (userContext) {
    var self = this;
    self.userContext = userContext;
};

/**
 * Page DOM element.
 * @method eb_BillingShippingAddressAdmin.domElement
 * @param {object} domElement current DOM element.
 * */
eb_BillingShippingAddressAdmin.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_BillingShippingAddressAdmin.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['http Response']) && eb_BillingShippingAddressAdmin.skipPageRedirection === false)
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_BillingShippingAddressAdmin);
});