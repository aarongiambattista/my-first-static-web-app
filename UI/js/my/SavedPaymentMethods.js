/**
 * Define eb_savedPayments class.
 * @class eb_savedPayments
 * */
var eb_savedPayments = eb_savedPayments || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_savedPayments.SitePath
 * @type {String}
 * */
eb_savedPayments.SitePath = eb_Config.SitePath;

/**
 * Template path.
 * @property eb_savedPayments.TemplatePath
 * @type {String}
 * */
eb_savedPayments.TemplatePath = "html/my/SavedPaymentMethods.html";

/**
 * Service path.
 * It would be set from configuration file.
 * @property eb_savedPayments.ServicePath
 * @type {String}
 * */
eb_savedPayments.ServicePath = eb_Config.ServicePathV1;

/**
 * GET service to get all SPM records.
 * @property eb_savedPayments.getService
 * @type {String}
 * */
eb_savedPayments.getService = eb_savedPayments.ServicePath + "ProfilePersons/{personId}/SavedPaymentMethods/CreditCard";

/**
 * PATCH service call to update specific SPM record.
 * @property eb_savedPayments.updateService
 * @type {String}
 * */
eb_savedPayments.updateService = eb_savedPayments.ServicePath + "ProfilePersons/{personId}/SavedPaymentMethods/CreditCard/{cardId}";

/**
 * GET service to get all SPM ACH records.
 * @property eb_savedPayments.getACHService
 * @type {String}
 * */
eb_savedPayments.getACHService = eb_savedPayments.ServicePath + "ProfilePersons/{personId}/SavedPaymentMethods/ACH";

/**
 * PATCH service call to update specific SPM ACH record.
 * @property eb_savedPayments.updateACHService
 * @type {String}
 * */
eb_savedPayments.updateACHService = eb_savedPayments.ServicePath + "ProfilePersons/{personId}/SavedPaymentMethods/ACH/{cardId}";

/**
 * DELETE service call to delete specific SPM record.
 * @property eb_savedPayments.deleteService
 * @type {String}
 * */
eb_savedPayments.deleteService = eb_savedPayments.ServicePath + "ProfilePersons/{personId}/SavedPaymentMethods/{cardId}";

/**
 * POST service call to create new SPM record.
 * @property eb_savedPayments.createService
 * @type {String}
 * */
eb_savedPayments.createService = eb_savedPayments.ServicePath + "ProfilePersons/{personId}/SavedPaymentMethods/CreditCard";

/**
 * POST service call to create new ACH SPM record.
 * @property eb_savedPayments.createACHSPMService
 * @type {string}
 * */
eb_savedPayments.createACHSPMService = eb_savedPayments.ServicePath + "ProfilePersons/{personId}/SavedPaymentMethods/ACH";

/**
 * POST service call to create new ACH Tokenizer SPM record.
 * @property eb_savedPayments.createACHTokenizerSPMService
 * @type {string}
 * */
eb_savedPayments.createACHTokenizerSPMService = eb_savedPayments.ServicePath + "ProfilePersons/{personId}/SavedPaymentMethods/ACHTokenizer";

/**
 * POST service call to create SPM by remote hosted payment method.
 * @property eb_savedPayments.createServiceBluepayHPP
 * @type {string}
 * */
eb_savedPayments.createServiceBluepayHPP = eb_savedPayments.ServicePath + "ProfilePersons/{personId}/SavedPaymentMethods/GetRemotePaymentRequest";

/**
 * GET service to get all valid payment types.
 * @property eb_savedPayments.getValidPaymentTypes
 * @type {String}
 */
eb_savedPayments.getValidPaymentURL = eb_savedPayments.ServicePath + "ProfilePersons/{personId}/ValidPayments";

/* Error messages */
eb_savedPayments.errorMessages = {
    'Add card failed': 'Unable to add card. Please check card details which are provided or try again.',
    'Update card failed': 'There was a problem to update card.',
    'Delete card failed': 'There was a problem to delete card.',
    'Invalid card': 'Sorry, this card is invalid. Please enter a valid Credit Card number.',
    'Expired card': 'Your Card is Expired.',
    'Wrong date': 'Please enter the correct month and year.'
};

/* Success Responses */
eb_savedPayments.successResponses = {
    'Card saved': 'Your Credit Card details saved successfully.',
    'Card updated': 'Your Credit Card details updated successfully.',
    'Card deleted': 'Your Credit Card details has been deleted successfully.',
    'ACH Card saved': 'Your ACH Card details saved successfully.',
    'ACH Card updated': 'Your ACH Card details updated successfully.',
    'ACH Card deleted': 'Your ACH Card details has been deleted successfully.'
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
 * @property eb_savedPayments.errorResponses
 * @type {Object}
 * */
eb_savedPayments.errorResponses = {
    203: { useServerMessage: true }
};

/**
 * Default error message.
 * @property eb_savedPayments.defaultErrorMessage
 * @type {String}
 * */
eb_savedPayments.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';


/**
 * The service will return saved payments HTML.
 * @method eb_savedPayments.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Saved payments template URL.
 * @return {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_savedPayments.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            var finalPath = eb_savedPayments.SitePath + eb_savedPayments.TemplatePath;
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

/**
 * GET service call method.
 * @method eb_savedPayments.getAllRecords
 * @param {String} personId Person ID.
 * @return {Object} jQuery promise object which when resolved returns list of SPM records.
 */
eb_savedPayments.getAllRecords = function (personId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!personId || personId <= 0) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    eBusinessJQObject.get({

        url: eb_savedPayments.getService.replace("{personId}", personId),
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
 * PATCH service call method.
 * @method eb_savedPayments.updateRecord
 * @param {Object} data Card details.
 * @param {String} personId Person ID.
 * @param {String} cardId Card ID.
 * @return {Object} jQuery promise object which when resolved returns updated SPM record.
 */
eb_savedPayments.updateRecord = function (data, personId, cardId) {
    var defer = eBusinessJQObject.Deferred();
    console.info('update Credit Cards...');
    if (!data) {
        throw { type: "argument_null", message: "data field is required.", stack: Error().stack };
    }
    if (!personId || personId <= 0) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    if (!cardId || cardId <= 0) {
        throw { type: "argument_null", message: "cardId property is required.", stack: Error().stack };
    }

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_savedPayments.updateService.replace("{personId}", personId).replace("{cardId}", cardId),
            crossDomain: true,
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
 * GET service call method.
 * @method eb_savedPayments.getAllACHRecords
 * @param {String} personId Person ID.
 * @return {Object} jQuery promise object which when resolved returns list of SPM ACH records.
 */
eb_savedPayments.getAllACHRecords = function (personId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!personId || personId <= 0) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    eBusinessJQObject.get({

        url: eb_savedPayments.getACHService.replace("{personId}", personId),
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
 * PATCH service call method.
 * @method eb_savedPayments.updateACHCardRecord
 * @param {Object} data Card collection details.
 * @param {String} personId Person ID.
 * @param {String} cardId Card ID.
 * @return {Object} jQuery promise object which when resolved returns updated SPM ACH record.
 */
eb_savedPayments.updateACHCardRecord = function (data, personId, cardId) {
    var defer = eBusinessJQObject.Deferred();
    console.info('update ACH Cards...');
    if (!data) {
        throw { type: "argument_null", message: "data field is required.", stack: Error().stack };
    }
    if (!personId || personId <= 0) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    if (!cardId || cardId <= 0) {
        throw { type: "argument_null", message: "cardId property is required.", stack: Error().stack };
    }

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_savedPayments.updateACHService.replace("{personId}", personId).replace("{cardId}", cardId),
            crossDomain: true,
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
 * POST service call method.
 * @method eb_savedPayments.createRecord
 * @param {Object} data Card details.
 * @param {String} personId Person ID.
 * @return {Object} jQuery promise object which when resolved returns created SPM record details.
 */
eb_savedPayments.createRecord = function (data, personId) {
    var defer = eBusinessJQObject.Deferred();
    console.info('create SPM Record...');
    if (!data) {
        throw { type: "argument_null", message: "card data is required.", stack: Error().stack };
    }
    if (!personId || personId <= 0) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_savedPayments.createService.replace("{personId}", personId),
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
 * DELETE service call method.
 * @method eb_savedPayments.deleteRecord
 * @param {String} personId Person ID.
 * @param {String} cardId Card ID.
 * @return {Object} jQuery promise object.
 */
eb_savedPayments.deleteRecord = function (personId, cardId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!cardId || cardId <= 0) {
        throw { type: "argument_null", message: "card data is required.", stack: Error().stack };
    }
    if (!personId || personId <= 0) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_savedPayments.deleteService.replace("{personId}", personId).replace("{cardId}", cardId),
            type: "DELETE",
            data: cardId,
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (data) {
            deferred.resolve(data);
        }).fail(deferred.reject);
    });
    return deferred.promise();
};

/**
 * Saved Payments model responsible for saved payments operations.
 * 
 * @method eb_savedPayments.model
 * 
 * @param {any} data Saved payment data for binding if required.
 * @param {Object} domElement Login DOM element.
 * @param {Object} personId Logged-in person Id.
 * 
 * */
eb_savedPayments.model = function (data, domElement, personId, validPayments) {
    var _that = this;
    _that.domElement = domElement;
    _that.errors = ko.validation.group(_that);

    if (personId) {
        eb_savedPayments.personId = personId;
    }

    eb_savedPayments.domElement(_that.domElement);

    _that.validPayments = ko.observable(validPayments);

    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

    if (typeof data === 'undefined') {
        data = {
            showPaymentMethods: 0,
            showSavedPaymentMethods: 1,
            showAddPaymentMethod: 1,
            showError: 0,
            showSuccess: 0,
            successMessage: "",
            expirationMonthOptions: ["Month", "January (1)", "February (2)", "March (3)", "April (4)", "May (5)", "June (6)", "July (7)", "August (8)", "September (9)", "October (10)", "November (11)", "December (12)"], ccExpirationMonth: "",
            expirationYearOptions: eb_Config.expirationYearOptions,
            ccExpirationYear: ""
        };
    }

    _that.showPaymentMethods = ko.observable(data['showPaymentMethods']);
    _that.showSavedPaymentMethods = ko.observable(data['showSavedPaymentMethods']);
    _that.showAddPaymentMethod = ko.observable(data['showAddPaymentMethod']);

    _that.showLoader = ko.observable(0);
    _that.bluePayURL = ko.observable("");

    /*Cards Details*/
    _that.cardNumber = ko.observable("").extend({ number: true });
    _that.expirationMonthOptions = ko.observable(data['expirationMonthOptions']);
    _that.selectedExpirationMonth = ko.observable(data['ccExpirationMonth']);
    _that.expirationYearOptions = ko.observable(data['expirationYearOptions']);
    _that.selectedExpirationYear = ko.observable(data['ccExpiractionYear']);
    _that.CVV = ko.observable("");
    _that.showEndDateError = ko.observable(0);
    _that.errorEndDateMessage = ko.observable();

    _that.savedCreditCards = ko.observableArray();

    /*Saved Credit Card Details.*/
    _that.updateID = ko.observable();
    _that.expirationMonth = ko.observable();
    _that.btnSelect = ko.observable(0);
    _that.showInSaveCard = ko.observable(1);
    _that.cardNumberModal = ko.observable();
    _that.ccSecurityNumberModal = ko.observable();
    _that.expirationMonthOptionsModal = ko.observable(data['expirationMonthOptions']);
    _that.selectedExpirationMonthModal = ko.observable();
    _that.expirationYearOptionsModal = ko.observable(data['expirationYearOptions']);
    _that.selectedExpirationYearModal = ko.observable();
    _that.deleteRecordID = ko.observable();

    _that.showCardError = ko.observable(data.showError);
    _that.showCardErrorOnTop = ko.observable(data.showError);
    _that.cardErrorMessage = ko.observable();
    _that.showCardSuccess = ko.observable(data.showSuccess);
    _that.cardSuccessMessage = ko.observable();
    _that.cardErrorMessageOnTop = ko.observable();

    /*ACH Fields*/
    _that.ACHAccountNumber = ko.observable('');
    _that.ACHAccountNumber.extend({ required: true });
    _that.ACHAccountName = ko.observable('');
    _that.ACHAccountName.extend({ required: true });
    _that.ACHBankName = ko.observable('');
    _that.ACHBankName.extend({ required: true });
    _that.ACHRoutingNumber = ko.observable('');
    _that.ACHRoutingNumber.extend({ required: true });

    _that.validCreditCard = ko.observable();

    /*ACH Edit Model Fields*/
    _that.ACHAccountNameEdit = ko.observable();
    _that.ACHAccountNumberEdit = ko.observable();
    _that.ACHBankNameEdit = ko.observable();
    _that.ACHRoutingNumberEdit = ko.observable();

    /* On any input field focus this function will get called. Hide parent control message box also. */
    _that.hideMessages = function () { };

    /* Saved payment control visibility attributes*/
    _that.showHostedPaymentPanel = ko.observable(0);
    _that.showCreditCards = ko.observable(0);
    _that.showACHCards = ko.observable(0);
    _that.showTokenizerPaymentPanel = ko.observable(0);

    /* Render saved payment control as per valid payment type */
    _that.showSavePaymentMethodControl = function () {
        if (_that.validPayments && _that.validPayments().length) {

            for (var i = 0; i < _that.validPayments().length; i++) {


                /* Credit Card Section */
                if (_that.validPayments()[i].PaymentType === 'Credit Card' || _that.validPayments()[i].PaymentType === 'Credit Card Reference Transaction') {
                    if (!_that.showHostedPaymentPanel() && !_that.showTokenizerPaymentPanel()) {
                        _that.showCreditCards(1);
                    }
                }

                /* Hosted Payment Section */
                if (_that.validPayments()[i].PaymentType === 'Credit Card Hosted Payment Reference Transaction' && _that.validPayments()[i].IsRemote === true) {
                    _that.showCreditCards(0);
                    _that.showHostedPaymentPanel(1);
                    _that.showTokenizerPaymentPanel(0);
                }

                /*ACH Card Section*/
                if (_that.validPayments()[i].PaymentType === 'Wire Transfer') {
                    _that.showACHCards(1);
                }

                /* iFrame Tokenizer Payment Section */
                if (_that.validPayments()[i].PaymentType === 'Hosted iFrame Tokenizer') {
                    _that.showCreditCards(0);
                    _that.showHostedPaymentPanel(0);
                    _that.showTokenizerPaymentPanel(1);
                }
            }

        }
    }

    _that.showSavePaymentMethodControl();

    /*Get all records from server.*/
    _that.getAllRecordsFromServer = function () {
        return eb_savedPayments.getAllRecords(eb_savedPayments.personId);
    };

    /* Get All ACH records from server.*/
    _that.getAllACHRecordFromServer = function () {
        return eb_savedPayments.getAllACHRecords(eb_savedPayments.personId);
    };

    /*Load data in savedCreditCards property.*/
    _that.loadSavedPaymentMethodData = function (data, achData) {
        //Credit Card record
        if (data.length !== 0) {
            eBusinessJQObject.map(data, function (row) {
                _that.savedCreditCards.push(new _that.savedPaymentMethodsModel(row));
            });
        }
        //ACH record
        if (achData.length != 0) {
            eBusinessJQObject.map(achData, function (row) {
                _that.savedCreditCards.push(new _that.savedPaymentMethodsModel(row));
            });
        }
        if (data.length === 0 && achData.length === 0) {
            _that.showSavedPaymentMethods(0);
        }
    };

    /*Get SPM records from server and load in array.*/
    _that.loadSPMRecords = function () {
        var def = eBusinessJQObject.Deferred();
        _that.getAllRecordsFromServer().done(function (data) {
            _that.getAllACHRecordFromServer().done(function (achData) {
                _that.savedCreditCards.removeAll();
                _that.loadSavedPaymentMethodData(data, achData);
                def.resolve();
            }).fail(function (xhr, testStatus, errorThrow) {
                def.reject();
                _that.showSavedPaymentMethods(0);
                console.error("Failed to get all ACH card SPM records.");
            });
        }).fail(function (xhr, textStatus, errorThrow) {
            def.reject();
            _that.showSavedPaymentMethods(0);
            console.error("Failed to get all credit card SPM records.");
        });
        return def.promise();
    }

    /*Load all SPM records*/
    _that.loadSPMRecords();

    /*Load SPM data on edit Dialog.*/
    _that.loadSelectedRecordOnDailog = function (cardInfo) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var month = months[cardInfo.expirationMonth - 1] || '';
        var expirationM = month + " (" + cardInfo.expirationMonth + ")";

        _that.updateID(cardInfo.id());
        _that.cardNumberModal(cardInfo.partialNumber());
        _that.ccSecurityNumberModal(cardInfo.CCSecurityNumber);
        _that.expirationMonthOptionsModal(data['expirationMonthOptions']);
        _that.selectedExpirationMonthModal(expirationM);
        _that.expirationMonth(cardInfo.expirationMonth);
        _that.expirationYearOptionsModal(data['expirationYearOptions']);
        _that.selectedExpirationYearModal(cardInfo.expirationYear());

        _that.validCreditCard(cardInfo.validCreditCard());

        /*ACH SPM record.*/
        if (!_that.validCreditCard()) {
            _that.ACHAccountNameEdit(cardInfo.accountName());
            _that.ACHAccountNumberEdit(cardInfo.accountNumber());
            _that.ACHBankNameEdit(cardInfo.bank());
            if (cardInfo.ABA != undefined) {
                _that.ACHRoutingNumberEdit(cardInfo.ABA());
            }
            
        }
        _that.showEndDateError(0);
    };

    /*Update SPM Record.*/
    _that.editCard = function () {
        var expMonth = _that.selectedExpirationMonthModal().match(/[^()]+/g)[1];
        var expYear = _that.selectedExpirationYearModal();
        if (!isDateExpired(expMonth, expYear)) {
            _that.showEndDateError(1);
            _that.errorEndDateMessage(eb_savedPayments.errorMessages['Wrong date']);
            return false;
        }
        var dataToUpdate = {
            expirationMonth: expMonth,
            expirationYear: expYear
        };
        _that.showCardSuccess(0);
        _that.showCardError(0);
        _that.showEndDateError(0);
        _that.showCardErrorOnTop(0);

        if (dataToUpdate) {
            eb_savedPayments.updateRecord(dataToUpdate, eb_savedPayments.personId, _that.updateID())
                .done(function (data) {
                    var spmRecord = ko.utils.arrayFirst(_that.savedCreditCards(), function (spmRecord) {
                        return spmRecord.id() === data.Id;
                    });
                    if (spmRecord) {
                        spmRecord.expirationMonthYear(data["expirationMonth"] + "/" + data["expirationYear"]);
                        spmRecord.expirationYear(data["expirationYear"]);
                        spmRecord.expirationMonth = data["expirationMonth"];
                        _that.showCardSuccess(1);
                        _that.cardSuccessMessage(eb_savedPayments.successResponses['Card updated']);
                    }
                })
                .fail(function (xhr, textStatus, errorThrow) {
                    _that.showCardErrorOnTop(1);
                    _that.showCardSuccess(0);
                    if (xhr && typeof xhr.responseJSON !== 'undefined')
                        _that.cardErrorMessageOnTop(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_savedPayments));
                    else
                        _that.cardErrorMessageOnTop(eb_savedPayments.errorMessages['Update card failed']);
                });
        }
    };

    /*Update ACH card information*/
    _that.editACHCard = function () {
        var dataToUpdate = {
            accountNumber: _that.ACHAccountNumberEdit(),
            accountName: _that.ACHAccountNameEdit(),
            bank: _that.ACHBankNameEdit(),
            aba: _that.ACHRoutingNumberEdit()
        }

        _that.showCardSuccess(0);
        _that.showCardError(0);
        _that.showEndDateError(0);
        _that.showCardErrorOnTop(0);

        eb_savedPayments.updateACHCardRecord(dataToUpdate, eb_savedPayments.personId, _that.updateID()).done(function (result) {
            var spmRecord = ko.utils.arrayFirst(_that.savedCreditCards(), function (spmRecord) {
                return spmRecord.id() === result.Id;
            });
            if (spmRecord) {
                spmRecord.accountName(result.accountName);
                spmRecord.accountNumber(result.accountNumber);
                spmRecord.ABA(result.ABA);
                spmRecord.bank(result.bank);
                spmRecord.partialNumber(result.partialNumber);
                _that.showCardSuccess(1);
                _that.cardSuccessMessage(eb_savedPayments.successResponses['ACH Card updated']);
            }
        }).fail(function (xhr, textStatus, errorThrow) {
            _that.showCardErrorOnTop(1);
            _that.showCardSuccess(0);
            if (xhr && typeof xhr.responseJSON !== 'undefined')
                _that.cardErrorMessageOnTop(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_savedPayments));
            else
                _that.cardErrorMessageOnTop(eb_savedPayments.errorMessages['Update card failed']);
        });
    };

    /*Remove SPM Record.*/
    _that.removeCard = function () {
        _that.showCardSuccess(0);
        _that.showEndDateError(0);
        _that.showCardError(0);
        _that.showCardErrorOnTop(0);
        if (_that.deleteRecordID() > 0) {
            _that.showLoader(1);
            eb_savedPayments.deleteRecord(eb_savedPayments.personId, _that.deleteRecordID())
                .done(function (result) {
                    _that.showLoader(0);
                    /*Reload Card record again for new card entry.*/
                    _that.loadSPMRecords().done(function () {
                        _that.showCardSuccess(1);
                        _that.cardSuccessMessage(eb_savedPayments.successResponses['Card deleted']);
                    });
                })
                .fail(function (xhr, textStatus, errorThrow) {
                    _that.showCardError(1);
                    _that.showCardSuccess(0);
                    _that.showLoader(0);
                    if (xhr && typeof xhr.responseJSON !== 'undefined')
                        _that.cardErrorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_savedPayments));
                    else
                        _that.cardErrorMessage(eb_savedPayments.errorMessages['Delete card failed']);
                });
        }
    };

    /*Create SPM Record.*/
    _that.addRecord = function () {
        _that.showCardError(0);
        _that.showCardErrorOnTop(0);
        if (isValidCreditCard(_that.cardNumber()) && _that.errors().length === 0) {
            var month = _that.selectedExpirationMonth().match(/\d+/)[0];
            var year = _that.selectedExpirationYear();
            if (!isDateExpired(month, year)) {
                _that.showCardError(1);
                _that.cardErrorMessage(eb_savedPayments.errorMessages['Expired card']);
                return;
            }
            var dataToAdd = {
                creditCardNumber: _that.cardNumber(),
                expirationMonth: month,
                expirationYear: year,
                CVV: _that.CVV()
            };
            _that.showLoader(1);
            eb_savedPayments.createRecord(dataToAdd, eb_savedPayments.personId)
                .done(function (result) {
                    _that.showLoader(0);
                    _that.showSavedPaymentMethods(1);
                    _that.showCardSuccess(1);
                    _that.cardSuccessMessage(eb_savedPayments.successResponses['Card saved']);
                    _that.loadSPMRecords();
                    /*clear all fields after saved record.*/
                    _that.CVV('');
                    _that.cardNumber('');
                    _that.selectedExpirationMonth('Month');
                    _that.selectedExpirationYear('Year');
                })
                .fail(function (xhr, textStatus, errorThrow) {
                    _that.showLoader(0);
                    _that.showCardError(1);
                    _that.showCardSuccess(0);
                    if (xhr && typeof xhr.responseJSON !== 'undefined')
                        _that.cardErrorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_savedPayments));
                    else
                        _that.cardErrorMessage(eb_savedPayments.errorMessages['Add card failed']);
                });
        }
        else {
            _that.showLoader(0);
            _that.showCardSuccess(0);
            _that.showCardErrorOnTop(0);
            _that.showCardError(1);
            _that.errors.showAllMessages(true);
            _that.cardErrorMessage(eb_savedPayments.errorMessages['Invalid card']);
        }
    };

    /*ACH saved payment record*/
    _that.createACHSavedPaymentRecord = function (cardInfo) {
        var cardDetails = {
            accountNumber: cardInfo.ACHAccountNumber(),
            accountName: cardInfo.ACHAccountName(),
            bank: cardInfo.ACHBankName(),
            aba: cardInfo.ACHRoutingNumber()
        };

        var serviceURL = eb_savedPayments.createACHSPMService.replace("{personId}", eb_savedPayments.personId);

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
                _that.loadSPMRecords().done(function () {
                    _that.showLoader(0);
                    _that.showSavedPaymentMethods(1);
                    _that.ACHAccountNumber("");
                    _that.ACHAccountName("");
                    _that.ACHBankName("");
                    _that.ACHRoutingNumber("");
                    eBusinessJQObject(_that.domElement).find(".validationMessage").hide();
                    _that.showCardSuccess(1);
                    _that.cardSuccessMessage(eb_savedPayments.successResponses['ACH Card saved']);
                });
            }).fail(function (xhr, msg, data) {
                _that.showLoader(0);
                _that.showCardError(1);
                _that.showCardSuccess(0);
                if (xhr && typeof xhr.responseJSON !== 'undefined')
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_savedPayments));
                else
                    _that.errorMessage(eb_savedPayments.defaultErrorMessage);
            });
        });
    };

    _that.addBluepayHPPRecord = function () {
        _that.showCardError(0);
        _that.showCardErrorOnTop(0);

        //EB-1625: Expiry Month & Year control removed from UI
        //Added attribute in ebconfig for default expiration month & year, by default its set to 1 year from current date
        var month = eb_Config.bluepayHPPCreditCardExpiryMonth;
        var year = eb_Config.bluepayHPPCreditCardExpiryYear;

        var postData = {
            "expirationMonth": month,
            "expirationYear": year
        };

        //hit service and fetch Bluepay HPP URL
        var serviceURL = eb_savedPayments.createServiceBluepayHPP.replace("{personId}", personId);

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
                _that.showLoader(0);
                _that.bluePayURL(data.outputPaymentURL);
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
                _that.showCardError(1);
            });
        });

    };

    _that.addiFrameTokenizerRecord = function () {
        _that.showCardError(0);
        _that.showCardErrorOnTop(0);

        //EB-1625: Expiry Month & Year control removed from UI
        //Added attribute in ebconfig for default expiration month & year, by default its set to 1 year from current date
        var month = eb_Config.bluepayHPPCreditCardExpiryMonth;
        var year = eb_Config.bluepayHPPCreditCardExpiryYear;

        var postData = {
            "expirationMonth": month,
            "expirationYear": year
        };

        //hit service and fetch Bluepay HPP URL
        var serviceURL = eb_savedPayments.createServiceBluepayHPP.replace("{personId}", personId);


        eb_tokenizer.loadTokenizerModal().done(function (data) {
            var token = data.message;
            var expiryDate = data.expiry;
            var saveForFutureUse = data.saveForFutureUse;
            if (data.isACH) {
                cardDetails = {
                    accountNumber: data.token,
                    accountName: data.accName,
                    bank: data.bank,
                    saveForFutureUse: saveForFutureUse
                }
                var serviceURL = eb_savedPayments.createACHTokenizerSPMService.replace("{personId}", eb_savedPayments.personId);
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
                        _that.loadSPMRecords().done(function () {
                            _that.showLoader(0);
                            _that.showSavedPaymentMethods(1);
                            _that.ACHAccountNumber("");
                            _that.ACHAccountName("");
                            _that.ACHBankName("");
                            _that.ACHRoutingNumber("");
                            eBusinessJQObject(_that.domElement).find(".validationMessage").hide();
                            _that.showCardSuccess(1);
                            _that.cardSuccessMessage(eb_savedPayments.successResponses['ACH Card saved']);
                        });
                    }).fail(function (xhr, msg, data) {
                        _that.showLoader(0);
                        _that.showCardError(1);
                        _that.showCardSuccess(0);
                        if (xhr && typeof xhr.responseJSON !== 'undefined')
                            _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_savedPayments));
                        else
                            _that.errorMessage(eb_savedPayments.defaultErrorMessage);
                    });
                });
            }
            else {
                var dataToAdd = {
                    creditCardNumber: token,
                    expirationMonth: expiryDate.slice(4),
                    expirationYear: expiryDate.slice(0, 4)
                };
                _that.showLoader(1);
                eb_savedPayments.createRecord(dataToAdd, eb_savedPayments.personId)
                    .done(function (result) {
                        _that.showLoader(0);
                        _that.showSavedPaymentMethods(1);
                        _that.showCardSuccess(1);
                        _that.cardSuccessMessage(eb_savedPayments.successResponses['Card saved']);
                        _that.loadSPMRecords();
                        /*clear all fields after saved record.*/
                        _that.CVV('');
                        _that.cardNumber('');
                        _that.selectedExpirationMonth('Month');
                        _that.selectedExpirationYear('Year');
                    })
                    .fail(function (xhr, textStatus, errorThrow) {
                        _that.showLoader(0);
                        _that.showCardError(1);
                        _that.showCardSuccess(0);
                        if (xhr && typeof xhr.responseJSON !== 'undefined')
                            _that.cardErrorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_savedPayments));
                        else
                            _that.cardErrorMessage(eb_savedPayments.errorMessages['Add card failed']);
                    }).always(function () {
                    });
            } 
        }
        ).fail(function (data, msg, jhr) {
            console.log(msg);
        });

    };

    _that.bluepayHPPPostResponseUrl = eb_savedPayments.ServicePath + 'ProfilePersons/{personId}/SavedPaymentMethods/ProcessRemoteResponse'.replace("{personId}", personId);

    _that.handleBluepayHPPPostResponseSuccess = function (data) {
        _that.showLoader(0);
        /*eBusinessJQObject(_that.domElement).find("#eb-BluePay").modal("hide");*/
        /*Bootstrap5.3 Modal Code Change Start*/
        var bluepayModal = bootstrap.Modal.getOrCreateInstance('#eb-BluePay');
        bluepayModal.hide();
        /*Bootstrap5.3 Modal Code Change End*/

        _that.showSavedPaymentMethods(1);
        _that.showCardSuccess(1);
        _that.cardSuccessMessage(eb_savedPayments.successResponses['Card saved']);
        _that.loadSPMRecords();

    };

    _that.handleBluepayHPPPostResponseFailure = function (xhr, msg, data) {
        _that.showLoader(0);
        /*eBusinessJQObject(_that.domElement).find("#eb-BluePay").modal("hide");*/
        /*Bootstrap5.3 Modal Code Change Start*/
        var bluepayModal = bootstrap.Modal.getOrCreateInstance('#eb-BluePay');
        bluepayModal.hide();
        /*Bootstrap5.3 Modal Code Change End*/
        _that.showCardError(1);
        _that.showCardSuccess(0);
        if (xhr && typeof xhr.responseJSON !== 'undefined')
            _that.cardErrorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_savedPayments));
        else
            _that.cardErrorMessage(eb_savedPayments.errorMessages['Add card failed']);
    };

    /*Validate Date is expired or not.*/
    function isDateExpired(month, year) {
        _that.showCardError(0);
        _that.showCardErrorOnTop(0);
        if (month !== "" && year !== "") {
            var currentTime = new Date();
            var currentmonth = currentTime.getMonth() + 1;
            var currentyear = currentTime.getFullYear();
            var selectedYear = year;
            var selectedMonth = month;
            return selectedYear > currentyear || selectedYear === currentyear && selectedMonth >= currentmonth;
        }
        else {
            _that.showCardError(1);
            _that.cardErrorMessage(eb_savedPayments.errorMessages['Invalid card']);
        }
    }

    /*Check card is valid or not.*/
    function isValidCreditCard(value) {
        /* accept only digits, dashes or spaces */
        if (/[^0-9-\s]+/.test(value)) return false;

        /* The Luhn Algorithm. It's so pretty. */
        var nCheck = 0, nDigit = 0, bEven = false;
        value = value.replace(/\D/g, "");

        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n);
            nDigit = parseInt(cDigit, 10);

            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }

            nCheck += nDigit;
            bEven = !bEven;
        }

        return nCheck % 10 === 0;
    }

    /*Event binding to check whether the updated month and year is appropriate or not*/
    _that.checkValidMonthYear = function (data, event) {
        var month = data.selectedExpirationMonthModal().match(/[^()]+/g)[1];
        var year = data.selectedExpirationYearModal();
        if (!isDateExpired(month, year)) {
            _that.showEndDateError(1);
            _that.errorEndDateMessage(eb_savedPayments.errorMessages['Wrong date']);
            return false;
        }
        _that.showEndDateError(0);
    };


    /*savedPaymentMethodsModel used to load data in savedCreditCards observable array property.*/
    _that.savedPaymentMethodsModel = function (data) {
        var self = this;
        var subString;
        if (data["partialNumber"]) {
            /*To get the last 4 digit of card*/
            subString = data["partialNumber"].slice(-4);
        }

        self.expirationMonthYear = ko.observable();
        self.expirationMonth = data["expirationMonth"];
        self.expirationYear = ko.observable();
        self.validCreditCard = ko.observable();

        if (data["expirationMonth"] && data["expirationYear"]) {
            self.expirationMonthYear(data["expirationMonth"] + "/" + data["expirationYear"]);
            self.expirationYear(data["expirationYear"]);
        }

        if (data["partialNumber"]) {
            self.partialNumber = ko.observable(data["partialNumber"]);
        }

        if (data["paymentType"].trim().toLowerCase() === "ach" || data["paymentType"].trim().toLowerCase() === "ach hosted") {
            self.cardName = ko.observable("Bank Account (" + data["paymentType"].trim() + ")")
            self.validCreditCard(0);
        } else {
            self.cardName = ko.observable(data["paymentType"]);
            self.validCreditCard(1);
        }

        self.paymentType = ko.observable(data["paymentType"].trim());
        self.id = ko.observable(data["Id"]);
        self.cardLastDigits = subString;

        if (data["CCSecurityNumber"]) {
            self.CCSecurityNumber = data["CCSecurityNumber"];
        }
        if (data["accountNumber"]) {
            self.accountNumber = ko.observable(data["accountNumber"]);
        }
        if (data["accountName"]) {
            self.accountName = ko.observable(data["accountName"]);
        }
        if (data["bank"]) {
            self.bank = ko.observable(data["bank"]);
        }
        if (data["ABA"]) {
            self.ABA = ko.observable(data["ABA"]);
        }
    };

    /*show delete card info dialog.*/
    _that.deleteCardDialog = function (cardInfo) {
        _that.deleteRecordID(cardInfo.id());
    };

    /*show edit card dialog with card details.*/
    _that.showEditDialog = function (cardInfo) {
        _that.showCardSuccess(0);
        _that.showCardError(0);
        _that.showEndDateError(0);
        _that.showCardErrorOnTop(0);
        _that.loadSelectedRecordOnDailog(cardInfo);
    };

    /*Toggle button to expand/collapse SPM form.*/
    _that.toggleShowSavedPaymentMethods = function () {
        _that.showSavedPaymentMethods(!_that.showSavedPaymentMethods());
    };

    /*Toggle button to expand/collapse add payment method form.*/
    _that.toggleShowAddPaymentMethod = function () {
        _that.showAddPaymentMethod(!_that.showAddPaymentMethod());
    };
};

/**
 * Page DOM element.
 * @method eb_savedPayments.domElement
 * @param {object} domElement current DOM element.
 * */
eb_savedPayments.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_savedPayments.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_savedPayments);
});

/** 
 * GET service call method to get all valid payments of the current user logged-in.
 * @method eb_savedPayments.getValidPayments
 * @param {Number} personId Person ID.
 * @return {Object} Returns jquery promise which resolves to list of valid payments.
 * */
eb_savedPayments.getValidPayments = function (personId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!personId || personId <= 0) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    eBusinessJQObject.get(
        {
            url: eb_savedPayments.getValidPaymentURL.replace("{personId}", personId),
            xhrFields: {
                withCredentials: true
            }
        }
    ).done(function (data) {
        deferred.resolve(data);
    }).fail(deferred.reject);
    return deferred.promise();
};