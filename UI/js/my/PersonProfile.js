/**
 * User Profile class.
 * @class eb_profile
 * */
var eb_profile = eb_profile || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_profile.SitePath
 * @type {String}
 **/
eb_profile.SitePath = eb_Config.SitePath;

/**
 * Profile template path.
 * @property eb_profile.TemplatePath
 * @type {String}
 **/
eb_profile.TemplatePath = "html/my/PersonProfile.html";

/**
 * SOA path.
 * It would be set from configuration file.
 * @property eb_profile.ServicePath
 * @type {String}
 * */
eb_profile.ServicePath = eb_Config.ServicePathV1;

/**
 * SOA serviceUrls.
 * All profile Service URLs.
 * @property eb_profile.ServicePath
 * @type {String}
 * */
eb_profile.serviceUrls = {
    'get Countries Service': eb_profile.ServicePath + "countries",
    'get Province Service': eb_profile.ServicePath + "country",
    'get Person Service': eb_profile.ServicePath + "ProfilePersons",
    'update Person Service': eb_profile.ServicePath + "ProfilePersons",
    'Address Validation': eb_profile.ServicePath + "AddressValidation",
    'update Profile Phone Number Service': eb_profile.ServicePath + "ProfilePersons/{personId}/ProfilePhones/{phoneName}",
    'get Profile Phone Number Service': eb_profile.ServicePath + "ProfilePersons/{personId}/ProfilePhones",
    'get Person Phone Number Service': eb_profile.ServicePath + "ProfilePersons/{personId}/PersonPhones",
    'update Person Phone Number Service': eb_profile.ServicePath + "ProfilePersons/{personId}/PersonPhones/{phoneName}",
    'get Profile Address Service': eb_profile.ServicePath + "ProfilePersons/{personId}/ProfileAddresses",
    'get Person Address Service': eb_profile.ServicePath + "ProfilePersons/{personId}/PersonAddresses",
    'update Profile Address Service': eb_profile.ServicePath + "ProfilePersons/{personId}/ProfileAddresses/{addressName}",
    'update Person Address Service': eb_profile.ServicePath + "ProfilePersons/{personId}/PersonAddresses/{addressName}",
    'make Preferred Mailing address': eb_profile.ServicePath + "ProfilePersons/{personId}/ProfileAddresses/{addressName}/makePreferredMailing"
}

/**
 * GET service to get the company list
 * @property eb_profile.getSearchDetails
 * @type {String}
 * */
eb_profile.getSearchDetails = "";

/**
 * OrderHistory Page URL.
 * @property eb_profile.proceedToOrderHistory
 * @type {String}
 * */
eb_profile.proceedToOrderHistory = eb_profile.SitePath + "/my/OrderHistory.html";

/* To Check blank date, if we didn't enter any value in date for person in smart client, then by default it return "01/01/0001" in following field [birthday, duesPaidThrough, joinDate]*/
eb_profile.defaultDate = "01/01/0001";


/*Get PersonId.*/
eb_profile.personId = "0";

/**
 * Rendering public method to load HTML template. Based on page level configuration it will select the template and load in DOM.
 * @method eb_profile.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Profile template URL.
 * @return {String} Profile HTML template.
 **/
eb_profile.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            var finalPath = eb_profile.SitePath + eb_profile.TemplatePath;
            options.templatePath = finalPath;
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

/* Error messages */
eb_profile.errorMessages = {
    'Profile save failed': 'There was an error encountered while updating your profile. Please try again. If the problem persists, please contact the customer support for further assistance.',
    'First name validation': 'Blank value is not OK for First Name.',
    'Last name validation': 'Blank value is not OK for Last Name.',
    'Preferred mailing address': 'You can make preferred mailing address profile address only.'
};

/* Success Responses */
eb_profile.successResponses = {
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
 * @property eb_profile.errorResponses
 * @type {Object}
 * */
eb_profile.errorResponses = {
    689: { useServerMessage: true },
    688: { useServerMessage: true },
    687: { useServerMessage: true },
    690: { useServerMessage: true }
};

/**
 * Default error message.
 * @property eb_profile.defaultErrorMessage
 * @type {String}
 * */
eb_profile.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/*Public method to get prefix data.*/
eb_profile.getPrefixData = function () {
    var deferred = eBusinessJQObject.Deferred();
    var prefixOptions = ["Dr.", "Miss", "Mrs.", "Mr.", "Ms.", "Sir."];
    deferred.resolve(prefixOptions);
    return deferred.promise();
};

/*Public method to get Suffix data.*/
eb_profile.getSuffixData = function () {
    var deferred = eBusinessJQObject.Deferred();
    var suffixOptions = ["Jr.", "PhD", "Sr."];
    deferred.resolve(suffixOptions);

    return deferred.promise();
};

/**
 * Public method to get profile phone data list from the server.
 * The service will return list of all phones.
 * @method eb_profile.getProfilePhoneNumberData
 * @return {Object} jQuery promise object which when resolved returns phones list.
 */
eb_profile.getProfilePhoneNumberData = function (personId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!personId) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    if (personId > 0) {
        var service = eb_profile.serviceUrls['get Profile Phone Number Service'].replace("{personId}", personId);
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
 * Update profile phone number information
 * @method eb_profile.updateProfilePhoneNumbersData
 * @return {Object} jQuery promise object which when resolved returns search data.
 */

eb_profile.updateProfilePhoneNumbersData = function (phoneData, personId, phoneName) {
    var defer = eBusinessJQObject.Deferred();
    if (!phoneData) {
        throw { type: "argument_null", message: "phone details is required.", stack: Error().stack };
    }
    if (!phoneName) {
        throw { type: "argument_null", message: "phoneName property is required.", stack: Error().stack };
    }
    if (!personId) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    if (personId > 0) {
        var service = eb_profile.serviceUrls['update Profile Phone Number Service'].replace("{personId}", personId).replace("{phoneName}", phoneName);
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
 * Public method to get person phone data list from the server.
 * The service will return list of all phones.
 * @method eb_profile.getPersonPhoneNumberData
 * @return {Object} jQuery promise object which when resolved returns phones list.
 */
eb_profile.getPersonPhoneNumberData = function (personId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!personId) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    if (personId > 0) {
        var service = eb_profile.serviceUrls['get Person Phone Number Service'].replace("{personId}", personId);
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
 * Update person phone number information
 * @method eb_profile.updatePersonPhoneNumbersData
 * @return {Object} jQuery promise object which when resolved returns search data.
 */

eb_profile.updatePersonPhoneNumbersData = function (phoneData, personId, phoneName) {
    var defer = eBusinessJQObject.Deferred();
    if (!phoneData) {
        throw { type: "argument_null", message: "phone details is required.", stack: Error().stack };
    }
    if (!phoneName) {
        throw { type: "argument_null", message: "phoneName property is required.", stack: Error().stack };
    }
    if (!personId) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    if (personId > 0) {
        var service = eb_profile.serviceUrls['update Person Phone Number Service'].replace("{personId}", personId).replace("{phoneName}", phoneName);
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
 * Public method to get countries data list from the server.
 * The service will return list of all countries.
 * @method eb_profile.getCountriesData
 * @return {Object} jQuery promise object which when resolved returns countries list.
 */
eb_profile.getCountriesData = function () {
    var deferred = eBusinessJQObject.Deferred();
    eBusinessJQObject.get(
        {
            url: eb_profile.serviceUrls['get Countries Service'],
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
 * @method eb_profile.getProvinceData
 * @param {String} country Country Id.
 * @return {Object} jQuery promise object which when resolved returns province list.
 */
eb_profile.getProvinceData = function (country) {
    var deferred = eBusinessJQObject.Deferred();
    var servicePath = eb_profile.serviceUrls['get Province Service'];
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
 * @method eb_profile.validateAddressData
 * @param {String} country Country Id.
 * @return {Object} jQuery promise object which when resolved returns province list.
 */
eb_profile.validateAddressData = function (data) {
    var deferred = eBusinessJQObject.Deferred();
    var servicePath = eb_profile.serviceUrls['Address Validation'];
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
 * Get person data from the server through the get service call.
 * @method eb_profile.getPersonData
 * @param {String} personID Person Id.
 * @return {Object} jQuery promise object which when resolved returns person data.
 */
eb_profile.getPersonData = function (personID) {
    var deferred = eBusinessJQObject.Deferred();
    var servicePath = eb_profile.serviceUrls['get Person Service'];
    if (personID) {
        servicePath = servicePath + "/" + personID;
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
 * Public method to get Profile Addresses data list from the server.
 * @method eb_profile.getProfileAddresses
 * @param {String} personId Person Id.
 * @return {Object} jQuery promise object which when resolved returns profile address data.
 */
eb_profile.getProfileAddresses = function (personId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!personId) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    if (personId > 0) {
        var service = eb_profile.serviceUrls['get Profile Address Service'].replace("{personId}", personId);
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
 * Public method to get Persons Addresses data list from the server
 * @method eb_profile.getPersonsAddresses
 * @param {Number} personId personId to get person addresses
 * @return {Object} Addresses of person
 * */
eb_profile.getPersonsAddresses = function (personId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!personId || personId <= 0) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    var service = eb_profile.serviceUrls['get Person Address Service'].replace("{personId}", personId);

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
 * Update person profile information method.
 * @method eb_profile.updatePersonData
 * @param {Object} data Data to be updated.
 * @return {Object} jQuery promise object which when resolved returns updated person data.
 */
eb_profile.updatePersonData = function (data) {
    var defer = eBusinessJQObject.Deferred();
    console.info('update Profile Service...');
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_profile.serviceUrls['update Person Service'] + "/" + eb_profile.personId,
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
 * @method eb_profile.updateProfileAddressRecord
 * @param {Object} data Data to be updated.
 * @param {String} addressName Address name.
 * @return {Object} jQuery promise object which when resolved returns updated profile address data.
 */
eb_profile.updateProfileAddressRecord = function (data, addressName) {
    var defer = eBusinessJQObject.Deferred();
    console.info('update address...');
    var service = eb_profile.serviceUrls['update Profile Address Service'].replace("{personId}", eb_profile.personId).replace("{addressName}", addressName);
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
 * @method eb_profile.updatePersonAddressRecord
 * @param {Number} personId personId
 * @param {Object} data Address related information[ State, City, Country ...]
 * @param {String} addressName Updated information of person Address
 * @return {Object}  Return Updated Address
 * */
eb_profile.updatePersonAddressRecord = function (data, addressName, personId) {
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
    var service = eb_profile.serviceUrls['update Person Address Service'].replace("{personId}", personId).replace("{addressName}", addressName);

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
 * @method eb_profile.makePreferredMailingaddress
 * @param {Number} personId personId
 * @param {Object} data Address related information[ State, City, Country ...]
 * @param {String} addressName Updated information of person Address
 * @return {Object}  Return Updated Address
 * */
eb_profile.makePreferredMailingaddress = function (data, addressName, personId) {
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
    var service = eb_profile.serviceUrls['make Preferred Mailing address'].replace("{personId}", personId).replace("{addressName}", addressName);
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
 * Get Service call for search data
 * @method eb_profile.getSearchData
 * @return {Object} jQuery promise object which when resolved returns search data.
 */
eb_profile.getSearchData = function () {
    var defer = eBusinessJQObject.Deferred();
    console.info('Get Search Data...');
    var service = eb_profile.getSearchDetails;
    if (!service) {
        throw { type: "argument_null", message: "Service URL is required.", stack: Error().stack };
    }
    eBusinessJQObject.get(
        {
            url: service
        }
    ).done(function (data) {
        defer.resolve(data);
    }).fail(defer.reject);
    return defer.promise();
};

/**
 * Person profile model.
 * @method eb_profile.model
 * @param {any} options Object of profile data.
 * @param {String} domElement DOM element.
 * @param {String} userContext eb_UserContext.model instance.
 * */
eb_profile.model = function (options, domElement, userContext) {
    var _that = this;
    _that.domElement = options.domElement;
    _that.userContext = options.userContext;
    _that.data = options.data;
    _that.addressData = options.addressData;
    _that.countriesData = options.countriesData;
    _that.addressPersonData = options.addressPersonData;

    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

    if (typeof _that.data === 'undefined' || _that.data === "") {
        _that.data = {
            /*Email Info.*/
            emailTypeOptions: ["Email Type", "Primary", "Secondary", "Tertiary"], emailType: "", email: "",
            genderOptions: ["Male", "Female", "Unknown"], gender: "",/*removing the option "Gender"*/
            userName: "", password: "", showLogin: 0,
            showMain: 1, showSettings: 0,
            showMembership: 0, showDemographics: 0, showCommunication: 0,
            showAlreadyRegistered: 0, showError: 0, showSignup: 1, showSuccess: 0
        };
    }

    _that.showSuccess = ko.observable(_that.data['showSuccess']);
    _that.successMessage = ko.observable();
    _that.showAddressSuccess = ko.observable(_that.data['showSuccess']);
    _that.successAddressMessage = ko.observable();
    _that.showAddressError = ko.observable(_that.data['showError']);
    _that.erroraddressMessage = ko.observable();
    _that.allowNumber = ko.observable();

    /*Person Info.*/
    if (_that.userContext) {
        _that.personID = ko.observable(_that.userContext.LinkId());
        eb_profile.personId = _that.personID();
    }

    _that.prefixOptions = ko.observable();
    _that.selectedPrefix = ko.observable();
    _that.firstName = ko.observable().extend({ required: { params: true, message: eb_profile.errorMessages['First name validation'] } });
    _that.middleName = ko.observable();
    _that.lastName = ko.observable().extend({ required: { params: true, message: eb_profile.errorMessages['Last name validation'] } });
    _that.firstLast = ko.observable();
    _that.suffixOptions = ko.observableArray(_that.data['suffixOptions']);
    _that.selectedSuffix = ko.observable();
    _that.title = ko.observable();
    _that.companyName = ko.observable();
    _that.search = ko.observable();
    _that.searchResult = ko.observableArray();
    _that.recordFound = ko.observable(0);

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
    _that.email = ko.observable();

    /*Address Details*/
    _that.addressTypeOptions = ko.observableArray();

    /*try out observable properties.*/
    _that.addressCountryCodeOptions = ko.observableArray().extend({ rateLimit: 500 });
    _that.addressStateProvinceOptions = ko.observableArray().extend({ rateLimit: 500 });
    _that.selectedAddress = ko.observable();
    var selectedAddressValue;
    _that.showVerifyAddress = ko.observable(0);

    /*Membership*/
    _that.memberType = ko.observable();
    _that.memberStatus = ko.observable();
    _that.joinDate = ko.observable();
    _that.duesPaidThrough = ko.observable();
    _that.parentMembershipVisible = ko.observable(false);

    /*Demographic*/
    _that.primaryFunction = ko.observable();
    _that.congressionalInfo = ko.observable();
    _that.birthday = ko.observable();
    _that.genderOptions = ko.observable(_that.data['genderOptions']);
    _that.selectedGender = ko.observable();
    _that.parentDemoGraphicVisible = ko.observable(false);

    /*User Info.*/
    _that.showLogin = ko.observable(_that.data['showLogin']);
    _that.userName = ko.observable();
    _that.password = ko.observable();

    /*Communication*/
    _that.optsOutOfMailCommunication = ko.observable();
    _that.optsOutOfFaxCommunication = ko.observable();
    _that.optsOutOfEmailCommunication = ko.observable();
    _that.excludeFromMembershipDirectory = ko.observable();
    _that.parentCommunicVisible = ko.observable(false);

    _that.showMain = ko.observable(_that.data['showMain']);
    _that.showSettings = ko.observable(_that.data['showSettings']);
    _that.showMembership = ko.observable(_that.data['showMembership']);
    _that.showDemographics = ko.observable(_that.data['showDemographics']);
    _that.showCommunication = ko.observable(_that.data['showCommunication']);

    _that.showError = ko.observable(_that.data['showError']);
    _that.showSignup = ko.observable(_that.data['showSignup']);
    _that.errorMessage = ko.observable();
    _that.btnSelect = ko.observable(0);
    _that.errors = ko.validation.group(_that);
    _that.showPrefferedError = ko.observable();
    _that.errorPrefferedMsg = ko.observable("cannot be set as Preferred Mailing Address ");
    _that.preMailingAddress = ko.observable(false);
    _that.preMailingAddressClick = function () {
        if (_that.preMailingAddress()); {
            if (_that.selectedAddress().isProfileAddress) {
                var updateAddress = {
                    id: _that.selectedAddress().id(),
                    addressName: _that.selectedAddress().name()
                }
                eb_profile.makePreferredMailingaddress(updateAddress, _that.selectedAddress().name(), _that.personID())
                    .done(function (addressData) {
                        _that.showSuccess(1);
                        _that.successMessage(eb_profile.successResponses['Profile saved']);
                    })
                    .fail(function (xhr, textStatus, errorThrow) {
                        _that.showError(1);
                        _that.showSuccess(0);
                        _that.errorMessage(eb_profile.errorMessages['Profile save failed']);
                    });
            } else {
                _that.showSuccess(0);
                _that.errorMessage(eb_profile.errorMessages['Preferred mailing address']);
                _that.showPrefferedError(1);
                return false;
            }
        }
        return true;
    }

    /*Selected address kept in property for validate*/
    _that.addressChanged = function (value) {
        selectedAddressValue = value;
        _that.preMailingAddress(value().isPreferredMailingAddress());
        _that.showPrefferedError(0);
    }

    /*Get prefix data from the server.*/
    _that.getPrefixDataFromServer = function () {
        return eb_profile.getPrefixData();
    };

    /*Load prefix data in prefixOptions array property.*/
    _that.loadPrefixData = function (data) {
        _that.prefixOptions(data);
    };

    /*call getPrefixDataFromServer method.*/
    _that.getPrefixDataFromServer().done(function (prefixData) {
        _that.loadPrefixData(prefixData);
    });

    /*Get suffix data from the server.*/
    _that.getSuffixDataFromServer = function () {
        return eb_profile.getSuffixData();
    };

    /*Load suffix data in array.*/
    _that.loadSuffixData = function (data) {
        _that.suffixOptions(data);
    };

    /*Call getSuffixDataFromServer method.*/
    _that.getSuffixDataFromServer().done(function (suffixData) {
        _that.loadSuffixData(suffixData);
    });

    /*Load countries Data*/
    _that.loadCountriesData = function (data) {
        _that.phoneCountryCodeOptions(data);
        _that.addressCountryCodeOptions(data);
    };

    /*Get countries data from the server.*/
    _that.getCountriesDataFromServer = function () {
        return eb_profile.getCountriesData();
    };

    /*Call getCountriesDataFromServer method.*/
    if (_that.countriesData) {
        _that.loadCountriesData(_that.countriesData);
    } else {
        _that.getCountriesDataFromServer()
            .done(function (countriesData) {
                _that.loadCountriesData(countriesData);
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getCountriesDataFromServer failed:  " + xhr.responseText);
            });
    }

    /*Get person data from the server.*/
    _that.getProvinceDataFromServer = function (country) {
        return eb_profile.getProvinceData(country);
    };

    /*Phone Data*/
    _that.phoneDetails = function (data) {
        var self = this;
        self.countryCode = ko.observable(data['countryCode']);
        self.areaCode = ko.observable(data['areaCode']);
        self.phoneName = ko.observable(data['name']);
        self.phone = ko.observable(data['phone']);
        self.phoneExtension = ko.observable(data['phoneExtension']);
        self.isPersonPhone = ko.observable(data['isPerson'] || false);
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
        _that.selectedPhone(newValue.phoneName());
    });

    /*Load phone data into the phoneTypeOptions array property.*/
    _that.loadPhoneNumbersData = function (data) {
        eBusinessJQObject.map(data, function (row) {
            _that.phoneTypeOptions.push(new _that.phoneDetails(row));
        });
    };

    /* Get profile phone data from the server. */
    _that.getProfilePhoneNumberDataFromServer = function () {
        return eb_profile.getProfilePhoneNumberData(_that.personID());
    };

    /*Profile phone number data*/
    if (options.profilePhoneNumberData) {
        _that.loadPhoneNumbersData(options.profilePhoneNumberData);
    } else {
        /* Call getProfilePhoneNumberDataFromServer method. */
        _that.getProfilePhoneNumberDataFromServer().done(function (profilePhoneNumberData) {
            _that.loadPhoneNumbersData(profilePhoneNumberData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.error("getProfilePhoneDataFromServer failed:  " + xhr.responseText);
        });
    }

    /*Get person phone data from server */
    _that.getPersonPhoneNumberDataFromServer = function () {
        return eb_profile.getPersonPhoneNumberData(_that.personID());
    };

    /* person phone number data*/
    if (options.personPhoneNumbersData) {
        eBusinessJQObject.map(options.personPhoneNumbersData, function (row, i) {
            /*To identify, it is person phone number*/
            row.isPerson = true; //HDEB-17: corrected Variable Name
        });
        _that.loadPhoneNumbersData(options.personPhoneNumbersData);
    } else {
        /*call getPersonPhoneNumberDataFromServer method*/
        _that.getPersonPhoneNumberDataFromServer().done(function (personPhoneNumberData) {
            eBusinessJQObject.map(personPhoneNumberData, function (row, i) {
                /*To identify, it is person phone number*/
                row.isPerson = true;
            });
            _that.loadPhoneNumbersData(personPhoneNumberData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.error("getPersonPhoneDataFromServer failed:  " + xhr.responseText);
        });
    }

    /*Get person data from the server.*/
    _that.getPersonDataFromServer = function () {
        return eb_profile.getPersonData(_that.userContext.LinkId());
    };

    /*Get person data from the server.*/
    _that.getPersonDataFromServer()
        .done(function (personData) {
            _that.loadPersonProfile(personData);
        })
        .fail(function (xhr, textStatus, errorThrow) {
            console.info("getPersonDataFromServer" + xhr.responseText);
        });

    /*Get userName & password from the User Context Object.*/
    if (_that.userContext) {
        _that.userName(_that.userContext.UserName());
        _that.password("############");
    }

    /*Load data into the profile model properties.*/
    _that.loadPersonProfile = function (personData) {
        _that.personID(personData['id']);
        _that.selectedPrefix(personData['prefix']);
        _that.firstName(personData['firstName']);
        _that.middleName(personData['middleName']);
        _that.lastName(personData['lastName']);
        _that.firstLast(_that.firstName() + " " + _that.lastName());
        _that.selectedSuffix(personData['suffix']);
        _that.title(personData['title']);
        _that.companyName(personData['companyName']);

        /*Membership*/
        _that.memberType(personData['memberType']);
        _that.memberStatus(personData['memberStatus']);

        /*Date Format*/
        _that.joinDay = ko.computed(function () {
            var joinDay = moment(personData['joinDate']).format(eb_Config.defaultDateFormat);
            if (eb_profile.defaultDate !== joinDay) {
                return joinDay;
            } else {
                return null;
            }
        });

        _that.duesPaid = ko.computed(function () {
            var duesPaidThrough = moment(personData['duesPaidThrough']).format(eb_Config.defaultDateFormat);
            if (eb_profile.defaultDate !== duesPaidThrough) {
                return duesPaidThrough;
            } else {
                return null;
            }
        });

        _that.birthDate = ko.computed(function () {
            var birthDate = moment(personData['birthday']).format(eb_Config.defaultDateFormat);
            if (eb_profile.defaultDate !== birthDate) {
                return birthDate;
            } else {
                return null;
            }
        });
        _that.joinDate(_that.joinDay());
        _that.duesPaidThrough(_that.duesPaid());
        _that.birthday(_that.birthDate());

        /*Demographic*/
        _that.primaryFunction(personData['primaryFunction']);
        _that.congressionalInfo(personData['congressionalInfo']);
        _that.selectedGender(personData['gender']);

        /*Communication*/
        _that.optsOutOfMailCommunication(personData['optsOutOfMailCommunication']);
        _that.optsOutOfFaxCommunication(personData['optsOutOfFaxCommunication']);
        _that.optsOutOfEmailCommunication(personData['optsOutOfEmailCommunication']);
        _that.excludeFromMembershipDirectory(personData['excludeFromMembershipDirectory']);

        _that.loadPhoneNumbersData(personData.phoneNumbers);
        _that.loadEmailData(personData['primaryEmail'], personData['secondaryEmail'], personData['tertiaryEmail']);
    };

    _that.addressTypeOptions.subscribe(function (newValue) { });

    /*Get Address Data From the Server*/
    _that.getAddressDataFromServer = function () {
        return eb_profile.getAddressData();
    };

    /* Get address data from the server. */
    _that.getPersonsAddressDataFromServer = function () {
        return eb_profile.getPersonsAddresses(eb_profile.personId);
    };

    /*Load state/Province data in addressStateProvinceOptions property.*/
    _that.loadProvinceData = function (data, def) {
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
    _that.loadAddressData = function (data, personData) {
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
                row.isProfileAddress = true;
                _that.addressStateProvinceOptions(provinceData);
                _that.addressTypeOptions.push(new _that.addressDataModel(row));
                loadedDataCount = loadedDataCount + 1;
                if (loadedDataCount == (data.length)) {
                    def.resolve();
                }
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("Failed to load state/province data" + xhr.responseText);
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
        self.isPreferredBillingAddress = ko.observable(data["isPreferredBillingAddress"]);
        self.isPreferredShippingAddress = ko.observable(data["isPreferredShippingAddress"]);
        self.isPreferredMailingAddress = ko.observable(data["isPreferredMailingAddress"]);

        self.line1 = ko.observable(data["line1"]);
        self.line2 = ko.observable(data["line2"]);
        self.name = ko.observable(data["name"]);
        self.postalCode = ko.observable(data["postalCode"]);
        self.stateProvince = ko.observable(data["stateProvince"]);
        if (data["isProfileAddress"]) {
            self.isProfileAddress = ko.observable(data["isProfileAddress"]);
        }
        if (data["isPersonAddress"]) {
            self.isPersonAddress = ko.observable(data["isPersonAddress"]);
        }
        self.isAddressUpdated = ko.observable(0);
        self.line1.subscribe(function (newValue) {
            if (newValue) {
                self.isAddressUpdated(1);
            }
        });

        self.line2.subscribe(function (newValue) {
            if (newValue) {
                self.isAddressUpdated(1);
            }
        });

        self.country.subscribe(function (newValue) {
            if (newValue) {
                self.isAddressUpdated(1);
            }
        });

        self.city.subscribe(function (newValue) {
            if (newValue) {
                self.isAddressUpdated(1);
            }
        });

        self.postalCode.subscribe(function (newValue) {
            if (newValue) {
                self.isAddressUpdated(1);
            }
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

    /*Get person data from the server.*/
    if (_that.addressData) {
        _that.loadAddressData(_that.addressData).done(function () {
            eBusinessJQObject.map(_that.addressPersonData, function (row) {
                var item = ko.utils.arrayFirst(_that.addressCountryCodeOptions(), function (item) {
                    var country = row.country;
                    if (country) {
                        country = country.trim();
                    }
                    return item.country === country;
                });

                var countryId = 0;
                if (!item) {
                    countryId = 0;
                } else { countryId = item.id };

                if (_that.addressStateProvinceOptions.length > 0) {
                    _that.addressStateProvinceOptions.removeAll();
                }
                _that.getProvinceDataFromServer(countryId).done(function (provinceData) {
                    _that.addressStateProvinceOptions(provinceData);
                    row.isPersonAddress = true;
                    _that.addressTypeOptions.push(new _that.addressDataModel(row));
                }).fail(function (xhr, textStatus, errorThrow) {
                    console.info("Failed to load state/province data" + xhr.responseText);
                });
            });

            var _self = this;
            _self.addressItem = ko.utils.arrayFirst(_that.addressTypeOptions(), function (item) {
                return item.isPreferredMailingAddress() == true;
            });
            if (_self.addressItem) {
                _that.selectedAddress(_self.addressItem);
                _that.preMailingAddress(_self.addressItem.isPreferredMailingAddress());
            }
        });
    }
    else {
        _that.getAddressDataFromServer().done(function (addressData) {
            _that.loadAddressData(addressData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getAddressDataFromServer" + xhr.responseText);
        });
    }

    _that.enteredAndSuggestedAddressRecord = ko.observableArray();

    /* Verify address record */
    _that.verifyAddressDialog = function (data) {
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

        eb_profile.validateAddressData(addressToValidate).done(function (result) {
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
                _that.successAddressMessage(eb_profile.successResponses['Address validated']);
            }
        }).fail(function (xhr, textStatus, errorThrow) {
            _that.showError(0);
            _that.showSuccess(0);
            _that.showAddressError(1);

            if (xhr && typeof xhr.responseJSON !== 'undefined')
                _that.erroraddressMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_profile));
            else
                _that.erroraddressMessage(eb_profile.defaultErrorMessage);

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

    /*Load email information into the selectedEmailType & email properties.*/
    _that.emailViewModel = function (type, email) {
        this.selectedEmailType = ko.observable(type);
        this.email = ko.observable(email);
    };

    /*Load data into the emailTypeOptions array property.*/
    _that.loadEmailData = function (email1, email2, email3) {
        _that.emailTypeOptions.removeAll();
        _that.emailTypeOptions.push(new _that.emailViewModel("Primary Email", email1));
        _that.emailTypeOptions.push(new _that.emailViewModel("Secondary Email", email2));
        _that.emailTypeOptions.push(new _that.emailViewModel("Tertiary Email", email3));
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

    /*Update person's profile.*/
    _that.updateProfileChanges = function () {
        _that.showError(0);
        _that.showSuccess(0);
        if (_that.personID() > 0) {
            /*Check weather phone field is updated or not*/
            if (_that.validatePhoneNumber()) {
                /*Update Person Data*/
                updatePerson = {
                    prefix: _that.selectedPrefix(),
                    firstName: _that.firstName(),
                    middleName: _that.middleName(),
                    lastName: _that.lastName(),
                    suffix: _that.selectedSuffix(),
                    title: _that.title(),
                    companyName: _that.companyName(),

                    /*Communication*/
                    optsOutOfMailCommunication: _that.optsOutOfMailCommunication(),
                    optsOutOfFaxCommunication: _that.optsOutOfFaxCommunication(),
                    optsOutOfEmailCommunication: _that.optsOutOfEmailCommunication(),
                    excludeFromMembershipDirectory: _that.excludeFromMembershipDirectory(),

                    /*email data*/
                    primaryEmail: _that.emailTypeOptions()[0].email(),
                    secondaryEmail: _that.emailTypeOptions()[1].email(),
                    tertiaryEmail: _that.emailTypeOptions()[2].email(),

                    birthday: _that.birthday(),
                    gender: _that.selectedGender()
                };

                if (_that.errors().length === 0) {
                    _that.showAddressError(0);
                    _that.showAddressSuccess(0);
                    _that.showPrefferedError(0);
                    /*Person update service call*/
                    eb_profile.updatePersonData(updatePerson)
                        .done(function (data) {

                            /*User context object method which load user data and stored in the local storage cache*/
                            var dataOut = { FirstName: _that.firstName(), LastName: _that.lastName() };
                            var fields = ['FirstName', 'LastName'];
                            _that.userContext.Load(dataOut);
                            _that.userContext.saveUpdateCache(fields, dataOut);

                            _that.showSuccess(1);
                            _that.successMessage(eb_profile.successResponses['Profile saved']);
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

                                    if (address.isProfileAddress) {
                                        eb_profile.updateProfileAddressRecord(updateAddress, address.name())
                                            .done(function (addressData) {
                                                _that.showSuccess(1);
                                                _that.successMessage(eb_profile.successResponses['Profile saved']);
                                            })
                                            .fail(function (xhr, textStatus, errorThrow) {
                                                _that.showError(1);
                                                _that.showSuccess(0);
                                                _that.errorMessage(eb_profile.errorMessages['Profile save failed']);
                                            });
                                    } else if (address.isPersonAddress) {
                                        eb_profile.updatePersonAddressRecord(updateAddress, address.name(), _that.personID())
                                            .done(function (addressData) {
                                                _that.showSuccess(1);
                                                _that.successMessage(eb_profile.successResponses['Profile saved']);
                                            })
                                            .fail(function (xhr, textStatus, errorThrow) {
                                                _that.showError(1);
                                                _that.showSuccess(0);
                                                _that.errorMessage(eb_profile.errorMessages['Profile save failed']);
                                            });
                                    }
                                }
                            });

                            _that.loadPersonProfile(data);/*reload profile to get latest values*/
                            /*Update Phone Numbers information. */
                            ko.utils.arrayForEach(_that.phoneTypeOptions(), function (phone) {
                                if (phone.isPhoneUpdated() === 1) {
                                    var phoneData = {
                                        countryCode: phone.countryCode(),
                                        areaCode: phone.areaCode(),
                                        phone: phone.phone(),
                                        phoneExtension: phone.phoneExtension()
                                    }

                                    if (phone.isPersonPhone()) {
                                        /*If it is person phones, then this will call*/
                                        eb_profile.updatePersonPhoneNumbersData(phoneData, _that.personID(), phone.phoneName())
                                            .done(function (phoneData) {
                                                _that.showSuccess(1);
                                                _that.successMessage(eb_profile.successResponses['Profile saved']);
                                            })
                                            .fail(function (xhr, textStatus, errorThrow) {
                                                _that.showSuccess(0);
                                                _that.showError(1);
                                                _that.errorMessage(eb_profile.errorMessages['Profile save failed']);
                                            });

                                    } else {
                                        /*If it is profile phones, then this will call */
                                        eb_profile.updateProfilePhoneNumbersData(phoneData, _that.personID(), phone.phoneName())
                                            .done(function (phoneData) {
                                                _that.showSuccess(1);
                                                _that.successMessage(eb_profile.successResponses['Profile saved']);
                                            })
                                            .fail(function (xhr, textStatus, errorThrow) {
                                                _that.showSuccess(0);
                                                _that.showError(1);
                                                _that.errorMessage(eb_profile.errorMessages['Profile save failed']);
                                            });
                                    }
                                }
                            });
                        }).fail(function (xhr, textStatus, errorThrow) {
                            _that.showSuccess(0);
                            _that.showError(1);
                            _that.errorMessage(eb_profile.errorMessages['Profile save failed']);
                        });
                } else {
                    _that.errors.showAllMessages();
                }
            }

        }
    };

    /*Show and hide main profile sections.*/
    _that.toggleMain = function () {
        _that.showSettings(0);
        _that.showMain(1);
        _that.showLogin(1);
    };

    /*Show Membership*/
    _that.toggleShowMembership = function () {
        _that.showMembership(!_that.showMembership());
        if (_that.showMembership())
            _that.parentMembershipVisible(true);
        else
            _that.parentMembershipVisible(false);
    };

    /*Show hide Demographics*/
    _that.toggleShowDemographics = function () {
        _that.showDemographics(!_that.showDemographics());
        if (_that.showDemographics())
            _that.parentDemoGraphicVisible(true);
        else
            _that.parentDemoGraphicVisible(false);
    };

    /*Show hide Login Page.*/
    _that.toggleShowLogin = function () {
        _that.showLogin(!_that.showLogin());
    };

    /*Show hide Communication ways*/
    _that.toggleShowCommunication = function () {
        _that.showCommunication(!_that.showCommunication());
        if (_that.showCommunication())
            _that.parentCommunicVisible(true);
        else
            _that.parentCommunicVisible(false);
    };

    /*Proceed to OrderHistory Page.*/
    _that.proceedToOrderHistrory = function () {
        if (eb_profile.proceedToOrderHistory) {
            window.location.assign(eb_profile.proceedToOrderHistory);
        } else {
            console.error("Proceed to payment URL is required.");
        }
    };

    /*To select the company from data list */
    _that.companyNames = function (row) {
        var self = this;
        self.companyList = ko.observable(row['title']);
    };

    /*Search Functionality to select the company from search list*/
    _that.search.subscribe(function (event) {
        _that.recordFound(0);
        eb_profile.getSearchData().done(function (searchData) {
            _that.searchResult.removeAll();
            if (searchData.length > 0) {
                if (_that.search().length !== 0) {
                    _that.recordFound(1);
                    eBusinessJQObject.map(searchData, function (row) {
                        var title = row.title.toLowerCase();
                        if (title.indexOf(_that.search().toLowerCase()) !== -1) {
                            _that.searchResult.push(new _that.companyNames(row));
                        }
                    });
                } else {
                    _that.recordFound(0);
                }
            }
        }).fail(function (xhr, textStatus, errorThrow) {
            console.error('Error to load the search data');
        });
        return true;
    });
};

/**
 * Page DOM element.
 * @method eb_profile.domElement
 * @param {object} domElement current DOM element.
 * */
eb_profile.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_profile.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_profile);
});