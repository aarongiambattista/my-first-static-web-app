/**
 * Define eb_adminPaymentControl class.
 * @class eb_adminPaymentControl
 * */
var eb_adminPaymentControl = eb_adminPaymentControl || {};

/**
 * Control level setting: Site path.
 * @property eb_adminPaymentControl.SitePath
 * @type {String}
 */
eb_adminPaymentControl.SitePath = eb_Config.SitePath;

/**
 * The path to the eBusiness SOA layer.
 * @property eb_adminPaymentControl.ServicePath
 * @type {String}
 */
eb_adminPaymentControl.ServicePath = eb_Config.ServicePathV1;

/**
 * Control level setting Template path.
 * @property eb_adminPaymentControl.TemplatePath
 * @type {String}
 */
eb_adminPaymentControl.TemplatePath = "html/admin/PaymentMethods.html";

/**
 * GET service to get all valid payment types.
 * @property eb_adminPaymentControl.getValidPaymentTypes
 * @type {String}
 */
eb_adminPaymentControl.getValidPaymentURL = eb_adminPaymentControl.ServicePath + "admin/company/{id}/ValidPayments";

/**
 * GET service to get all Saved Cards records.
 * @property eb_adminPaymentControl.getSavedCardsService
 * @type {String}
 */
eb_adminPaymentControl.getSavedCardsService = eb_adminPaymentControl.ServicePath + "admin/company/{id}/SavedPaymentMethods/CreditCard";

/**
 * Service URL to update/edit Saved Cards records.
 * @property eb_adminPaymentControl.editSavedPaymentURL
 * @type {String}
 */
eb_adminPaymentControl.editSavedPaymentURL = eb_adminPaymentControl.ServicePath + 'admin/company/{id}/SavedPaymentMethods/CreditCard/{card ID}';

/**
 * Service URL to delete Saved Cards records.
 * @property eb_adminPaymentControl.deleteSavedPaymentURL
 * @type {String}
 */
eb_adminPaymentControl.deleteSavedPaymentURL = eb_adminPaymentControl.ServicePath + 'admin/company/{id}/SavedPaymentMethods/{card ID}';

/**
 * Service URL to get Saved Cards records for ACH.
 * @property eb_adminPaymentControl.getSavedCardForAch
 * @type {String}
 */
eb_adminPaymentControl.getSavedCardForAch = eb_adminPaymentControl.ServicePath + 'admin/company/{id}/SavedPaymentMethods/ACH';

/**
 * PATCH ACH record.
 * @property eb_adminPaymentControl.updateACHrecordService
 * @type {string}
 * */
eb_adminPaymentControl.updateACHrecordService = eb_adminPaymentControl.ServicePath + "admin/company/{id}/SavedPaymentMethods/ACH/{savedPaymentId}"

/**Payment methods for companies */

/**
 * GET service to get all valid payment types for a company.
 * @property eb_adminPaymentControl.getValidPaymentURLCompany
 * @type {String}
 */
eb_adminPaymentControl.getValidPaymentURLCompany = eb_adminPaymentControl.ServicePath + "admin/company/{id}/ValidPayments";

/**
 * GET service to get all Saved Cards records for a company.
 * @property eb_adminPaymentControl.getSavedCardsServiceCompany
 * @type {String}
 */
eb_adminPaymentControl.getSavedCardsServiceCompany = eb_adminPaymentControl.ServicePath + "admin/company/{id}/SavedPaymentMethods/CreditCard";

/**
 * Service URL to get Saved Cards records for ACH for a company.
 * @property eb_adminPaymentControl.getSavedCardForAchCompany
 * @type {String}
 */
eb_adminPaymentControl.getSavedCardForAchCompany = eb_adminPaymentControl.ServicePath + 'admin/company/{id}/SavedPaymentMethods/ACH';


/**
 * Object with each month's numeric value.
 * @property: eb_adminPaymentControl.monthConstants
 * @type {Object}
 * */
eb_adminPaymentControl.monthConstants = {
    'Month': 0, 'January(1)': 1, 'February(2)': 2, 'March(3)': 3, 'April(4)': 4, 'May(5)': 5, 'June(6)': 6,
    'July(7)': 7, 'August(8)': 8, 'September(9)': 9, 'October(10)': 10, 'November(11)': 11, 'December(12)': 12
};

/* Success Responses */
eb_adminPaymentControl.successResponses = {
    'Card saved': 'Your Credit Card details saved successfully.',
    'Card updated': 'Your Credit Card details updated successfully.',
    'Card deleted': 'Your Credit Card details has been deleted successfully.',
    'Order placed': 'Your order has been placed successfully.'
};

/* Error messages */
eb_adminPaymentControl.errorMessages = {
    'Card date expired': 'Your card is expired.'
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
 * @property eb_adminPaymentControl.errorResponses
 * @type {Object}
 * */
eb_adminPaymentControl.errorResponses = {
    700: { useServerMessage: false, frontEndMessage: 'There was an error occurred during payment operation. Please try again.' }
};

/**
 * Default error message.
 * @property eb_adminPaymentControl.defaultErrorMessage
 * @type {String}
 * */
eb_adminPaymentControl.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/**
 * All card types.
 * @property eb_adminPaymentControl.creditCardtypes
 * @type {Object}
 * */
eb_adminPaymentControl.creditCardtypes = ["Visa", "Mastercard", "American Express", "Discover"];

/**
 * All active payment types
 * @property: eb_adminPaymentControl.activePaymentTypes
 * @type {Object}
 */
eb_adminPaymentControl.activePaymentTypes = {
    'Visa': 'Visa',
    'Mastercard': 'Mastercard',
    'American Express': 'American Express',
    'Discover': 'Discover',
    'Hosted Reference Transaction': 'Hosted Reference Transaction',
    'Purchase Order': 'Purchase Order',
    'ACH': 'ACH'
}

/**
 * All active payment types
 * @property: eb_adminPaymentControl.validPaymentTypesForUser
 * @type {Object}
 */
eb_adminPaymentControl.validPaymentTypesForUser = {
    'Purchase Order': 'Purchase Order',
    'Credit Card': 'Credit Card',
    'Wire Transfer': 'Wire Transfer',
    'Credit Card Reference Transaction': 'Credit Card Reference Transaction',
    'Credit Card Hosted Payment Reference Transaction': 'Credit Card Hosted Payment Reference Transaction',
    'Hosted iFrame Tokenizer': 'Hosted iFrame Tokenizer',
    'Google Pay': 'Google Pay',
    'Apple Pay': 'Apple Pay'
}

/**
 * Rendering public method to load HTML template. 
 * Based on page level configuration it will select the template and load in DOM.
 * Template path and DOM element are required parameters.
 * GET the template by Ajax call using template path and then assign it to DOM element.
 * @method eb_adminPaymentControl.render
 * @param {Object} options Object with data required for getting HTML template through Ajax call.
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * 
 * @returns {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_adminPaymentControl.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            var finalPath = eb_adminPaymentControl.SitePath + eb_adminPaymentControl.TemplatePath;
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
 * GET service call method to get all  ACH Saved Cards records of the current user logged-in.
 * @method eb_adminPaymentControl.getAllACHSavedCardRecords
 * @param {Number} companyId Person ID.
 * @return {Object} Returns jquery promise which resolves to list of saved cards.
 * */
eb_adminPaymentControl.getAllACHSavedCardRecords = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId || companyId <= 0) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    eBusinessJQObject.get(
        {
            url: eb_adminPaymentControl.getSavedCardForAch.replace("{id}", companyId),
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
 * PATCH ACH service method.
 * @method eb_adminPaymentControl.updateACHCardRecord
 * @param {object} ACH card collection object.
 * @param {String} companyId person ID.
 * @param {String} cardId cardId
 * @return {Object} jQuery promise object which return updated ACH record.
 */
eb_adminPaymentControl.updateACHCardRecord = function (data, companyId, cardId) {
    var def = eBusinessJQObject.Deferred();
    if (!data) {
        throw { type: "argument_null", message: "data field is required.", stack: Error().stack };
    }
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_adminPaymentControl.updateACHrecordService.replace("{id}", companyId).replace("{savedPaymentId}", cardId),
            type: "PATCH",
            data: data,
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (result) {
            def.resolve(result);
        }).fail(def.reject);
    });
    return def.promise();
}

/**
 * GET service call method to get all  ACH Saved Cards records of current company .
 * @method eb_adminPaymentControl.getAllACHSavedCardRecordsCompany
 * @param {Number} companyId Company ID.
 * @return {Object} Returns jquery promise which resolves to list of saved cards.
 * */
eb_adminPaymentControl.getAllACHSavedCardRecordsCompany = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId || companyId <= 0) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    eBusinessJQObject.get(
        {
            url: eb_adminPaymentControl.getSavedCardForAchCompany.replace("{id}", companyId),
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
 * Payment Control Model for binding data and to handle events.
 * @method eb_adminPaymentControl.paymentModel
 * @param {Object} options Object with data required for model binding.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 * @param {Object} options.savedCards Saved Cards list of current user.
 * @param {Object} control The model of current calling control. It is needed to access payment function, control properties, error handling properties defined in calling control.
 */
eb_adminPaymentControl.paymentModel = function (options, control) {
    var _that = this;

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement and shoppingCart properties is required.", stack: Error().stack };
    }

    if (!options.domElement) {
        throw { type: "argument_mismatch", message: 'Missing domElement.  The object passed in must have a domElement property with a non-empty DOM object.', stack: Error().stack };
    }

    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

    _that.domElement = options.domElement;
    _that.savedCardList = ko.observable(options.savedCards);
    _that.parentControl = control;
    _that.showSavedPaymentMethodPanel = ko.observable(false);
    // _that.showCreditCards = ko.observable(0);
    // _that.showBillMeLaterPanel = ko.observable(false);

    /* Valid Payments */
    _that.validPayments = options.validPayments;

    _that.showError = ko.observable(0);
    /* Properties for Error handling */
    _that.showSuccessMessage = ko.observable(0);
    _that.successMessage = ko.observable('');
    _that.showErrorMessage = ko.observable(0);
    _that.errorMessage = ko.observable('');

    /* Payment methods visibility control attributes */
    _that.showBillMeLaterPanel = ko.observable(0);
    _that.showACHPanel = ko.observable(0);
    _that.showCreditCards = ko.observable(0);
    _that.showHostedPaymentPanel = ko.observable(0);
    _that.showiFrameTokenizerPaymentPanel = ko.observable(0);
    _that.showGPayPanel = ko.observable(0);
    _that.showGpayPayments = ko.observable(0);
    _that.showApplePayPanel = ko.observable(0);
    _that.showApplePayPayments = ko.observable(0);

    /* Control visibility of payment methods */
    _that.showPaymentMethodsForUser = function () {

        for (var i = 0; i < _that.validPayments.length; i++) {

            /* PO Section */
            if (_that.validPayments[i].name === eb_adminPaymentControl.validPaymentTypesForUser['Purchase Order'])
                _that.showBillMeLaterPanel(1);

            /* ACH Section */
            if (_that.validPayments[i].PaymentType === eb_adminPaymentControl.validPaymentTypesForUser["Wire Transfer"])
                _that.showACHPanel(1);

            /* Credit Card Section */
            if (_that.validPayments[i].PaymentType === eb_adminPaymentControl.validPaymentTypesForUser['Credit Card'] || _that.validPayments[i].PaymentType === eb_adminPaymentControl.validPaymentTypesForUser['Credit Card Reference Transaction']) {
                if (!_that.showHostedPaymentPanel() && !_that.showiFrameTokenizerPaymentPanel())
                    _that.showCreditCards(1);
            }

            /* Hosted Payment Section */
            if (_that.validPayments[i].PaymentType === eb_adminPaymentControl.validPaymentTypesForUser['Credit Card Hosted Payment Reference Transaction'] && _that.validPayments[i].IsRemote === true) {
                _that.showCreditCards(0);
                _that.showHostedPaymentPanel(1);
                _that.showiFrameTokenizerPaymentPanel(0);
            }

            /* Hosted iFrame Tokenizer */
            if (_that.validPayments[i].PaymentType === eb_adminPaymentControl.validPaymentTypesForUser['Hosted iFrame Tokenizer']) {
                _that.showCreditCards(0);
                _that.showHostedPaymentPanel(0);
                _that.showiFrameTokenizerPaymentPanel(1);
            }

            /* Google Pay Section */
            if (_that.validPayments[i].PaymentType === eb_adminPaymentControl.validPaymentTypesForUser["Google Pay"])
                _that.showGPayPanel(1);

            /* Apple Pay Section */
            if (_that.validPayments[i].PaymentType === eb_adminPaymentControl.validPaymentTypesForUser["Apple Pay"])
                _that.showApplePayPanel(1);
        }

    }

    /* Check showBillMeLaterSection attribute is passed from parent control, if not passed or if passed as true, check payment type in validPayments list. */
    //_that.showBillMeLaterSection = function () {
    //    if (options.showBillMeLaterPanel === undefined || options.showBillMeLaterPanel === true) {
    //        for (var i = 0; i < _that.validPayments.length; i++) {
    //            if (_that.validPayments[i].name === eb_adminPaymentControl.validPaymentTypesForUser['Purchase Order'])
    //                return _that.showBillMeLaterPanel(true);
    //        }
    //    }
    //};

    ///* Show ACH Section*/
    //_that.showACHSection = function () {
    //    for (var i = 0; i < _that.validPayments.length; i++) {
    //        if (_that.validPayments[i].PaymentType === eb_adminPaymentControl.validPaymentTypesForUser["Wire Transfer"])
    //            return _that.showACHPanel(true);
    //    }
    //};

    ///* Show Credit Card Section*/
    //_that.showCreditCardSection = function () {
    //    for (var i = 0; i < _that.validPayments.length; i++) {
    //        if (_that.validPayments[i].PaymentType === eb_adminPaymentControl.validPaymentTypesForUser['Credit Card']
    //            || _that.validPayments[i].PaymentType === eb_adminPaymentControl.validPaymentTypesForUser['Credit Card Reference Transaction']) {
    //            return _that.showCreditCards(true);
    //        }
    //    }
    //};
    ////Credit Card Reference Transaction
    ////Credit Card Hosted Payment Reference Transaction

    ///* Show Hosted payment Card Section*/ 
    //_that.showHostedPaymentSection = function () {
    //    for (var i = 0; i < _that.validPayments.length; i++) {
    //        if (_that.validPayments[i].PaymentType === eb_adminPaymentControl.validPaymentTypesForUser['Credit Card Hosted Payment Reference Transaction']
    //            && _that.validPayments[i].IsRemote === true) {
    //            if (_that.showCreditCardSection())
    //                _that.showCreditCardSection(0);

    //            return _that.showHostedPayment(true);
    //        }
    //    }
    //};

    /* Show only those saved cards whose paymentType is valid. */
    _that.isValidSavedPayment = function (payType) {
        for (var i = 0; i < _that.validPayments.length; i++) {
            if (_that.validPayments[i].name === payType.trim())
                return true;
        }
        return false;
    };

    //if (_that.validPayments !== undefined || options.showBillMeLaterPanel === true) {
    //    _that.showBillMeLaterPanel(1);
    //}

    _that.showSavedPaymentMethod = function () {
        if (options.savedCards && options.savedCards.length || options.achCards && options.achCards.length) {
            _that.showSavedPaymentMethodPanel = ko.observable(true);
        } else {
            if (_that.showCreditCards())
                _that.showCreditCardsSection(1);

            _that.showSavedPaymentMethodPanel = ko.observable(false);
        }
    };

    _that.showSavedPaymentMethod();

    if (typeof _that.parentControl.paymentControl === 'undefined') {
        _that.parentControl.paymentControl = {};
    }

    _that.cardNumber = ko.observable('');
    _that.cVV = ko.observable('');
    _that.showLoader = ko.observable(0);
    _that.expirationMonthOptions = ko.observable(["Month", "January(1)", "February(2)", "March(3)", "April(4)", "May(5)", "June(6)", "July(7)", "August(8)", "September(9)", "October(10)", "November(11)", "December(12)"]);
    _that.expirationYearOptions = ko.observable(eb_Config.expirationYearOptions);
    _that.selectedMonth = ko.observable('');
    _that.selectedYear = ko.observable('');
    _that.selectedMonthNumber = ko.observable(eb_adminPaymentControl.monthConstants[_that.selectedMonth()]);
    _that.saveForFutureUse = ko.observable(true);
    _that.showSaveForFutureCheckBox = ko.observable(true);
    _that.creditCardImageList = ko.observableArray([]);
    _that.showCreditCardsSection = ko.observable(0);
    _that.showHostedSection = ko.observable(0);
    _that.showSavedPaymentMethods = ko.observable(0);
    _that.showACHPayments = ko.observable(0);
    //_that.showACHPanel = ko.observable(false);
    _that.billMe = ko.observable(0);
    _that.poNumber = ko.observable("");
    _that.poNumber.extend({ required: true });

    _that.ACHAccountNumber = ko.observable('');
    _that.ACHAccountNumber.extend({ required: true });
    _that.ACHAccountName = ko.observable('');
    _that.ACHAccountName.extend({ required: true });
    _that.ACHBankName = ko.observable('');
    _that.ACHBankName.extend({ required: true });
    _that.ACHRoutingNumber = ko.observable('');
    _that.ACHRoutingNumber.extend({ required: true });
    _that.ACHsaveForFutureUse = ko.observable(true);
    _that.ACHPlaceOrder = ko.observable(false);

    /* Hide Payment Types if its not valid payment method. */
    //if (_that.validPayments !== undefined) {
    //    _that.showACHSection();
    //    _that.showHostedPaymentSection();
    //    _that.showCreditCardSection();
    //}

    /* Place Order and Proceed button should be disabled if cart is empty */
    /* On any input field focus this function will get called. Hide parent control message box also. */
    _that.hideMessages = function () {
        _that.showSuccessMessage(0);
        _that.showErrorMessage(0);
        _that.parentControl.showError(0);
        _that.parentControl.showSuccess(0);
        _that.showError(0);
    };

    _that.errors = ko.validation.group(_that);

    /* Enable ACH place Order Button */
    _that.enableACHPlaceOrderButton = function () {
        if (_that.ACHAccountNumber().length && _that.ACHAccountName().length && _that.ACHBankName().length && _that.ACHRoutingNumber().length) {
            _that.ACHPlaceOrder = ko.observable(true);
        }
        else {
            _that.ACHPlaceOrder = ko.observable(false);
        }
    };

    /* Object to hold saved card models */
    _that.savedCardsCollection = ko.observable().extend({ notify: 'always' });
    _that.savedCardForACH = ko.observableArray();

    /* Function to create saved card models */
    _that.extractModels = function (data, constructor) {
        var models = [];
        if (data === null) {
            return models;
        }

        for (var index = 0; index < data.length; index++) {
            var row = data[index];
            if (_that.isValidSavedPayment(row.paymentType)) {  /* Create model of valid payment types cards only. */
                var model = new constructor(row);
                models.push(model);
            }
        }
        return models;
    };

    /* Load Saved card models */
    _that.loadSavedCards = function () {
        _that.savedCardsCollection(_that.extractModels(_that.savedCardList(), _that.savedCardModel));
    };

    /*ACH Edit Model Fields*/
    _that.ACHAccountNameEdit = ko.observable();
    _that.ACHAccountNumberEdit = ko.observable();
    _that.ACHBankNameEdit = ko.observable();
    _that.ACHRoutingNumberEdit = ko.observable();

    /* ACH SPM payments*/
    _that.achListOfCards = function (data) {
        var self = this;
        self.id = data["Id"];
        self.partialNumber = ko.observable(data["partialNumber"]);
        self.paymentType = ko.observable(data["paymentType"]);
        self.accountName = ko.observable(data["accountName"]);
        self.accountNumber = ko.observable(data["accountNumber"]);
        self.bank = ko.observable(data["bank"]);
        self.ABA = ko.observable(data["ABA"]);
        self.selectSavedCards = ko.observable(0);
        self.showEndDateError = ko.observable();
        self.errorEndDateMessage = ko.observable();

        self.editACHCardDetails = function (cardInfo) {
            _that.ACHAccountNameEdit(cardInfo.accountName());
            _that.ACHAccountNumberEdit(cardInfo.accountNumber());
            _that.ACHBankNameEdit(cardInfo.bank());
            _that.ACHRoutingNumberEdit(cardInfo.ABA());
        }

        self.selectSavedCard = function () {
            eBusinessJQObject.map(_that.savedCardsCollection(), function (record) {
                record.selectSavedCards(0);
            });
            eBusinessJQObject.map(_that.savedCardForACH(), function (record) {
                record.selectSavedCards(0);
            });
            self.selectSavedCards(1);
            return true;
        }

        /*Edit ACH card*/
        self.editACHCard = function (data) {
            var dataToUpdate = {
                accountNumber: _that.ACHAccountNumberEdit(),
                accountName: _that.ACHAccountNameEdit(),
                bank: _that.ACHBankNameEdit(),
                aba: _that.ACHRoutingNumberEdit()
            }

            _that.showErrorMessage(0);
            eb_adminPaymentControl.updateACHCardRecord(dataToUpdate, _that.parentControl.companyId, data.id).done(function (result) {
                var spmRecord = ko.utils.arrayFirst(_that.savedCardForACH(), function (spmRecord) {
                    return spmRecord.id === result.Id;
                });

                if (spmRecord) {
                    spmRecord.accountName(result.accountName);
                    spmRecord.accountNumber(result.accountNumber);
                    spmRecord.ABA(result.ABA);
                    spmRecord.bank(result.bank);
                    spmRecord.partialNumber(result.partialNumber);
                    _that.showSuccessMessage(1);
                    _that.successMessage(eb_adminPaymentControl.successResponses['Card updated']);
                }
            }).fail(function (xhr, textStatus, errorThrow) {
                _that.showErrorMessage(1);
                _that.showCardSuccess(0);
                if (xhr && typeof xhr.responseJSON !== 'undefined')
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminPaymentControl));
                else
                    _that.errorMessage(eb_adminPaymentControl.errorMessages['Update card failed']);
            });
        }

        /* Delete card details function. */
        self.deleteCardDetails = function (cardInfo) {
            var param = {};
            param.serviceURL = eb_adminPaymentControl.deleteSavedPaymentURL.replace('{Id}', _that.parentControl.companyId).replace('{card ID}', cardInfo.id);
            _that.showLoader(1);
            eb_adminPaymentControl.deleteSavedCard(param).done(function () {
                _that.reloadSavedCard().done(function () {
                    _that.showLoader(0);
                }).fail(function (xhr, msg, data) {
                    _that.showSuccessMessage(0);
                    _that.showErrorMessage(1);
                    _that.showLoader(0);
                    if (xhr && typeof xhr.responseJSON !== 'undefined')
                        _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminPaymentControl));
                    else
                        _that.errorMessage(eb_adminPaymentControl.defaultErrorMessage);
                });
            }).fail(function (xhr, msg, data) {
                _that.showSuccessMessage(0);
                _that.showErrorMessage(1);
                _that.showLoader(0);
                if (xhr && typeof xhr.responseJSON !== 'undefined')
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminPaymentControl));
                else
                    _that.errorMessage(eb_adminPaymentControl.defaultErrorMessage);
            });
        };
    };

    /*Load ACH card models*/
    _that.loadACHCardModels = function (achSavedCard) {
        eBusinessJQObject.map(achSavedCard, function (card) {
            if (_that.isValidSavedPayment(card.paymentType))
                _that.savedCardForACH.push(new _that.achListOfCards(card));
        });
    };

    /* Function that can be called from parent control to reload saved card HTML after payment is done */
    _that.reloadSavedCard = function () {
        var def = eBusinessJQObject.Deferred();
        eBusinessJQObject.when(eb_adminPaymentControl.getAllRecords(_that.parentControl.companyId),
            eb_adminPaymentControl.getAllACHSavedCardRecords(_that.parentControl.companyId)).done(function (savedCardList, achCardList) {
                _that.savedCardList('');
                _that.savedCardsCollection('');
                _that.savedCardForACH.removeAll();
                /*Check for SavedCard*/
                if (savedCardList.length) {
                    _that.savedCardList(savedCardList);
                    _that.loadSavedCards();
                    _that.showSavedPaymentMethodPanel(true);
                }
                /*Check for ACHCard*/
                if (achCardList.length) {
                    _that.loadACHCardModels(achCardList);
                    _that.showSavedPaymentMethodPanel(true);
                }
                _that.showErrorMessage(0);
                _that.showSuccessMessage(0);
                def.resolve();
            }).fail(function (xhr, msg, data) {
                _that.showSuccessMessage(0);
                _that.showErrorMessage(1);
                def.reject(xhr, msg, data);
                _that.errorMessage('Unable to load saved cards.');
            });
        return def.promise();
    };

    /* Function that can be called from parent control to reload saved card company admin HTML after payment is done */
    _that.reloadSavedCardCompany = function () {
        var def = eBusinessJQObject.Deferred();
        eBusinessJQObject.when(eb_adminPaymentControl.getAllRecordsCompany(_that.parentControl.companyId),
            eb_adminPaymentControl.getAllACHSavedCardRecordsCompany(_that.parentControl.companyId)).done(function (savedCardList, achCardList) {
                _that.savedCardList('');
                _that.savedCardsCollection('');
                _that.savedCardForACH.removeAll();
                /*Check for SavedCard*/
                if (savedCardList.length) {
                    _that.savedCardList(savedCardList);
                    _that.loadSavedCards();
                    _that.showSavedPaymentMethodPanel(true);
                }
                /*Check for ACHCard*/
                if (achCardList.length) {
                    _that.loadACHCardModels(achCardList);
                    _that.showSavedPaymentMethodPanel(true);
                }
                _that.showErrorMessage(0);
                _that.showSuccessMessage(0);
                def.resolve();
            }).fail(function (xhr, msg, data) {
                _that.showSuccessMessage(0);
                _that.showErrorMessage(1);
                def.reject(xhr, msg, data);
                _that.errorMessage('Unable to load saved cards.');
            });
        return def.promise();
    };

    /* Function for checking card expiry. While paying with new card, this function should be call 
     * from parent control's 'payByNewCard' function to validate card details. If function returns
     * true, then give proper error for card expiry on UI.*/
    _that.isDateExpired = function (month, year) {
        if (month !== "" && year !== "") {
            var selectedYear = parseInt(year);
            var selectedMonth = month;
            var currentTime = new Date();
            var currentMonth = currentTime.getMonth() + 1;
            var currentYear = currentTime.getFullYear();

            if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth))
                return true;

            return false;
        }
    };

    /* Saved Card Model */
    _that.savedCardModel = function (data) {
        var self = this;

        self.monthArray = {
            "1": "January(1)", "2": "February(2)", "3": "March(3)", "4": "April(4)", "5": "May(5)", "6": "June(6)", "7": "July(7)", "8": "August(8)", "9": "September(9)", "10": "October(10)", "11": "November(11)", "12": "December(12)"
        };

        self.id = ko.observable(data["Id"]);
        self.cardName = ko.observable(data["paymentType"]);
        self.partialNumber = ko.observable(data["partialNumber"]);
        self.savedMonth = ko.observable(self.monthArray[data["expirationMonth"]]);
        self.savedYear = ko.observable(data["expirationYear"]);
        self.newMonth = ko.observable('');
        self.newYear = ko.observable('');
        self.endingIn = ko.observable('');
        self.selectSavedCards = ko.observable(0);

        /* Toggle saved Cards */
        self.selectSavedCard = function () {
            eBusinessJQObject.map(_that.savedCardsCollection(), function (record) {
                record.selectSavedCards(0);
            });
            eBusinessJQObject.map(_that.savedCardForACH(), function (record) {
                record.selectSavedCards(0);
            });
            self.selectSavedCards(1);
            return true;
        }

        if (data["partialNumber"]) {
            /*To get the last 4 digit of card*/
            self.endingIn(data["partialNumber"].slice(-4));
        }

        self.expirationMonthYear = ko.observable(data["expirationMonth"] + "/" + data["expirationYear"]);
        self.requireCVV = ko.observable(data["requireCVV"]);
        self.cVV = ko.observable('').extend({ notify: 'always' });

        /* Function to provide current card details on edit model */
        self.editCardDetails = function (cardInfo) {
            console.log();
            self.newMonth(self.savedMonth());
            self.newYear(self.savedYear());
        };

        /* Update card details function */
        self.updateCardDetails = function (cardInfo) {
            var cardDetails = {
                expirationMonth: eb_adminPaymentControl.monthConstants[cardInfo.newMonth()],
                expirationYear: cardInfo.newYear()
            };

            var param = {};
            param.serviceURL = eb_adminPaymentControl.editSavedPaymentURL.replace('{person ID}', _that.parentControl.companyId).replace('{card ID}', cardInfo.id());
            param.cardData = cardDetails;

            eb_adminPaymentControl.editSavedCard(param).done(function (data) {
                _that.showErrorMessage(0);
                _that.showSuccessMessage(1);
                _that.successMessage(eb_adminPaymentControl.successResponses['Card updated']);
                /* Instead of loading cards again, change the current card details with updated values */
                cardInfo.savedMonth(self.monthArray[data.expirationMonth]);
                cardInfo.savedYear(data.expirationYear);
                cardInfo.expirationMonthYear(data.expirationMonth + '/' + data.expirationYear);
            }).fail(function (xhr, msg, data) {
                _that.showSuccessMessage(0);
                _that.showErrorMessage(1);
                if (xhr && typeof xhr.responseJSON !== 'undefined')
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminPaymentControl));
                else
                    _that.errorMessage(eb_adminPaymentControl.defaultErrorMessage);
            });

        };

        /* Delete card details function. */
        self.deleteCardDetails = function (cardInfo) {

            var param = {};
            param.serviceURL = eb_adminPaymentControl.deleteSavedPaymentURL.replace('{person ID}', _that.parentControl.companyId).replace('{card ID}', cardInfo.id());

            eb_adminPaymentControl.deleteSavedCard(param).done(function () {
                eb_adminPaymentControl.getAllRecords(_that.parentControl.companyId).done(function (savedCardList) {
                    /* Reload saved card list. */
                    _that.savedCardList('');
                    _that.savedCardsCollection('');
                    if (savedCardList.length) {
                        _that.savedCardList(savedCardList);
                        _that.loadSavedCards();
                    } else {
                        if (!_that.savedCardForACH().length) {
                            _that.showSavedPaymentMethodPanel(false);

                            if (_that.showCreditCards())
                                _that.showCreditCardsSection(1);
                        }
                    }

                    _that.hideMessages();
                    _that.showErrorMessage(0);
                    _that.showSuccessMessage(1);
                    _that.successMessage(eb_adminPaymentControl.successResponses['Card deleted']);
                }).fail(function (xhr, msg, data) {
                    _that.showSuccessMessage(0);
                    _that.showErrorMessage(1);
                    if (xhr && typeof xhr.responseJSON !== 'undefined')
                        _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminPaymentControl));
                    else
                        _that.errorMessage(eb_adminPaymentControl.defaultErrorMessage);
                });

            }).fail(function (xhr, msg, data) {
                _that.showSuccessMessage(0);
                _that.showErrorMessage(1);
                if (xhr && typeof xhr.responseJSON !== 'undefined')
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminPaymentControl));
                else
                    _that.errorMessage(eb_adminPaymentControl.defaultErrorMessage);
            });
        };

    };

    /* Credit card model for showing images. Currently showing 4 images only so have to change this in future */
    _that.creditCardImagesModel = function (creditCardType) {
        var self = this;
        self.cardName = ko.observable(creditCardType);

        self.isVisa = ko.observable(false);
        self.isMaster = ko.observable(false);
        self.isAmex = ko.observable(false);
        self.isDiscover = ko.observable(false);

        self.isCardValid = ko.observable(false);

        switch (self.cardName()) {
            case "Visa":
                self.isVisa(true);
                break;
            case "Mastercard":
                self.isMaster(true);
                break;
            case "American Express":
                self.isAmex(true);
                break;
            case "Discover":
                self.isDiscover(true);
                break;
        }

        if (_that.isValidSavedPayment(self.cardName()))
            self.isCardValid(true);
    };

    /* Load Credit card images */
    _that.loadCreditCardImages = function () {
        for (var i = 0; i < 4; i++) {
            _that.creditCardImageList.push(new _that.creditCardImagesModel(eb_adminPaymentControl.creditCardtypes[i]));
        }
    };

    /* Load SPM */
    _that.loadSavedCards();

    /*Load ACH SPM */
    _that.loadACHCardModels(options.achCards);

    /* Load Credit card Images */
    _that.loadCreditCardImages();

    _that.showPaymentMethodsForUser();

    _that.openDefaultPaymentPanel = function () {
        if (_that.showSavedPaymentMethodPanel())
            _that.showSavedPaymentMethods(1);
    }

    _that.openDefaultPaymentPanel();

    /* Toggle Credit Card */
    _that.toggleCreditCard = function () {
        _that.showError(0);
        if ((_that.showHostedPaymentPanel() == 0 && _that.showiFrameTokenizerPaymentPanel() == 0) && _that.showCreditCards()) {
            _that.showCreditCardsSection(!_that.showCreditCardsSection());
            if (_that.showCreditCardsSection()) {
                _that.showSavedPaymentMethods(0);
                _that.showACHPayments(0);
                _that.billMe(0);
                _that.showGpayPayments(0);
                _that.showApplePayPayments(0);
            }
            else {
                _that.showCreditCardsSection(0);
            }
        }

    };


    /* Toggle Saved Payment Methods */
    _that.toggleSavedPayment = function () {
        _that.showError(0);
        _that.showSavedPaymentMethods(!_that.showSavedPaymentMethods());
        if (_that.showSavedPaymentMethods()) {
            _that.showSavedPaymentMethods(1);
            _that.billMe(0);
            _that.showGpayPayments(0);
            _that.showApplePayPayments(0);

            if (_that.showCreditCards())
                _that.showCreditCardsSection(0);

            if (_that.showHostedPaymentPanel() && _that.showiFrameTokenizerPaymentPanel())
                _that.showHostedSection(0);


        } else {
            _that.showSavedPaymentMethods(0);
        }
    };

    /* Toggle Saved Payment Methods */
    _that.toggleACHPayment = function () {
        _that.showError(0);
        _that.showACHPayments(!_that.showACHPayments());
        if (_that.showACHPayments()) {
            _that.showACHPayments(1);
            _that.billMe(0);
            _that.showGpayPayments(0);
            _that.showApplePayPayments(0);
            _that.showSavedPaymentMethods(0);

            if (_that.showCreditCards())
                _that.showCreditCardsSection(0);

            if (_that.showHostedPaymentPanel() && _that.showiFrameTokenizerPaymentPanel())
                _that.showHostedSection(0);


        } else {
            _that.showACHPayments(0);
        }
    };

    /* Toggle Bill Me */
    _that.toggleBillMe = function () {
        _that.showError(0);
        if (_that.billMe()) {
            _that.billMe(0);
        } else {
            _that.billMe(1);
            _that.showSavedPaymentMethods(0);
            _that.showACHPayments(0);
            _that.showGpayPayments(0);
            _that.showApplePayPayments(0);

            if (_that.showCreditCards())
                _that.showCreditCardsSection(0);

            if (_that.showHostedPaymentPanel() && _that.showiFrameTokenizerPaymentPanel())
                _that.showHostedSection(0);

        }
    };

    /* Toggle Hosted Method */
    _that.toggleHosted = function () {
        _that.showError(0);
        if ((_that.showHostedPaymentPanel() || _that.showiFrameTokenizerPaymentPanel()) && _that.showCreditCards() == 0) {
            _that.showHostedSection(!_that.showHostedSection());
            if (_that.showHostedSection()) {
                _that.showSavedPaymentMethods(0);
                _that.showACHPayments(0);
                _that.billMe(0);
                _that.showGpayPayments(0);
                _that.showApplePayPayments(0);
            }
            else {
                _that.showHostedSection(0);
            }
        }
    };

    /* Toggle Gpay Payment Methods */
    _that.toggleGpayPayment = function () {
        _that.showError(0);
        _that.showGpayPayments(!_that.showGpayPayments());
        if (_that.showGpayPayments()) {
            _that.showGpayPayments(1);
            _that.billMe(0);
            _that.showSavedPaymentMethods(0);
            _that.showACHPayments(0);
            _that.showHostedSection(0);
            _that.showApplePayPayments(0);

        } else {
            _that.showGpayPayments(0);
        }
    };

    /* Toggle Apple Pay Payment Methods */
    _that.toggleApplePayPayment = function () {
        _that.showError(0);
        _that.showApplePayPayments(!_that.showApplePayPayments());
        if (_that.showApplePayPayments()) {
            _that.showApplePayPayments(1);
            _that.billMe(0);
            _that.showSavedPaymentMethods(0);
            _that.showACHPayments(0);
            _that.showHostedSection(0);
            _that.showGpayPayments(0);

        } else {
            _that.showApplePayPayments(0);
        }
    };
};

/** 
 * GET service call method to get all valid payments of the current user logged-in.
 * @method eb_adminPaymentControl.getValidPayments
 * @param {Number} companyId Person ID.
 * @return {Object} Returns jquery promise which resolves to list of valid payments.
 * */
eb_adminPaymentControl.getValidPayments = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId || companyId <= 0) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    eBusinessJQObject.get(
        {
            url: eb_adminPaymentControl.getValidPaymentURL.replace("{id}", companyId),
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
 * GET service call method to get all Saved Cards records of the current user logged-in.
 * @method eb_adminPaymentControl.getAllRecords
 * @param {Number} companyId Person ID.
 * @return {Object} Returns jquery promise which resolves to list of saved cards.
 * */
eb_adminPaymentControl.getAllRecords = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId || companyId <= 0) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    eBusinessJQObject.get(
        {
            url: eb_adminPaymentControl.getSavedCardsService.replace("{id}", companyId),
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
 * Service call method to edit Saved Card record of the current user logged-in.
 * @method eb_adminPaymentControl.editSavedCard
 * @param {Number} cardDetails Saved Cards Details.
 * @return {Object} Returns jquery promise.
 * */
eb_adminPaymentControl.editSavedCard = function (cardDetails) {
    var deferred = eBusinessJQObject.Deferred();
    var _that = this;

    _that.serviceURL = cardDetails.serviceURL;
    _that.data = cardDetails.cardData;

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: _that.serviceURL,
            data: _that.data,
            type: 'PATCH',
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
 * Service call method to delete Saved Card record of the current user logged-in.
 * @method eb_adminPaymentControl.deleteSavedCard
 * @param {Number} cardDetails Saved Cards Details.
 * @return {Object} Returns jquery promise.
 * */
eb_adminPaymentControl.deleteSavedCard = function (cardDetails) {
    var deferred = eBusinessJQObject.Deferred();
    var _that = this;
    _that.serviceURL = cardDetails.serviceURL;
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: _that.serviceURL,
            type: 'DELETE',
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
 * GET service call method to get all valid payments of the current company.
 * @method eb_adminPaymentControl.getValidPaymentsCompany
 * @param {Number} companyId company ID.
 * @return {Object} Returns jquery promise which resolves to list of valid payments.
 * */
eb_adminPaymentControl.getValidPaymentsCompany = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId || companyId <= 0) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    eBusinessJQObject.get(
        {
            url: eb_adminPaymentControl.getValidPaymentURLCompany.replace("{id}", companyId),
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
 * GET service call method to get all Saved Cards records of the current company.
 * @method eb_adminPaymentControl.getAllRecordsCompany
 * @param {Number} companyId company ID.
 * @return {Object} Returns jquery promise which resolves to list of saved cards.
 * */
eb_adminPaymentControl.getAllRecordsCompany = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId || companyId <= 0) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    eBusinessJQObject.get(
        {
            url: eb_adminPaymentControl.getSavedCardsServiceCompany.replace("{id}", companyId),
            xhrFields: {
                withCredentials: true
            }
        }
    ).done(function (data) {
        deferred.resolve(data);
    }).fail(deferred.reject);
    return deferred.promise();
};

