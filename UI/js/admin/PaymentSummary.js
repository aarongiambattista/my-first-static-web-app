/**
 * Define eb_adminPaymentSummaryDetails class.
 * @class eb_adminPaymentSummaryDetails
 * */
var eb_adminPaymentSummaryDetails = eb_adminPaymentSummaryDetails || {};

/**
 * Control level setting: Site path.
 * @property eb_adminPaymentSummaryDetails.SitePath
 * @type {String}
 */
eb_adminPaymentSummaryDetails.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_adminPaymentSummaryDetails.TemplatePath
 * @type {String}
 */
eb_adminPaymentSummaryDetails.TemplatePath = "html/PaymentSummary.html";

/**
 * The path to the eBusiness SOA layer.
 * @property eb_adminPaymentSummaryDetails.ServicePath
 * @type {String}
 */
eb_adminPaymentSummaryDetails.ServicePath = eb_Config.ServicePathV1;

/**
 * Coupon Name service to get the Id
 * @property eb_adminPaymentSummaryDetails.cName
 * @type {Number}
 */
eb_adminPaymentSummaryDetails.cName = eb_adminPaymentSummaryDetails.ServicePath + "Coupon";

/**
 * Proceed to checkout URL if user has not passed from outside.
 * @property eb_adminPaymentSummaryDetails.proceedToCheckoutUrl
 * @type {String}
 */
eb_adminPaymentSummaryDetails.proceedToCheckoutUrl = eb_adminPaymentSummaryDetails.SitePath + "admin/" + "BillingShippingAddress.html";

/**
 * Proceed to checkout URL if user has not passed from outside.
 * @property eb_adminPaymentSummaryDetails.proceedToPaymentUrl
 * @type {String}
 */
eb_adminPaymentSummaryDetails.proceedToPaymentUrl = eb_adminPaymentSummaryDetails.SitePath + "admin/" + "Checkout.html";

/**
 * Skipping payment step on checkout wizard if Order total is Zero.
 * @property eb_adminPaymentSummaryDetails.orderConfirmationUrl
 * @type {String}
 */
eb_adminPaymentSummaryDetails.orderConfirmationUrl = eb_adminPaymentSummaryDetails.SitePath + "/admin/" + "OrderConfirmation.html";

/*Success Response */
eb_adminPaymentSummaryDetails.successResponses = {
    'Coupon applied.': 'Coupon has been applied.',
    'Coupon not valid': 'Coupon is not valid.'
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
 * @property eb_adminPaymentSummaryDetails.errorResponses
 * @type {Object}
 * */
eb_adminPaymentSummaryDetails.errorResponses = {
    430: { useServerMessage: true }
};

/**
 * Default error message.
 * @property eb_adminPaymentSummaryDetails.defaultErrorMessage
 * @type {String}
 * */
eb_adminPaymentSummaryDetails.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/* Input Validations */
eb_adminPaymentSummaryDetails.couponValidations = {
    'Enter coupon': 'Please enter the coupon.',
    'Coupon not applicable': 'Coupon is valid, but not applicable for the cart items.'
};

/**
 * Rendering public method to load HTML template. Based on page level configuration it will select the template and load in DOM
 * @method eb_adminPaymentSummaryDetails.render
 * @param {any} options options contains different parameter like Site path, templatePath and domElement..
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * @returns {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_adminPaymentSummaryDetails.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            options.templatePath = eb_adminPaymentSummaryDetails.SitePath + eb_adminPaymentSummaryDetails.TemplatePath;
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
 * Coupon Name service to get the coupon Id
 * @method eb_adminPaymentSummaryDetails.couponId
 * @param {String} couponName CoupanName
 * @return {Object} Return Id of Coupon. If not available then return -1
 * */
eb_adminPaymentSummaryDetails.couponId = function (couponName) {
    var defer = eBusinessJQObject.Deferred();
    var service = eb_adminPaymentSummaryDetails.cName;
    if (couponName) {
        service = eb_adminPaymentSummaryDetails.cName + "/" + couponName;
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
 * PaymentSummary Details Model for binding data
 * @method eb_adminPaymentSummaryDetails.model
 * @param {any} options parameter object.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL
 * @param {Object} options.shoppingCart Shopping cart data.
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 */
eb_adminPaymentSummaryDetails.model = function (options) {
    var _that = this;
    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement property is required.", stack: Error().stack };
    }
    _that.domElement = options.domElement;

    if (options.data) {
        _that.data = options.data;
    }

    if (options.shoppingCart) {
        _that.shoppingCart = options.shoppingCart;
        eb_adminPaymentSummaryDetails.shoppingCart(options.shoppingCart);
    }

    eb_adminPaymentSummaryDetails.domElement(_that.domElement);

    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

    _that.showError = ko.observable(0).extend({ rateLimit: 100 });
    _that.errorMessage = ko.observable('');
    _that.paymentTextName = ko.observable("Proceed to Payment");
    _that.couponValidation = ko.observable(0);
    _that.couponValidationMessage = ko.observable();
    _that.subTotal = ko.observable();
    _that.subTotalWithoutCurrencySymbol = ko.observable();
    _that.discount = ko.observable();
    _that.tax = ko.observable();
    _that.shipping = ko.observable();
    _that.grandTotalBeforeDiscount = ko.observable();
    _that.couponName = ko.observable("");
    _that.showControl = ko.observable(0); /* Added property to Visible/Disable control. */
    _that.proceedToCheckout = ko.observable(1); /* proceed to checkout button visible/disable. By default it is visible. */
    _that.hidePaymentDetails = ko.observable(1); /* Payment summary control used on more than one page some of the fields we don't required on every pages hence added this property to hide fields from control. */
    _that.proceedToPaymentVisible = ko.observable(0); /* Proceed to payment button visible/disable property. By default it is disable. */
    _that.disableProceedToCheckout = ko.observable(0); /* Proceed to checkout button visible/disable property. By default it is disable. */
    _that.disableProceedToPayment = ko.observable(0); /* Proceed to payment button visible/disable property. By default it is disable. */
    _that.total = ko.observable();
    _that.handling = ko.observable();
    _that.couponClass = ko.observable();
    _that.applyButton = ko.observable(1);
    _that.removeButton = ko.observable(0);
    _that.hideCouponForAnonymous = ko.observable(0); /* Coupon bar for anonymous user */
    _that.showHandlingChargesNote = ko.observable(1); /* Remove the note of handling charges from checkout and confirmation page. */
    _that.fixedPanelev = ko.observable('');
    _that.disableTextCoupon = ko.observable(0);
    _that.grandTotal = ko.observable(0);
    _that.totalSavings = ko.observable(0);

    /* Redirect to the billing and shipping page. */
    if (options.proceedToCheckoutUrl) {
        eb_adminPaymentSummaryDetails.proceedToCheckoutUrl = options.proceedToCheckoutUrl;
    }

    /* Redirect to the billing and shipping page. */
    if (options.proceedToPaymentUrl) {
        eb_adminPaymentSummaryDetails.proceedToPaymentUrl = options.proceedToPaymentUrl;
    }

    if (options.userContext) {
        _that.userContext = options.userContext;

        if (_that.userContext.isUserLoggedIn()) {
            _that.hideCouponForAnonymous(1); /*Show coupon bar, if it is not an anonymous user*/
        }
    }

    /* checking if coupon is applied */
    _that.checkCouponApplied = function (couponID, couponName, shoppingCartItems) {
        /* Reload the ViewCart so that we don't need to refresh manually to see discount on updated cart items */
        if (!shoppingCartItems) {
            if (eb_adminPaymentSummaryDetails.viewCartObject) {
                eb_adminPaymentSummaryDetails.shoppingCart.viewCart().done(function (result) {
                    if (eb_adminPaymentSummaryDetails.viewCartObject.getSubscriptionAndEventCartItems) {
                        eb_adminPaymentSummaryDetails.viewCartObject.getSubscriptionAndEventCartItems().done(function (data) {
                            _that.updateCouponAppliedMessage(couponID, couponName, eb_adminPaymentSummaryDetails.shoppingCart.cartItems());
                        }).fail(function (data, msg, jhr) {
                            console.error("Failed to get cart item" + data);
                        });
                    }
                    else {
                        console.error("getSubscriptionAndEventCartItems method not found.");
                    }
                }).fail(function (data, msg, jhr) {
                    console.error("Failed to get cart items" + data);
                });
            }
            else {
                console.error("viewCartObject not found.");
            }
        }
        else {
            _that.updateCouponAppliedMessage(couponID, couponName, shoppingCartItems);
        }
    };

    /* The Summary Widget at the right side of the page will be fixed on scrolling */
    var winObject = eBusinessJQObject(window);
    winObject.scroll(function () {
        if (winObject.scrollTop() >= 50 && winObject.height() >= 535) {
            summaryStartScrolling();
        } else {
            summaryStopScrolling();
        }
    });

    function summaryStartScrolling() {
        _that.fixedPanelev("fixedPanelpayment");
    }

    function summaryStopScrolling() {
        _that.fixedPanelev("");
    }

    /* Update coupon applied message. */
    _that.updateCouponAppliedMessage = function (couponID, couponName, shoppingCartItems) {
        var totalSavings = 0;
        eBusinessJQObject.each(shoppingCartItems, function (idx, cartItem) {
            totalSavings += cartItem.totalDiscount;
        });
        if (parseFloat(totalSavings) <= 0) {
            _that.couponValidationMessage(eb_adminPaymentSummaryDetails.couponValidations['Coupon not applicable']);
            _that.couponClass('couponFailed');
            _that.disableTextCoupon(0);
        }
        else {
            _that.couponValidationMessage(eb_adminPaymentSummaryDetails.successResponses['Coupon applied.']);
            _that.couponClass('couponApplied');
            _that.disableTextCoupon(1);
            _that.applyButton(0);/* hide apply button */
            _that.removeButton(1);/* show remove button */
        }
        if (!couponID || couponID === "" || couponID === -1) {
            _that.couponName("");
            _that.couponValidation(0);
            _that.disableTextCoupon(0);
        }
        if (couponName && couponName !== "" && couponName !== -1) {
            _that.couponName(couponName);
            _that.disableTextCoupon(1);
            _that.applyButton(0);/* hide apply button */
            _that.removeButton(1);/* show remove button */
        }
    };

    /* shoppingCart numberOfItems property subscribe event */
    _that.shoppingCart.numberOfItems.subscribe(function (newValue) {
        _that.loadShoppingCartData(_that.shoppingCart);
    });

    /* load shopping cart data */
    _that.loadShoppingCartData = function (data) {
        _that.total(data.grandTotalBeforeDiscount());
        _that.subTotal(data.currencySymbol() + parseFloat(data.subTotal()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        _that.subTotalWithoutCurrencySymbol(parseFloat(data.subTotal()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        _that.tax(data.currencySymbol() + parseFloat(data.tax()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        _that.shipping(data.currencySymbol() + parseFloat(data.shipping()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        _that.handling(data.currencySymbol() + parseFloat(data.handling()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        _that.grandTotalBeforeDiscount(data.currencySymbol() + parseFloat(data.grandTotalBeforeDiscount()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        _that.discount(parseFloat(data.subTotal()).toFixed(eb_Config.roundOffDigitsAfterDecimal));

        var grandTotal = parseFloat((data.subTotal() + data.totalSavings()));

        _that.grandTotal(data.currencySymbol() + parseFloat(grandTotal).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        _that.totalSavings(data.currencySymbol() + parseFloat(data.totalSavings()).toFixed(eb_Config.roundOffDigitsAfterDecimal));

        /* If the number of items is zero then disable the proceed to checkout button */
        if (data.numberOfItems() === 0 || data.numberOfItems() === "") {
            /* To disable the checkout button on view cart page when their is no item in view cart */
            _that.disableProceedToCheckout(1);
            /* To disable the proceed to payment button on review order page when their is no item in view cart */
            _that.disableProceedToPayment(1);
        }

        /* If the coupon is applied, then it will show the coupon applied message */
        if (data.couponId() > 0) {
            _that.couponValidation(1);
            _that.couponValidationMessage(eb_adminPaymentSummaryDetails.successResponses['Coupon applied.']);
            _that.couponClass('couponApplied');
            _that.applyButton(0);/* hide apply button */
            _that.removeButton(1);/* show remove button */

            /* when coupon is present on the cart, check whether Coupon is applied or not and display message accordingly as per knownResponses described above
              need to use this here as when a product is removed from view cart, this method loadShoppingCartData is called and we need to check at this moment if coupon is applicable for item(s) in cart */
            _that.checkCouponApplied(data.couponId(), data.couponName(), data.cartItems());
        }

        /*Change the text of button, if total is equal to 0*/
        if (data.grandTotalBeforeDiscount() === 0) {
            _that.paymentTextName("Place Order");
        }
    };

    if (_that.data) {
        _that.loadShoppingCartData(data);
    }
    else {
        if (_that.shoppingCart) {
            _that.loadShoppingCartData(_that.shoppingCart);
        }
    }

    /* Apply coupon */
    _that.applyCoupon = function () {
        if (_that.couponName() !== '') {
            _that.couponNameCheck = function () {
                /* get call for coupon id from coupon name */
                return eb_adminPaymentSummaryDetails.couponId(_that.couponName());
            };
            _that.couponNameCheck().done(function (data) {
                if (data.id > 0) {
                    if (_that.shoppingCart) {
                        var couponid = { couponid: data.id };
                        _that.shoppingCart.updateShoppingCart(couponid).done(function (result) {
                            _that.checkCouponApplied(result.couponId, result.couponName);
                            _that.couponValidation(1);
                            _that.couponValidationMessage(eb_adminPaymentSummaryDetails.successResponses['Coupon applied.']);
                            _that.couponClass('couponApplied');
                            _that.applyButton(0);
                            _that.removeButton(1);
                            _that.loadShoppingCartData(_that.shoppingCart);
                        }).fail(function (data, msg, jhr) {
                            _that.couponValidation(1);
                            _that.couponValidationMessage(eb_adminPaymentSummaryDetails.successResponses['Coupon not valid']);
                            _that.couponClass('couponFailed');
                            _that.applyButton(1);/* show apply button */
                            _that.removeButton(0);/* hide remove button */
                            console.error(data.responseJSON || "Not valid coupon code.");
                        });
                    }
                } else {
                    _that.couponValidation(1);
                    _that.couponValidationMessage(eb_adminPaymentSummaryDetails.successResponses['Coupon not valid']);
                    _that.couponClass('couponFailed');
                    _that.applyButton(1);/* show apply button */
                    _that.removeButton(0);/* hide remove button */
                }
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getCouponId failed:  " + xhr.responseText);
            });

        } else {
            _that.couponValidation(1);
            _that.couponValidationMessage(eb_adminPaymentSummaryDetails.couponValidations['Enter coupon']);
            _that.couponClass('couponFailed');
        }
    };

    /* Remove Coupon */
    _that.removeCoupon = function () {
        if (_that.shoppingCart) {
            var id = -1;
            var couponid = { couponid: id };
            _that.shoppingCart.updateShoppingCart(couponid).done(function (result) {
                _that.checkCouponApplied(result.couponId, result.couponName);
                _that.couponName("");
                _that.couponValidation(0);
                _that.applyButton(1);
                _that.removeButton(0);
                _that.loadShoppingCartData(_that.shoppingCart);
            }).fail(function (data, msg, jhr) {
                console.error("Failed to remove Coupon : " + couponid);
            });
        }
    };

    /* Proceed to checkout redirection. */
    _that.proceedToCheckout = function () {
        if (_that.userContext.isUserLoggedIn()) {
            if (eb_adminPaymentSummaryDetails.proceedToCheckoutUrl) {
                window.location.assign(eb_adminPaymentSummaryDetails.proceedToCheckoutUrl);
            }
            else {
                console.error("Proceed to checkout URL is required.");
            }
        }
        else {
            //Before redirecting to login page clear the current session.
            sessionStorage.clear();
            window.location.assign(eb_Config.loginPageURL + "?" + encodeURIComponent("RedirectPage=" + window.location.href));
        }
    };

    /* Proceed to payment redirection. */
    _that.proceedToPayment = function (val) {
        if (val && val.total() === 0) {
            /*Place the order for zero dollar product*/
            _that.shoppingCart.placeOrderForZeroDollarProduct().done(function (data) {
                if (eb_adminPaymentSummaryDetails.orderConfirmationUrl) {
                    window.location.assign(eb_adminPaymentSummaryDetails.orderConfirmationUrl + "?" + encodeURIComponent("orderId") + "=" + encodeURIComponent(data.id)); /* Updates all our instances of encodeURIComponent. */
                }
                else {
                    console.error("Order Confirmation URL is required.");
                }

            }).fail(function (xhr, textStatus, errorThrow) {
                _that.showError(1);
                if (xhr && typeof xhr.responseJSON !== 'undefined')
                    _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminPaymentSummaryDetails));
                else
                    _that.errorMessage(eb_adminPaymentSummaryDetails.defaultErrorMessage);
            });
        }
        else {
            if (eb_adminPaymentSummaryDetails.proceedToPaymentUrl) {
                window.location.assign(eb_adminPaymentSummaryDetails.proceedToPaymentUrl);
            }
            else {
                console.error("Proceed to payment URL is required.");
            }
        }
    };

    _that.shoppingCart.grandTotalBeforeDiscount.subscribe(function (newValue) {
        _that.loadShoppingCartData(_that.shoppingCart);
    });
};

/**
 * Shopping cart object
 * @method eb_adminPaymentSummaryDetails.shoppingCart
 * @param {Object} shoppingCart  shopping cart object.
 * */
eb_adminPaymentSummaryDetails.shoppingCart = function (shoppingCart) {
    var self = this;
    self.shoppingCart = shoppingCart;
};

/**
 * View cart Object
 * @method eb_adminPaymentSummaryDetails.viewCartObject
 * @param {Object} viewCartObject  viewCart object.
 * */
eb_adminPaymentSummaryDetails.viewCartObject = function (viewCartObject) {
    var self = this;
    self.viewCartObject = viewCartObject;
};

/**
* Page DOM element.
* @method eb_adminPaymentSummaryDetails.domElement
* @param {object} domElement current DOM element.
* */
eb_adminPaymentSummaryDetails.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};