/**
 * Company Information class.
 * @class eb_CompanyInformation
 * */
var eb_CompanyInformation = eb_CompanyInformation || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_CompanyInformation.SitePath
 * @type {String}
 * */
eb_CompanyInformation.SitePath = eb_Config.SitePath;

/**
 * Company Information template path.
 * @property eb_CompanyInformation.TemplatePath
 * @type {String}
 * */
eb_CompanyInformation.TemplatePath = "html/admin/CompanyInfo.html";

/**
 * SOA path.
 * @property eb_CompanyInformation.ServicePath
 * @type {String}
 * */
eb_CompanyInformation.ServicePath = eb_Config.ServicePathV1;

/**
 * SOA serviceUrls.
 * All company information Service URLs.
 * @property eb_CompanyInformation.ServicePath
 * @type {String}
 * */
eb_CompanyInformation.serviceUrls = {
    'get Company Information Service': eb_CompanyInformation.ServicePath + "admin/company/{id}",
    'get Company Billing Address Service': eb_CompanyInformation.ServicePath + "admin/company/{id}/ProfileAddresses/{addressName}",
    'get Company Main Phone/Fax Service': eb_CompanyInformation.ServicePath + "admin/company/{id}/ProfilePhones/{name}",
    'get Countries Service': eb_CompanyInformation.ServicePath + "countries",
    'get Province Service': eb_CompanyInformation.ServicePath + "country",
    'Address Validation': eb_CompanyInformation.ServicePath + "AddressValidation",
    'get Profile Phone Number Service': eb_CompanyInformation.ServicePath + "admin/company/{id}/ProfilePhones",
    'get Company Phone Number Service': eb_CompanyInformation.ServicePath + "admin/company/{id}/CompanyPhones",
    'get Profile Address Service': eb_CompanyInformation.ServicePath + "admin/company/{id}/ProfileAddresses",
    'get Company Address Service': eb_CompanyInformation.ServicePath + "admin/company/{id}/CompanyAddresses",
    'update Email And Website Service': eb_CompanyInformation.ServicePath + "admin/company/{id}",
    'update Profile Phone Number Service': eb_CompanyInformation.ServicePath + "admin/company/{id}/ProfilePhones/{name}",
    'update Company Phone Number Service': eb_CompanyInformation.ServicePath + "admin/company/{id}/CompanyPhones/{name}",
    'update Profile Address Service': eb_CompanyInformation.ServicePath + "admin/company/{id}/ProfileAddresses/{addressName}",
    'update Company Address Service': eb_CompanyInformation.ServicePath + "admin/company/{id}/CompanyAddresses/{AddressName}"
}

/*CompanyId.*/
eb_CompanyInformation.companyId = "0";

/* To Check blank date, if we didn't enter any value in date in smart client, then by default it return "01/01/0001" */
eb_CompanyInformation.defaultDate = "01/01/0001";

/* Error messages */
eb_CompanyInformation.errorMessages = {
    'Profile save failed': 'There was an error encountered while updating your profile. Please try again. If the problem persists, please contact the customer support for further assistance.'
};

/* Success Responses */
eb_CompanyInformation.successResponses = {
    'Profile saved': 'Changes have been successfully saved.',
    'Address validated': 'Address validated successfully. Changes not found!'
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
 * @property eb_CompanyInformation.errorResponses
 * @type {Object}
 * */
eb_CompanyInformation.errorResponses = {
    689: { useServerMessage: true },
    688: { useServerMessage: true },
    687: { useServerMessage: true },
    690: { useServerMessage: true }
};

/**
 * Default error message.
 * @property eb_CompanyInformation.defaultErrorMessage
 * @type {String}
 * */
eb_CompanyInformation.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/**
 * Public method to validate data from the server.
 * @method eb_CompanyInformation.validateAddressData
 * @param {String} country Country Id.
 * @return {Object} jQuery promise object.
 */
eb_CompanyInformation.validateAddressData = function (data) {
    var deferred = eBusinessJQObject.Deferred();
    var servicePath = eb_CompanyInformation.serviceUrls['Address Validation'];
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.get(
            {
                url: servicePath,
                type: "POST",
                data: data,
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
 * Public method to get company information from the server.
 * The service will return company information.
 * @method eb_CompanyInformation.getCompanyInformation
 * @return { Object } jQuery promise object which when resolved returns company information.
 **/
eb_CompanyInformation.getCompanyInformationData = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (companyId > 0) {
        var service = eb_CompanyInformation.serviceUrls['get Company Information Service'].replace("{id}", companyId);
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
 * Public method to get company billing address from the server.
 * The service will return company billing address.
 * @method eb_CompanyInformation.getCompanyBillingAddress
 * @return { Object } jQuery promise object which when resolved returns billing address.
 **/
eb_CompanyInformation.getCompanyBillingAddress = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (companyId > 0) {
        var service = eb_CompanyInformation.serviceUrls['get Company Billing Address Service'].replace("{id}", companyId).replace("{addressName}", "Billing Address");
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
}

/**
 * Public method to get company main phone from the server.
 * The service will return company main phone.
 * @method eb_CompanyInformation.getCompanyMainPhone
 * @return { Object } jQuery promise object which when resolved returns main phone.
 **/
eb_CompanyInformation.getCompanyMainPhone = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (companyId > 0) {
        var service = eb_CompanyInformation.serviceUrls['get Company Main Phone/Fax Service'].replace("{id}", companyId).replace("{name}", "Main Phone");
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
}

/**
 * Public method to get company main fax from the server.
 * The service will return company main fax.
 * @method eb_CompanyInformation.getCompanyMainFax
 * @return { Object } jQuery promise object which when resolved returns main fax.
 **/
eb_CompanyInformation.getCompanyMainFax = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (companyId > 0) {
        var service = eb_CompanyInformation.serviceUrls['get Company Main Phone/Fax Service'].replace("{id}", companyId).replace("{name}", "Main Fax");
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
}

/**
 * Public method to get profile phone data list from the server.
 * The service will return list of all phones.
 * @method eb_CompanyInformation.getProfilePhoneNumberData
 * @return {Object} jQuery promise object which when resolved returns phones list.
 */
eb_CompanyInformation.getProfilePhoneNumberData = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (companyId > 0) {
        var service = eb_CompanyInformation.serviceUrls['get Profile Phone Number Service'].replace("{id}", companyId);
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
 * Public method to get company phone data list from the server.
 * The service will return list of all phones.
 * @method eb_CompanyInformation.getCompanyPhoneNumberData
 * @return {Object} jQuery promise object which when resolved returns phones list.
 */
eb_CompanyInformation.getCompanyPhoneNumberData = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (companyId > 0) {
        var service = eb_CompanyInformation.serviceUrls['get Company Phone Number Service'].replace("{id}", companyId);
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
 * Public method to get countries data list from the server.
 * The service will return list of all countries.
 * @method eb_CompanyInformation.getCountriesData
 * @return {Object} jQuery promise object which when resolved returns countries list.
 */
eb_CompanyInformation.getCountriesData = function () {
    var deferred = eBusinessJQObject.Deferred();
    eBusinessJQObject.get(
        {
            url: eb_CompanyInformation.serviceUrls['get Countries Service'],
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
 * Public method to get province data list from the server.
 * @method eb_CompanyInformation.getProvinceData
 * @param {String} country Country Id.
 * @return {Object} jQuery promise object which when resolved returns province list.
 **/
eb_CompanyInformation.getProvinceData = function (country) {
    var deferred = eBusinessJQObject.Deferred();
    var servicePath = eb_CompanyInformation.serviceUrls['get Province Service'];
    if (country) {
        servicePath = servicePath + "/" + country + "/" + "states";
    } else {
        deferred.resolve();
        return deferred.promise();
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
 * Public method to validate data from the server.
 * @method eb_CompanyInformation.validateAddressData
 * @param {String} data Address data.
 * @return {Object} jQuery promise object which when resolved returns validation results.xxxxxxzzzxxxxzxxstdfgdds
 */
eb_CompanyInformation.validateAddressData = function (data) {
    var deferred = eBusinessJQObject.Deferred();
    var servicePath = eb_CompanyInformation.serviceUrls['Address Validation'];
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.get(
            {
                url: servicePath,
                type: "POST",
                data: data,
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
 * Public method to get Profile Addresses data list for company from the server.
 * @method eb_CompanyInformation.getProfileAddresses
 * @param {String} companyId company Id.
 * @return {Object} jQuery promise object which when resolved returns profile address data.
 */
eb_CompanyInformation.getProfileAddresses = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (companyId > 0) {
        var service = eb_CompanyInformation.serviceUrls['get Profile Address Service'].replace("{id}", companyId);
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
 * Public method to get Company Addresses data list from the server
 * @method eb_CompanyInformation.getCompanyAddresses
 * @param {Number} companyId companyId to get company addresses
 * @return {Object} Addresses of company
 * */
eb_CompanyInformation.getCompanyAddresses = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId || companyId <= 0) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    var service = eb_CompanyInformation.serviceUrls['get Company Address Service'].replace("{id}", companyId);

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
 * Update profile phone number information of company
 * @method eb_CompanyInformation.updateProfilePhoneNumbersData
 * @return {Object} jQuery promise object
 */
eb_CompanyInformation.updateProfilePhoneNumberData = function (phoneData, companyId, phoneName) {
    var defer = eBusinessJQObject.Deferred();
    if (!phoneData) {
        throw { type: "argument_null", message: "phone details is required.", stack: Error().stack };
    }
    if (!phoneName) {
        throw { type: "argument_null", message: "phoneName property is required.", stack: Error().stack };
    }
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (companyId > 0) {
        var service = eb_CompanyInformation.serviceUrls['update Profile Phone Number Service'].replace("{id}", companyId).replace("{name}", phoneName);
    }
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: service,
            method: 'PATCH',
            contentType: "application/json",                /*request header*/
            data: JSON.stringify(phoneData),
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
 * Update company phone number information
 * @method eb_CompanyInformation.updateCompanyPhoneNumbersData
 * @return {Object} jQuery promise object
 */
eb_CompanyInformation.updateCompanyPhoneNumbersData = function (phoneData, companyId, phoneName) {
    var defer = eBusinessJQObject.Deferred();
    if (!phoneData) {
        throw { type: "argument_null", message: "phone details is required.", stack: Error().stack };
    }
    if (!phoneName) {
        throw { type: "argument_null", message: "phoneName property is required.", stack: Error().stack };
    }
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (companyId > 0) {
        var service = eb_CompanyInformation.serviceUrls['update Company Phone Number Service'].replace("{id}", companyId).replace("{name}", phoneName);
    }

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: service,
            method: 'PATCH',
            contentType: "application/json",                /*request header*/
            data: JSON.stringify(phoneData),
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
 * Update company information method.
 * @method eb_CompanyInformation.updateCompanyData
 * @param {Object} data Data to be updated.
 * @return {Object} jQuery promise object which when resolved returns updated company data.
 */
eb_CompanyInformation.updateEmailAndWebsiteData = function (data) {
    var defer = eBusinessJQObject.Deferred();
    console.info('update Email and Website Service...');
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_CompanyInformation.serviceUrls['update Email And Website Service'].replace("{id}", eb_CompanyInformation.companyId),
            method: 'PATCH',
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
 * @method eb_CompanyInformation.updateProfileAddressRecord
 * @param {Object} data Data to be updated.
 * @param {String} addressName Address name.
 * @return {Object} jQuery promise object which when resolved returns updated profile address data.
 */
eb_CompanyInformation.updateProfileAddressRecord = function (data, addressName) {
    var defer = eBusinessJQObject.Deferred();
    console.info('update address...');
    var service = eb_CompanyInformation.serviceUrls['update Profile Address Service'].replace("{id}", eb_CompanyInformation.companyId).replace("{addressName}", addressName);
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: service,
            type: "PATCH",
            contentType: "application/json",                /*request header*/
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
 * @method eb_CompanyInformation.updateCompanyAddressRecord
 * @param {Number} companyId companyId
 * @param {Object} data Address related information[ State, City, Country ...]
 * @param {String} addressName Updated information of company Address
 * @return {Object}  Return Updated Address
 * */
eb_CompanyInformation.updateCompanyAddressRecord = function (data, addressName, companyId) {
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
    var service = eb_CompanyInformation.serviceUrls['update Company Address Service'].replace("{id}", companyId).replace("{AddressName}", addressName);

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: service,
            type: "PATCH",
            contentType: "application/json",                /*request header*/
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
 * The service will return company information HTML.
 * @method eb_CompanyInformation.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Company Information template URL.
 * @return {String} Company Information HTML template.
 * */
eb_CompanyInformation.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_CompanyInformation.SitePath + eb_CompanyInformation.TemplatePath;
        options.templatePath = finalPath;
    }

    if (!options.domElement) {
        throw { type: "argument_mismatch", message: 'Missing domElement.  The object passed in must have a domElement property with a non-empty DOM object.', stack: Error().stack };
    }

    eBusinessJQObject.get(options.templatePath).done(function (data) {
        options.domElement.innerHTML = data;
        defer.resolve(data);
    }).fail(function (data, msg, jhr) {
        defer.reject(data, msg, jhr);
    });
    return defer.promise();
};


/**
 * Company Information model responsible for company information operations.
 * 
 * @method eb_CompanyInformation.model
    * 
 * @param { any } options Object of company information data.
 * @param { String } options.ServicePath Service URL.
 * @param { String } options.SitePath Site URL.
 * @param { String } options.templatePath HTML path.
 * @param { Object } options.domElement Company information DOM element.
 * @param {Object} userContext eb_UserContext.model instance.
 * 
 * */

eb_CompanyInformation.model = function (options) {
    var _that = this;
    _that.domElement = options.domElement;    
    _that.userContext = options.userContext;
    _that.companyInfoData = options.companyInfoData;
    _that.billingAddressData = options.billingAddressData;
    _that.mainPhoneData = options.mainPhoneData;
    _that.mainFaxData = options.mainFaxData; 

    _that.showAddress = ko.observable();
    _that.billingAddressLine1 = ko.observable();
    _that.billingAddressLine2 = ko.observable();
    _that.billingAddressCity = ko.observable();
    _that.billingAddressStateProvince = ko.observable();
    _that.billingAddressPostalCode = ko.observable();
    _that.billingAddressCountry = ko.observable();
    _that.membershipType = ko.observable();
    _that.website = ko.observable();
    _that.email = ko.observable();
    _that.startDate = ko.observable();
    _that.endDate = ko.observable();
    _that.companyId = ko.observable();
    _that.companyName = ko.observable();
    _that.phone = ko.observable();
    _that.fax = ko.observable();
    _that.memberStatus = ko.observable();
    _that.countriesData = ko.observable();
    _that.errors = ko.validation.group(_that);
    _that.showError = ko.observable(0);
    _that.showSuccess = ko.observable(0);
    _that.showAddressError = ko.observable(0);
    _that.showAddressSuccess = ko.observable(0);
    _that.successMessage = ko.observable();
    _that.errorMessage = ko.observable();
    _that.erroraddressMessage = ko.observable();
    _that.successAddressMessage = ko.observable();
    _that.showLoader = ko.observable(0);

    /*Phone Info.*/
    _that.phoneTypeOptions = ko.observableArray();
    _that.selectedPhoneType = ko.observable();
    _that.phoneCountryCodeOptions = ko.observableArray();
    _that.countryCode = ko.observable();
    _that.areaCode = ko.observable();
    _that.phoneNumber = ko.observable();
    _that.extension = ko.observable();
    _that.selectedPhone = ko.observable();

    /*Email Info.*/
    _that.emailTypeOptions = ko.observableArray();
    _that.selectedEmailType = ko.observable();
    

    /*Address Details*/
    _that.addressTypeOptions = ko.observableArray();

    /*try out observable properties.*/
    _that.addressCountryCodeOptions = ko.observableArray().extend({ rateLimit: 500 });
    _that.addressStateProvinceOptions = ko.observableArray().extend({ rateLimit: 500 });
    _that.selectedAddress = ko.observable();
    var selectedAddressValue;
    _that.showVerifyAddress = ko.observable(0);

    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);


    //load company Id from local storage
    if (_that.userContext) {
        _that.companyId(_that.userContext.companyId());
        eb_CompanyInformation.companyId = _that.companyId();
    }

    _that.getCompanyInformationFromServer = function () {
        return eb_CompanyInformation.getCompanyInformationData(_that.companyId());
    }

    _that.loadCompanyInformation = function (companyData) {
        _that.loadEmailData(companyData['MainEmail'], companyData['JobsEmail'], companyData['InfoEmail']);
        _that.website(companyData['website']);
    }

    _that.getCompanyBillingAddressFromServer = function () {
        return eb_CompanyInformation.getCompanyBillingAddress(_that.companyId());
    }

    _that.getCompanyMainPhoneFromServer = function () {
        return eb_CompanyInformation.getCompanyMainPhone(_that.companyId());
    }

    _that.getCompanyMainFaxFromServer = function () {
        return eb_CompanyInformation.getCompanyMainFax(_that.companyId());
    }

    //set company information
    _that.setCompanyInformation = function (data) {

        _that.startingDate = ko.computed(function () {
            var startingDate = moment(data.startDate).format(eb_Config.defaultDateFormat);
            if (eb_CompanyInformation.defaultDate !== startingDate) {
                return startingDate;
            } else {
                return null;
            }
        });
        _that.endingDate = ko.computed(function () {
            var endingDate = moment(data.endDate).format(eb_Config.defaultDateFormat);
            if (eb_CompanyInformation.defaultDate !== endingDate) {
                return endingDate;
            } else {
                return null;
            }
        });

        _that.companyName(data.companyName);
        _that.email(data.MainEmail);
        _that.website(data.website);
        _that.membershipType(data.memberType);
        _that.startDate(_that.startingDate());
        _that.endDate(_that.endingDate());
        _that.memberStatus(data.memberStatusName);

    }

    //set company address information
    _that.setCompanyAddress = function (data) {
        _that.billingAddressLine1("");
        _that.billingAddressLine2("");
        _that.billingAddressCity("");
        _that.billingAddressStateProvince("");
        _that.billingAddressPostalCode("");
        _that.billingAddressCountry("");

        if (data.line1 || data.line2 || data.city || data.stateProvince || data.postalCode || data.country) {
            _that.showAddress(1);

            if (data.line1) {
                _that.billingAddressLine1(data.line1 );
            }
            if (data.line2) {
                _that.billingAddressLine2(data.line2 );
            }
            if (data.city) {
                if (data.stateProvince) {
                    _that.billingAddressCity(data.city + ",");
                }
                else {
                    _that.billingAddressCity(data.city);
                }
            }
            if (data.stateProvince) {
                _that.billingAddressStateProvince(data.stateProvince);
            }
            if (data.postalCode) {
                _that.billingAddressPostalCode(data.postalCode);
            }
            if (data.country) {
                _that.billingAddressCountry(data.country);
            }
        }
        else {
            _that.showAddress(0);
        }
    }

    //set company phone information
    _that.setCompanyPhone = function (data) {
        _that.phone(data.formattedPhone);
    }

    //set company fax information
    _that.setCompanyFax = function (data) {
        _that.fax(data.formattedPhone);
    }


    if (_that.companyInfoData) {
        _that.setCompanyInformation(_that.companyInfoData);
    }
    else {
        /*Call getCompanyInformationFromServer method.*/
        _that.getCompanyInformationFromServer()
            .done(function (data) {
                _that.setCompanyInformation(data);
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getCompanyInformationFromServer failed:  " + xhr.responseText);
                eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
            });
    }

    if (_that.billingAddressData) {
        _that.setCompanyAddress(_that.billingAddressData);
    }
    else {
        /*Call getCompanyBillingAddressFromServer method.*/
        _that.getCompanyBillingAddressFromServer()
            .done(function (data) {
                _that.setCompanyAddress(data);
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getCompanyBillingAddressFromServer failed:  " + xhr.responseText);
                eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
            });
    }

    if (_that.mainPhoneData) {
        _that.setCompanyPhone(_that.mainPhoneData);
    }
    else {
        /*Call getCompanyMainPhoneFromServer method.*/
        _that.getCompanyMainPhoneFromServer()
            .done(function (data) {
                _that.setCompanyPhone(data);
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getCompanyMainPhoneFromServer failed:  " + xhr.responseText);
                eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
            });
    }

    if (_that.mainFaxData) {
        _that.setCompanyFax(_that.mainFaxData);
    }
    else {
        /*Call getCompanyMainFaxFromServer method.*/
        _that.getCompanyMainFaxFromServer()
            .done(function (data) {
                _that.setCompanyFax(data);
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getCompanyMainFaxFromServer failed:  " + xhr.responseText);
                eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
            });
    }


    //update user context on company change from company dropdown control
    _that.handleUserContext = function () {
        _that.companyId(_that.userContext.companyId());
        eb_CompanyInformation.companyId = _that.companyId();
        _that.windowChange();
    }

    /*Selected address kept in property for validate*/
    _that.addressChanged = function (value) {
        selectedAddressValue = value;
    }

    /*Load countries Data*/
    _that.loadCountriesData = function (data) {
        _that.phoneCountryCodeOptions(data);
        _that.addressCountryCodeOptions(data);
    };

    /*Get countries data from the server.*/
    _that.getCountriesDataFromServer = function () {
        return eb_CompanyInformation.getCountriesData();
    };

    /*Phone Data*/
    _that.phoneDetails = function (data) {
        var self = this;
        self.countryCode = ko.observable(data['countryCode']);
        self.areaCode = ko.observable(data['areaCode']);
        self.phoneName = ko.observable(data['name']);
        self.phone = ko.observable(data['phone']);
        self.phoneExtension = ko.observable(data['phoneExtension']);
        self.isPhoneUpdated = ko.observable(0);
        self.phoneRequired = ko.observable(0);
        self.countryCode.subscribe(function (newValue) {
            if (newValue.length >= 0) {
                self.isPhoneUpdated(1);
            }
        });

        self.phone.subscribe(function (newValue) {
            if (newValue.length >= 0) {
                self.isPhoneUpdated(1);
            }
        });

        self.areaCode.subscribe(function (newValue) {
            if (newValue.length >= 0) {
                self.isPhoneUpdated(1);
            }
        });

        self.phoneExtension.subscribe(function (newValue) {
            if (newValue.length >= 0) {
                self.isPhoneUpdated(1);
            }
        });

        self.hideErrorMessage = function (data, e) {
            self.phoneRequired(0);
            e.stopPropagation();
        }
    }

    _that.selectedPhoneType.subscribe(function (newValue) {
        if (newValue) {
            _that.selectedPhone(newValue.phoneName());
        }    
    });

    /*Load phone data into the phoneTypeOptions array property.*/
    _that.loadPhoneNumbersData = function (data) {
        eBusinessJQObject.map(data, function (row) {
            _that.phoneTypeOptions.push(new _that.phoneDetails(row));
        });
    };

    /* Get profile phone data for company from the server. */
    _that.getProfilePhoneNumberDataFromServer = function () {
        return eb_CompanyInformation.getProfilePhoneNumberData(_that.companyId());
    };

    /*Get company phone data from server */
    _that.getCompanyPhoneNumberDataFromServer = function () {
        return eb_CompanyInformation.getCompanyPhoneNumberData(_that.companyId());
    };

    /*Get company data from the server.*/
    _that.getProvinceDataFromServer = function (country) {
        return eb_CompanyInformation.getProvinceData(country);
    };


    _that.addressTypeOptions.subscribe(function (newValue) { });

    /*Get Profile Address Data of company From the Server*/
    _that.getProfileAddressDataFromServer = function () {
        return eb_CompanyInformation.getProfileAddresses(_that.companyId());
    };

    /* Get company address data from the server. */
    _that.getCompanyAddressDataFromServer = function () {
        return eb_CompanyInformation.getCompanyAddresses(_that.companyId());
    };

    /*Load state/Province data in addressStateProvinceOptions property.*/
    _that.loadProvinceData = function (data, defe) {
        var defe = eBusinessJQObject.Deferred();
        var _self = this;
        _self.addressItem = ko.utils.arrayFirst(_that.addressTypeOptions(), function (item) {
            var name = data.name;
            var addressName = item.name;
            if (ko.isObservable(item.name)) {
                addressName = item.name()
            }
            return addressName === name;
        });

        _self.item = ko.utils.arrayFirst(_that.addressCountryCodeOptions(), function (item) {
            var country = data.country;
            if (country) {
                country = country.trim();
            }
            return item.country === country;
        });

        if (_self.item && _self.item.id > 0) {
            if (_self.addressItem && _self.addressItem.name) {
                _self.addressItem.addressStateProvinceOptions.removeAll();
            } else { _that.addressStateProvinceOptions.removeAll(); }

            var addItem = ko.utils.arrayFirst(_that.addressTypeOptions(), function (item) {
                var name = data.country;
                var addressName = item.country;
                if (ko.isObservable(item.country)) {
                    addressName = item.country()
                }
                return addressName === name;
            });
            _that.getProvinceDataFromServer(_self.item.id).done(function (provinceData) {
                eBusinessJQObject.map(provinceData, function (row) {
                    if (_self.addressItem && _self.addressItem.name) {
                        _self.addressItem.addressStateProvinceOptions.push(row);
                    } else { _that.addressStateProvinceOptions.push(row); }
                });
                defe.resolve();
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getProvinceDataFromServer " + xhr.responseText);
                defe.reject(xhr, textStatus, errorThrow);
            });
        } else {
            _that.addressStateProvinceOptions.removeAll();
            defe.resolve();
        }
        return defe.promise();
    };

    /*Load address data into the addressTypeOptions array property.*/
    _that.loadAddressData = function (data, companyData) {
        var def = eBusinessJQObject.Deferred();
        var loadedDataCount = 0;
        eBusinessJQObject.map(data, function (row) {
            //Check country 
            var item = ko.utils.arrayFirst(_that.addressCountryCodeOptions(), function (item) {
                var country = row.country;
                if (country) {
                    country = country.trim();
                }
                return item.country === country;
            });

            var countryId = 0;
            if (!item) { countryId = 0; } else { countryId = item.id };
            if (_that.addressStateProvinceOptions.length > 0) {
                _that.addressStateProvinceOptions.removeAll();
            }
            _that.getProvinceDataFromServer(countryId).done(function (provinceData) {
                _that.addressStateProvinceOptions(provinceData);
                _that.addressTypeOptions.push(new _that.addressDataModel(row));
                loadedDataCount = loadedDataCount + 1;
                if (loadedDataCount == (data.length)) {
                    def.resolve();
                }
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("Failed to load state/province data" + xhr.responseText);
                eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
            });
        });
        return def.promise();
    };

    /*Address data model*/
    _that.addressDataModel = function (data) {
        var self = this;
        self.addressCountryCodeOptions = ko.observableArray(_that.addressCountryCodeOptions()).extend({ rateLimit: 500 });
        self.addressStateProvinceOptions = ko.observableArray(_that.addressStateProvinceOptions()).extend({ rateLimit: 500 });
        self.id = ko.observable(data["id"]);
        self.city = ko.observable(data["city"]);
        self.country = ko.observable(data["country"]);
        self.line1 = ko.observable(data["line1"]);
        self.line2 = ko.observable(data["line2"]);
        self.name = ko.observable(data["name"]);
        self.postalCode = ko.observable(data["postalCode"]);
        self.stateProvince = ko.observable(data["stateProvince"]);
        self.isAddressUpdated = ko.observable(0);

        self.line1.subscribe(function (newValue) {
            self.isAddressUpdated(1);
        });

        self.line2.subscribe(function (newValue) {
            self.isAddressUpdated(1);
        });

        self.country.subscribe(function (newValue) {
            if (newValue) {
                self.isAddressUpdated(1);
            }
        });

        self.city.subscribe(function (newValue) {
            self.isAddressUpdated(1);
        });

        self.postalCode.subscribe(function (newValue) {
            self.isAddressUpdated(1);
        });

        self.stateProvince.subscribe(function (newValue) {
            if (newValue) {
                self.isAddressUpdated(1);
            }
        });

        self.selectionChanged = function (address) {
            var def = eBusinessJQObject.Deferred();
            var updateAddress = {
                name: address.name(),
                country: address.country(),
                line1: address.line1(),
                line2: address.line2(),
                postalCode: address.postalCode(),
                stateProvince: address.stateProvince(),
                city: address.city()
            };
            _that.loadProvinceData(updateAddress, def);
        };
    }

    /*Load email information into the selectedEmailType & email properties.*/
    _that.emailViewModel = function (type, email) {
        this.selectedEmailType = ko.observable(type);
        this.email = ko.observable(email);
    };

    /*Load data into the emailTypeOptions array property.*/
    _that.loadEmailData = function (email1, email2, email3) {
        _that.emailTypeOptions.push(new _that.emailViewModel("Main Email", email1));
        _that.emailTypeOptions.push(new _that.emailViewModel("Jobs Email", email2));
        _that.emailTypeOptions.push(new _that.emailViewModel("Info Email", email3));
    };

    _that.enteredAndSuggestedAddressRecord = ko.observableArray();

    /* Verify address record */
    _that.verifyAddressDialog = function (data) {
        _that.showLoader(1);
        _that.showAddressSuccess(0);
        _that.showAddressError(0);
        var addressToValidate = {
            name: selectedAddressValue().name(),
            line1: selectedAddressValue().line1(),
            line2: selectedAddressValue().line2(),
            country: selectedAddressValue().country(),
            city: selectedAddressValue().city(),
            stateProvince: selectedAddressValue().stateProvince(),
            postalCode: selectedAddressValue().postalCode()
        };

        eb_CompanyInformation.validateAddressData(addressToValidate).done(function (result) {
            _that.enteredAndSuggestedAddressRecord.removeAll();
            _that.showError(0);
            _that.showSuccess(0);
            if (result.status === "ChangeSuggested") {
                _that.enteredAndSuggestedAddressRecord.push(new _that.enteredAddressModel(addressToValidate, result));
                /*eBusinessJQObject(_that.domElement).find('#modal-verify-address').modal("show");*/
                /*Bootstrap5.3 Modal Code Change Start*/
                new bootstrap.Modal(document.getElementById('modal-verify-address')).show();
                /*Bootstrap5.3 Modal Code Change End*/
            } else if (result.status === "Success") {
                _that.showAddressSuccess(1);
                _that.successAddressMessage(eb_CompanyInformation.successResponses['Address validated']);
            }
            _that.showLoader(0);
        }).fail(function (xhr, textStatus, errorThrow) {
            _that.showError(0);
            _that.showSuccess(0);
            _that.showAddressError(1);
            _that.showLoader(0);

            if (xhr && typeof xhr.responseJSON !== 'undefined')
                _that.erroraddressMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation));
            else
                _that.erroraddressMessage(eb_CompanyInformation.defaultErrorMessage);

        });
    };

    _that.enteredAddressModel = function (edata, sdata) {
        var self = this;
        self.name = edata["name"];
        self.eline1 = edata["line1"];
        self.eline2 = edata["line2"];
        self.ecountry = edata["country"];
        self.ecity = edata["city"];
        self.estateProvince = edata["stateProvince"];
        self.epostalCode = edata["postalCode"];

        self.sline1 = sdata["line1"];
        self.sline2 = sdata["line2"];
        self.scountry = sdata["country"];
        self.scity = sdata["city"];
        self.sstateProvince = sdata["stateProvince"];
        self.spostalCode = sdata["postalCode"];
        self.suggestedAddressClick = function (sdata) {
            var addressItem = ko.utils.arrayFirst(_that.addressTypeOptions(), function (item) {
                var name = sdata.name;
                var addressName = item.name;
                if (ko.isObservable(item.name)) {
                    addressName = item.name()
                }
                return addressName === name;
            });
            if (addressItem) {
                addressItem.line1(sdata["sline1"]);
                addressItem.line2(sdata["sline2"]);
                addressItem.country(sdata["scountry"]);
                addressItem.city(sdata["scity"]);
                addressItem.stateProvince(sdata["sstateProvince"]);
                addressItem.postalCode(sdata["spostalCode"]);
            }
        }
    }
    /*Call getCountriesDataFromServer method.*/
    _that.getCountriesDataFromServer()
        .done(function (countriesData) {
            _that.loadCountriesData(countriesData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getCountriesDataFromServer failed:  " + xhr.responseText);
            eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
        });

    /*gets called after clicking on edit button from UI in order to fetch all editable informtion for company selected*/
    _that.fetchInformation = function () {

        _that.emailTypeOptions.removeAll();
        _that.phoneTypeOptions.removeAll();
        _that.addressTypeOptions.removeAll();

        if (!_that.addressCountryCodeOptions) {
            /*Call getCountriesDataFromServer method.*/
            _that.getCountriesDataFromServer()
                .done(function (countriesData) {
                    _that.loadCountriesData(countriesData);
                }).fail(function (xhr, textStatus, errorThrow) {
                    console.info("getCountriesDataFromServer failed:  " + xhr.responseText);
                    eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
                });
        }
        
        /* Call getProfilePhoneNumberDataFromServer method. */
        _that.getProfilePhoneNumberDataFromServer().done(function (profilePhoneNumberData) {
            _that.loadPhoneNumbersData(profilePhoneNumberData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.error("getProfilePhoneDataFromServer failed:  " + xhr.responseText);
            eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
        });

        /*call getCompanyPhoneNumberDataFromServer method*/
        _that.getCompanyPhoneNumberDataFromServer().done(function (companyPhoneNumberData) {
            _that.loadPhoneNumbersData(companyPhoneNumberData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.error("getCompanyPhoneDataFromServer failed:  " + xhr.responseText);
            eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
        });

        /*call getProfileAddressDataFromServer method*/
        _that.getProfileAddressDataFromServer().done(function (addressData) {
            _that.loadAddressData(addressData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getAddressDataFromServer" + xhr.responseText);
            eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
        });

        /*call getCompanyAddressDataFromServer method*/
        _that.getCompanyAddressDataFromServer().done(function (addressData) {
            _that.loadAddressData(addressData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getAddressDataFromServer" + xhr.responseText);
            eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
        });

        /*call getCompanyInformationFromServer method*/
        _that.getCompanyInformationFromServer().done(function (companyInfo) {
            _that.loadCompanyInformation(companyInfo);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getAddressDataFromServer" + xhr.responseText);
            eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
        });
    };

    /*This issue is used to validate the phone control*/
    _that.validatePhoneNumber = function () {
        var triggerCall = true; /*To Check whether, we need to trigger phone call */
        for (i = 0; i < _that.phoneTypeOptions().length; i++) {
            var phone = _that.phoneTypeOptions()[i];
            if (phone.isPhoneUpdated() === 1) {
                /*If all the fields like Country Code, Area Code, Phone and Extension is empty, then update the call*/
                if (!phone.countryCode() && !phone.areaCode() && !phone.phone() && !phone.phoneExtension()) {
                    phone.phoneRequired(0);
                } else {
                    /*If all the fields like Country Code / Area Code / Extension is available and phone fields is empty then don't trigger the call */
                    if (!phone.phone()) {
                        triggerCall = false;
                        console.error('Phone Field is Mandatory');
                        phone.phoneRequired(1);
                        _that.selectedPhoneType(phone);
                        return triggerCall
                        break;
                    }
                }
            }
        }
        return triggerCall;
    }

    /*gets called everytime window changes, either from edit pop-up to info page or when company changes*/
    _that.windowChange = function () {
        _that.showSuccess(0);
        _that.showError(0);
        _that.showAddressSuccess(0);
        _that.showAddressError(0);

        _that.showLoader(1);
        /*Call getCompanyInformationFromServer method.*/
        _that.getCompanyInformationFromServer()
            .done(function (data) {
                _that.setCompanyInformation(data);
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getCompanyInformationFromServer failed:  " + xhr.responseText);
                eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
            });
   
        /*Call getCompanyBillingAddressFromServer method.*/
        _that.getCompanyBillingAddressFromServer()
            .done(function (data) {
                _that.setCompanyAddress(data);
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getCompanyBillingAddressFromServer failed:  " + xhr.responseText);
                eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
            });
    
        /*Call getCompanyMainPhoneFromServer method.*/
        _that.getCompanyMainPhoneFromServer()
            .done(function (data) {
                _that.setCompanyPhone(data);
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getCompanyMainPhoneFromServer failed:  " + xhr.responseText);
                eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
            });
    
        /*Call getCompanyMainFaxFromServer method.*/
        _that.getCompanyMainFaxFromServer()
            .done(function (data) {
                _that.setCompanyFax(data);
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getCompanyMainFaxFromServer failed:  " + xhr.responseText);
                eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
            });
        _that.showLoader(0);
    }

    /*Update company's profile.*/
    _that.updateProfileChanges = function () {
        _that.showError(0);
        _that.showSuccess(0);
        if (_that.companyId() > 0) {
            /*Check whether the phone field is updated or not*/
            if (_that.validatePhoneNumber()) {
                /*Update Email and Website Data*/
                updateEmailAndWebsite = {
                    /*email data*/
                    MainEmail: _that.emailTypeOptions()[0].email(),
                    JobsEmail: _that.emailTypeOptions()[1].email(),
                    InfoEmail: _that.emailTypeOptions()[2].email(),

                    /*website data*/
                    website: _that.website()
                };

                if (_that.errors().length === 0) {
                    _that.showAddressError(0);
                    _that.showAddressSuccess(0);
                    /*Email and Website update service call*/
                    eb_CompanyInformation.updateEmailAndWebsiteData(updateEmailAndWebsite)
                        .done(function (data) {
                            _that.showSuccess(1);
                            _that.successMessage(eb_CompanyInformation.successResponses['Profile saved']);
                            /*Update Address Information.  */
                            ko.utils.arrayForEach(_that.addressTypeOptions(), function (address) {
                                if (address.isAddressUpdated() === 1) {

                                    var updateAddress = {
                                        id: address.id(),
                                        name: address.name(),
                                        country: address.country(),
                                        line1: address.line1(),
                                        line2: address.line2(),
                                        postalCode: address.postalCode(),
                                        stateProvince: address.stateProvince(),
                                        city: address.city()
                                    };

                                    if (address.name() == "Street Address" || address.name() == "Billing Address" || address.name() == "PO Box Address") {
                                        eb_CompanyInformation.updateProfileAddressRecord(updateAddress, address.name())
                                            .done(function (addressData) {
                                                _that.showSuccess(1);
                                                _that.successMessage(eb_CompanyInformation.successResponses['Profile saved']);
                                            })
                                            .fail(function (xhr, textStatus, errorThrow) {
                                                _that.showError(1);
                                                _that.showSuccess(0);
                                                _that.errorMessage(eb_CompanyInformation.errorMessages['Profile save failed']);
                                                eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
                                            });
                                    } else {
                                        eb_CompanyInformation.updateCompanyAddressRecord(updateAddress, address.name(), _that.companyId())
                                            .done(function (addressData) {
                                                _that.showSuccess(1);
                                                _that.successMessage(eb_CompanyInformation.successResponses['Profile saved']);
                                            })
                                            .fail(function (xhr, textStatus, errorThrow) {
                                                _that.showError(1);
                                                _that.showSuccess(0);
                                                _that.errorMessage(eb_CompanyInformation.errorMessages['Profile save failed']);
                                                eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
                                            });
                                    }
                                }
                            });

                            /*Update Phone Numbers information. */
                            ko.utils.arrayForEach(_that.phoneTypeOptions(), function (phone) {
                                if (phone.isPhoneUpdated() === 1) {
                                    var phoneData = {
                                        countryCode: phone.countryCode(),
                                        areaCode: phone.areaCode(),
                                        phone: phone.phone(),
                                        phoneExtension: phone.phoneExtension()
                                    }

                                    if (phone.phoneName() == "Main Phone" || phone.phoneName() == "Main Fax") {
                                        /*If it is profile phone, then this will get called */
                                        eb_CompanyInformation.updateProfilePhoneNumberData(phoneData, _that.companyId(), phone.phoneName())
                                            .done(function (phoneData) {
                                                _that.showSuccess(1);
                                                _that.successMessage(eb_CompanyInformation.successResponses['Profile saved']);
                                            })
                                            .fail(function (xhr, textStatus, errorThrow) {
                                                _that.showSuccess(0);
                                                _that.showError(1);
                                                _that.errorMessage(eb_CompanyInformation.errorMessages['Profile save failed']);
                                                eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
                                            });
                                        

                                    } else {
                                        /*If it is company phone, then this will get called*/
                                        eb_CompanyInformation.updateCompanyPhoneNumbersData(phoneData, _that.companyId(), phone.phoneName())
                                            .done(function (phoneData) {
                                                _that.showSuccess(1);
                                                _that.successMessage(eb_CompanyInformation.successResponses['Profile saved']);
                                            })
                                            .fail(function (xhr, textStatus, errorThrow) {
                                                _that.showSuccess(0);
                                                _that.showError(1);
                                                _that.errorMessage(eb_CompanyInformation.errorMessages['Profile save failed']);
                                                eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
                                            });
                                    }
                                }
                            });
                        }).fail(function (xhr, textStatus, errorThrow) {
                            _that.showSuccess(0);
                            _that.showError(1);
                            _that.errorMessage(eb_CompanyInformation.errorMessages['Profile save failed']);
                            eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
                        });
                } else {
                    _that.errors.showAllMessages();
                }
            }
        }
    };

    /* Quantity validation allow only numeric character. */
    ko.bindingHandlers.numeric = {
        init: function (element, valueAccessor) {
            eBusinessJQObject(element).on("keydown", function (event) {
                /* Allow: backspace, delete, tab, escape, and enter */
                if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || event.keyCode === 13 || event.keyCode === 189 || event.keyCode === 109 || event.keyCode === 187 || event.keyCode === 107 ||
                    /* Allow: Ctrl+A */
                    event.keyCode === 65 && event.ctrlKey === true ||
                    /* Allow: home, end, left, right */
                    event.keyCode >= 35 && event.keyCode <= 40) {
                    /* let it happen, don't do anything */
                    return;
                }
                else {
                    /* Ensure that it is a number and stop the key press */
                    if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                        event.preventDefault();
                    }
                }
            });
        }
    };

    ko.bindingHandlers.clickOutside = {
        init: function (element, valueAccessor) {
            eBusinessJQObject(element).on('hidden.bs.modal', function () {
                _that.windowChange();
            });
        },
    }
};



/**
* Page DOM element.
* @method eb_CompanyInformation.domElement
* @param {object} domElement current DOM element.
* */
eb_CompanyInformation.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_CompanyInformation.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyInformation);
});