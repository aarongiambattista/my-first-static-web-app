/**
 * Define eb_membershipApplication class.
 * @class eb_membershipApplication
 * */
var eb_membershipApplication = eb_membershipApplication || {};

/**
 * Control level setting: Site path.
 * @property eb_membershipApplication.SitePath
 * @type {String}
 */
eb_membershipApplication.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_membershipApplication.TemplatePath
 * @type {String}
 */
eb_membershipApplication.TemplatePath = "html/MembershipApplication.html";

/**
 * Order Confirmation page redirection
 * @property eb_membershipApplication.orderConfirmationUrl
 * @type {String}
 * */
eb_membershipApplication.orderConfirmationUrl = eb_membershipApplication.SitePath + "OrderConfirmation.html";

/* Error messages */
eb_membershipApplication.errorMessages = {
    'Profile save failed': 'There was an error encountered while updating your profile. Please try again. If the problem persists, please contact the customer support for further assistance.',
    'First name validation': 'First Name is required.',
    'Last name validation': 'Last Name is required.',
    'Card date expired': 'Sorry, this card has expired. Please enter a valid card number.',
    'Invalid Email': 'Please enter a valid Email address (eg. johdoe@communitybrands.com).',
    'Invalid card number': 'Sorry, this card is invalid. Please enter a valid card number.'
};

/* Success Responses */
eb_membershipApplication.successResponses = {
    'Profile saved': 'Changes have been successfully saved.',
};

/**
 * Object with each month's numeric value.
 *  @property eb_membershipApplication.monthConstants
 * */
eb_membershipApplication.monthConstants = {
    'Month': 0, 'January(1)': 1, 'February(2)': 2, 'March(3)': 3, 'April(4)': 4, 'May(5)': 5, 'June(6)': 6,
    'July(7)': 7, 'August(8)': 8, 'September(9)': 9, 'October(10)': 10, 'November(11)': 11, 'December(12)': 12
};

/*Public method for error responses */
eb_membershipApplication.errorResoponses = {
    850: { useServerMessage: true, frontEndMessage: '' },
    1102: { useServerMessage: false, frontEndMessage: 'An error occurred during Bluepay Remote Payment processing. Please check the payment details entered and try again. If the problem persists please contact our customer service department.' }
};

/*Public method to get prefix data.*/
eb_membershipApplication.getPrefixData = function () {
    var deferred = eBusinessJQObject.Deferred();
    var prefixOptions = ["Dr.", "Miss", "Mrs.", "Mr.", "Ms.", "Sir."];
    deferred.resolve(prefixOptions);
    return deferred.promise();
};

/*Public method to get Suffix data.*/
eb_membershipApplication.getSuffixData = function () {
    var deferred = eBusinessJQObject.Deferred();
    var suffixOptions = ["Jr.", "PhD", "Sr."];
    deferred.resolve(suffixOptions);

    return deferred.promise();
};

/**
 * The path to the eBusiness SOA layer.
 * @property eb_membershipApplication.ServicePath
 * @type {String}
 */
eb_membershipApplication.ServicePath = eb_Config.ServicePathV1;

/**
 * This is default date
 * @property eb_membershipApplication.defaultDate
 * @type {String}
 */
eb_membershipApplication.defaultDate = "01/01/0001";

/**
 * The service URL path
 * @property eb_membershipApplication.serviceUrls
 * @type {object}
 **/
eb_membershipApplication.serviceUrls = {
    'Pay By New Card': eb_membershipApplication.ServicePath + 'MembershipApplication/Checkout/CreditCard',
    'Pay By Saved Card': eb_membershipApplication.ServicePath + 'MembershipApplication/Checkout/SavedPayment',
    'Pay By ACH new card': eb_membershipApplication.ServicePath + 'MembershipApplication/Checkout/ACH',
    'Pay By ACH Tokenizer new card': eb_membershipApplication.ServicePath + 'MembershipApplication/Checkout/ACHTokenizer',
    'Tokenize': eb_membershipApplication.ServicePath + 'CardPointe/ccn/tokenize',
    'Tokenize Apple Pay': eb_membershipApplication.ServicePath + 'CardPointe/ccn/tokenizeApplePay',
    'Pay By GPay': eb_membershipApplication.ServicePath + 'MembershipApplication/Checkout/GPay',
    'Pay By ApplePay': eb_membershipApplication.ServicePath + 'MembershipApplication/Checkout/ApplePay',
    'get Person PhoneNumber Service': eb_membershipApplication.ServicePath + 'ProfilePersons/{personId}/PersonPhones',
    'get Profile PhoneNumber Service': eb_membershipApplication.ServicePath + 'ProfilePersons/{personId}/ProfilePhones',
    'get membership Application Product': eb_membershipApplication.ServicePath + 'MembershipApplicationDefinition/Current/Products',
    'get Person Service': eb_membershipApplication.ServicePath + 'countries',
    'update Person Service': eb_membershipApplication.ServicePath + 'ProfilePersons',
    'get Person Service': eb_membershipApplication.ServicePath + "ProfilePersons/{personId}",
    'update countries Service': eb_membershipApplication.ServicePath + 'countries',
    'get countries Service': eb_membershipApplication.ServicePath + 'countries',
    'update Person PhoneNumber Service': eb_membershipApplication.ServicePath + 'ProfilePersons/{personId}/PersonPhones/{phoneName}',
    'update Profile PhoneNumbers Data': eb_membershipApplication.ServicePath + 'ProfilePersons/{personId}/ProfilePhones/{phoneName}',
    'Membership Application': eb_membershipApplication.ServicePath + 'MembershipApplication',
    'Membership Application Definition': eb_membershipApplication.ServicePath + 'MembershipApplicationDefinition/Current',
    'Pay By Bluepay HPP': eb_membershipApplication.ServicePath + 'MembershipApplication/Checkout/GetRemotePaymentRequest'
};

/**
 * Default error message.
 * @property eb_membershipApplication.defaultErrorMessage
 * @type {String}
 * */
eb_membershipApplication.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/**
 * Default image URL.
 * If product image is not available, default image will be shown.
 * @property eb_membershipApplication.defaultImage
 * @type {String}
 * */
eb_membershipApplication.defaultImage = "./images/products/coming-soon.png";

/**
 * Globally defined error codes object for the control.
 * Every error code should have boolean 'useServerMessage' attribute, which when true suggests we are
 * showing service error message on the UI.
 * If the 'useServerMessage' is defined as false, then provide another attribute 'frontEndMessage' with
 * the error string which will be shown on UI.
 * If 'useServerMessage' is false and 'frontEndMessage' is not defined, default error message will be shown.
 * If service error response contains error code not defined in this object then default error message will be shown.
 * 
 * @property eb_membershipApplication.errorResponses
 * @type {Object}
 * */
eb_membershipApplication.errorResponses = {
    202: { useServerMessage: true },
    203: { useServerMessage: true },
    430: { useServerMessage: true },
    601: { useServerMessage: false, frontEndMessage: 'Sorry, you are not eligible for “Bill me later” option. Please contact the customer support for further assistance with this order.' },
    700: { useServerMessage: false, frontEndMessage: 'An error occurred during Payment processing. Please check the payment details entered and try again. If the problem persists please contact our customer service department.' },
    1102: { useServerMessage: false, frontEndMessage: 'An error occurred during Bluepay Remote Payment processing. Please check the payment details entered and try again. If the problem persists please contact our customer service department.' }
};

/**
 * Rendering public method to load HTML template.
 * Based on page level configuration it will select the template and load in DOM.
 * Template path and DOM element are required parameters.
 * GET the template by Ajax call using template path and then assign it to DOM element.
 * @method eb_membershipApplication.render
 * @param {Object} options Object with data required for getting HTML template through Ajax call.
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * @returns {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_membershipApplication.render = function (options) {
    var defer = eBusinessJQObject.Deferred();
    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        options.templatePath = eb_membershipApplication.SitePath + eb_membershipApplication.TemplatePath;

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
 * Get Membership Application data from the server through the get service call.
 * @method eb_membershipApplication.getMembershipApplicationData
 * @return {object} jQuery promise object return the membership application data.
 **/
eb_membershipApplication.getMembershipApplicationData = function () {
    var deferred = eBusinessJQObject.Deferred();
    var servicePath = eb_membershipApplication.serviceUrls['get membership Application Product'];
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
 * Get Membership Application definition from the server through the get service call.
 * @method eb_membershipApplication.getMembershipApplicationDefinitionData
 * @return {object} jQuery promise object return the membership application data definition.
 * */
eb_membershipApplication.getMembershipApplicationDefinitionData = function () {
    var deferred = eBusinessJQObject.Deferred();
    var servicePath = eb_membershipApplication.serviceUrls['Membership Application Definition'];
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
 * Update person phone number information
 * @method eb_membershipApplication.updatePersonPhoneNumbersData
 * @param {phoneData} data phoneData to be updated.
 * @param {personId} data personId to be updated.
 * @param {phoneName} data phoneName to be updated.
 * @return {Object} jQuery promise object which when resolved returns updated phone number data.
 */
eb_membershipApplication.updatePersonPhoneNumbersData = function (phoneData, personId, phoneName) {
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
        var service = eb_membershipApplication.serviceUrls['update Person PhoneNumber Service'].replace("{personId}", personId).replace("{phoneName}", phoneName);
    }
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: service,
            method: 'PATCH',
            data: phoneData,
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
 * update Single Membership Product Item
 * @method eb_membershipApplication.updateSingleMembershipProductItem
 * @param {string} Data productId as data
 * @return {Object} jQuery promise object which when resolved returns membership data.
 */
eb_membershipApplication.updateSingleMembershipProductItem = function (productId) {
    var defer = eBusinessJQObject.Deferred();
    if (!productId) {
        throw { type: "argument_null", message: "productId property is required.", stack: Error().stack };
    }

    var service = eb_membershipApplication.serviceUrls['Membership Application'];
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: service,
            method: 'PATCH',
            data: productId,
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
 * Update profile phone number information
 * @method eb_profile.updateProfilePhoneNumbersData
 * @return {Object} jQuery promise object which when resolved returns phone number data.
 */
eb_membershipApplication.updateProfilePhoneNumbersData = function (phoneData, personId, phoneName) {
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
        var service = eb_membershipApplication.serviceUrls['update Profile PhoneNumbers Data'].replace("{personId}", personId).replace("{phoneName}", phoneName);
    }
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: service,
            method: 'PATCH',
            data: phoneData,
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
 * Update person profile information method.
 * @method eb_membershipApplication.updatePersonData
 * @param {Object} data Data to be updated.
 * @param {Object} personId Data to be updated.
 * @return {Object} jQuery promise object which when resolved returns updated person data.
 */
eb_membershipApplication.updatePersonData = function (data, personId) {
    var defer = eBusinessJQObject.Deferred();
    console.info('update Profile Service...');

    if (!data) {
        throw { type: "argument_null", message: "Person Data is required.", stack: Error().stack };
    }

    if (!personId) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_membershipApplication.serviceUrls['update Person Service'] + "/" + personId,
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
 * Public method to get person phone data list from the server.
 * The service will return list of all phones.
 * @method eb_membershipApplication.getPersonPhoneNumberData
 * @param {string} personId Data to be updated
 * @return {Object} jQuery promise object which when resolved returns phones list.
 */
eb_membershipApplication.getPersonPhoneNumberData = function (personId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!personId) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    if (personId > 0) {
        var service = eb_membershipApplication.serviceUrls['get Person PhoneNumber Service'].replace("{personId}", personId);
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
 * Get person data from the server through the get service call.
 * @method eb_profile.getPersonData
 * @param {String} personID Person Id.
 * @return {Object} jQuery promise object which when resolved returns person data.
 */
eb_membershipApplication.getPersonData = function (personID) {
    var deferred = eBusinessJQObject.Deferred();
    var servicePath = eb_membershipApplication.serviceUrls['get Person Service'];
    if (personID) {
        servicePath = eb_membershipApplication.serviceUrls['get Person Service'].replace("{personId}", personID);
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
 * The service will return list of all countries.
 * @method eb_profile.getCountriesData
 * @return {Object} jQuery promise object which when resolved returns countries list.
 */
eb_membershipApplication.getCountriesData = function () {
    var deferred = eBusinessJQObject.Deferred();
    eBusinessJQObject.get(
        {
            url: eb_membershipApplication.serviceUrls['get countries Service'],
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
 * This method is used to make card payment.
 * @method eb_membershipApplication.cardPayment
 * @param {Object} cardDetails CardDetails of login user.
 * @return {Object} jQuery promise object which when resolved returns payment details.
 */
eb_membershipApplication.cardPayment = function (cardDetails) {
    var defer = eBusinessJQObject.Deferred();
    var serviceURL;

    if (cardDetails.isSavedCard) {
        serviceURL = eb_membershipApplication.serviceUrls['Pay By Saved Card'];
    }

    if (cardDetails.isCreditCard) {
        serviceURL = eb_membershipApplication.serviceUrls['Pay By New Card'];
    }

    if (cardDetails.isGPay) {
        serviceURL = eb_membershipApplication.serviceUrls['Pay By GPay'];
    }

    if (cardDetails.isApplePay) {
        serviceURL = eb_membershipApplication.serviceUrls['Pay By ApplePay'];
    }

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: serviceURL,
            type: "POST",
            data: cardDetails,
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (data) {
            defer.resolve(data);
        }).fail(defer.reject);
    });
    return defer.promise();
};

/**
 * Public method to get profile phone data list from the server.
 * The service will return list of all phones.
 * @method eb_membershipApplication.getProfilePhoneNumberData
 * @param {String} personId Data person Id.
 * @return {Object} jQuery promise object which when resolved returns phones list.
 */
eb_membershipApplication.getProfilePhoneNumberData = function (personId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!personId) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    if (personId > 0) {
        var service = eb_membershipApplication.serviceUrls['get Profile PhoneNumber Service'].replace("{personId}", personId);
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
/**
 * MembershipApplication Model for binding data.
 * The model contains observable properties to hold corresponding data returned from services.
 * Also, model contains computed properties and methods to support MembershipApplication functionality.
 * @method eb_membershipApplication.model
 * @param {Object} options Contains necessary data which is required for Donations functionality.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL.
 * @param {Object} options.data Contains data returned from service which is used to construct Membership Application model.
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 */
eb_membershipApplication.model = function (options) {
    var _that = this;

    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement property is required.", stack: Error().stack };
    }

    if (options.personId) {
        eb_membershipApplication.personId = options.personId;
        _that.personId = ko.observable(eb_membershipApplication.personId);
    } else {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }

    if (typeof _that.data === 'undefined' || _that.data === "") {
        _that.data = {
            /*Email Info.*/
            emailTypeOptions: ["Email Type", "Primary", "Secondary", "Tertiary"], emailType: "", email: "",
            genderOptions: ["Male", "Female", "Unknown"], gender: "",/*removing the option "Gender"*/
        };
    }

    _that.userContext = {}
    if (options.userContext) {
        _that.userContext = options.userContext;
    }

    _that.domElement = options.domElement;
    _that.membershipOrders = ko.observableArray();
    _that.memberErrorMessage = ko.observable(0);
    _that.selectMembershipError = ko.observable(0);
    _that.showLoader = ko.observable(0);

    _that.focus = ko.observable(false);/*focus on input field*/
    _that.amount = ko.observable(0);
    _that.errorMessage = ko.observable(0);
    _that.successMessage = ko.observable(0);
    _that.showSuccess = ko.observable(0);
    _that.showMembershipName = ko.observable("");
    _that.showError = ko.observable(0);

    _that.prefixOptions = ko.observable();
    _that.selectedPrefix = ko.observable();
    _that.personID = ko.observable(eb_membershipApplication.personId);
    _that.firstName = ko.observable().extend({ required: { params: true, message: eb_membershipApplication.errorMessages['First name validation'] } });
    _that.lastName = ko.observable().extend({ required: { params: true, message: eb_membershipApplication.errorMessages['Last name validation'] } });
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
    _that.membershipApplicationName = ko.observable();
    _that.membershipLevelText = ko.observable("Select Membership Level");

    /*Email Info.*/
    _that.emailTypeOptions = ko.observableArray();
    _that.selectedEmailType = ko.observable();
    _that.email = ko.observable().extend({ email: { params: true, message: eb_membershipApplication.errorMessages['Invalid Email'] } });
    _that.primaryEmailAddress = ko.observable();

    /*Demographic*/
    _that.birthday = ko.observable();
    _that.genderOptions = ko.observable(_that.data['genderOptions']);
    _that.selectedGender = ko.observable();

    _that.errors = ko.validation.group(_that);

    /*Get prefix data from the server.*/
    _that.getPrefixDataFromServer = function () {
        return eb_membershipApplication.getPrefixData();
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
        return eb_membershipApplication.getSuffixData();
    };

    /*Load suffix data in array.*/
    _that.loadSuffixData = function (data) {
        _that.suffixOptions(data);
    };

    /*Call getSuffixDataFromServer method.*/
    _that.getSuffixDataFromServer().done(function (suffixData) {
        _that.loadSuffixData(suffixData);
    });

    /* Payment Control attributes */
    _that.paymentControl = {};
    _that.paymentControl.showBillMeLaterPayType = false;
    _that.paymentControl.savedCardsTitle = 'Saved Credit Cards';
    _that.paymentControl.cardTitle = 'New Card';
    _that.paymentControl.paymentControlButtonName = 'Pay & Submit';
    _that.paymentControl.showSaveForFutureCheckBox = true;
    _that.paymentControl.showEditDeleteSavedCardButtons = false;
    _that.paymentControl.bluePayURL = ko.observable("");

    /*Load data into the profile model properties.*/
    _that.loadPersonProfile = function (personData) {
        _that.personID(personData['id']);
        _that.selectedPrefix(personData['prefix']);
        _that.firstName(personData['firstName']);
        _that.lastName(personData['lastName']);

        _that.selectedSuffix(personData['suffix']);
        _that.title(personData['title']);
        _that.companyName(personData['companyName']);

        var birthdate = moment(personData['birthday']).format(eb_Config.defaultDateFormat);
        if (eb_membershipApplication.defaultDate !== birthdate) {
            _that.birthday(birthdate);
        } else {
            _that.birthday("");
        }

        /*Load email information into the selectedEmailType & email properties.*/
        _that.emailViewModel = function (type, email) {
            this.selectedEmailType = ko.observable(type);
            this.email = ko.observable(email);
        };

        /*Load data into the emailTypeOptions array property.*/
        _that.loadEmailData = function (email1, email2, email3) {
            _that.emailTypeOptions.push(new _that.emailViewModel("Primary Email", email1));
            _that.emailTypeOptions.push(new _that.emailViewModel("Secondary Email", email2));
            _that.emailTypeOptions.push(new _that.emailViewModel("Tertiary Email", email3));
        };

        /*Demographic*/
        _that.selectedGender(personData['gender']);

        /*Communication*/
        //_that.loadPhoneNumbersData(personData.phoneNumbers);
        _that.loadEmailData(personData['primaryEmail'], personData['secondaryEmail'], personData['tertiaryEmail']);
        _that.primaryEmailAddress(personData['primaryEmail']);
    };

    /*Phone Data*/
    _that.phoneDetails = function (data) {
        var self = this;
        self.countryCode = ko.observable(data['countryCode']);
        self.phoneName = ko.observable(data['name']);
        self.phone = ko.observable(data['phone']);
        self.areaCode = ko.observable(data['areaCode']);
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

    /*selected Phone Type*/
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
        return eb_membershipApplication.getProfilePhoneNumberData(_that.personId());
    };

    /* profile phone number data*/
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
        return eb_membershipApplication.getPersonPhoneNumberData(_that.personID());
    }

    if (options.personPhoneNumbersData) {
        eBusinessJQObject.map(options.personPhoneNumbersData, function (row, i) {
            /*To identify, it is person phone number*/
            personPhoneNumberData[i].isPerson = true;
        });
        _that.loadPhoneNumbersData(options.personPhoneNumbersData);
    } else {
        /*call getPersonPhoneNumberDataFromServer method*/
        _that.getPersonPhoneNumberDataFromServer().done(function (personPhoneNumberData) {
            eBusinessJQObject.map(personPhoneNumberData, function (row, i) {
                /*To identify, it is person phone number*/
                personPhoneNumberData[i].isPerson = true;
            });
            _that.loadPhoneNumbersData(personPhoneNumberData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.error("getPersonPhoneDataFromServer failed:  " + xhr.responseText);
        });
    }

    /*Get person data from the server.*/
    _that.getPersonDataFromServer = function () {
        return eb_membershipApplication.getPersonData(_that.personId());
    };

    /*Get person data from the server.*/
    if (options.profileData) {
        _that.loadPersonProfile(options.profileData);
    } else {
        _that.getPersonDataFromServer()
            .done(function (personData) {
                _that.loadPersonProfile(personData);
            })
            .fail(function (xhr, textStatus, errorThrow) {
                console.info("getPersonDataFromServer" + xhr.responseText);
            });
    }

    /* Details of membership product */
    _that.membershipDetails = function (data) {
        var self = this;
        self.id = ko.observable(data['productId']);
        self.styleClass = ko.observable("");
        self.membershipName = ko.observable(data['name']);
        self.description = ko.observable(data['webDescription']);
        self.currencySymbol = ko.observable(data['currencySymbol']);
        self.price = ko.observable(parseFloat(data['price']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.checkedMember = ko.observable(false);

        /*If we want the image, to be default image then set the value of 'eb_Config.loadDefaultImage' = true,
         * If we don't want default image then set that as 'eb_Config.loadDefaultimage' = false;
         */
        if (eb_Config.loadDefaultImage) {
            self.webImage = ko.observable(eb_membershipApplication.defaultImage);
        }
        else {
            /* Take the image from large folder */
            self.webImage = ko.observable(eb_Config.largeImageURL + self.id() + eb_Config.imageExtension);
        }

        /*Selected Funds*/
        self.selectedMembership = function (value) {
            _that.selectMembershipError(0);
            var productId = { productId: value.id() };
            eb_membershipApplication.updateSingleMembershipProductItem(productId).done(function (data) {
                _that.showSuccess(0);
                /*To focus on input field*/
                _that.focus(true);
            /* If default member price is greater than 0, then show the amount field with price, 
           */ _that.memberErrorMessage(0);
                _that.amount(Number(value.price()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
                eBusinessJQObject.map(_that.membershipOrders(), function (record) {
                    record.styleClass("");
                    record.checkedMember(false);
                });
                self.styleClass("eb-membership-selected-card"); /* Apply the class of border to selected application */
                self.checkedMember(true);

            }).fail(function (xhr, textStatus, errorThrow) {
                _that.showError(1);
                _that.errorMessage("Failed to update Single Membership Product Item. : " + value.membershipName());
                console.error("Failed to update Single Membership Product Item:  " + xhr.responseText);
            });
        };

        /*More details of product with image and product description*/
        self.moreDetails = function (data, e) {
            /*eBusinessJQObject(_that.domElement).find('#collapse' + data.id()).modal("show");*/
            /*Bootstrap5.3 Modal Code Change Start*/
            var moreDetailsModal = document.getElementById("collapse" + data.id());
            new bootstrap.Modal(moreDetailsModal).show();
            /*Bootstrap5.3 Modal Code Change End*/
            /*To Stop the bubble up of event*/
            e.stopPropagation();
        };
    };

    /* Load application order data  */
    _that.loadMembershipOrdersFromServer = function (allOrders) {
        if (allOrders.length == 0) {
            _that.memberErrorMessage(1);
            _that.membershipLevelText("No Membership level record found.")
        } else { _that.memberErrorMessage(0); }
        eBusinessJQObject.map(allOrders, function (orders) {
            _that.membershipOrders.push(new _that.membershipDetails(orders));
        });
    };

    /* Load application membership definition data */
    _that.loadMembershipDefFromServer = function (appDetails) {
        if (appDetails) {
            _that.membershipApplicationName(appDetails.name)
            _that.memberErrorMessage(1);
        } else { _that.memberErrorMessage(0); }
    };

    /*Get application data form server*/
    _that.getMembershipOrdersFromServer = function () {
        return eb_membershipApplication.getMembershipApplicationData();
    };

    /*Get application data form server*/
    _that.getMembershipDefFromServer = function () {
        return eb_membershipApplication.getMembershipApplicationDefinitionData();
    };

    /*if the membership Application data is available then load it*/
    if (options.membershipApplicationDefinitionData) {
        _that.loadMembershipDefFromServer(options.membershipApplicationDefinitionData);
    }
    else {
        /*Call the service of application orders*/
        _that.getMembershipDefFromServer().done(function (appDetails) {
            _that.loadMembershipDefFromServer(appDetails);
        }).fail(function (xhr, textStatus, errorThrow) {
            _that.memberErrorMessage(1);
            console.info("getMembershipDefFromServer failed:  " + xhr.responseText);
        });
    }

    /*if the membership Application data is available then load it*/
    if (options.membershipApplicationData) {
        _that.loadMembershipOrdersFromServer(options.membershipApplicationData);
    }
    else {
        /*Call the service of application orders*/
        _that.getMembershipOrdersFromServer().done(function (allOrders) {
            _that.loadMembershipOrdersFromServer(allOrders);
        }).fail(function (xhr, textStatus, errorThrow) {
            _that.memberErrorMessage(1);
            _that.membershipLevelText("No Membership Level Record Found.")
            console.info("getMembershipOrdersFromServer failed:  " + xhr.responseText);
        });
    }

    /*To Place the application order*/
    _that.appPlaceOrder = function (cardDetails, product) {
        var deferred = eBusinessJQObject.Deferred();
        eb_membershipApplication.cardPayment(cardDetails).done(function (data) {
            _that.showMembershipName(product);
            deferred.resolve(data);
        }).fail(deferred.reject);
        return deferred.promise();
    };

    /*Payment by SPM*/
    _that.payBySavedCard = function (cardInfo) {
        if (_that.errors().length === 0) {
            _that.showLoader(1);
            _that.updateProfileChanges().done(function () {
                _that.selectMembershipError(0);
                var isApplicationSelected = true;
                _that.showSuccess(0);
                if (_that.amount() !== '' || _that.amount() > 0) {
                    var cardDetails = {
                        CVV: cardInfo.cVV(),
                        SavedPaymentId: cardInfo.id()
                    };
                    cardDetails.amount = _that.amount();
                    cardDetails.isSavedCard = true;
                    var appSelected = ko.utils.arrayFirst(_that.membershipOrders(), function (product) {
                        if (product.checkedMember() === true) {
                            cardDetails.productId = product.id();
                            isApplicationSelected = false;
                            /*calling appPlaceOrder function*/
                            _that.appPlaceOrder(cardDetails, product.membershipName()).done(function (data) {
                                _that.showLoader(0);
                                if (eb_membershipApplication.orderConfirmationUrl) {
                                    window.location.assign(eb_membershipApplication.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id) + "&" + "membershipSuccess=0");
                                }
                                else {
                                    console.error("Order Confirmation URL is required.");
                                }
                            }).fail(function (xhr, textStatus, errorThrow) {
                                _that.showLoader(0);
                                _that.showError(1);
                                _that.errorMessage("Your membership application is not submitted.");
                            });
                        }
                    });
                    if (isApplicationSelected) {
                        _that.selectMembershipError(1);
                        _that.showLoader(0);
                        console.log('Error to select membership application');
                    }
                } else {
                    console.log('Enter Amount');
                    propBooleanlValid.showAllMessages(true);
                }
            }).fail(function (xhr, textStatus, errorThrow) {
                _that.showLoader(0);
                _that.showError(1);
                _that.errorMessage("Failed to update profile page.");
            });
        } else {
            _that.errors.showAllMessages();
        }
    };

    /*Pay by Saved ACH Card*/
    _that.payByACHSavedCard = function (cardInfo) {
        if (_that.errors().length === 0) {
            _that.updateProfileChanges().done(function () {
                var isApplicationSelected = true;
                var card = "isSavedCard";
                _that.showSuccess(0);
                if (_that.amount() !== '' || _that.amount() > 0) {
                    var cardDetails = {
                        SavedPaymentId: cardInfo.id
                    };
                    cardDetails.amount = _that.amount();
                    cardDetails.isSavedCard = true;
                    var appSelected = ko.utils.arrayFirst(_that.membershipOrders(), function (product) {
                        if (product.checkedMember() === true) {
                            cardDetails.productId = product.id();
                            isApplicationSelected = false;
                            _that.showLoader(1);
                            /*calling appPlaceOrder function*/
                            _that.appPlaceOrder(cardDetails, product.membershipName()).done(function (data) {
                                _that.showLoader(0);
                                if (eb_membershipApplication.orderConfirmationUrl) {
                                    window.location.assign(eb_membershipApplication.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id) + "&" + "membershipSuccess=0");
                                }
                                else {
                                    console.error("Order Confirmation URL is required.");
                                }
                            }).fail(function (xhr, textStatus, errorThrow) {
                                _that.showLoader(0);
                                _that.showError(1);
                                _that.errorMessage("Your membership application is not submitted.");
                            });
                        }
                    });
                    if (isApplicationSelected) {
                        _that.selectMembershipError(1);
                        _that.showLoader(0);
                        console.log('Error to select membership application');
                    }
                } else {
                    console.log('Enter Amount');
                    propBooleanlValid.showAllMessages(true);
                }
            }).fail(function (xhr, textStatus, errorThrow) {
                _that.showLoader(0);
                _that.showError(1);
                _that.errorMessage("Failed to update profile page.");
            });
        } else {
            _that.errors.showAllMessages();
        }
    };

    //Check card is valid or not.
    function isValidCreditCard(value) {
        // accept only digits, dashes or spaces
        if (/[^0-9-\s]+/.test(value)) return false;

        // The Luhn Algorithm. It's so pretty.
        var nCheck = 0, nDigit = 0, bEven = false;
        value = value.replace(/\D/g, "");

        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n),
                nDigit = parseInt(cDigit, 10);

            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }

            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) == 0;
    }

    /*Payment by Credit Card*/
    _that.payByNewCard = function (cardInfo) {
        if (_that.errors().length === 0) {
            _that.updateProfileChanges().done(function () {
                _that.selectMembershipError(0);
                var isApplicationSelected = true;
                _that.showSuccess(0);
                if (_that.amount() !== '' || _that.amount() > 0) {

                    if (!isValidCreditCard(cardInfo.cardNumber())) {
                        cardInfo.showError(1);
                        cardInfo.errorMessage(eb_membershipApplication.errorMessages['Invalid card number']);
                        return;
                    }

                    if (cardInfo.isDateExpired(eb_membershipApplication.monthConstants[cardInfo.selectedMonth()], cardInfo.selectedYear())) {
                        cardInfo.showError(1);
                        cardInfo.errorMessage(eb_membershipApplication.errorMessages['Card date expired']);
                        return;
                    }
                    /*Card details */
                    var cardDetails = {
                        cardNumber: cardInfo.cardNumber(),
                        expirationMonth: eb_membershipApplication.monthConstants[cardInfo.selectedMonth()],
                        expirationYear: cardInfo.selectedYear(),
                        cvv: cardInfo.cVV(),
                        saveForFutureUse: cardInfo.saveForFutureUse()
                    };
                    cardDetails.amount = _that.amount();
                    cardDetails.isCreditCard = true;

                    /*Selected member product*/
                    var appSelected = ko.utils.arrayFirst(_that.membershipOrders(), function (product) {
                        if (product.checkedMember() === true) {
                            isApplicationSelected = false;
                            cardDetails.productId = product.id();
                            _that.showLoader(1);
                            /*calling appPlaceOrder function*/
                            _that.appPlaceOrder(cardDetails, product.membershipName()).done(function (data) {
                                if (eb_membershipApplication.orderConfirmationUrl) {
                                    window.location.assign(eb_membershipApplication.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id) + "&" + "membershipSuccess=0");
                                }
                                else {
                                    console.error("Order Confirmation URL is required.");
                                }
                            }).fail(function (xhr, textStatus, errorThrow) {
                                _that.showLoader(0);
                                cardInfo.showError(1)
                                if (xhr && typeof xhr.responseJSON !== 'undefined')
                                    cardInfo.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_membershipApplication));
                                else
                                    _that.errorMessage("Your membership application is not submitted.");
                            });
                        }
                    });
                    if (isApplicationSelected) {
                        _that.selectMembershipError(1);
                        _that.showLoader(0);
                        console.log('Error while selecting the application');
                    }
                } else {
                    console.log('Enter Amount');
                }
            }).fail(function (xhr, textStatus, errorThrow) {
                _that.showLoader(0);
                _that.showError(1);
                _that.errorMessage("Failed to update profile page.");
            });
        } else {
            _that.errors.showAllMessages();
        }
    };

    /* Pay by New Card function */
    _that.payByACHCard = function (cardInfo) {
        if (_that.errors().length === 0) {
            _that.updateProfileChanges().done(function () {
                var cardDetails = {
                    accountNumber: cardInfo.ACHAccountNumber(),
                    accountName: cardInfo.ACHAccountName(),
                    bank: cardInfo.ACHBankName(),
                    aba: cardInfo.ACHRoutingNumber(),
                    saveForFutureUse: cardInfo.ACHsaveForFutureUse()
                };
                var isApplicationSelected = true;
                _that.showLoader(1);
                var appSelected = ko.utils.arrayFirst(_that.membershipOrders(), function (product) {
                    if (product.checkedMember() === true) {
                        isApplicationSelected = false;
                        var serviceURL = eb_membershipApplication.serviceUrls['Pay By ACH new card'];
                        _that.showLoader(1);
                        eb_Config.retrieveCSRFTokens().always(function (headers) {
                            eBusinessJQObject.ajax({
                                url: serviceURL,
                                type: "POST",
                                data: cardDetails,
                                xhrFields: {
                                    withCredentials: true
                                },
                                headers: headers
                            }).done(function (data) {
                                _that.showLoader(0);
                                if (eb_membershipApplication.orderConfirmationUrl) {
                                    window.location.assign(eb_membershipApplication.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id));
                                }
                                else {
                                    console.error("Order Confirmation URL is required.");
                                }
                            }).fail(function (xhr, msg, data) {
                                _that.showLoader(0);
                                _that.showError(1)
                                if (xhr && typeof xhr.responseJSON !== 'undefined') {
                                    cardInfo.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_membershipApplication));
                                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_membershipApplication));
                                }
                                else
                                    _that.errorMessage("Your membership application is not submitted.");
                            });
                        });
                    }
                });
                if (isApplicationSelected) {
                    _that.selectMembershipError(1);
                    _that.showLoader(0);
                    console.log('Error while selecting the application');
                }
            }).fail(function (xhr, textStatus, errorThrow) {
                _that.showLoader(0);
                _that.showError(1);
                _that.errorMessage("Failed to update profile page.");
            });
        } else {
            _that.errors.showAllMessages();
        }
    };

    /*Pay by Bluepay HPP*/
    _that.payByBluepayHPP = function () {

        if (_that.errors().length === 0) {
            _that.updateProfileChanges().done(function () {
                var postData = {

                };
                var isApplicationSelected = true;
                _that.showLoader(1);
                var appSelected = ko.utils.arrayFirst(_that.membershipOrders(), function (product) {
                    if (product.checkedMember() === true) {
                        isApplicationSelected = false;

                        //hit service and fetch Bluepay HPP URL
                        var serviceURL = eb_membershipApplication.serviceUrls['Pay By Bluepay HPP'];

                        _that.showLoader(1);

                        eb_Config.retrieveCSRFTokens().always(function (headers) {
                            eBusinessJQObject.ajax({
                                url: serviceURL,
                                type: "POST",
                                data: "",
                                xhrFields: {
                                    withCredentials: true
                                },
                                headers: headers
                            }).done(function (data) {
                                _that.showLoader(0);
                                _that.paymentControl.bluePayURL(data.outputPaymentURL);
                                //eBusinessJQObject(_that.domElement).find("#eb-BluePay").modal({
                                //    backdrop: 'static',
                                //    keyboard: false
                                //}).toggle();
                                /*Bootstrap5.3 Modal Code Change Start*/
                                var bluepayModal = document.getElementById("eb-BluePay");
                                new bootstrap.Modal(bluepayModal, ({
                                    backdrop: 'static',
                                    keyboard: false
                                })).show();
                                /*Bootstrap5.3 Modal Code Change End*/
                            }).fail(function (xhr, msg, data) {
                                _that.showLoader(0);
                                _that.showError(1);
                            });
                        });
                    }
                });
                if (isApplicationSelected) {
                    _that.selectMembershipError(1);
                    _that.showLoader(0);
                    console.log('Error while selecting the application');
                }
            }).fail(function (xhr, textStatus, errorThrow) {
                _that.showLoader(0);
                _that.showError(1);
                _that.errorMessage("Failed to update profile page.");
            });
        } else {
            _that.errors.showAllMessages();
        }
    };

    /*Pay by iFrane Tokenizer*/
    _that.payByiFrameTokenizer = function (cardInfo) {
        if (_that.errors().length === 0) {
            _that.updateProfileChanges().done(function () {
                _that.selectMembershipError(0);
                var isApplicationSelected = true;
                _that.showSuccess(0);
                if (_that.amount() !== '' || _that.amount() > 0) {

                    eb_tokenizer.loadTokenizerModal().done(function (data) {
                        var token = data.message;
                        var expiryDate = data.expiry;
                        var saveForFutureUse = data.saveForFutureUse;
                        var cardDetails;
                       
                        if (data.isACH) {
                            cardDetails = {
                                accountNumber: data.token,
                                accountName: data.accName,
                                bank: data.bank,
                                saveForFutureUse: saveForFutureUse
                            }
                            _that.showLoader(1);
                            var appSelected = ko.utils.arrayFirst(_that.membershipOrders(), function (product) {
                                if (product.checkedMember() === true) {
                                    isApplicationSelected = false;
                                    var serviceURL = eb_membershipApplication.serviceUrls['Pay By ACH Tokenizer new card'];
                                    _that.showLoader(1);
                                    eb_Config.retrieveCSRFTokens().always(function (headers) {
                                        eBusinessJQObject.ajax({
                                            url: serviceURL,
                                            type: "POST",
                                            data: cardDetails,
                                            xhrFields: {
                                                withCredentials: true
                                            },
                                            headers: headers
                                        }).done(function (data) {
                                            _that.showLoader(0);
                                            if (eb_membershipApplication.orderConfirmationUrl) {
                                                window.location.assign(eb_membershipApplication.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id));
                                            }
                                            else {
                                                console.error("Order Confirmation URL is required.");
                                            }
                                        }).fail(function (xhr, msg, data) {
                                            _that.showLoader(0);
                                            _that.showError(1)
                                            if (xhr && typeof xhr.responseJSON !== 'undefined') {
                                                cardInfo.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_membershipApplication));
                                                _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_membershipApplication));
                                            }
                                            else
                                                _that.errorMessage("Your membership application is not submitted.");
                                        });
                                    });
                                }
                            });

                        }
                        else {
                            /*Card details */
                            cardDetails = {
                                cardNumber: token,
                                expirationMonth: expiryDate.slice(4),
                                expirationYear: expiryDate.slice(0, 4),
                                saveForFutureUse: saveForFutureUse || false
                            };
                            cardDetails.amount = _that.amount();
                            cardDetails.isCreditCard = true;

                            /*Selected member product*/
                            var appSelected = ko.utils.arrayFirst(_that.membershipOrders(), function (product) {
                                if (product.checkedMember() === true) {
                                    isApplicationSelected = false;
                                    cardDetails.productId = product.id();
                                    _that.showLoader(1);
                                    /*calling appPlaceOrder function*/
                                    _that.appPlaceOrder(cardDetails, product.membershipName()).done(function (data) {
                                        if (eb_membershipApplication.orderConfirmationUrl) {
                                            window.location.assign(eb_membershipApplication.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id) + "&" + "membershipSuccess=0");
                                        }
                                        else {
                                            console.error("Order Confirmation URL is required.");
                                        }
                                    }).fail(function (xhr, textStatus, errorThrow) {
                                        _that.showLoader(0);
                                        cardInfo.showError(1)
                                        if (xhr && typeof xhr.responseJSON !== 'undefined')
                                            cardInfo.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_membershipApplication));
                                        else
                                            _that.errorMessage("Your membership application is not submitted.");
                                    }).always(function () {
                                    });
                                }
                            });
                        }
                        if (isApplicationSelected) {
                            _that.selectMembershipError(1);
                            _that.showLoader(0);
                            console.log('Error while selecting the application');
                        }
                    }
                    ).fail(function (data, msg, jhr) {
                        console.log(msg);
                    });

                } else {
                    console.log('Enter Amount');
                }
            }).fail(function (xhr, textStatus, errorThrow) {
                _that.showLoader(0);
                _that.showError(1);
                _that.errorMessage("Failed to update profile page.");
            });
        } else {
            _that.errors.showAllMessages();
        }
    };

    /*Checks if all page specific conditions are satisfied before proceeding for payment using Google Pay.*/
    _that.isValidPayment = function () {
        if (_that.errors().length === 0) {
            var isApplicationSelected = false;
                var appSelected = ko.utils.arrayFirst(_that.membershipOrders(), function (product) {
                    if (product.checkedMember() === true) {
                        isApplicationSelected = true;
                        if (_that.amount() !== '' || _that.amount() > 0) {
                            return true;
                        }
                        return false;
                    }
                    return false;
                });

                if (!isApplicationSelected) {
                    _that.selectMembershipError(1);
                    _that.showLoader(0);
                    console.log('Error while selecting the application');
                }
            }

        else {
            _that.errors.showAllMessages();
        }
        return appSelected;
    }

    _that.tokenizeGPayData = function (gPayTokenData) {
        var defer = eBusinessJQObject.Deferred();

        var serviceURL = eb_membershipApplication.serviceUrls['Tokenize'];
        var postData = {
            "encryptionhandler": "EC_GOOGLE_PAY",
            "devicedata": gPayTokenData,
            "CurrencyTypeId": eb_shoppingCart.live.currencyTypeId()
        };

        _that.showLoader(1);

        eb_Config.retrieveCSRFTokens().always(function (headers) {
            eBusinessJQObject.ajax({
                url: serviceURL,
                type: "POST",
                data: postData,
                xhrFields: {
                    withCredentials: true
                },
                headers: headers
            }).done(function (data) {
                defer.resolve(data.outputToken);
            }).fail(function (xhr, msg, data) {
                defer.reject(msg);
                _that.showLoader(0);
                _that.showError(1);
                if (xhr && typeof xhr.responseJSON !== 'undefined')
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_membershipApplication));
                else
                    _that.errorMessage(eb_membershipApplication.defaultErrorMessage);
            }).always(function () {
            });
        });
        return defer.promise();

    }

    /*Payment by GPay*/
    _that.payByGPay = function (cardInfo) {
        if (_that.errors().length === 0) {
            _that.updateProfileChanges().done(function () {
                _that.selectMembershipError(0);
                var isApplicationSelected = true;
                _that.showSuccess(0);

                    var token = cardInfo;
                    _that.showLoader(1);

                    eb_Config.retrieveCSRFTokens().always(function (headers) {

                        _that.tokenizeGPayData(token).done(function (cpToken) {

                            var cardDetails = {
                                cardNumber: cpToken,
                                amount: _that.amount(),
                                saveForFutureUse: false,
                                isGPay: true
                            };

                    /*Selected member product*/
                    var appSelected = ko.utils.arrayFirst(_that.membershipOrders(), function (product) {
                        if (product.checkedMember() === true) {
                            isApplicationSelected = false;
                            cardDetails.productId = product.id();
                            /*calling appPlaceOrder function*/
                            _that.appPlaceOrder(cardDetails, product.membershipName()).done(function (data) {
                                if (eb_membershipApplication.orderConfirmationUrl) {
                                    window.location.assign(eb_membershipApplication.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id) + "&" + "membershipSuccess=0");
                                }
                                else {
                                    console.error("Order Confirmation URL is required.");
                                }
                            }).fail(function (xhr, textStatus, errorThrow) {
                                _that.showLoader(0);
                                _that.showError(1);
                                if (xhr && typeof xhr.responseJSON !== 'undefined')
                                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_membershipApplication));
                                else
                                    _that.errorMessage("Your membership application is not submitted.");
                            });
                        }
                    });
                        });
                    });
                    
            }).fail(function (xhr, textStatus, errorThrow) {
                _that.showLoader(0);
                _that.showError(1);
                _that.errorMessage("Failed to update profile page.");
            });
        } else {
            _that.errors.showAllMessages();
        }
    };

    ko.computed(function () {
        gPayPriceSettings.totalPrice = _that.amount();
        applePayPriceSettings.totalPrice = _that.amount();
    });

    _that.tokenizeApplePayData = function (applePayTokenData) {
        var defer = eBusinessJQObject.Deferred();

        var serviceURL = eb_membershipApplication.serviceUrls['Tokenize Apple Pay'];
        var postData = {
            "encryptionhandler": "EC_APPLE_PAY",
            "devicedata": applePayTokenData,
            "CurrencyTypeId": eb_shoppingCart.live.currencyTypeId()
        };

        _that.showLoader(1);

        eb_Config.retrieveCSRFTokens().always(function (headers) {
            eBusinessJQObject.ajax({
                url: serviceURL,
                type: "POST",
                data: postData,
                xhrFields: {
                    withCredentials: true
                },
                headers: headers
            }).done(function (data) {
                defer.resolve(data.outputToken);
            }).fail(function (xhr, msg, data) {
                defer.reject(msg);
                _that.showLoader(0);
                _that.showError(1);
                if (xhr && typeof xhr.responseJSON !== 'undefined')
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_membershipApplication));
                else
                    _that.errorMessage(eb_membershipApplication.defaultErrorMessage);
            }).always(function () {
            });
        });
        return defer.promise();

    }

    /*Payment by Apple Pay*/
    _that.payByApplePay = function (cardInfo) {
        if (_that.errors().length === 0) {
            _that.updateProfileChanges().done(function () {
                _that.selectMembershipError(0);
                var isApplicationSelected = true;
                _that.showSuccess(0);

                var token = cardInfo;
                _that.showLoader(1);

                eb_Config.retrieveCSRFTokens().always(function (headers) {
                    _that.tokenizeApplePayData(token).done(function (cpToken) {
                        var cardDetails = {
                            cardNumber: cpToken,
                            amount: _that.amount(),
                            saveForFutureUse: false,
                            isApplePay: true
                        };

                        /*Selected member product*/
                        var appSelected = ko.utils.arrayFirst(_that.membershipOrders(), function (product) {
                            if (product.checkedMember() === true) {
                                isApplicationSelected = false;
                                cardDetails.productId = product.id();
                                /*calling appPlaceOrder function*/
                                _that.appPlaceOrder(cardDetails, product.membershipName()).done(function (data) {
                                    if (eb_membershipApplication.orderConfirmationUrl) {
                                        window.location.assign(eb_membershipApplication.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id) + "&" + "membershipSuccess=0");
                                    }
                                    else {
                                        console.error("Order Confirmation URL is required.");
                                    }
                                }).fail(function (xhr, textStatus, errorThrow) {
                                    _that.showLoader(0);
                                    _that.showError(1);
                                    if (xhr && typeof xhr.responseJSON !== 'undefined')
                                        _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_membershipApplication));
                                    else
                                        _that.errorMessage("Your membership application is not submitted.");
                                });
                            }
                        });
                });
                });

            }).fail(function (xhr, textStatus, errorThrow) {
                _that.showLoader(0);
                _that.showError(1);
                _that.errorMessage("Failed to update profile page.");
            });
        } else {
            _that.errors.showAllMessages();
        }
    };

    _that.bluepayHPPPostResponseUrl = eb_membershipApplication.ServicePath + 'MembershipApplication/Checkout/ProcessRemoteResponse';

    _that.handleBluepayHPPPostResponseSuccess = function (data) {
        /*eBusinessJQObject(_that.domElement).find("#eb-BluePay").modal("hide");*/
        /*Bootstrap5.3 Modal Code Change Start*/
        var bluepayModal = bootstrap.Modal.getOrCreateInstance('#eb-BluePay');
        bluepayModal.hide();
        /*Bootstrap5.3 Modal Code Change End*/
        _that.showLoader(0);

        if (eb_membershipApplication.orderConfirmationUrl) {
            window.location.assign(eb_membershipApplication.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.OrderId));
        }
        else {
            console.error("Order Confirmation URL is required.");
        }

    };

    _that.handleBluepayHPPPostResponseFailure = function (xhr, msg, data) {
        /*eBusinessJQObject(_that.domElement).find("#eb-BluePay").modal("hide");*/
        /*Bootstrap5.3 Modal Code Change Start*/
        var bluepayModal = bootstrap.Modal.getOrCreateInstance('#eb-BluePay');
        bluepayModal.hide();
        /*Bootstrap5.3 Modal Code Change End*/
        _that.showLoader(0);

        _that.showError(1);
        if (xhr && typeof xhr.responseJSON !== 'undefined')
            _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_membershipApplication));
        else
            _that.errorMessage("Your membership application is not submitted.");
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
                        _that.showLoader(0);
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
        var deferred = eBusinessJQObject.Deferred();
        if (_that.personID() > 0) {
            if (_that.validatePhoneNumber()) {
                updatePerson = {
                    prefix: _that.selectedPrefix(),
                    firstName: _that.firstName(),
                    lastName: _that.lastName(),
                    suffix: _that.selectedSuffix(),
                    title: _that.title(),
                    companyName: _that.companyName(),

                    /*email data*/
                    primaryEmail: _that.emailTypeOptions()[0].email(),
                    secondaryEmail: _that.emailTypeOptions()[1].email(),
                    tertiaryEmail: _that.emailTypeOptions()[2].email(),

                    birthday: _that.birthday(),
                    gender: _that.selectedGender()
                };

                if (_that.errors().length === 0) {
                    _that.showSuccess(0);
                    _that.showError(0);
                    /*Person update service call*/
                    eb_membershipApplication.updatePersonData(updatePerson, _that.personID())
                        .done(function (data) {

                            /*User context object method which load user data and save in local storage cache*/
                            var dataOut = { FirstName: _that.firstName(), LastName: _that.lastName() };
                            var fields = ['FirstName', 'LastName'];

                            _that.userContext.Load(dataOut);
                            _that.userContext.saveUpdateCache(fields, dataOut);

                            /*Update Phone Numbers information. */
                            var count = 0;
                            ko.utils.arrayForEach(_that.phoneTypeOptions(), function (phone) {
                                count = count + 1;
                                if (phone.isPhoneUpdated() === 1) {
                                    count = 0;
                                    var phoneData = {
                                        countryCode: phone.countryCode(),
                                        areaCode: phone.areaCode(),
                                        phone: phone.phone(),
                                        phoneExtension: phone.phoneExtension()
                                    }
                                    if (phone.isPersonPhone()) {
                                        /*If it is person phones, then this will call*/
                                        eb_membershipApplication.updatePersonPhoneNumbersData(phoneData, _that.personID(), phone.phoneName())
                                            .done(function (phoneData) {
                                                phone.phoneRequired(0);
                                                deferred.resolve(phoneData);
                                            })
                                            .fail(function (xhr, textStatus, errorThrow) {
                                                deferred.reject(xhr, textStatus, errorThrow);
                                                phone.phoneRequired(0);
                                                _that.showError(1);
                                                _that.errorMessage(eb_membershipApplication.errorMessages['Profile save failed']);
                                            });

                                    } else {
                                        /*If it is profile phones, then this will call */
                                        eb_membershipApplication.updateProfilePhoneNumbersData(phoneData, _that.personID(), phone.phoneName())
                                            .done(function (phoneData) {
                                                phone.phoneRequired(0);
                                                deferred.resolve(phoneData);
                                            })
                                            .fail(function (xhr, textStatus, errorThrow) {
                                                deferred.reject(xhr, textStatus, errorThrow);
                                                phone.phoneRequired(0);
                                                _that.showError(1);
                                                _that.errorMessage(eb_membershipApplication.errorMessages['Profile save failed']);
                                            });
                                    }
                                }
                            });
                            if (count === _that.phoneTypeOptions().length) {
                                deferred.resolve();
                            }
                        }).fail(function (xhr, textStatus, errorThrow) {
                            _that.showError(1);
                            _that.showLoader(0);
                            _that.errorMessage(eb_membershipApplication.errorMessages['Profile save failed']);
                        });
                } else {
                    _that.errors.showAllMessages();
                }
            }
            return deferred.promise();
        }
    };
};

/*If image is not there, then attach No Photo Image*/
ko.bindingHandlers.imageSrc = {
    update: function (element, valueAccessor) {
        var options = valueAccessor();
        var src = ko.unwrap(options.src);
        eBusinessJQObject('<img />').attr('src', src).on('load', function () {
            eBusinessJQObject(element).attr('src', src);
        }).on('error', function () {
            eBusinessJQObject(element).attr('src', eb_membershipApplication.defaultImage);
        });
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

/**
 * Page DOM element.
 * @method eb_membershipApplication.domElement
 * @param {object} domElement current DOM element.
 * */
eb_membershipApplication.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_membershipApplication.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_membershipApplication);
});