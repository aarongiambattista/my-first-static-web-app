/**
 * Define eb_donation class.
 * @class eb_donation
 * */
var eb_donation = eb_donation || {};

/**
 * Control level setting: Site path.
 * @property eb_donation.SitePath
 * @type {String}
 */
eb_donation.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_donation.TemplatePath
 * @type {String}
 */
eb_donation.TemplatePath = "html/Donations.html";

/**
 * The path to the eBusiness SOA layer.
 * @property eb_donation.ServicePath
 * @type {String}
 */
eb_donation.ServicePath = eb_Config.ServicePathV1;

/**
 * GET fund raising product
 * @property eb_donation.fundRaisingProduct
 * @type {String}
 */
eb_donation.fundRaisingProduct = eb_donation.ServicePath + "FundRaisingProducts";

/**
 * Post fund raising checkout creditcard
 * @property eb_donation.fundRaisingProduct
 * @type {String}
 */
eb_donation.fundCreditCard = eb_donation.ServicePath + "Fundraising/Checkout/CreditCard";

/**
 * Post fund raising checkout saved payment
 * @property eb_donation.fundRaisingProduct
 * @type {String}
 */
eb_donation.fundSavedPayment = eb_donation.ServicePath + "Fundraising/Checkout/SavedPayment";

/**
 * Post fund raising checkout ACH payment
 * @property eb_donation.fundACHPayment
 * @type {String}
 */
eb_donation.fundACHPayment = eb_donation.ServicePath + "Fundraising/Checkout/ACH";

/**
 * Post fund raising checkout ACH payment
 * @property eb_donation.fundACHPayment
 * @type {String}
 */
eb_donation.fundACHPayment = eb_donation.ServicePath + "Fundraising/Checkout/ACH";

/**
 * Post fund raising checkout ACH Tokenizer payment
 * @property eb_donation.fundACHTokenizerPayment
 * @type {String}
 */
eb_donation.fundACHTokenizerPayment = eb_donation.ServicePath + "Fundraising/Checkout/ACHTokenizer";

/**
 * Retrieve Bluepay Hosted Payment Request URL for Fund Raising
 * @property eb_donation.bluepayHPPPayment
 * @type {String}
 */
eb_donation.bluepayHPPPayment = eb_donation.ServicePath + "Fundraising/Checkout/GetRemotePaymentRequest";

/**
 * Post fund raising checkout GPay payment
 * @property eb_donation.fundGPayPayment
 * @type {String}
 */
eb_donation.fundGPayPayment = eb_donation.ServicePath + "Fundraising/Checkout/GPay";

/**
 * Cardpointe Tokenizer service
 * @property eb_donation.tokenize
 * @type {String}
 */
eb_donation.tokenize = eb_donation.ServicePath + "CardPointe/ccn/tokenize";

/**
 * Cardpointe Tokenizer service for Apple Pay
 * @property eb_donation.tokenizeApplePay
 * @type {String}
 */
eb_donation.tokenizeApplePay = eb_donation.ServicePath + "CardPointe/ccn/tokenizeApplePay";

/**
 * Post fund raising checkout ApplePay payment
 * @property eb_donation.fundApplePayPayment
 * @type {String}
 */
eb_donation.fundApplePayPayment = eb_donation.ServicePath + "Fundraising/Checkout/ApplePay";

/**
 * Default error message.
 * @property eb_donation.defaultErrorMessage
 * @type {String}
 * */
eb_donation.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/**
 * Default image URL.
 * If product image is not available, default image will be shown.
 * @property eb_donation.defaultImage
 * @type {String}
 * */
eb_donation.defaultImage = "./images/products/coming-soon.png";


/**
 * Globally defined error codes object for the control.
 * Every error code should have boolean 'useServerMessage' attribute, which when true suggests we are
 * showing service error message on the UI.
 * If the 'useServerMessage' is defined as false, then provide another attribute 'frontEndMessage' with
 * the error string which will be shown on UI.
 * If 'useServerMessage' is false and 'frontEndMessage' is not defined, default error message will be shown.
 * If service error response contains error code not defined in this object then default error message will be shown.
 * 
 * @property eb_donation.errorResponses
 * @type {Object}
 * */
eb_donation.errorResponses = {
    202: { useServerMessage: true },
    203: { useServerMessage: true },
    430: { useServerMessage: true },
    601: { useServerMessage: false, frontEndMessage: 'Sorry, you are not eligible for “Bill me later” option. Please contact the customer support for further assistance with this order.' },
    700: { useServerMessage: false, frontEndMessage: 'An error occurred during Payment processing. Please check the payment details entered and try again. If the problem persists please contact our customer service department.' },
    850: { useServerMessage: true },
    1102: { useServerMessage: false, frontEndMessage: 'An error occurred during Bluepay Remote Payment processing. Please check the payment details entered and try again. If the problem persists please contact our customer service department.' }
};

/* Error messages */
eb_donation.errorMessages = {
    'Card date expired': 'Your card is expired.',
    'Invalid card number': 'Sorry, this card is invalid. Please enter a valid card number.'
};

/**
 * Order Confirmation page redirection
 * @property eb_donation.orderConfirmationUrl
 * @type {String}
 * */
eb_donation.orderConfirmationUrl = eb_donation.SitePath + "OrderConfirmation.html";


/**
 * Rendering public method to load HTML template.
 * Based on page level configuration it will select the template and load in DOM.
 * Template path and DOM element are required parameters.
 * GET the template by Ajax call using template path and then assign it to DOM element.
 * @method eb_donation.render
 * @param {Object} options Object with data required for getting HTML template through Ajax call.
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * @returns {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_donation.render = function (options) {
    var defer = eBusinessJQObject.Deferred();
    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        options.templatePath = eb_donation.SitePath + eb_donation.TemplatePath;

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
 * Get fund raising data from the server through the get service call.
 * @method eb_donation.getFundRaisingData
 * @return {Object} Return Array of state
 * */
eb_donation.getFundRaisingData = function () {
    var deferred = eBusinessJQObject.Deferred();
    var servicePath = eb_donation.fundRaisingProduct;
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
 * This method is used to credit card or saved card or ACH payment based on card type.
 * @method eb_donation.cardPayment
 * @param {Object} cardDetails CardDetails of login user.
 * @param {String} card card type to do credit card or saved card or ACH payment
 * @return {Object} jQuery promise object which when resolved returns payment details.
 */
eb_donation.cardPayment = function (cardDetails, card) {
    var defer = eBusinessJQObject.Deferred();
    var serviceURL;

    if (card === "isSavedCard") {
        serviceURL = eb_donation.fundSavedPayment;
    }

    if (card === "isCreditCard") {
        serviceURL = eb_donation.fundCreditCard;
    }

    if (card === "isAchCard") {
        serviceURL = eb_donation.fundACHPayment;
    }

    if (card === "isACHTokenizer") {
        serviceURL = eb_donation.fundACHTokenizerPayment;
    }

    if (card === "isGPay") {
        serviceURL = eb_donation.fundGPayPayment;
    }

    if (card === "isApplePay") {
        serviceURL = eb_donation.fundApplePayPayment;
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
 * Donation Model for binding data.
 * The model contains observable properties to hold corresponding data returned from services.
 * Also, model contains computed properties and methods to support Donation functionality.
 * @method eb_donation.model
 * @param {Object} options Contains necessary data which is required for Donations functionality.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL.
 * @param {Object} options.data Contains data returned from service which is used to construct Donations model.
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 */
eb_donation.model = function (options) {
    var _that = this;

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement property is required.", stack: Error().stack };
    }

    if (options.personId) {
        eb_donation.personId = options.personId;
        _that.personId = eb_donation.personId;
    } else {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }

    _that.domElement = options.domElement;
    _that.fundRaisingOrders = ko.observableArray();
    _that.allFundRaisingPrices = ko.observableArray();
    _that.noAmountAvailable = ko.observable(0);
    _that.amount = ko.observable('').extend({ required: { params: true, message: 'Please enter an amount' } });/*Amount to be paid*/

    _that.showFundName = ko.observable("");
    _that.fundErrorMessage = ko.observable(0);
    _that.focus = ko.observable(false);/*focus on input field*/
    _that.showLoader = ko.observable(0);

    // If the amount is not entered then it shows the message
    var propBooleanlValid = ko.validation.group(_that.amount, { deep: false });
    propBooleanlValid.showAllMessages(false);

    /* Payment Control attributes */
    _that.paymentControl = {};
    _that.paymentControl.showBillMeLaterPayType = false;
    _that.paymentControl.savedCardsTitle = 'Saved Credit Cards';
    _that.paymentControl.cardTitle = 'New Card';
    _that.paymentControl.paymentControlButtonName = 'Donate';
    _that.paymentControl.showSaveForFutureCheckBox = true;
    _that.paymentControl.showEditDeleteSavedCardButtons = false;
    _that.paymentControl.bluePayURL = ko.observable("");

    /* Payment */
    _that.showError = ko.observable(0);
    _that.errorMessage = ko.observable("");
    _that.showSuccess = ko.observable(0);
    _that.successMessage = ko.observable("");

    _that.applyPrice = function (price, currencySymbol) {
        var self = this;
        if (_that.amount() === price) {
            /*Apply active class if the default price is previously given */
            self.applyPrice = ko.observable("active");
        } else {
            /*Apply no class if the default price is not given */
            self.applyPrice = ko.observable("");
        }
        self.fundPrice = ko.observable(currencySymbol + price);

        /*on button click select the price*/
        self.amountSelected = function () {
            _that.showError(0);
            _that.showSuccess(0);
            eBusinessJQObject.map(_that.allFundRaisingPrices(), function (data) {
                data.applyPrice("");
            });
            self.applyPrice("active");
            _that.amount(price);
        };
    };

    /*fund prices for selected fund to be paid by users*/
    _that.fundToBePaid = function (prices, currencySymbol, amount) {
        _that.allFundRaisingPrices.removeAll();
        if (prices !== null) {
            _that.noAmountAvailable(1);
            eBusinessJQObject.map(prices, function (price) {
                _that.allFundRaisingPrices.push(new _that.applyPrice(price, currencySymbol));
            });
        }
    };

    /* Details of fund raising product */
    _that.fundDetails = function (data) {
        var self = this;
        self.id = ko.observable(data['id']);
        self.styleClass = ko.observable("");
        self.fundName = ko.observable(data['name']);
        self.image = ko.observable();
        self.description = ko.observable(data['webDescription']);
        self.currencySymbol = ko.observable(data['currencySymbol']);
        self.defaultFundraisingPrice = ko.observable(data['defaultFundraisingPrice']);
        self.checkedFund = ko.observable(false);

        if (data['fundraisingPrices'] !== null) {
            /* We get the fund raising price as comma separated, so split that and an take the price in array */
            self.fundRaisingPrice = ko.observable(data['fundraisingPrices'].split(','));
        } else {
            self.fundRaisingPrice = ko.observable(data['fundraisingPrices']);
        }

        /*If we want the image, to be default image then set the value of 'eb_Config.loadDefaultImage' = true,
         * If we don't want default image then set that as 'eb_Config.loadDefaultimage' = false;
         */
        if (eb_Config.loadDefaultImage) {
            self.webImage = ko.observable(eb_donation.defaultImage);
        }
        else {
            /* Take the image from large folder */
            self.webImage = ko.observable(eb_Config.largeImageURL + self.id() + eb_Config.imageExtension);
        }

        /*Selected Funds*/
        self.selectedFund = function (value) {
            _that.noAmountAvailable(0);
            _that.fundErrorMessage(0);
            _that.showSuccess(0);
            _that.showError(0);
            /*To focus on input field*/
            _that.focus(true);
            /* If default member price is greater than 0, then show the amount field with price, 
              otherwise focus in to the amount field
           */ _that.fundErrorMessage(0);
            if (self.defaultFundraisingPrice() > 0) {
                _that.amount(Number(self.defaultFundraisingPrice()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
            }
            eBusinessJQObject.map(_that.fundRaisingOrders(), function (record) {
                record.styleClass("");/* Remove the class of border */
                record.checkedFund(false);
            });
            self.styleClass("eb-fund-selected-card"); /* Apply the class of border to selected fund */
            self.checkedFund(true);
            /*calling fundToBePaid method to show the fund prices*/
            _that.fundToBePaid(self.fundRaisingPrice(), self.currencySymbol(), _that.amount());
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


    /* Load fund raising order data  */
    _that.loadFundOrderDataFromServer = function (fundData) {
        eBusinessJQObject.map(fundData, function (orders) {
            _that.fundRaisingOrders.push(new _that.fundDetails(orders));
        });
    };

    /*Get fund data form server*/
    _that.getFundOrdersDataFromServer = function () {
        return eb_donation.getFundRaisingData();
    };

    /*if the donations data is available then load it*/
    if (options.donation) {
        _that.loadFundOrderDataFromServer(options.donation);
    }
    else {
        /*Call the service of fund orders*/
        _that.getFundOrdersDataFromServer().done(function (fundData) {
            _that.loadFundOrderDataFromServer(fundData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getProductDataFromServer failed:  " + xhr.responseText);
        });
    }

    /*To Place the fund order*/
    _that.fundPlaceOrder = function (cardDetails, fundName, card) {
        var defer = eBusinessJQObject.Deferred();
        eb_donation.cardPayment(cardDetails, card).done(function (data) {
            _that.showFundName(fundName);
            _that.amount("");
            propBooleanlValid.showAllMessages(false);
            eBusinessJQObject.map(_that.fundRaisingOrders(), function (record) {
                record.styleClass("");/* Remove the class of border */
                record.checkedFund(false);
            });
            _that.showSuccess(1);
            defer.resolve(data);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("fund failed:  " + xhr.responseText);
            _that.showError(1);
            if (xhr && typeof xhr.responseJSON !== 'undefined')
                _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_donation));
            else
                _that.errorMessage(eb_donation.defaultErrorMessage);
            defer.reject();
        });
        return defer.promise()
    };

    /*Payment by SPM*/
    _that.payBySavedCard = function (cardInfo) {
        var isFundSelected = true;
        var card = "isSavedCard";
        _that.showSuccess(0);
        if (cardInfo.showError) {
            cardInfo.showError(0);
        }
        var fundSelected = ko.utils.arrayFirst(_that.fundRaisingOrders(), function (fund) {
            if (fund.checkedFund() === true) {
                isFundSelected = false;
                if (_that.amount() !== '') {
                    var cardDetails = {
                        CVV: cardInfo.cVV(),
                        SavedPaymentId: cardInfo.id()
                    };

                    cardDetails.amount = _that.amount();
                    cardDetails.isSavedCard = true;
                    cardDetails.productId = fund.id();
                    _that.showLoader(1);

                    /*calling fundPlaceOrder function*/
                    _that.fundPlaceOrder(cardDetails, fund.fundName(), card).done(function (data) {
                        _that.showLoader(0);
                        if (eb_donation.orderConfirmationUrl) {
                            window.location.assign(eb_donation.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id) + "&" + "donationSuccess=0");
                        }
                        else {
                            console.error("Order Confirmation URL is required.");
                        }
                    }).fail(function () {
                        _that.showLoader(0);
                        console.log('Failed to processed payment');
                    });
                }
            }
        });
        if (isFundSelected) {
            _that.fundErrorMessage(1);
            console.log('Please Select the Fund');
        }

        if (_that.amount() === '') {
            console.log('Enter Amount');
            propBooleanlValid.showAllMessages(true);
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

    /*Payment by Credit Card*/
    _that.payByNewCard = function (cardInfo) {
        var isFundSelected = true;
        var card = "isCreditCard";
        _that.showSuccess(0);
        cardInfo.showError(0);

        var fundSelected = ko.utils.arrayFirst(_that.fundRaisingOrders(), function (fund) {
            if (fund.checkedFund() === true) {
                isFundSelected = false;

                if (!isValidCreditCard(cardInfo.cardNumber())) {
                    cardInfo.showError(1);
                    cardInfo.errorMessage(eb_donation.errorMessages['Invalid card number']);
                    return;
                }

                if (cardInfo.isDateExpired(eb_paymentControl.monthConstants[cardInfo.selectedMonth()], cardInfo.selectedYear())) {
                    cardInfo.showError(1);
                    cardInfo.errorMessage(eb_donation.errorMessages['Card date expired']);
                    return;
                }

                if (_that.amount() !== '') {
                    /*Card details */
                    var cardDetails = {
                        cardNumber: cardInfo.cardNumber(),
                        expirationMonth: eb_paymentControl.monthConstants[cardInfo.selectedMonth()],
                        expirationYear: cardInfo.selectedYear(),
                        cvv: cardInfo.cVV(),
                        saveForFutureUse: cardInfo.saveForFutureUse()
                    };
                    cardDetails.amount = _that.amount();
                    cardDetails.productId = fund.id();
                    _that.showLoader(1);
                    /*calling fundPlaceOrder function*/
                    _that.fundPlaceOrder(cardDetails, fund.fundName(), card).done(function (data) {
                        _that.showLoader(0);
                        if (eb_donation.orderConfirmationUrl) {
                            window.location.assign(eb_donation.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id) + "&" + "donationSuccess=0");
                        }
                        else {
                            console.error("Order Confirmation URL is required.");
                        }
                    }).fail(function () {
                        _that.showLoader(0);
                        _that.showError(0);
                        cardInfo.showError(1);
                        cardInfo.errorMessage(_that.errorMessage());
                        console.log('Failed to processed payment');
                    });
                }
            }
        });

        if (isFundSelected) {
            _that.fundErrorMessage(1);
            console.log('Please Select the Fund');
        }

        if (_that.amount() === '') {
            console.log('Enter Amount');
            propBooleanlValid.showAllMessages(true);
        }
    };

    /*Pay by iFrane Tokenizer*/
    _that.payByiFrameTokenizer = function (cardInfo) {
        var isFundSelected = true;
        var card = "isCreditCard";
        _that.showSuccess(0);
        cardInfo.showError(0);

        var fundSelected = ko.utils.arrayFirst(_that.fundRaisingOrders(), function (fund) {
            if (fund.checkedFund() === true) {
                isFundSelected = false;


                if (_that.amount() !== '') {

                    eb_tokenizer.loadTokenizerModal().done(function (data) {
                        var token = data.message;
                        var expiryDate = data.expiry;
                        var saveForFutureUse = data.saveForFutureUse;
                        var cardDetails

                        //var formattedExpiryDate = new Intl.DateTimeFormat('en-US').format(new Date(expiryDate.slice(0, 4) + "/" + expiryDate.slice(4)));
                        if (data.isACH) {
                            cardDetails = {
                                accountNumber: data.token,
                                accountName: data.accName,
                                bank: data.bank,
                                saveForFutureUse: saveForFutureUse
                            }
                            card = "isACHTokenizer";
                        }
                        else {
                            cardDetails = {
                                cardNumber: token,
                                expirationMonth: expiryDate.slice(4),
                                expirationYear: expiryDate.slice(0, 4),
                                saveForFutureUse: saveForFutureUse || false
                            }
                        }

                        _that.showLoader(1);

                        cardDetails.amount = _that.amount();
                        cardDetails.productId = fund.id();
                        _that.showLoader(1);
                        /*calling fundPlaceOrder function*/
                        _that.fundPlaceOrder(cardDetails, fund.fundName(), card).done(function (data) {
                            _that.showLoader(0);
                            if (eb_donation.orderConfirmationUrl) {
                                window.location.assign(eb_donation.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id) + "&" + "donationSuccess=0");
                            }
                            else {
                                console.error("Order Confirmation URL is required.");
                            }
                        }).fail(function () {
                            _that.showLoader(0);
                            _that.showError(0);
                            cardInfo.showError(1);
                            cardInfo.errorMessage(_that.errorMessage());
                            console.log('Failed to processed payment');
                        }).always(function () {
                        });
                    }
                    ).fail(function (data, msg, jhr) {
                        console.log(msg);
                    });

                }
            }
        });

        if (isFundSelected) {
            _that.fundErrorMessage(1);
            console.log('Please Select the Fund');
        }

        if (_that.amount() === '') {
            console.log('Enter Amount');
            propBooleanlValid.showAllMessages(true);
        }
    };


    /*Fund by ACH Card*/
    _that.payByACHCard = function (cardInfo) {
        var isFundSelected = true;
        var card = "isAchCard";
        _that.showSuccess(0);
        _that.showError(0);
        /*Selected funds*/
        var fundSelected = ko.utils.arrayFirst(_that.fundRaisingOrders(), function (fund) {
            if (fund.checkedFund() === true) {
                isFundSelected = false;
                if (_that.amount() !== '') {
                    /*Card details data for credit card*/
                    var cardDetails = {
                        accountNumber: cardInfo.ACHAccountNumber(),
                        accountName: cardInfo.ACHAccountName(),
                        bank: cardInfo.ACHBankName(),
                        aba: cardInfo.ACHRoutingNumber(),
                        saveForFutureUse: cardInfo.ACHsaveForFutureUse()
                    };
                    cardDetails.amount = _that.amount();
                    cardDetails.productId = fund.id();
                    /*calling fundPlaceOrder function*/
                    _that.showLoader(1);
                    _that.fundPlaceOrder(cardDetails, fund.fundName(), card).done(function (data) {
                        _that.showLoader(0);
                        if (eb_donation.orderConfirmationUrl) {
                            window.location.assign(eb_donation.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id) + "&" + "donationSuccess=0");
                        }
                        else {
                            console.error("Order Confirmation URL is required.");
                        }

                    }).fail(function () {
                        _that.showError(0);
                        _that.showLoader(0);
                        cardInfo.showError(1);
                        cardInfo.errorMessage(_that.errorMessage());
                        console.log('Failed to processed payment');
                    });
                }
            }
        });

        if (isFundSelected) {
            _that.fundErrorMessage(1);
            console.log('Please Select the Fund');
        }
        if (_that.amount() === '') {
            console.log('Enter Amount');
            propBooleanlValid.showAllMessages(true);
        }
    };

    /*Pay by Saved ACH Card*/
    _that.payByACHSavedCard = function (cardInfo) {
        var isFundSelected = true;
        var card = "isSavedCard";
        _that.showSuccess(0);
        _that.showError(0);
        var fundSelected = ko.utils.arrayFirst(_that.fundRaisingOrders(), function (fund) {
            if (fund.checkedFund() === true) {
                if (_that.amount() !== '') {
                    var cardDetails = {
                        SavedPaymentId: cardInfo.id
                    };
                    cardDetails.amount = _that.amount();
                    cardDetails.isSavedCard = true;
                    cardDetails.productId = fund.id();
                    isFundSelected = false;
                    /*calling fundPlaceOrder function*/
                    _that.showLoader(1);
                    _that.fundPlaceOrder(cardDetails, fund.fundName(), card).done(function (data) {
                        _that.showLoader(0);
                        if (eb_donation.orderConfirmationUrl) {
                            window.location.assign(eb_donation.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id) + "&" + "donationSuccess=0");
                        }
                        else {
                            console.error("Order Confirmation URL is required.");
                        }
                    }).fail(function () {
                        console.log('Failed to processed payment');
                        _that.showLoader(0);
                    });
                }
            }
        });

        if (isFundSelected) {
            _that.fundErrorMessage(1);
            console.log('Please Select the Fund');
        }

        if (_that.amount() === '') {
            console.log('Enter Amount');
            propBooleanlValid.showAllMessages(true);
        }
    };

    /*Pay by Bluepay HPP*/
    _that.payByBluepayHPP = function () {

        var isFundSelected = true;

        _that.showSuccess(0);
        _that.showError(0);
        /*Selected funds*/
        var fundSelected = ko.utils.arrayFirst(_that.fundRaisingOrders(), function (fund) {
            if (fund.checkedFund() === true) {
                isFundSelected = false;
                if (_that.amount() !== '') {

                    var postData = {
                        amount: _that.amount(),
                        productId: fund.id()
                    };

                    //hit service and fetch Bluepay HPP URL
                    var serviceURL = eb_donation.bluepayHPPPayment;

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
            }
        });

        if (isFundSelected) {
            _that.fundErrorMessage(1);
            console.log('Please Select the Fund');
        }
        if (_that.amount() === '') {
            console.log('Enter Amount');
            propBooleanlValid.showAllMessages(true);
        }


    };

    _that.bluepayHPPPostResponseUrl = eb_donation.ServicePath + 'Fundraising/Checkout/ProcessRemoteResponse';

    _that.handleBluepayHPPPostResponseSuccess = function (data) {
        _that.showLoader(0);
        /*eBusinessJQObject(_that.domElement).find("#eb-BluePay").modal("hide");*/
        /*Bootstrap5.3 Modal Code Change Start*/
        var bluepayModal = bootstrap.Modal.getOrCreateInstance('#eb-BluePay');
        bluepayModal.hide();
        /*Bootstrap5.3 Modal Code Change End*/

        if (eb_donation.orderConfirmationUrl) {
            window.location.assign(eb_donation.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.OrderId) + "&" + "donationSuccess=0");
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
            _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_donation));
        else
            _that.errorMessage(eb_donation.defaultErrorMessage);
        console.log('Failed to process payment');
    };

    /*Checks if all page specific conditions are satisfied before proceeding for payment using Google Pay.*/
    _that.isValidPayment = function () {
            var isFundSelected = false;
            _that.showSuccess(0);
            _that.showError(0);

            var fundSelected = ko.utils.arrayFirst(_that.fundRaisingOrders(), function (fund) {
                if (fund.checkedFund() === true) {
                    isFundSelected = true;
                    if (_that.amount() !== '') {
                        return true;
                    }
                    return false;
                }
                return false;
            });

            if (!isFundSelected) {
                _that.fundErrorMessage(1);
                console.log('Please Select the Fund');
            }

            if (_that.amount() === '') {
                console.log('Enter Amount');
                propBooleanlValid.showAllMessages(true);
        }
        return fundSelected;
    }

    _that.tokenizeGPayData = function (gPayTokenData) {
        var defer = eBusinessJQObject.Deferred();

        var serviceURL = eb_donation.tokenize;
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
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_donation));
                else
                    _that.errorMessage(eb_donation.defaultErrorMessage);
            }).always(function () {
            });
        });
        return defer.promise();

    }

    /*Payment by GPay*/
    _that.payByGPay = function (cardInfo) {
        var isFundSelected = true;
        var card = "isGPay";
        _that.showSuccess(0);
        _that.showError(0);

        var fundSelected = ko.utils.arrayFirst(_that.fundRaisingOrders(), function (fund) {
            if (fund.checkedFund() === true) {
                isFundSelected = false;

                if (_that.amount() !== '') {
                    var token = cardInfo;
                    _that.showLoader(1);

                    eb_Config.retrieveCSRFTokens().always(function (headers) {

                        _that.tokenizeGPayData(token).done(function (cpToken) {

                            var cardDetails = {
                                cardNumber: cpToken,
                                amount: _that.amount(),
                                productId: fund.id(),
                                saveForFutureUse: false
                            };

                    /*calling fundPlaceOrder function*/
                            _that.fundPlaceOrder(cardDetails, fund.fundName(), card).done(function (data) {
                                _that.showLoader(0);
                                if (eb_donation.orderConfirmationUrl) {
                                    window.location.assign(eb_donation.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id) + "&" + "donationSuccess=0");
                                }
                                else {
                                    console.error("Order Confirmation URL is required.");
                                }
                            }).fail(function () {
                                _that.showLoader(0);
                                _that.showError(1);
                                console.log('Failed to processed payment');
                            });
                        });
                    });
                }
            }
        });
    };

    ko.computed(function () {
        gPayPriceSettings.totalPrice = _that.amount();
        applePayPriceSettings.totalPrice = _that.amount();
    });

    _that.tokenizeApplePayData = function (applePayTokenData) {
        var defer = eBusinessJQObject.Deferred();

        var serviceURL = eb_donation.tokenizeApplePay;
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
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_donation));
                else
                    _that.errorMessage(eb_donation.defaultErrorMessage);
            }).always(function () {
            });
        });
        return defer.promise();

    }

    /*Payment by Apple Pay*/
    _that.payByApplePay = function (cardInfo) {
        var isFundSelected = true;
        var card = "isApplePay";
        _that.showSuccess(0);
        _that.showError(0);

        var fundSelected = ko.utils.arrayFirst(_that.fundRaisingOrders(), function (fund) {
            if (fund.checkedFund() === true) {
                isFundSelected = false;

                if (_that.amount() !== '') {
                    var token = cardInfo;
                    _that.showLoader(1);

                    eb_Config.retrieveCSRFTokens().always(function (headers) {
                        _that.tokenizeApplePayData(token).done(function (cpToken) {
                            var cardDetails = {
                                cardNumber: cpToken,
                                amount: _that.amount(),
                                productId: fund.id(),
                                saveForFutureUse: false
                            };

                            /*calling fundPlaceOrder function*/
                            _that.fundPlaceOrder(cardDetails, fund.fundName(), card).done(function (data) {
                                _that.showLoader(0);
                                if (eb_donation.orderConfirmationUrl) {
                                    window.location.assign(eb_donation.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id) + "&" + "donationSuccess=0");
                                }
                                else {
                                    console.error("Order Confirmation URL is required.");
                                }
                            }).fail(function () {
                                _that.showLoader(0);
                                _that.showError(1);
                                console.log('Failed to processed payment');
                            });
                        });
                    });
                }
            }
        });
    };
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

/*If image is not there, then attach No Photo Image*/
ko.bindingHandlers.imageSrc = {
    update: function (element, valueAccessor) {
        var options = valueAccessor();
        var src = ko.unwrap(options.src);
        eBusinessJQObject('<img />').attr('src', src).on('load', function () {
            eBusinessJQObject(element).attr('src', src);
        }).on('error', function () {
            eBusinessJQObject(element).attr('src', eb_donation.defaultImage);
        });
    }
};

/**
 * Page DOM element.
 * @method eb_donation.domElement
 * @param {object} domElement current DOM element.
 * */
eb_donation.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_donation.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_donation);
});