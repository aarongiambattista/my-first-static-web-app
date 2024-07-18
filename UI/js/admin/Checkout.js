/**
 * Define eb_adminCheckout class.
 * @class eb_adminCheckout
 * */
var eb_adminCheckout = eb_adminCheckout || {};

/**
 * Control level setting: Site path.
 * @property eb_adminCheckout.SitePath
 * @type {String}
 */
eb_adminCheckout.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_adminCheckout.TemplatePath
 * @type {String}
 */
eb_adminCheckout.TemplatePath = "html/Checkout.html";

/**
 * The path to the eBusiness SOA layer.
 * @property eb_adminCheckout.ServicePath
 * @type {String}
 */
eb_adminCheckout.ServicePath = eb_Config.ServicePathV1;

/* TODO: Once actual service is ready will update the payPalUrl. */
/**
 * Paypal Url
 * @property eb_adminCheckout.payPalUrl
 * @type {String}
 */
eb_adminCheckout.payPalUrl = "";

/**
 * For Initiating the payment
 * @property eb_adminCheckout.initiatePayment
 * @type {String}
 */
eb_adminCheckout.initiatePayment = "PayPalExpress/InitiatePayment";

/**
 * For Completing the payment
 * @property eb_adminCheckout.completePayment
 * @type {String}
 */
eb_adminCheckout.completePayment = "PayPalExpress/CompletePayment";

/**
 * Order type
 * @property eb_adminCheckout.purchaseOrder
 * @type {String}
 */
eb_adminCheckout.purchaseOrder = "PurchaseOrder";

/**
 * Redirect from checkout page to reviewOrder
 * @property eb_adminCheckout.reviewOrderUrl
 * @type {String}
 */
eb_adminCheckout.reviewOrderUrl = eb_adminCheckout.SitePath + "admin/ReviewOrder.html";

/**
 * Shipping address URL.
 * @property eb_adminCheckout.shippingAddressUrl
 * @type {String}
 */
eb_adminCheckout.shippingAddressUrl = eb_adminCheckout.SitePath + "admin/BillingShippingAddress.html";

/**
 * Order confirmation URL.
 * @property eb_adminCheckout.orderConfirmationUrl
 * @type {String}
 */
eb_adminCheckout.orderConfirmationUrl = eb_adminCheckout.SitePath + "admin/OrderConfirmation.html";

eb_adminCheckout.serviceUrls = {
    'Pay By New Card': eb_adminCheckout.ServicePath + 'admin/company/{companyId}/ShoppingCarts/Checkout/CreditCard',
    'Pay By Saved Card': eb_adminCheckout.ServicePath + 'admin/company/{companyId}/ShoppingCarts/Checkout/SavedPayment',
    'Pay By ACH new card': eb_adminCheckout.ServicePath + 'admin/company/{companyId}/ShoppingCarts/Checkout/ACH',
    'Pay By ACH Tokenizer new card': eb_adminCheckout.ServicePath + 'admin/company/{companyId}/ShoppingCarts/Checkout/ACHTokenizer',
    'Pay By GPay': eb_adminCheckout.ServicePath + 'admin/company/{companyId}/ShoppingCarts/Checkout/GPay',
    'CardPointe Tokenize': eb_adminCheckout.ServicePath + 'CardPointe/ccn/tokenize',
    'CardPointe Tokenize Apple Pay': eb_adminCheckout.ServicePath + 'CardPointe/ccn/tokenizeApplePay',
    'Pay By ApplePay': eb_adminCheckout.ServicePath + 'admin/company/{companyId}/ShoppingCarts/Checkout/ApplePay',
    'Pay By Bluepay HPP': eb_adminCheckout.ServicePath + 'admin/company/{companyId}/ShoppingCarts/Checkout/GetRemotePaymentRequest',
    'Process Bluepay HPP Response': eb_adminCheckout.ServicePath + 'admin/company/{companyId}/ShoppingCarts/Checkout/ProcessRemotePaymentResponse'
};

/*Success Response */
eb_adminCheckout.successResponses = {
    'Order placed': 'Your order has been placed successfully.'
};

/* Error messages */
eb_adminCheckout.errorMessages = {
    'Card date expired': 'Sorry, this card has expired. Please enter a valid card number.',
    'Invalid card number': 'Sorry, this card is invalid. Please enter a valid card number.'
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
 * @property eb_adminCheckout.errorResponses
 * @type {Object}
 * */
eb_adminCheckout.errorResponses = {
    202: { useServerMessage: true },
    203: { useServerMessage: true },
    430: { useServerMessage: true },
    601: { useServerMessage: false, frontEndMessage: 'Sorry, you are not eligible for “Bill me later” option. Please contact the customer support for further assistance with this order.' },
    700: { useServerMessage: false, frontEndMessage: 'An error occurred during Payment processing. Please check the payment details entered and try again. If the problem persists please contact our customer service department.' },
    1102: { useServerMessage: false, frontEndMessage: 'An error occurred during Bluepay Remote Payment processing. Please check the payment details entered and try again. If the problem persists please contact our customer service department.' }
};

/**
 * Default error message.
 * @property eb_adminCheckout.defaultErrorMessage
 * @type {String}
 * */
eb_adminCheckout.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/**
 * Rendering public method to load HTML template. 
 * Based on page level configuration it will select the template and load in DOM.
 * Template path and DOM element are required parameters.
 * GET the template by Ajax call using template path and then assign it to DOM element.
 * @method eb_reviewOrder.render
 * @param {any} options Object with data required for getting HTML template through Ajax call.
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * 
 * @returns {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_adminCheckout.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_adminCheckout.SitePath + eb_adminCheckout.TemplatePath;
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
 * Checkout Model for binding data.
 * The model contains observable properties to hold corresponding data returned from services.
 * Also, model contains computed properties and methods to support Checkout functionality.
 * @method eb_adminCheckout.model
 * @param {Object} options Contains necessary data which is required for Checkout functionality.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL.
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 * @param {Object} options.shoppingCart Shopping Cart Object.
 * @param {String} options.personId Person ID.
 */
eb_adminCheckout.model = function (options) {
    var _that = this;
    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement and shoppingCart properties is required.", stack: Error().stack };
    }

    if (!options.domElement) {
        throw { type: "argument_mismatch", message: 'Missing domElement.  The object passed in must have a domElement property with a non-empty DOM object.', stack: Error().stack };
    }

    if (!options.shoppingCart) {
        throw { type: "argument_mismatch", message: 'Missing shoppingCart.  The object passed in must have a shoppingCart property with a non-empty DOM object.', stack: Error().stack };
    }

    ko.validation.registerExtenders();
    _that.domElement = options.domElement;
    eb_adminCheckout.domElement(_that.domElement);
    _that.shoppingCart = options.shoppingCart;
    _that.data = options.data;
    _that.showLoader = ko.observable(0);

    _that.showError = ko.observable(0);
    _that.errorMessage = ko.observable("");
    _that.showSuccess = ko.observable(0);
    _that.successMessage = ko.observable("");

    /* Person ID required for updating card data */
    _that.personId = options.personId;

    /*Name of the company being handled currently.*/
    _that.companyName = ko.observable(options.companyName);

    /* Payment Control attributes */
    _that.paymentControl = {};
    _that.paymentControl.savedCardsTitle = 'Saved Credit Cards';
    _that.paymentControl.cardTitle = 'New Card';
    _that.paymentControl.paymentControlButtonName = 'Place Order';
    _that.paymentControl.showSaveForFutureCheckBox = true;
    _that.paymentControl.showEditDeleteSavedCardButtons = true;
    _that.paymentControl.bluePayURL = ko.observable("");

    /* Payment */
    /* Set payPalUrl from outside. */
    if (options.payPalUrl) {
        eb_adminCheckout.payPalUrl = options.payPalUrl;
    }

    /* Pass change shipping address URL */
    if (options.reviewOrderUrl) {
        eb_adminCheckout.reviewOrderUrl = options.reviewOrderUrl;
    }

    /* Pass change shipping address URL */
    if (options.orderConfirmationUrl) {
        eb_adminCheckout.orderConfirmationUrl = options.orderConfirmationUrl;
    }

    /* Pay pal Place Order method. */
    _that.paypalPlaceOrder = function () {
        if (_that.shoppingCart) {
            var cardData = {};
            cardData.parameter = eb_adminCheckout.initiatePayment;
            /*window.open(eb_adminCheckout.payPalUrl, "mywindow", "status=1,toolbar=1");*/
            cardData.data = {
                CallingURL: eb_adminCheckout.payPalUrl
            };
            _that.shoppingCart.checkout(cardData).done(function (result) {
                /* need to get PayerID and Token */
                var payPalData = {};
                payPalData.parameter = eb_adminCheckout.completePayment;
                payPalData.data = {
                    PayerID: "W8BUCCG6PEFVQ",
                    Token: "EC-581846091G803745X"
                };
                _that.shoppingCart.checkout(payPalData).done(function (resultPaypal) {
                    console.info(eb_adminCheckout.successResponses['Order placed']);
                    if (eb_adminCheckout.orderConfirmationUrl) {
                        window.location.assign(eb_adminCheckout.orderConfirmationUrl);
                    }
                    else {
                        console.error("Proceed to checkout URL is required.");
                    }
                }).fail(function (xhr, textStatus, errorThrow) {
                    console.error('Order not placed.');
                });
                console.info('Order not placed.');

            }).fail(function (xhr, textStatus, errorThrow) {
                console.error('Order not placed.');
            });
        }
    };

    /* Bill me later place order. */
    _that.billMeLaterPlaceOrder = function (data) {
        if (_that.shoppingCart) {
            if (!data.poNumber() || data.poNumber() === 'undefined') {
                data.poNumber("Bill Me Later");
            }

            var cardData = {};
            cardData.parameter = eb_adminCheckout.purchaseOrder;
            cardData.data = {
                PurchaseOrderNumber: data.poNumber()
            };
            _that.placeOrder(cardData);
        }
        else {
            console.error("Shopping cart object not found.");
        }
    };

    /* Place order method. */
    _that.placeOrder = function (cardData) {
        _that.showLoader(1);
        _that.shoppingCart.checkout(cardData).done(function (data) {
            console.info(eb_adminCheckout.successResponses['Order placed']);
            _that.showLoader(0);
            if (eb_adminCheckout.orderConfirmationUrl) {
                window.location.assign(eb_adminCheckout.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id));
            }
            else {
                console.error("Proceed to checkout URL is required.");
            }

        }).fail(function (xhr, textStatus, errorThrow) {
            _that.showLoader(0);
            _that.showError(1);
            if (xhr && typeof xhr.responseJSON !== 'undefined')
                _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminCheckout));
            else
                _that.errorMessage(eb_adminCheckout.defaultErrorMessage);
        });
    };

    /* Redirect to review order page. */
    _that.backToReviewOrder = function () {
        if (eb_adminCheckout.reviewOrderUrl) {
            window.location.assign(eb_adminCheckout.reviewOrderUrl);
        }
        else {
            console.error("Failed to redirect to review order page.");
        }
    };

    /* Redirect to billing and shipping address page. */
    _that.backToAddress = function () {
        if (eb_adminCheckout.shippingAddressUrl) {
            window.location.assign(eb_adminCheckout.shippingAddressUrl);
        }
        else {
            console.error("Failed to redirect to address order page.");
        }
    };

    /* Payment Functions */
    /* Pay by Saved Card function */
    _that.payBySavedCard = function (cardInfo) {

        var cardDetails = {
            CVV: cardInfo.cVV(),
            SavedPaymentId: cardInfo.id()
        };

        var serviceURL = eb_adminCheckout.serviceUrls['Pay By Saved Card'].replace("{companyId}", eb_adminShoppingCart.companyId);

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
                if (eb_adminCheckout.orderConfirmationUrl) {
                    window.location.assign(eb_adminCheckout.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id));
                }
                else {
                    console.error("Proceed to checkout URL is required.");
                }
            }).fail(function (xhr, msg, data) {
                _that.showLoader(0);
                _that.showError(1);
                if (xhr && typeof xhr.responseJSON !== 'undefined')
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminCheckout));
                else
                    _that.errorMessage(eb_adminCheckout.defaultErrorMessage);
            });
        });
    };

    /*Pay by Saved ACH Card*/
    _that.payByACHSavedCard = function (cardInfo) {
        var cardDetails = {
            SavedPaymentId: cardInfo.id
        };

        var serviceURL = eb_adminCheckout.serviceUrls['Pay By Saved Card'].replace("{companyId}", eb_adminShoppingCart.companyId);
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
                if (eb_adminCheckout.orderConfirmationUrl) {
                    window.location.assign(eb_adminCheckout.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id));
                }
                else {
                    console.error("Proceed to checkout URL is required.");
                }
            }).fail(function (xhr, msg, data) {
                _that.showLoader(0);
                _that.showError(1);
                if (xhr && typeof xhr.responseJSON !== 'undefined')
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminCheckout));
                else
                    _that.errorMessage(eb_adminCheckout.defaultErrorMessage);
            });
        });
    };

    /*Pay by Bluepay HPP*/
    _that.payByBluepayHPP = function () {
        //hit service and fetch Bluepay HPP URL
        var serviceURL = eb_adminCheckout.serviceUrls['Pay By Bluepay HPP'].replace("{companyId}", eb_adminShoppingCart.companyId);

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
    };

    /*Pay by iFranme Tokenizer*/
    _that.payByiFrameTokenizer = function () {
        var defer = eBusinessJQObject.Deferred();


        eb_tokenizer.loadTokenizerModal().done(function (data) {
            var token = data.message;
            var expiryDate = data.expiry;
            var saveForFutureUse = data.saveForFutureUse;
            var cardDetails;
            var serviceURL
            //var formattedExpiryDate = new Intl.DateTimeFormat('en-US').format(new Date(expiryDate.slice(0, 4) + "/" + expiryDate.slice(4)));

            if (data.isACH) {
                cardDetails = {
                    accountNumber: data.token,
                    accountName: data.accName,
                    bank: data.bank,
                    saveForFutureUse: saveForFutureUse
                }
                serviceURL = eb_adminCheckout.serviceUrls["Pay By ACH Tokenizer new card"].replace("{companyId}", eb_adminShoppingCart.companyId);
            }
            else{
                cardDetails = {
                    cardNumber: token,
                    expirationMonth: expiryDate.slice(4),
                    expirationYear: expiryDate.slice(0, 4),
                    saveForFutureUse: saveForFutureUse || false
                }
                serviceURL = eb_adminCheckout.serviceUrls['Pay By New Card'].replace("{companyId}", eb_adminShoppingCart.companyId);
            }
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
                    if (eb_adminCheckout.orderConfirmationUrl) {
                        window.location.assign(eb_adminCheckout.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id));
                    }
                    else {
                        console.error("Proceed to checkout URL is required.");
                    }
                }).fail(function (xhr, msg, data) {
                    _that.showLoader(0);
                    _that.showError(1);
                    if (xhr && typeof xhr.responseJSON !== 'undefined')
                        _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminCheckout));
                    else
                        _that.errorMessage(eb_adminCheckout.defaultErrorMessage);
                }).always(function () {
                });
            });
        }
        ).fail(function (data, msg, jhr) {
            console.log(msg);
        });

        return defer.promise();
    };


    _that.bluepayHPPPostResponseUrl = eb_adminCheckout.serviceUrls['Process Bluepay HPP Response'].replace("{companyId}", eb_adminShoppingCart.companyId);

    _that.handleBluepayHPPPostResponseSuccess = function (data) {
        /*eBusinessJQObject(_that.domElement).find("#eb-BluePay").modal("hide");*/
        /*Bootstrap5.3 Modal Code Change Start*/
        var bluepayModal = bootstrap.Modal.getOrCreateInstance('#eb-BluePay');
        bluepayModal.hide();
        /*Bootstrap5.3 Modal Code Change End*/
        _that.showLoader(0);
        if (eb_adminCheckout.orderConfirmationUrl) {
            window.location.assign(eb_adminCheckout.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.OrderId));
        }
        else {
            console.error("Proceed to checkout URL is required.");
        }
    };

    _that.handleBluepayHPPPostResponseFailure = function (xhr, msg, data) {
        _that.showLoader(0);
        _that.showError(1);
        /*eBusinessJQObject(_that.domElement).find("#eb-BluePay").modal("hide");*/
        /*Bootstrap5.3 Modal Code Change Start*/
        var bluepayModal = bootstrap.Modal.getOrCreateInstance('#eb-BluePay');
        bluepayModal.hide();
        /*Bootstrap5.3 Modal Code Change End*/

        if (xhr && typeof xhr.responseJSON !== 'undefined')
            _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminCheckout));
        else
            _that.errorMessage(eb_adminCheckout.defaultErrorMessage);
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

    /* Pay by New Card function */
    _that.payByNewCard = function (cardInfo) {
        if (!isValidCreditCard(cardInfo.cardNumber())) {
            cardInfo.showError(1);
            cardInfo.errorMessage(eb_adminCheckout.errorMessages['Invalid card number']);
            return;
        }

        if (cardInfo.isDateExpired(eb_adminPaymentControl.monthConstants[cardInfo.selectedMonth()], cardInfo.selectedYear())) {
            cardInfo.showError(1);
            cardInfo.errorMessage(eb_adminCheckout.errorMessages['Card date expired']);
            return;
        }

        var cardDetails = {
            cardNumber: cardInfo.cardNumber(),
            expirationMonth: eb_adminPaymentControl.monthConstants[cardInfo.selectedMonth()],
            expirationYear: cardInfo.selectedYear(),
            cvv: cardInfo.cVV(),
            saveForFutureUse: cardInfo.saveForFutureUse()
        };

        var serviceURL = eb_adminCheckout.serviceUrls['Pay By New Card'].replace("{companyId}", eb_adminShoppingCart.companyId);

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
                if (eb_adminCheckout.orderConfirmationUrl) {
                    window.location.assign(eb_adminCheckout.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id));
                }
                else {
                    console.error("Proceed to checkout URL is required.");
                }
            }).fail(function (xhr, msg, data) {
                _that.showLoader(0);
                _that.showError(1);
                if (xhr && typeof xhr.responseJSON !== 'undefined')
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminCheckout));
                else
                    _that.errorMessage(eb_adminCheckout.defaultErrorMessage);
            });
        });
    };

    /* Pay by New Card function */
    _that.payByACHCard = function (cardInfo) {

        var cardDetails = {
            accountNumber: cardInfo.ACHAccountNumber(),
            accountName: cardInfo.ACHAccountName(),
            bank: cardInfo.ACHBankName(),
            aba: cardInfo.ACHRoutingNumber(),
            saveForFutureUse: cardInfo.ACHsaveForFutureUse()
        };

        var serviceURL = eb_adminCheckout.serviceUrls['Pay By ACH new card'].replace("{companyId}", eb_adminShoppingCart.companyId);

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
                if (eb_adminCheckout.orderConfirmationUrl) {
                    window.location.assign(eb_adminCheckout.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id));
                }
                else {
                    console.error("Proceed to checkout URL is required.");
                }
            }).fail(function (xhr, msg, data) {
                _that.showLoader(0);
                _that.showError(1);
                if (xhr && typeof xhr.responseJSON !== 'undefined')
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminCheckout));
                else
                    _that.errorMessage(eb_adminCheckout.defaultErrorMessage);
            });
        });
    };

    /*Checks if all page specific conditions are satisfied before proceeding for payment using Google Pay.*/
    _that.isValidPayment = function () {
        if (eb_adminPaymentSummaryDetails.live.subTotalWithoutCurrencySymbol() > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    _that.tokenizeGPayData = function (gPayTokenData) {
        var defer = eBusinessJQObject.Deferred();

        var serviceURL = eb_adminCheckout.serviceUrls['CardPointe Tokenize'];
        var postData = {
            "encryptionhandler": "EC_GOOGLE_PAY",
            "devicedata": gPayTokenData,
            "CurrencyTypeId": eb_adminShoppingCart.live.currencyTypeId()
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
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminCheckout));
                else
                    _that.errorMessage(eb_adminCheckout.defaultErrorMessage);
            }).always(function () {
            });
        });
        return defer.promise();

    }

    /*Pay by Google Pay.*/
    _that.payByGPay = function (data) {
        var defer = eBusinessJQObject.Deferred();

        var token = data;//data.token;

        var serviceURL = eb_adminCheckout.serviceUrls['Pay By GPay'].replace("{companyId}", eb_adminShoppingCart.companyId);
        _that.showLoader(1);
        eb_Config.retrieveCSRFTokens().always(function (headers) {

            _that.tokenizeGPayData(token).done(function (cpToken) {

                var cardDetails = {
                    cardNumber: cpToken,
                    saveForFutureUse: false
                };

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
                    if (eb_adminCheckout.orderConfirmationUrl) {
                        window.location.assign(eb_adminCheckout.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id));
                    }
                    else {
                        console.error("Proceed to checkout URL is required.");
                    }
                }).fail(function (xhr, msg, data) {
                    _that.showLoader(0);
                    _that.showError(1);
                    defer.reject(msg);
                    if (xhr && typeof xhr.responseJSON !== 'undefined')
                        _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminCheckout));
                    else
                        _that.errorMessage(eb_adminCheckout.defaultErrorMessage);
                }).always(function () {
                });
            });


        });


        return defer.promise();
    };

    _that.tokenizeApplePayData = function (applePayTokenData) {
        var defer = eBusinessJQObject.Deferred();

        var serviceURL = eb_adminCheckout.serviceUrls['CardPointe Tokenize Apple Pay'];
        var postData = {
            "encryptionhandler": "EC_APPLE_PAY",
            "devicedata": applePayTokenData,
            "CurrencyTypeId": eb_adminShoppingCart.live.currencyTypeId()
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
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminCheckout));
                else
                    _that.errorMessage(eb_adminCheckout.defaultErrorMessage);
            }).always(function () {
            });
        });
        return defer.promise();

    }

    /*Pay by Apple Pay.*/
    _that.payByApplePay = function (data) {
        var defer = eBusinessJQObject.Deferred();

        var token = data;

        var serviceURL = eb_adminCheckout.serviceUrls['Pay By ApplePay'].replace("{companyId}", eb_adminShoppingCart.companyId);
        _that.showLoader(1);
        eb_Config.retrieveCSRFTokens().always(function (headers) {
            _that.tokenizeApplePayData(token).done(function (cpToken) {
                var cardDetails = {
                    cardNumber: cpToken,
                    saveForFutureUse: false
                };

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
                    if (eb_adminCheckout.orderConfirmationUrl) {
                        window.location.assign(eb_adminCheckout.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id));
                    }
                    else {
                        console.error("Proceed to checkout URL is required.");
                    }
                }).fail(function (xhr, msg, data) {
                    _that.showLoader(0);
                    _that.showError(1);
                    defer.reject(msg);
                    if (xhr && typeof xhr.responseJSON !== 'undefined')
                        _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminCheckout));
                    else
                        _that.errorMessage(eb_adminCheckout.defaultErrorMessage);
                }).always(function () {
                });
            });
        });


        return defer.promise();
    };
};

/**
* Page DOM element.
* @method eb_adminCheckout.domElement
* @param {object} domElement current DOM element.
* */
eb_adminCheckout.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_adminCheckout.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminCheckout);
});