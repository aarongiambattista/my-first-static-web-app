/**
 * Define eb_billingShippingAddress class.
 * @class eb_billingShippingAddress
 * */
var eb_billingShippingAddress = eb_billingShippingAddress || {};

/**
 * Control level setting: Site path.
 * @property eb_billingShippingAddress.SitePath
 * @type {String}
 */
eb_billingShippingAddress.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_billingShippingAddress.TemplatePath
 * @type {String}
 */
eb_billingShippingAddress.TemplatePath = "html/BillingShippingAddress.html";

/**
 * The path to the eBusiness SOA layer.
 * @property eb_billingShippingAddress.ServicePath
 * @type {String}
 */
eb_billingShippingAddress.ServicePath = eb_Config.ServicePathV1;

/**
 * Redirect to review order Page.
 * @property eb_billingShippingAddress.orderReviewUrl
 * @type {String}
 */
eb_billingShippingAddress.orderReviewUrl = "ReviewOrder.html";

/**
 * Redirect to billing or shipping address
 * @property eb_billingShippingAddress.selectedAddress
 * @type {String}
 */
eb_billingShippingAddress.selectedAddress = eb_Config.getUrlParameter("navigateTo");

/**
 * Shipping Address
 * @property eb_billingShippingAddress.shippingAddress
 * @type {String}
 */
eb_billingShippingAddress.shippingAddress = "ShippingAddress";

/**
 * GET service to get all State/Province record.
 * @property eb_billingShippingAddress.getProvinceService
 * @type {String}
 */
eb_billingShippingAddress.getProvinceService = eb_billingShippingAddress.ServicePath + "country/{country}/states";

/**
 * GET service to get all countries records.
 * @property eb_billingShippingAddress.getCountriesService
 * @type {String}
 */
eb_billingShippingAddress.getCountriesService = eb_billingShippingAddress.ServicePath + "countries";

/**
 * GET profile address service.
 * @property eb_billingShippingAddress.getProfileAddressService
 * @type {String}
 */
eb_billingShippingAddress.getProfileAddressService = eb_billingShippingAddress.ServicePath + "ProfilePersons/{personId}/ProfileAddresses";

/**
 * GET person address service.
 * @property eb_billingShippingAddress.getPersonAddressService
 * @type {String}
 */
eb_billingShippingAddress.getPersonAddressService = eb_billingShippingAddress.ServicePath + "ProfilePersons/{personId}/PersonAddresses";

/**
 * GET new address service.
 * @property eb_billingShippingAddress.newAddressService
 * @type {String}
 */
eb_billingShippingAddress.newAddressService = eb_billingShippingAddress.ServicePath + "ProfilePersons/{personId}/PersonAddresses";

/**
 * Update profile address service.
 * @property eb_billingShippingAddress.updateProfileAddressService
 * @type {String}
 */
eb_billingShippingAddress.updateProfileAddressService = eb_billingShippingAddress.ServicePath + "ProfilePersons/{personId}/ProfileAddresses/{addressName}";

/**
 * Update person address service.
 * @property eb_billingShippingAddress.updatePersonsAddressService
 * @type {String}
 */
eb_billingShippingAddress.updatePersonsAddressService = eb_billingShippingAddress.ServicePath + "ProfilePersons/{personId}/PersonAddresses/{addressName}";

/**
 * Delete person address
 * @property eb_billingShippingAddress.deletePersonAddressService
 * @type {String}
 */
eb_billingShippingAddress.deletePersonAddressService = eb_billingShippingAddress.ServicePath + "ProfilePersons/{personId}/PersonAddresses/{addressName}";

/**
 * Delete profile address
 * @property eb_billingShippingAddress.deleteProfileAddressService
 * @type {String}
 */
eb_billingShippingAddress.deleteProfileAddressService = eb_billingShippingAddress.ServicePath + "ProfilePersons/{personId}/ProfileAddresses/{addressName}";

/**
 * Get All Shipment types service URL.
 * @property eb_billingShippingAddress.getAllShipmentTypesURL
 * @type {String}
 */
eb_billingShippingAddress.getAllShipmentTypesURL = "ShoppingCarts/ShipmentTypes";

/**
 * person id
 * @property eb_billingShippingAddress.personId
 * @type {String}
 */
eb_billingShippingAddress.personId = "";

/**
 * skipPageRedirection
 * @property eb_billingShippingAddress.skipPageRedirection
 * @type {bool}
 */
eb_billingShippingAddress.skipPageRedirection = false;

/* Success Responses */
eb_billingShippingAddress.successResponses = {
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
 * @property eb_billingShippingAddress.errorResponses
 * @type {Object}
 * */
eb_billingShippingAddress.errorResponses = {
    689: { useServerMessage: true },
    688: { useServerMessage: true },
    687: { useServerMessage: true }
};

/**
 * Default error message.
 * @property eb_billingShippingAddress.defaultErrorMessage
 * @type {String}
 * */
eb_billingShippingAddress.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/* Input validations */
eb_billingShippingAddress.addressValidations = {
    "Address name": "Please enter address name.",
    "Line1": "Please enter address line1 details.",
    "City": "Please enter city.",
    "Country": "Please select the country.",
    "Select Billing": "Please select a Billing address.",
    "Select Shipping": "Please select a Shipping address."
};

/**
 * Gets all web-enabled shipment types.
 * @method eb_billingShippingAddress.getAllShipmentTypes
 * @return {Object} jQuery promise object which when resolved returns shipment type list.
 * */
eb_billingShippingAddress.getAllShipmentTypes = function () {
    var defer = eBusinessJQObject.Deferred();
    console.info('get all shipment types');
    var serviceURL = eb_billingShippingAddress.ServicePath + eb_billingShippingAddress.getAllShipmentTypesURL;
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
 * @method eb_billingShippingAddress.render
 * @param {Object} options Object with data required for getting HTML template through Ajax call.
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * 
 * @returns {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_billingShippingAddress.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_billingShippingAddress.SitePath + eb_billingShippingAddress.TemplatePath;
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
 * @method eb_billingShippingAddress.getProvinceData
 * @param {String} country All the state in specified country
 * @return {Object} Return Array of state
 * */
eb_billingShippingAddress.getProvinceData = function (country) {
    var deferred = eBusinessJQObject.Deferred();
    if (!country) {
        throw { type: "argument_null", message: "country property is required.", stack: Error().stack };
    }
    var servicePath = eb_billingShippingAddress.getProvinceService;
    if (country) {
        servicePath = eb_billingShippingAddress.getProvinceService.replace("{country}", country);
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
 * @method eb_billingShippingAddress.getCountriesData
 * @return {Object} Return Array of All Countries
 * */
eb_billingShippingAddress.getCountriesData = function () {
    var deferred = eBusinessJQObject.Deferred();
    eBusinessJQObject.get(
        {
            url: eb_billingShippingAddress.getCountriesService,
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
 * @method eb_billingShippingAddress.getProfileAddresses
 * @param {Number} personId personId to get profile addresses
 * @return {Object} Addresses of person
 * */
eb_billingShippingAddress.getProfileAddresses = function (personId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!personId || personId <= 0) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    var service = eb_billingShippingAddress.getProfileAddressService.replace("{personId}", personId);
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
 * Public method to get Persons Addresses data list from the server
 * @method eb_billingShippingAddress.getPersonsAddresses
 * @param {Number} personId personId to get person addresses
 * @return {Object} Addresses of person
 * */
eb_billingShippingAddress.getPersonsAddresses = function (personId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!personId || personId <= 0) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    var service = eb_billingShippingAddress.getPersonAddressService.replace("{personId}", personId);

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
 * @method eb_billingShippingAddress.createAddressRecord
 * @param {Number} personId personId 
 * @param {Object} data Address related information[ State, City, Country ...]
 * @return {Object} New address promise object with City, Id, Country, State, line1, line2, name, postal code, StateProvience fields.
 * */
eb_billingShippingAddress.createAddressRecord = function (data, personId) {
    var defer = eBusinessJQObject.Deferred();
    console.info('create address record...');

    if (!personId || personId <= 0) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    if (!data) {
        throw { data: "argument_null", message: "data property is required.", stack: Error().stack };
    }
    var service = eb_billingShippingAddress.newAddressService.replace("{personId}", personId);
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
 * @method eb_billingShippingAddress.updateProfileAddressRecord
 * @param {Number} personId personId
 * @param {Object} data Address related information[ State, City, Country ...]
 * @param {String} addressName Updated information of profile address
 * @return {Object} Return Updated Address
 * */
eb_billingShippingAddress.updateProfileAddressRecord = function (data, addressName, personId) {
    var defer = eBusinessJQObject.Deferred();
    if (!personId || personId <= 0) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }

    if (!addressName) {
        throw { type: "argument_null", message: "addressName property is required.", stack: Error().stack };
    }

    if (!data) {
        throw { data: "argument_null", message: "data property is required.", stack: Error().stack };
    }

    console.info('update address...');
    var service = eb_billingShippingAddress.updateProfileAddressService.replace("{personId}", personId).replace("{addressName}", addressName);
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
 * @method eb_billingShippingAddress.updatePersonAddressRecord
 * @param {Number} personId personId
 * @param {Object} data Address related information[ State, City, Country ...]
 * @param {String} addressName Updated information of person Address
 * @return {Object}  Return Updated Address
 * */
eb_billingShippingAddress.updatePersonAddressRecord = function (data, addressName, personId) {
    var defer = eBusinessJQObject.Deferred();
    if (!personId || personId <= 0) {
        throw ({ type: "argument_null", message: "personId property is required.", stack: Error().stack });
    }

    if (!addressName) {
        throw ({ type: "argument_null", message: "addressName property is required.", stack: Error().stack });
    }

    if (!data) {
        throw ({ data: "argument_null", message: "data property is required.", stack: Error().stack });
    }

    console.info('update address...');
    var service = eb_billingShippingAddress.updatePersonsAddressService.replace("{personId}", personId).replace("{addressName}", addressName);
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
 * Delete Person Address Service call
 * @method eb_billingShippingAddress.deletePersonAddressRecord
 * @param {Number} personId  personID
 * @param {String} addressName Address name to delete particular address
 * */
eb_billingShippingAddress.deletePersonAddressRecord = function (addressName, personId) {
    var defer = eBusinessJQObject.Deferred();
    if (!personId || personId <= 0) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }

    if (!addressName) {
        throw { type: "argument_null", message: "addressName property is required.", stack: Error().stack };
    }

    console.info('delete address...');
    var service = eb_billingShippingAddress.deletePersonAddressService.replace("{personId}", personId).replace("{addressName}", addressName);
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
 * Delete Profile Address Service call
 * @method eb_billingShippingAddress.deleteProfileAddressRecord
 * @param {Number} personId personID
 * @param {String} addressName Address name to delete particular address
 * */
eb_billingShippingAddress.deleteProfileAddressRecord = function (addressName, personId) {
    var defer = eBusinessJQObject.Deferred();
    if (!personId || personId <= 0) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }

    if (!addressName) {
        throw { type: "argument_null", message: "addressName property is required.", stack: Error().stack };
    }

    console.info('delete address...');
    var service = eb_billingShippingAddress.deleteProfileAddressService.replace("{personId}", personId).replace("{addressName}", addressName);
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
 * BillingShippingAddress Model for binding data.
 * The model contains observable properties to hold corresponding data returned from services.
 * Also, model contains computed properties and methods to support Billing and Shipping Address functionality.
 * @method eb_billingShippingAddress.model
 * @param {Object} options Contains necessary data which is required for Billing and Shipping Address functionality.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL.
 * @param {Object} options.data Contains data returned from service which is used to construct BillingShippingAddress model.
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 */

eb_billingShippingAddress.model = function (options) {
    var _that = this;

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement property is required.", stack: Error().stack };
    }

    if (options.data) {
        _that.data = options.data;
    }
    else { _that.data = {}; }

    _that.domElement = options.domElement;
    eb_billingShippingAddress.domElement(_that.domElement);

    _that.errors = ko.validation.group(_that);

    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

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
        eb_billingShippingAddress.shoppingCart = options.shoppingCart;
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
        eb_billingShippingAddress.userContext = options.userContext;
        eb_billingShippingAddress.personId = eb_billingShippingAddress.userContext.LinkId();
    }


    _that.isBillingSameAsShipping = ko.observable(false);
    _that.billingCheck = ko.observable();
    _that.shippingCheck = ko.observable();

    _that.billingCheck.subscribe(function (val) {
        if (val != null && _that.billingCheck() != undefined && !_that.isBillingSameAsShipping() && _that.shippingCheck() != undefined) {
            if (eb_billingShippingAddress.shoppingCart) {
                var billinData = { billingAddressId: _that.billingCheck() || null };
                eb_billingShippingAddress.shoppingCart.updateShoppingCart(billinData).done(function (result) {
                    console.info("BillingAddress updated.");
                }).fail(function (xhr, textStatus, errorThrow) {
                    eb_billingShippingAddress.skipPageRedirection = true;
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
            if (eb_billingShippingAddress.shoppingCart) {
                var billinData = { billingAddressId: _that.billingCheck() || null, shippingAddressID: _that.shippingCheck() || null };
                eb_billingShippingAddress.shoppingCart.updateShoppingCart(billinData).done(function (result) {
                    _that.paymentSummaryObject.loadShoppingCartData(_that.shoppingCart);
                    console.info("ShippingAddress updated.");
                }).fail(function (xhr, textStatus, errorThrow) {
                    eb_billingShippingAddress.skipPageRedirection = true;
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
    if (eb_billingShippingAddress.selectedAddress === eb_billingShippingAddress.shippingAddress) {
        _that.billingAddressCollapse(0);
        _that.shippingAddressCollapse(1);
    } else {
        _that.billingAddressCollapse(1);
        _that.shippingAddressCollapse(0);
    }

    /* If the Billing address is same as shipping address then this method will be triggered. */
    _that.sameBillingShippingAddress = function (item) {
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
        return eb_billingShippingAddress.getProvinceData(countryId);
    };

    /* Get countries data from the server. */
    _that.getCountriesDataFromServer = function () {
        return eb_billingShippingAddress.getCountriesData();
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
    _that.getProfileAddressDataFromServer = function () {
        return eb_billingShippingAddress.getProfileAddresses(eb_billingShippingAddress.personId);
    };

    /* Get address data from the server. */
    _that.getPersonsAddressDataFromServer = function () {
        return eb_billingShippingAddress.getPersonsAddresses(eb_billingShippingAddress.personId);
    };

    /* getAddressRecords method. */
    getAddressRecords();

    billingSameAsShipping();

    /* call getAddressDataFromServer method. */
    function getAddressRecords() {
        var def = eBusinessJQObject.Deferred();
        eBusinessJQObject.when(_that.getProfileAddressDataFromServer(),
            _that.getPersonsAddressDataFromServer()).done(function (profileAddress, personsAddress) {
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
                eBusinessJQObject.map(personsAddress, function (row) {
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
                console.info("getProfileAddressDataFromServer failed:  " + xhr.responseText);
                def.reject(xhr, textStatus, errorThrow);
            });
        return def.promise();
    }

    /* Billing same as shipping check */
    function billingSameAsShipping() {
        if (eb_billingShippingAddress.shoppingCart) {
            var billingAddressID = eb_billingShippingAddress.shoppingCart.billingAddressId();
            var shippingAddressID = eb_billingShippingAddress.shoppingCart.shippingAddressId();
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
        self.countryCode = ko.observable(data["countryCode"]);
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
        if (eb_billingShippingAddress.shoppingCart.billingAddressId() === data["id"]) {
            self.billingCheck(data["id"]);
            _that.billingCheck(data["id"]);
            var billingAddressId = eb_billingShippingAddress.shoppingCart.billingAddressId();
            var shippingAddressId = eb_billingShippingAddress.shoppingCart.shippingAddressId();

            if (billingAddressId > 0 && billingAddressId == shippingAddressId) {
                _that.isBillingSameAsShipping(true);
            }
        }
        else if (self.isPreferredBilling && self.isPreferredBilling()) {
            self.billingCheck(data["id"]);
            _that.billingCheck(data["id"]);
        }

        /* Need to persist current selected shipping addressID. */
        if (eb_billingShippingAddress.shoppingCart.shippingAddressId() === data["id"]) {
            self.shippingCheck(data["id"]);
            _that.shippingCheck(data["id"]);
            var billingAddressId = eb_billingShippingAddress.shoppingCart.billingAddressId();
            var shippingAddressId = eb_billingShippingAddress.shoppingCart.shippingAddressId();

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
        self.line1 = ko.observable(data.line1()).extend({ required: { params: true, message: eb_billingShippingAddress.addressValidations['Line1'] } });
        self.line2 = data.line2();
        self.city = ko.observable(data.city()).extend({ required: { params: true, message: eb_billingShippingAddress.addressValidations['City'] } });
        if (data.countryCode()) { self.countryCode = data.countryCode().trim(); }
        if (data.country()) { self.country = ko.observable(data.country().trim()).extend({ required: { params: true, message: eb_billingShippingAddress.addressValidations['Country'] } }); }
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
            if (dataToUpdate) {
                if (data.profileAddresses) {
                    eb_billingShippingAddress.updateProfileAddressRecord(dataToUpdate, data.name, eb_billingShippingAddress.personId)
                        .done(function (result) {
                            getAddressRecords().done(function () {
                                _that.showSuccess(1);
                                _that.successMessage(eb_billingShippingAddress.successResponses['Address updated']);
                            });
                        })
                        .fail(function (xhr, textStatus, errorThrow) {
                            _that.showError(1);
                            _that.errorMessage("The address was not updated.");
                        });
                } else {
                    eb_billingShippingAddress.updatePersonAddressRecord(dataToUpdate, data.name, eb_billingShippingAddress.personId)
                        .done(function (result) {
                            getAddressRecords().done(function () {
                                _that.showSuccess(1);
                                /*ERROR HANDLING*/
                                _that.successMessage(eb_billingShippingAddress.successResponses['Address updated']);
                            });
                        })
                        .fail(function (xhr, textStatus, errorThrow) {
                            _that.showError(1);
                            /*ERROR HANDLING*/
                            _that.errorMessage("The address was not updated.");
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
        if (_that.isProfileAddress() === true) {
            eb_billingShippingAddress.deleteProfileAddressRecord(_that.addressName(), eb_billingShippingAddress.personId)
                .done(function (result) {
                    getAddressRecords().done(function () {
                        if (_that.shippingAddress().length === 0) {
                            _that.billingCheck(undefined);
                            _that.shippingCheck(undefined);
                            _that.isBillingSameAsShipping(false);
                        }
                        _that.showSuccess(1);
                        _that.successMessage(eb_billingShippingAddress.successResponses['Address deleted']);
                    });
                })
                .fail(function (xhr, textStatus, errorThrow) {
                    _that.showError(1);
                    /*ERROR HANDLING*/
                    _that.errorMessage("The address was not deleted.");
                    console.error(xhr.responseJSON.errorCode);
                });
        } else {
            eb_billingShippingAddress.deletePersonAddressRecord(_that.addressName(), eb_billingShippingAddress.personId)
                .done(function (result) {
                    getAddressRecords().done(function () {
                        if (_that.shippingAddress().length === 0) {
                            _that.billingCheck(undefined);
                            _that.shippingCheck(undefined);
                            _that.isBillingSameAsShipping(false);
                        }
                        _that.showSuccess(1);
                        _that.successMessage(eb_billingShippingAddress.successResponses['Address deleted']);
                    });
                })
                .fail(function (xhr, textStatus, errorThrow) {
                    _that.showError(1);
                    /*ERROR HANDLING*/
                    _that.errorMessage("The address was not deleted.");
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
            window.location.replace(eb_billingShippingAddress.orderReviewUrl);
        }
    };

    /* New address model */
    _that.newAddressModel = function () {
        var self = this;
        self.phoneCountryCodeOptions = _that.phoneCountryCodeOptions();
        self.addressStateOptions = ko.observableArray();
        self.name = ko.observable('').extend({ required: { params: true, message: eb_billingShippingAddress.addressValidations['Address name'] } });
        self.line1 = ko.observable('').extend({ required: { params: true, message: eb_billingShippingAddress.addressValidations['Line1'] } });
        self.line2 = ko.observable();
        self.city = ko.observable('').extend({ required: { params: true, message: eb_billingShippingAddress.addressValidations['City'] } });
        self.stateProvince = ko.observable();
        self.postalCode = ko.observable();
        self.id = ko.observable();
        self.countryCode = ko.observable();
        self.country = ko.observable().extend({ required: { params: true, message: eb_billingShippingAddress.addressValidations['Country'] } });
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
            if (dataToAdd) {
                eb_billingShippingAddress.createAddressRecord(dataToAdd, eb_billingShippingAddress.personId)
                    .done(function (result) {
                        getAddressRecords().done(function () {
                            _that.showError(0);
                            _that.showSuccess(1);
                            _that.successMessage(eb_billingShippingAddress.successResponses['Address saved']);
                        });
                    })
                    .fail(function (xhr, textStatus, errorThrow) {
                        _that.showError(1);

                        if (xhr && typeof xhr.responseJSON !== 'undefined')
                            _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_billingShippingAddress));
                        else
                            _that.errorMessage(eb_billingShippingAddress.defaultErrorMessage);

                    });
            }
        };
    };
};


/**
 * Shopping cart object
 * @method eb_billingShippingAddress.shoppingCart
 * @param {Object} shoppingCart  shopping cart object.
 * */
eb_billingShippingAddress.shoppingCart = function (shoppingCart) {
    var self = this;
    self.shoppingCart = shoppingCart;
};

/**
 * User context object 
 * @method eb_billingShippingAddress.userContext
 * @param {Object} userContext  userContext object.
 * */
eb_billingShippingAddress.userContext = function (userContext) {
    var self = this;
    self.userContext = userContext;
};

/**
 * Page DOM element.
 * @method eb_billingShippingAddress.domElement
 * @param {object} domElement current DOM element.
 * */
eb_billingShippingAddress.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_billingShippingAddress.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['http Response']) && eb_billingShippingAddress.skipPageRedirection === false)
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_billingShippingAddress);
});