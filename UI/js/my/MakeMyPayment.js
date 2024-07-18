/**
 * Make Payment class.
 * @class eb_MakeMYPayment
 * */
var eb_MakeMYPayment = eb_MakeMYPayment || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_MakeMYPayment.SitePath
 * @type {String}
 * */
eb_MakeMYPayment.SitePath = eb_Config.SitePath;

/**
 * Template path.
 * @property eb_MakeMYPayment.TemplatePath
 * @type {String}
 * */
eb_MakeMYPayment.TemplatePath = "html/my/MakePayment.html";

/**
 * SOA path.
 * It would be set from configuration file.
 * @property eb_MakeMYPayment.ServicePath
 * @type {String}
 * */
eb_MakeMYPayment.ServicePath = eb_Config.ServicePathV1;

/**
 * Make payment service
 * @property eb_MakeMYPayment.getOrderHistory
 * @type {String}
 * */
eb_MakeMYPayment.getOutstandingOrders = eb_MakeMYPayment.ServicePath + "ProfilePersons/{id}/OrderHistory/OutstandingOrders";


/*Service call for Saved Card and Credit Card*/
eb_MakeMYPayment.serviceUrls = {
    'Pay By New Card': eb_MakeMYPayment.ServicePath + 'ProfilePersons/{personId}/OrderHistory/{orderId}/MakePayment/CreditCard',
    'Pay By Saved Card': eb_MakeMYPayment.ServicePath + 'ProfilePersons/{personId}/OrderHistory/{orderId}/MakePayment/SavedPayment',
    'Pay By ACH Card': eb_MakeMYPayment.ServicePath + 'ProfilePersons/{personId}/OrderHistory/{orderId}/MakePayment/ACH',
    'Pay By Bluepay HPP': eb_MakeMYPayment.ServicePath + 'ProfilePersons/{personId}/OrderHistory/MakePayment/BulkOrder/GetRemotePaymentRequest',
    'Pay By New Card Bulk': eb_MakeMYPayment.ServicePath + 'ProfilePersons/{personId}/OrderHistory/MakePayment/BulkOrder/CreditCard',
    'Pay By ACH Tokenizer Card': eb_MakeMYPayment.ServicePath + 'ProfilePersons/{personId}/OrderHistory/MakePayment/BulkOrder/ACHTokenizer',
    'Pay By GPay': eb_MakeMYPayment.ServicePath + 'ProfilePersons/{personId}/OrderHistory/MakePayment/GPay',
    'CardPointe Tokenize': eb_MakeMYPayment.ServicePath + 'CardPointe/ccn/tokenize',
    'CardPointe Tokenize Apple Pay': eb_MakeMYPayment.ServicePath + 'CardPointe/ccn/tokenizeApplePay',
    'Pay By ApplePay': eb_MakeMYPayment.ServicePath + 'ProfilePersons/{personId}/OrderHistory/MakePayment/ApplePay'
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
 * @property eb_MakeMYPayment.errorResponses
 * @type {Object}
 * */
eb_MakeMYPayment.errorResponses = {
    202: { useServerMessage: true },
    203: { useServerMessage: true },
    430: { useServerMessage: true },
    601: { useServerMessage: false, frontEndMessage: 'Sorry, you are not eligible for “Bill me later” option. Please contact the customer support for further assistance with this order.' },
    700: { useServerMessage: false, frontEndMessage: 'An error occurred during Payment processing. Please check the payment details entered and try again. If the problem persists please contact our customer service department.' },
    850: { useServerMessage: true },
    707: { useServerMessage: false, frontEndMessage: 'Invalid input. Please check the payment/order details entered and try again.' }
};

/**
 * Default error message.
 * @property eb_MakeMYPayment.defaultErrorMessage
 * @type {String}
 * */
eb_MakeMYPayment.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/* Error messages */
eb_MakeMYPayment.errorMessages = {
    'Card date expired': 'Your card is expired.',
    'Invalid card number': 'Sorry, this card is invalid. Please enter a valid card number.'
};


/**
 * Render make a payment page.
 * @method eb_MakeMYPayment.render
 * @param {Object} options Array of required data.
 * @param {String} options.templatePath Order history template URL.
 * @return {String} Order history HTML template.
 * */
eb_MakeMYPayment.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            options.templatePath = eb_MakeMYPayment.SitePath + eb_MakeMYPayment.TemplatePath;
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
 * This method is used to get order history data.
 * @method eb_MakeMYPayment.outstandingOrderService
 * @param {String} personId Logged-in person Id.
 * @return {Object} jQuery promise object which when resolved returns unpaid order data.
 */
eb_MakeMYPayment.outstandingOrderService = function (personId) {
    var defer = eBusinessJQObject.Deferred();
    var service = eb_MakeMYPayment.getOutstandingOrders;
    if (!personId) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }

    if (personId > 0) {
        service = eb_MakeMYPayment.getOutstandingOrders.replace("{id}", personId);
    }

    eBusinessJQObject.get(
        {
            url: service,
            xhrFields: {
                withCredentials: true
            }
        }).done(function (data) {
            defer.resolve(data);
        }).fail(defer.reject);
    return defer.promise();
};



/**
 * This method is used to get order history data.
 * @method eb_MakeMYPayment.cardPayment
 * @param {Object} cardDetails CardDetails of login user.
 * @param {String} orderId Order Id for order to be placed.
 * @return {Object} jQuery promise object which when resolved returns order history data.
 */
eb_MakeMYPayment.cardPayment = function (cardDetails, orderId) {
    var defer = eBusinessJQObject.Deferred();
    var serviceURL;
    if (cardDetails.isSavedCard) {
        serviceURL = eb_MakeMYPayment.serviceUrls['Pay By Saved Card'].replace('{personId}', eb_MakeMYPayment.personId).replace('{orderId}', orderId);
    }

    if (cardDetails.isCreditCard) {
        serviceURL = eb_MakeMYPayment.serviceUrls['Pay By New Card'].replace('{personId}', eb_MakeMYPayment.personId).replace('{orderId}', orderId);
    }

    if (cardDetails.isACHCard) {
        serviceURL = eb_MakeMYPayment.serviceUrls['Pay By ACH Card'].replace('{personId}', eb_MakeMYPayment.personId).replace('{orderId}', orderId);
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
 * @method eb_MakeMYPayment.cardPaymentBulk
 * @param { Object } cardDetails CardDetails of company selected.
 * @param { String } orderId Order Id for order to be placed.
 * @return { Object } jQuery promise object which when resolved returns order history data.
 */
eb_MakeMYPayment.cardPaymentBulk = function (cardDetails) {
    var defer = eBusinessJQObject.Deferred();
    var serviceURL;
    serviceURL = eb_MakeMYPayment.serviceUrls['Pay By New Card Bulk'].replace("{personId}", eb_MakeMYPayment.personId);

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: serviceURL,
            type: "POST",
            data: JSON.stringify(cardDetails),
            xhrFields: {
                withCredentials: true
            },
            headers: headers,
            contentType: 'application/json'
        }).done(function (data) {
            defer.resolve(data);
        }).fail(defer.reject);
    });
    return defer.promise();
};

/**
 * @method eb_MakeMYPayment.achPaymentBulk
 * @param { Object } achDetails ACH Card Details of company selected.
 * @param { String } orderId Order Id for order to be placed.
 * @return { Object } jQuery promise object which when resolved returns order history data.
 */
eb_MakeMYPayment.achPaymentBulk = function (achDetails) {
    var defer = eBusinessJQObject.Deferred();
    var serviceURL;
    serviceURL = eb_MakeMYPayment.serviceUrls['Pay By ACH Tokenizer Card'].replace("{personId}", eb_MakeMYPayment.personId);

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: serviceURL,
            type: "POST",
            data: JSON.stringify(achDetails),
            xhrFields: {
                withCredentials: true
            },
            headers: headers,
            contentType: 'application/json'
        }).done(function (data) {
            defer.resolve(data);
        }).fail(defer.reject);
    });
    return defer.promise();
};

/**
 * @method eb_MakeMYPayment.gPayPayment
 * @param { Object } postData Input data for service.
 * @return { Object } jQuery promise object.
 */
eb_MakeMYPayment.gPayPayment = function (postData) {
    var defer = eBusinessJQObject.Deferred();
    var serviceURL;
    serviceURL = eb_MakeMYPayment.serviceUrls['Pay By GPay'].replace("{personId}", eb_MakeMYPayment.personId);

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: serviceURL,
            type: "POST",
            data: JSON.stringify(postData),
            xhrFields: {
                withCredentials: true
            },
            headers: headers,
            contentType: 'application/json'
        }).done(function (data) {
            defer.resolve(data);
        }).fail(defer.reject);
    });
    return defer.promise();
};

/**
 * @method eb_MakeMYPayment.ApplePayPayment
 * @param { Object } postData Input data for service.
 * @return { Object } jQuery promise object.
 */
eb_MakeMYPayment.ApplePayPayment = function (postData) {
    var defer = eBusinessJQObject.Deferred();
    var serviceURL;
    serviceURL = eb_MakeMYPayment.serviceUrls['Pay By ApplePay'].replace("{personId}", eb_MakeMYPayment.personId);

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: serviceURL,
            type: "POST",
            data: JSON.stringify(postData),
            xhrFields: {
                withCredentials: true
            },
            headers: headers,
            contentType: 'application/json'
        }).done(function (data) {
            defer.resolve(data);
        }).fail(defer.reject);
    });
    return defer.promise();
};

/**
 * Make Payment model.
 * 
 * @method eb_MakeMYPayment.model
 * 
 * @param {Object} options Object of make payment data.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL.
 * @param {String} options.templatePath HTML path.
 * @param {String} options.personId: User Linked ID.
 * @param {Object} options.domElement Make Payment DOM element.
 * @param {Object} options.data List of orders.
 * 
 * */
eb_MakeMYPayment.model = function (options) {
    var _that = this;
    _that.domElement = options.domElement;
    _that.outstandingOrders = ko.observableArray();
    _that.successPayment = ko.observable(0);
    _that.showNoOrders = ko.observable(0);
    _that.showAllOrders = ko.observable(1);
    _that.allowLoader = ko.observable(0);
    _that.allCurrency = ko.observable();
    /*Total  Oustanding Balance*/
    _that.totalOutstandingBalance = ko.observable(0);
    _that.totalOutstandingPayment = ko.observable(0);
    /*Total Checked Payment*/
    _that.totalPaymentBalance = ko.observable(0);
    _that.totalPayment = ko.observable(0);
    _that.totalPaymentWithoutCurrency = ko.observable(0);
    _that.mainSelect = ko.observable(0);
    _that.payMe = ko.observable(0);

    /* Payment Control attributes */
    _that.paymentControl = {};
    _that.paymentControl.showBillMeLaterPayType = false;
    _that.paymentControl.savedCardsTitle = 'Saved Credit Cards';
    _that.paymentControl.cardTitle = 'New Card';
    _that.paymentControl.paymentControlButtonName = 'Make My Payment';
    _that.paymentControl.showSaveForFutureCheckBox = true;
    _that.paymentControl.showEditDeleteSavedCardButtons = false;
    _that.paymentControl.bluePayURL = ko.observable("");
    _that.paymentControl.cardInfo = {};
    /* Payment */

    _that.showError = ko.observable(0);
    _that.errorMessage = ko.observable("");
    _that.showSuccess = ko.observable(0);
    _that.successMessage = ko.observable("");
    _that.totalPaymentForSuccessMessage = ko.observable(0);
    _that.countCheckBox = ko.observable(0); /*TO count the length of selected checkbox*/
    _that.showLoader = ko.observable(0);

    _that.totalPayment(_that.totalPayment().toFixed(eb_Config.roundOffDigitsAfterDecimal));
    _that.totalPaymentWithoutCurrency(_that.totalPaymentWithoutCurrency().toFixed(eb_Config.roundOffDigitsAfterDecimal));
    _that.totalOutstandingBalance(_that.totalOutstandingBalance().toFixed(eb_Config.roundOffDigitsAfterDecimal));
    _that.errors = ko.validation.group(_that);

    if (options.orders) {
        _that.data = options.orders;
    }

    if (options.personId) {
        eb_MakeMYPayment.personId = options.personId;
        _that.personId = eb_MakeMYPayment.personId;
    } else {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }

    /*Each Order Details*/
    _that.orderDetailsData = function (row) {
        var self = this;
        self.orderId = ko.observable(row["OrderId"]);
        self.orderDate = ko.computed(function () {
            return moment(row["OrderDate"]).format(eb_Config.defaultDateFormat);
        });
        self.currencySymbol = ko.observable(row["currencySymbol"].trim());
        self.orderType = ko.observable(row["OrderType"]);
        /*Order Total Price */
        self.orderTotal = ko.observable(self.currencySymbol() + row["OrderTotal"].toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.orderAmountDue = ko.observable(self.currencySymbol() + row["AmountDue"].toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.isSelected = ko.observable(0);
        self.payableAmount = ko.observable("");
        self.payableAmount.focused = ko.observable();
        self.amountVisible = ko.observable(0);
        self.showError = ko.observable(0);
        /* To Calculate the amount without using the $ symbol, which contains only the amount */
        self.amount = ko.observable(row["AmountDue"]);
        _that.totalOutstandingPayment(_that.totalOutstandingPayment() + row["AmountDue"]);
        _that.totalOutstandingBalance(self.currencySymbol() + _that.totalOutstandingPayment().toFixed(eb_Config.roundOffDigitsAfterDecimal));
        _that.allCurrency(self.currencySymbol());
        /* Order Clicked via checkbox*/
        self.orderClicked = function () {
            _that.successPayment(0);
            _that.showError(0);
            if (self.isSelected()) {
                _that.countCheckBox(_that.countCheckBox() + 1); /*If checkbox is selected, the count of checkbox will increment by one*/
                /*To Check if their is already an amount is added*/
                if (!self.payableAmount() || self.payableAmount() === "") {
                    self.payableAmount(self.amount().toFixed(eb_Config.roundOffDigitsAfterDecimal));
                }
                /* Enable the Amount field if the checkbox is checked*/
                self.amountVisible(1);
            }
            else {
                _that.countCheckBox(_that.countCheckBox() - 1); /*If checkbox is unselected, the count of checkbox will decrement by one*/
                self.payableAmount("");
                self.amountVisible(0);
                self.showError(0);
            }

            /*Check if all the checkbox is selected then select main checkbox */
            if (_that.outstandingOrders().length === _that.countCheckBox()) {
                _that.mainSelect(1);
            } else {
                _that.mainSelect(0);
            }
            return true;
        };

        /*Payment Amount Field to get the actual value and perform operations on that*/
        self.payableAmount.subscribe(function (data) {
            var total = 0;
            var amountRegularExpression = /^\d*\.?\d{0,2}$/;

            if (data === "" || data === "0") {
                self.payableAmount("");
            }

            /*Restrict the user to enter only two decimal point*/
            if (amountRegularExpression.test(data) === false) {
                data = data.substring(0, data.length - 1);
                self.payableAmount(data);
            }

            eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                if (row.payableAmount() <= row.amount()) {
                    if (row.isSelected()) {
                        total = total + Number(row.payableAmount());
                        row.showError(0);
                    }
                } else {
                    row.showError(1);
                }

            });
            _that.totalPayment(self.currencySymbol() + total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
            _that.totalPaymentWithoutCurrency(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
        });

        /*To check wheather the input field is focus out, if it is then unchecked the checkbox*/
        self.payableAmount.focused.subscribe(function (checkEmpty) {
            if (!checkEmpty && !self.payableAmount()) {
                self.isSelected(0);
                self.amountVisible(0);
                _that.mainSelect(0);
                if (_that.countCheckBox() > 0)
                    _that.countCheckBox(_that.countCheckBox() - 1);
            }
        });
    };

    /*Loading outstandning orders from server*/
    _that.loadOutstandingOrderDataFromServer = function (data) {
        if (data.length > 0) {
            eBusinessJQObject.map(data, function (row) {
                _that.outstandingOrders.push(new _that.orderDetailsData(row));
            });
        } else {
            _that.showNoOrders(1);
            _that.showAllOrders(0);
        }
    };

    /*Get Outstanding orders form server*/
    _that.getOrdersDataFromServer = function (personId) {
        return eb_MakeMYPayment.outstandingOrderService(personId);
    };

    /*Loading the data*/
    if (_that.data) {
        _that.loadOutstandingOrderDataFromServer(_that.data);
    } else {
        _that.getOrdersDataFromServer(_that.personId).done(function (orders) {
            _that.loadOutstandingOrderDataFromServer(orders);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getProductDataFromServer failed:  " + xhr.responseText);
        });
    }

    /*Select and Unselect All checkbox*/
    _that.selectAll = function (data, event) {
        var total = 0;
        _that.successPayment(0);
        _that.showError(0);
        eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
            if (event.target.checked) {
                if (!row.payableAmount() || row.payableAmount() === "") {
                    row.payableAmount(row.amount().toFixed(eb_Config.roundOffDigitsAfterDecimal));
                }
                row.amountVisible(1);
                row.isSelected(true);
                _that.mainSelect(1);
                _that.countCheckBox(_that.outstandingOrders().length);
                total = total + Number(row.payableAmount());
            } else {
                row.isSelected(false);
                row.payableAmount("");
                row.amountVisible(0);
                row.showError(0);
                _that.mainSelect(0);
                _that.countCheckBox(0);
            }
            _that.totalPayment(row.currencySymbol() + total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
            _that.totalPaymentWithoutCurrency(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
        });
        return true;
    };

    /* Price validation allow only numeric character. */
    ko.bindingHandlers.numeric = {
        init: function (element, valueAccessor) {
            eBusinessJQObject(element).on("keydown", function (event) {
                /* Allow: backspace, delete, tab, escape, and enter */
                if (event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || event.keyCode === 13 || event.keyCode === 46 ||
                    /* Allow: Ctrl+A */
                    event.keyCode === 65 && event.ctrlKey === true ||
                    /* Allow: . , */
                    (event.keyCode === 188 || event.keyCode === 190 || event.keyCode === 110) ||
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

    /*Saved Card Method*/
    _that.savedCard = function (cardInfo) {
        if (_that.errors().length === 0) {
            var deferred = eBusinessJQObject.Deferred();
            var count = 0;
            var length = 0;
            var cardDetails;
            if (cardInfo.savedCard) {
                cardDetails = {
                    SavedPaymentId: cardInfo.id(),
                    CVV: cardInfo.cVV()
                };
            } else {
                cardDetails = {
                    SavedPaymentId: cardInfo.id
                };
            }

            /*To get the count of selected row*/
            eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                if (row.isSelected() && row.payableAmount() <= row.amount()) {
                    count++;
                }
            });
            if (count !== 0) {
                eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                    if (row.isSelected() && row.payableAmount() <= row.amount()) {
                        cardDetails.paymentAmount = row.payableAmount();
                        cardDetails.isSavedCard = true;
                        eb_MakeMYPayment.cardPayment(cardDetails, row.orderId()).done(function () {
                            length++;
                            if (length === count) {
                                deferred.resolve();
                            }
                            _that.showError(0);
                            /*To Calculate the balance of order placed*/
                            _that.totalPaymentForSuccessMessage(_that.totalPaymentForSuccessMessage() + Number(row.payableAmount()));
                        }).fail(function (xhr, textStatus, errorThrow) {
                            _that.showError(1);
                            if (xhr && typeof xhr.responseJSON !== 'undefined')
                                _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_MakeMYPayment));
                            else
                                _that.errorMessage(eb_MakeMYPayment.defaultErrorMessage);
                            deferred.reject();
                        });
                    }
                });
            } else {
                _that.showError(1);
                _that.errorMessage('Please select the Order');
                deferred.reject();
            }
        } else {
            _that.errors.showAllMessages();
        }
        return deferred.promise();
    };

    /* Payment Functions for Saved Card */
    _that.payBySavedCard = function (cardInfo) {
        if (_that.errors().length === 0) {
            var total = 0;
            _that.allowLoader(1);
            _that.totalPaymentForSuccessMessage(0);
            _that.successPayment(0);
            /*It is to identify that it is savedCreditCard parameter*/
            cardInfo.savedCard = 'creditCard';
            /*Calling Saved Card Method*/
            _that.savedCard(cardInfo).done(function () {
                _that.successPayment(1);
                cardInfo.cVV("");
                /*Call the outstanding orders data*/
                _that.getOrdersDataFromServer(_that.personId).done(function (orders) {
                    _that.totalPaymentForSuccessMessage(_that.allCurrency() + Number(_that.totalPaymentForSuccessMessage()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    _that.totalOutstandingPayment(0);
                    _that.totalOutstandingBalance(0);
                    _that.totalPayment(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    _that.totalPaymentWithoutCurrency(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    _that.mainSelect(0);
                    _that.allowLoader(0);
                    if (orders.length === 0) {
                        _that.outstandingOrders.removeAll();
                        _that.showNoOrders(1);
                        _that.showAllOrders(0);
                        _that.totalOutstandingBalance(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    } else {
                        _that.outstandingOrders.removeAll();
                        _that.loadOutstandingOrderDataFromServer(orders);

                    }
                }).fail(function (xhr, textStatus, errorThrow) {
                    console.info("getProductDataFromServer failed:  " + xhr.responseText);
                    _that.allowLoader(0);
                });
            }).fail(function () {
                console.log('Failed to processed payment');
                _that.allowLoader(0);
            });
        } else {
            _that.errors.showAllMessages();
        }
    };

    /* Payment Functions for ACH Saved Card */
    _that.payByACHSavedCard = function (cardInfo) {
        if (_that.errors().length === 0) {
            var total = 0;
            _that.allowLoader(1);
            _that.totalPaymentForSuccessMessage(0);
            _that.successPayment(0);
            /*Calling Saved Card Method*/
            _that.savedCard(cardInfo).done(function () {
                _that.successPayment(1);
                /*Call the outstanding orders data*/
                _that.getOrdersDataFromServer(_that.personId).done(function (orders) {
                    _that.totalPaymentForSuccessMessage(_that.allCurrency() + Number(_that.totalPaymentForSuccessMessage()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    _that.totalOutstandingPayment(0);
                    _that.totalOutstandingBalance(0);
                    _that.totalPayment(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    _that.totalPaymentWithoutCurrency(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    _that.mainSelect(0);
                    _that.allowLoader(0);
                    if (orders.length === 0) {
                        _that.outstandingOrders.removeAll();
                        _that.showNoOrders(1);
                        _that.showAllOrders(0);
                        _that.totalOutstandingBalance(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    } else {
                        _that.outstandingOrders.removeAll();
                        _that.loadOutstandingOrderDataFromServer(orders);

                    }
                }).fail(function (xhr, textStatus, errorThrow) {
                    console.info("getProductDataFromServer failed:  " + xhr.responseText);
                    _that.allowLoader(0);
                });
            }).fail(function () {
                console.log('Failed to processed payment');
                _that.allowLoader(0);
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

        return (nCheck % 10) === 0;
    }

    /* Credit Card Method */
    _that.creditCard = function (cardInfo) {
        if (_that.errors().length === 0) {
            var deferred = eBusinessJQObject.Deferred();
            var count = 0;
            var length = 0;
            var serviceCallCount = 0;

            if (!isValidCreditCard(cardInfo.cardNumber())) {
                cardInfo.showError(1);
                _that.errorMessage(eb_MakeMYPayment.errorMessages['Invalid card number']);
                deferred.reject();
                return deferred.promise();
            }

            if (cardInfo.isDateExpired(eb_paymentControl.monthConstants[cardInfo.selectedMonth()], cardInfo.selectedYear())) {
                cardInfo.showError(1);
                _that.errorMessage(eb_MakeMYPayment.errorMessages['Card date expired']);
                deferred.reject();
                return deferred.promise();
            }

            /*Card details data for credit card*/
            var cardDetails = {
                cardNumber: cardInfo.cardNumber(),
                expirationMonth: eb_paymentControl.monthConstants[cardInfo.selectedMonth()],
                expirationYear: cardInfo.selectedYear(),
                cvv: cardInfo.cVV(),
                saveForFutureUse: cardInfo.saveForFutureUse()
            };

            /*To get the count of selected row*/
            eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                if (row.isSelected() && row.payableAmount() <= row.amount()) {
                    count++;
                }
            });
            if (count !== 0) {
                eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                    //Logic to avoid Multiple SPM's being created
                    if (serviceCallCount > 0)
                        cardDetails.saveForFutureUse = false;

                    if (row.isSelected() && row.payableAmount() <= row.amount()) {
                        cardDetails.paymentAmount = row.payableAmount();
                        cardDetails.isCreditCard = true;
                        eb_MakeMYPayment.cardPayment(cardDetails, row.orderId()).done(function () {
                            length++;
                            if (length === count) {
                                deferred.resolve();
                            }
                            /* To Calculate the balance of order placed */
                            _that.totalPaymentForSuccessMessage(_that.totalPaymentForSuccessMessage() + Number(row.payableAmount()));
                        }).fail(function (xhr, textStatus, errorThrow) {

                            if (xhr && typeof xhr.responseJSON !== 'undefined')
                                _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_MakeMYPayment));
                            else
                                _that.errorMessage(eb_MakeMYPayment.defaultErrorMessage);
                            deferred.reject();
                        });

                        serviceCallCount = serviceCallCount + 1;
                    }
                });
            } else {
                deferred.reject();
            }
        } else {
            _that.errors.showAllMessages();
        }
        return deferred.promise();
    };

    /* Credit Card/ACH Method */
    _that.cardPointeTokenizer = function (cardDetails, paymentType) {
        if (_that.errors().length === 0) {
            var deferred = eBusinessJQObject.Deferred();
            if (paymentType === "ach") {
                eb_MakeMYPayment.achPaymentBulk(cardDetails).done(function () {
                    deferred.resolve();

                }).fail(function (xhr, textStatus, errorThrow) {

                    if (xhr && typeof xhr.responseJSON !== 'undefined')
                        _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_MakeMYPayment));
                    else
                        _that.errorMessage(eb_MakeMYPayment.defaultErrorMessage);
                    deferred.reject();
                });
            }
            else {
                eb_MakeMYPayment.cardPaymentBulk(cardDetails).done(function () {
                    deferred.resolve();

                }).fail(function (xhr, textStatus, errorThrow) {

                    if (xhr && typeof xhr.responseJSON !== 'undefined')
                        _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_MakeMYPayment));
                    else
                        _that.errorMessage(eb_MakeMYPayment.defaultErrorMessage);
                    deferred.reject(); 
                });
            }
           
        }
 
        return deferred.promise();
    };

    /*Payment Functions for Credit Card */
    _that.payByNewCard = function (cardInfo) {
        if (_that.errors().length === 0) {
            var total = 0;
            /*Calling credit card method*/
            _that.totalPaymentForSuccessMessage(0);
            _that.successPayment(0);
            _that.allowLoader(1);
            _that.creditCard(cardInfo).done(function () {
                _that.successPayment(1);
                /*To reload the saved card function */
                cardInfo.reloadSavedCard();
                /* Clear cardinfo details */
                cardInfo.cardNumber("");
                cardInfo.cVV("");
                cardInfo.selectedMonth("Month");
                cardInfo.selectedYear("Year");
                /*Call the outstanding orders data*/
                _that.getOrdersDataFromServer(_that.personId).done(function (orders) {
                    _that.totalPaymentForSuccessMessage(_that.allCurrency() + Number(_that.totalPaymentForSuccessMessage()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    _that.totalOutstandingPayment(0);
                    _that.totalOutstandingBalance(0);
                    _that.mainSelect(0);
                    _that.allowLoader(0);
                    _that.totalPayment(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    _that.totalPaymentWithoutCurrency(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    if (orders.length === 0) {
                        _that.outstandingOrders.removeAll();
                        _that.showNoOrders(1);
                        _that.showAllOrders(0);
                        _that.totalOutstandingBalance(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    } else {
                        _that.outstandingOrders.removeAll();
                        _that.loadOutstandingOrderDataFromServer(orders);
                    }
                }).fail(function (xhr, textStatus, errorThrow) {
                    console.info("getProductDataFromServer failed:  " + xhr.responseText);
                    _that.allowLoader(0);
                });
            }).fail(function () {
                console.log("Failed to processed payment");
                _that.allowLoader(0);
                cardInfo.showError(1);
                cardInfo.errorMessage(_that.errorMessage());
            });
        } else {
            _that.errors.showAllMessages();
        }
    };

    /*Ach method call for payment*/
    _that.achCard = function (cardInfo) {
        if (_that.errors().length === 0) {
            var deferred = eBusinessJQObject.Deferred();
            var count = 0;
            var length = 0;
            var serviceCallCount = 0;
            /*Card details data for credit card*/
            var cardDetails = {
                accountNumber: cardInfo.ACHAccountNumber(),
                accountName: cardInfo.ACHAccountName(),
                bank: cardInfo.ACHBankName(),
                aba: cardInfo.ACHRoutingNumber(),
                saveForFutureUse: cardInfo.ACHsaveForFutureUse()
            };

            eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                if (row.isSelected() && row.payableAmount() <= row.amount()) {
                    count++;
                }
            });
            if (count !== 0) {
                eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                    //EB-2181: Logic to avoid Multiple SPM's being created, hacky fix but that's how it has been done for Credit Cards too and has been since long
                    //TODO: Send requests in just one request, Bulk Payment, as done for Hosted & Tokenizer, need endpoint changes in it as well, should be taken in 7.2
                    if (serviceCallCount > 0) {
                        cardDetails.saveForFutureUse = false;
                    }

                    if (row.isSelected() && row.payableAmount() <= row.amount()) {
                        cardDetails.paymentAmount = row.payableAmount();
                        cardDetails.isACHCard = true;
                        eb_MakeMYPayment.cardPayment(cardDetails, row.orderId()).done(function () {
                            length++;
                            if (length === count) {
                                deferred.resolve();
                            }
                            /*To Calculate the balance of order placed*/
                            _that.totalPaymentForSuccessMessage(_that.totalPaymentForSuccessMessage() + Number(row.payableAmount()));
                        }).fail(function (xhr, textStatus, errorThrow) {
                            _that.showError(1);
                            if (xhr && typeof xhr.responseJSON !== 'undefined')
                                _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_MakeMYPayment));
                            else
                                _that.errorMessage(eb_MakeMYPayment.defaultErrorMessage);
                            deferred.reject();
                        });

                        serviceCallCount = serviceCallCount + 1;
                    }
                });
            } else {
                _that.showError(1);
                _that.errorMessage('Please select the Order');
                deferred.reject();
            }
        } else {
            _that.errors.showAllMessages();
        }
        return deferred.promise();

    };

    /*Pay by the ACH Card*/
    _that.payByACHCard = function (cardInfo) {
        if (_that.errors().length === 0) {
            var total = 0;
            _that.totalPaymentForSuccessMessage(0);
            _that.successPayment(0);
            _that.allowLoader(1);
            /*calling ach card*/
            _that.achCard(cardInfo).done(function () {
                _that.successPayment(1);
                /*To reload the saved card function */
                cardInfo.reloadSavedCard();
                /* Clear cardinfo details */
                cardInfo.ACHAccountNumber(""),
                    cardInfo.ACHAccountName(""),
                    cardInfo.ACHBankName(""),
                    cardInfo.ACHRoutingNumber(""),
                    cardInfo.errors.showAllMessages(false);
                /*Call the outstanding orders data*/
                _that.getOrdersDataFromServer(_that.personId).done(function (orders) {
                    _that.totalPaymentForSuccessMessage(_that.allCurrency() + Number(_that.totalPaymentForSuccessMessage()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    _that.totalOutstandingPayment(0);
                    _that.totalOutstandingBalance(0);
                    _that.mainSelect(0);
                    _that.allowLoader(0);
                    _that.totalPayment(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    _that.totalPaymentWithoutCurrency(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    if (orders.length === 0) {
                        _that.outstandingOrders.removeAll();
                        _that.showNoOrders(1);
                        _that.showAllOrders(0);
                        _that.totalOutstandingBalance(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                    } else {
                        _that.outstandingOrders.removeAll();
                        _that.loadOutstandingOrderDataFromServer(orders);
                    }
                }).fail(function (xhr, textStatus, errorThrow) {
                    console.info("getProductDataFromServer failed:  " + xhr.responseText);
                    _that.allowLoader(0);
                });
            }).fail(function () {
                console.log("Failed to processed payment");
                _that.allowLoader(0);
                cardInfo.showErrorMessage(1);
                cardInfo.errorMessage(_that.errorMessage());
            });
        } else {
            _that.errors.showAllMessages();
        }
    };

    /*Pay by the ACH Card*/
    _that.payByBluepayHPP = function (cardInfo) {
        _that.paymentControl.cardInfo = cardInfo;

        if (_that.errors().length === 0) {
            var total = 0;
            var count = 0;

            _that.totalPaymentForSuccessMessage(0);
            _that.successPayment(0);
            _that.allowLoader(1);

            var serviceURL = eb_MakeMYPayment.serviceUrls['Pay By Bluepay HPP'].replace('{personId}', eb_MakeMYPayment.personId);

            var postDataArray = [];

            var totalAmt = 0;

            eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                if (row.isSelected() && row.payableAmount() <= row.amount()) {
                    count++;
                    totalAmt += Number(row.payableAmount());
                }
            });
            if (count !== 0) {
                eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                    if (row.isSelected() && row.payableAmount() <= row.amount()) {
                        var postDataSingle = {
                            "paymentAmount": -1,
                            "orderId": -1
                        };
                        postDataSingle.paymentAmount = row.payableAmount();
                        postDataSingle.orderId = row.orderId();

                        postDataArray.push(postDataSingle);

                    }
                });
            } else {
                _that.showError(1);
                _that.allowLoader(0);
                _that.errorMessage('Please select the Order');
                return;
            }

            _that.totalPaymentForSuccessMessage(Number(totalAmt).toFixed(eb_Config.roundOffDigitsAfterDecimal));


            eb_Config.retrieveCSRFTokens().always(function (headers) {
                eBusinessJQObject.ajax({
                    url: serviceURL,
                    type: "POST",
                    data: JSON.stringify(postDataArray),
                    xhrFields: {
                        withCredentials: true
                    },
                    headers: headers,
                    contentType: 'application/json'
                }).done(function (data) {
                    _that.allowLoader(0);
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
                    if (xhr && typeof xhr.responseJSON !== 'undefined')
                        _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_MakeMYPayment));
                    else
                        _that.errorMessage(eb_MakeMYPayment.defaultErrorMessage);
                    _that.allowLoader(0);
                    _that.showError(1);
                });
            });

        } else {
            _that.errors.showAllMessages();
        }
    };

    /*Pay by iFrame Tokenizer*/
    _that.payByiFrameTokenizer = function (cardInfo) {

        if (_that.errors().length === 0) {
            _that.showError(0);
            var total = 0;
            var totalNoOfOrdersToBePaidOff = 0;

            _that.totalPaymentForSuccessMessage(0);
            _that.successPayment(0);

            var postDataArray = [];

            var totalAmt = 0;
            eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                if (row.isSelected() && row.payableAmount() <= parseFloat(row.amount())) {
                    totalNoOfOrdersToBePaidOff++;
                    totalAmt += Number(row.payableAmount());
                }
            });
            if (totalNoOfOrdersToBePaidOff === 0) {
                _that.showError(1);
                _that.allowLoader(0);
                _that.errorMessage('Please select the Order');
                return;
            }

            _that.totalPaymentForSuccessMessage(Number(totalAmt).toFixed(eb_Config.roundOffDigitsAfterDecimal));

            if (totalNoOfOrdersToBePaidOff !== 0) {

                eb_tokenizer.loadTokenizerModal().done(function (data) {
                    var token = data.message;
                    var expiryDate = data.expiry;
                    var saveForFutureUse = data.saveForFutureUse;
                    var saveToTypes = data.saveToTypes || "Person";
                    var paymentType;


                    postDataArray = [];
                    eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                        if (row.isSelected() && row.payableAmount() <= parseFloat(row.amount())) {

                            var postDataSingle = {
                                "paymentAmount": -1,
                                "orderId": -1
                            };
                            postDataSingle.paymentAmount = row.payableAmount();
                            postDataSingle.orderId = row.orderId();

                            postDataArray.push(postDataSingle);

                        }
                    });

                    if (data.isACH) {
                        eBusinessJQObject.map(postDataArray, function (postData){
                            postData.AccountNumber = token;
                            postData.AccountName = data.accName;
                            postData.Bank = data.bank;
                            postData.saveForFutureUse = saveForFutureUse || false;
                            postData.saveToTypes = saveToTypes;
                            postData.CheckNumber = "ebiz payment";
                        });
                        paymentType="ach"
                    }
                    else {
                        var formattedExpiryDate = new Intl.DateTimeFormat('en-US').format(new Date(expiryDate.slice(0, 4) + "/" + expiryDate.slice(4)));
                        eBusinessJQObject.map(postDataArray, function (postData) {
                            postData.CCAccountNumber = token;
                            postData.CCExpireDate = formattedExpiryDate;
                            postData.saveForFutureUse = saveForFutureUse || false;
                            postData.saveToTypes = saveToTypes;
                        });

                    }
                    _that.allowLoader(1);

                    _that.cardPointeTokenizer(postDataArray, paymentType).done(function () {
                        _that.successPayment(1);

                        /*Call the outstanding orders data*/
                        _that.getOrdersDataFromServer(_that.personId || eb_MakeMYPayment.personId).done(function (orders) {
                            _that.totalPaymentForSuccessMessage(_that.allCurrency() + Number(_that.totalPaymentForSuccessMessage()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
                            _that.totalOutstandingPayment(0);
                            _that.totalOutstandingBalance(0);
                            _that.mainSelect(0);
                            _that.allowLoader(0);
                            _that.totalPayment(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                            _that.totalPaymentWithoutCurrency(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                            if (orders.length === 0) {
                                _that.outstandingOrders.removeAll();
                                _that.showNoOrders(1);
                                _that.showAllOrders(0);
                                _that.totalOutstandingBalance(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                            } else {
                                _that.outstandingOrders.removeAll();
                                _that.loadOutstandingOrderDataFromServer(orders);
                            }
                        }).fail(function (xhr, textStatus, errorThrow) {
                            console.info("getProductDataFromServer failed:  " + xhr.responseText);
                            _that.allowLoader(0);
                        });
                    }).fail(function () {
                        console.log("Failed to processed payment");
                        _that.allowLoader(0);
                        cardInfo.showError(1);
                        cardInfo.errorMessage(_that.errorMessage());
                    }).always(function () {
                        _that.allowLoader(0);
                    });
                }
                ).fail(function (data, msg, jhr) {
                    console.log(msg);
                });

            }
            else {
                _that.showError(1);
                _that.errorMessage('Please select at least an Order');
                _that.allowLoader(0);
            }
        } else {
            _that.errors.showAllMessages();
        }
    };

    _that.tokenizeGPayData = function (gPayTokenData) {
        var defer = eBusinessJQObject.Deferred();

        var serviceURL = eb_MakeMYPayment.serviceUrls['CardPointe Tokenize'];
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
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_MakeMYPayment));
                else
                    _that.errorMessage(eb_MakeMYPayment.defaultErrorMessage);
            }).always(function () {
            });
        });
        return defer.promise();

    }

    /*Checks if all page specific conditions are satisfied before proceeding for payment using Google Pay.*/
    _that.isValidPayment = function () {
        if (_that.errors().length === 0) {
            _that.showError(0);
            var totalNoOfOrdersToBePaidOff = 0;

            eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                if (row.isSelected() && row.payableAmount() <= parseFloat(row.amount())) {
                    totalNoOfOrdersToBePaidOff++;
                }
            });
            if (totalNoOfOrdersToBePaidOff === 0) {
                _that.showError(1);
                _that.allowLoader(0);
                _that.errorMessage('Please select at least one Order');
            }
            else {
                return true;
            }
        } else {
            _that.errors.showAllMessages();
        }
        return false;
    }
    
    /*Pay by Google Pay*/
    _that.payByGPay = function (data) {
        if (_that.errors().length === 0) {
            _that.showError(0);
            var total = 0;

            _that.totalPaymentForSuccessMessage(0);
            _that.successPayment(0);

            var postDataArray = [];

            var totalAmt = 0;
            eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                if (row.isSelected() && row.payableAmount() <= parseFloat(row.amount())) {
                    totalAmt += Number(row.payableAmount());
                }
            });
            
            _that.totalPaymentForSuccessMessage(Number(totalAmt).toFixed(eb_Config.roundOffDigitsAfterDecimal));
                var defer = eBusinessJQObject.Deferred();
                var token = data;//data.token;

                postDataArray = [];
                eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                    if (row.isSelected() && row.payableAmount() <= parseFloat(row.amount())) {

                        var postDataSingle = {
                            "paymentAmount": -1,
                            "orderId": -1
                        };
                        postDataSingle.paymentAmount = row.payableAmount();
                        postDataSingle.orderId = row.orderId();

                        postDataArray.push(postDataSingle);

                    }
                });

                _that.allowLoader(1);
                eb_Config.retrieveCSRFTokens().always(function (headers) {

                    _that.tokenizeGPayData(token).done(function (cpToken) {
                        eBusinessJQObject.map(postDataArray, function (postData) {
                            postData.CCAccountNumber = cpToken;
                            postData.saveForFutureUse = false;
                        });

                        eb_MakeMYPayment.gPayPayment(postDataArray).done(function (data) {
                            defer.resolve(data);
                            _that.successPayment(1);

                            /*Call the outstanding orders data*/
                            _that.getOrdersDataFromServer(_that.personId || eb_MakeMYPayment.personId).done(function (orders) {
                                _that.totalPaymentForSuccessMessage(_that.allCurrency() + Number(_that.totalPaymentForSuccessMessage()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
                                _that.totalOutstandingPayment(0);
                                _that.totalOutstandingBalance(0);
                                _that.mainSelect(0);
                                _that.allowLoader(0);
                                _that.totalPayment(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                                _that.totalPaymentWithoutCurrency(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                                if (orders.length === 0) {
                                    _that.outstandingOrders.removeAll();
                                    _that.showNoOrders(1);
                                    _that.showAllOrders(0);
                                    _that.totalOutstandingBalance(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                                } else {
                                    _that.outstandingOrders.removeAll();
                                    _that.loadOutstandingOrderDataFromServer(orders);
                                }
                            }).fail(function (xhr, textStatus, errorThrow) {
                                console.info("getOrdersDataFromServer failed:  " + xhr.responseText);
                                _that.allowLoader(0);
                            });
                        }).fail(function (xhr, msg, data) {
                            _that.allowLoader(0);
                            _that.showError(1);
                            defer.reject(msg);
                            if (xhr && typeof xhr.responseJSON !== 'undefined')
                                _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_MakeMYPayment));
                            else
                                _that.errorMessage(eb_MakeMYPayment.defaultErrorMessage);
                        }).always(function () {
                        });
                    });


                });
                return defer.promise();    
        } else {
            _that.errors.showAllMessages();
        }
        
    };

    ko.computed(function () {
        gPayPriceSettings.totalPrice = _that.totalPaymentWithoutCurrency();
        applePayPriceSettings.totalPrice = _that.totalPaymentWithoutCurrency();
    });

    _that.tokenizeApplePayData = function (applePayTokenData) {
        var defer = eBusinessJQObject.Deferred();

        var serviceURL = eb_MakeMYPayment.serviceUrls['CardPointe Tokenize Apple Pay'];
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
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_MakeMYPayment));
                else
                    _that.errorMessage(eb_MakeMYPayment.defaultErrorMessage);
            }).always(function () {
            });
        });
        return defer.promise();

    }

    /*Pay by Apple Pay*/
    _that.payByApplePay = function (data) {
        if (_that.errors().length === 0) {
            _that.showError(0);
            var total = 0;

            _that.totalPaymentForSuccessMessage(0);
            _that.successPayment(0);

            var postDataArray = [];

            var totalAmt = 0;
            eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                if (row.isSelected() && row.payableAmount() <= parseFloat(row.amount())) {
                    totalAmt += Number(row.payableAmount());
                }
            });

            _that.totalPaymentForSuccessMessage(Number(totalAmt).toFixed(eb_Config.roundOffDigitsAfterDecimal));
            var defer = eBusinessJQObject.Deferred();
            var token = data;//data.token;

            postDataArray = [];
            eBusinessJQObject.map(_that.outstandingOrders(), function (row) {
                if (row.isSelected() && row.payableAmount() <= parseFloat(row.amount())) {

                    var postDataSingle = {
                        "paymentAmount": -1,
                        "orderId": -1
                    };
                    postDataSingle.paymentAmount = row.payableAmount();
                    postDataSingle.orderId = row.orderId();

                    postDataArray.push(postDataSingle);

                }
            });

            _that.allowLoader(1);
            eb_Config.retrieveCSRFTokens().always(function (headers) {
                _that.tokenizeApplePayData(token).done(function (cpToken) {
                eBusinessJQObject.map(postDataArray, function (postData) {
                    postData.CCAccountNumber = cpToken;
                    postData.saveForFutureUse = false;
                });

                eb_MakeMYPayment.ApplePayPayment(postDataArray).done(function (data) {
                    defer.resolve(data);
                    _that.successPayment(1);

                    /*Call the outstanding orders data*/
                    _that.getOrdersDataFromServer(_that.personId || eb_MakeMYPayment.personId).done(function (orders) {
                        _that.totalPaymentForSuccessMessage(_that.allCurrency() + Number(_that.totalPaymentForSuccessMessage()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
                        _that.totalOutstandingPayment(0);
                        _that.totalOutstandingBalance(0);
                        _that.mainSelect(0);
                        _that.allowLoader(0);
                        _that.totalPayment(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                        _that.totalPaymentWithoutCurrency(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                        if (orders.length === 0) {
                            _that.outstandingOrders.removeAll();
                            _that.showNoOrders(1);
                            _that.showAllOrders(0);
                            _that.totalOutstandingBalance(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
                        } else {
                            _that.outstandingOrders.removeAll();
                            _that.loadOutstandingOrderDataFromServer(orders);
                        }
                    }).fail(function (xhr, textStatus, errorThrow) {
                        console.info("getOrdersDataFromServer failed:  " + xhr.responseText);
                        _that.allowLoader(0);
                    });
                }).fail(function (xhr, msg, data) {
                    _that.allowLoader(0);
                    _that.showError(1);
                    defer.reject(msg);
                    if (xhr && typeof xhr.responseJSON !== 'undefined')
                        _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_MakeMYPayment));
                    else
                        _that.errorMessage(eb_MakeMYPayment.defaultErrorMessage);
                }).always(function () {
                });
            });
            });
            return defer.promise();
        } else {
            _that.errors.showAllMessages();
        }

    };

    _that.bluepayHPPPostResponseUrl = eb_MakeMYPayment.ServicePath + 'ProfilePersons/{personId}/OrderHistory/MakePayment/BulkOrder/ProcessRemoteResponse'.replace('{personId}', eb_MakeMYPayment.personId);

    _that.handleBluepayHPPPostResponseSuccess = function (data) {
        /*eBusinessJQObject(_that.domElement).find("#eb-BluePay").modal("hide");*/
        /*Bootstrap5.3 Modal Code Change Start*/
        var bluepayModal = bootstrap.Modal.getOrCreateInstance('#eb-BluePay');
        bluepayModal.hide();
        /*Bootstrap5.3 Modal Code Change End*/

        _that.successPayment(1);
        /*To reload the saved card function */
        _that.paymentControl.cardInfo.reloadSavedCard();

        var total = 0;
        /*Call the outstanding orders data*/
        _that.getOrdersDataFromServer(_that.personId).done(function (orders) {
            _that.totalPaymentForSuccessMessage(_that.allCurrency() + Number(_that.totalPaymentForSuccessMessage()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
            _that.totalOutstandingPayment(0);
            _that.totalOutstandingBalance(0);
            _that.mainSelect(0);
            _that.allowLoader(0);
            _that.totalPayment(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
            _that.totalPaymentWithoutCurrency(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
            if (orders.length === 0) {
                _that.outstandingOrders.removeAll();
                _that.showNoOrders(1);
                _that.showAllOrders(0);
                _that.totalOutstandingBalance(total.toFixed(eb_Config.roundOffDigitsAfterDecimal));
            } else {
                _that.outstandingOrders.removeAll();
                _that.loadOutstandingOrderDataFromServer(orders);
            }
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getProductDataFromServer failed:  " + xhr.responseText);
            _that.showError(1);
            if (xhr && typeof xhr.responseJSON !== 'undefined')
                _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_MakeMYPayment));
            else
                _that.errorMessage(eb_MakeMYPayment.defaultErrorMessage);

            _that.allowLoader(0);
        });
    };

    _that.handleBluepayHPPPostResponseFailure = function (xhr, msg, data) {

        /*eBusinessJQObject(_that.domElement).find("#eb-BluePay").modal("hide");*/
        /*Bootstrap5.3 Modal Code Change Start*/
        var bluepayModal = bootstrap.Modal.getOrCreateInstance('#eb-BluePay');
        bluepayModal.hide();
        /*Bootstrap5.3 Modal Code Change End*/

        console.log("Failed to processed payment");

        _that.showError(1);
        if (xhr && typeof xhr.responseJSON !== 'undefined')
            _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_MakeMYPayment));
        else
            _that.errorMessage(eb_MakeMYPayment.defaultErrorMessage);

        _that.allowLoader(0);
        _that.paymentControl.cardInfo.showErrorMessage(1);
        _that.paymentControl.cardInfo.errorMessage(_that.errorMessage());
    };

    /* On go to payment */
    _that.gotToPayment = function () {
        var currentDiv = eBusinessJQObject(_that.domElement).find('.paymentMethodsCheckData').offset().top;
        window.scrollTo(0, currentDiv);
    };

    /*CheckScroll of Browser*/
    _that.checkResize = function () {
        if (_that.outstandingOrders().length > 6) {
            _that.payMe(1);
        }
    };

    _that.checkResize();
};