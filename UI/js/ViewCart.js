/**
 * Define eb_productViewCart class.
 * @class eb_productViewCart
 * */
var eb_productViewCart = eb_productViewCart || {};

/**
 * Control level setting: Site path.
 * @property eb_productViewCart.SitePath
 * @type {String}
 */
eb_productViewCart.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_productViewCart.TemplatePath
 * @type {String}
 */
eb_productViewCart.TemplatePath = "ViewCart.html";

/**
 * The path to the eBusiness SOA layer.
 * @property eb_productViewCart.ServicePath
 * @type {String}
 */
eb_productViewCart.ServicePath = eb_Config.ServicePathV1;

/**
 * Redirect to product Details Page.
 * @property eb_productViewCart.productDetailsURL
 * @type {String}
 */
eb_productViewCart.productDetailsURL = eb_productViewCart.SitePath + "ProductDetails.html";

/**
 * Redirect to event Details Page.
 * @property eb_productViewCart.eventDetailsURL
 * @type {String}
 */
eb_productViewCart.eventDetailsURL = eb_productViewCart.SitePath + "events/EventDetails.html";

/**
 * Redirect to event registration Page.
 * @property eb_productViewCart.eventRegistrationURL
 * @type {String}
 */
eb_productViewCart.eventRegistrationURL = eb_productViewCart.SitePath + "events/EventRegistration.html";

/**
 * Default product image.
 * @property eb_productViewCart.defaultImage
 * @type {String}
 */
eb_productViewCart.defaultImage = "./images/products/coming-soon.png";

/*Success Response */
eb_productViewCart.successResponses = {
    'Order placed': 'Your order has been placed successfully.'
};

/**
* If service error response contains error code not defined in this object then default error message will be shown.
 * 
 * @property eb_productViewCart.errorResponses
    * @type { Object }
 **/
eb_productViewCart.errorResponses = {
    413: { useServerMessage: true }
};

/**
 * Default error message.
 * @property eb_productViewCart.defaultErrorMessage
 * @type {String}
 * */
eb_productViewCart.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/* Default message when cart is empty */
eb_productViewCart.cartEmptyMessage = "Your Cart is Empty";

/**
 * Rendering public method to load HTML template. Based on page level configuration it will select the template and load in DOM
 * @method eb_productViewCart.render
 * @param {any} options options contains different parameter like Sitepath, templatePath and domElement..
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * @returns {String} jQuery return promise object which when resolved returns HTML template.
 * */
eb_productViewCart.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            options.templatePath = eb_productViewCart.SitePath + eb_productViewCart.TemplatePath;
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
 * View Cart Model for binding data
 * @method eb_productViewCart.model
 * @param {any} options options contains different parameter like Site path, templatePath, domElement, ServicePath, shoppingcart, eventAllItems, subscriptionAllItems
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 * @param {Object} options.eventAllItems Event Items.
 * @param {Object} options.shoppingCart Shopping Cart Object.
 * @param {Object} options.subscriptionAllItems Subscription Items.
 */
eb_productViewCart.model = function (options) {
    var _that = this;
    _that.domElement = options.domElement;
    _that.subscriptionAllItems = ko.observableArray();
    _that.eventAllItems = ko.observableArray();

    if (options.data) {
        _that.data = options.data;
    }

    if (options.shoppingCart) {
        eb_productViewCart.shoppingCart(options.shoppingCart);
    }

    if (options.subscriptionAllItems) {
        _that.subscriptionAllItems = ko.observableArray(options.subscriptionAllItems);
    }

    if (options.eventAllItems) {
        _that.eventAllItems = ko.observableArray(options.eventAllItems);
    }

    eb_productViewCart.domElement(_that.domElement);
    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

    ko.validation.registerExtenders();

    _that.cartEmptyMessageVisible = ko.observable(0); /* This is for vi-sibling, if the cart is empty. */
    _that.cartEmptyMessage = ko.observable(); /* This is for showing the message if the cart is empty. */
    _that.viewCartProduct = ko.observableArray(); /* Array of ViewCartItems */
    _that.visible = ko.observable(false); /* This for disabling or enabling the field */
    _that.removeButtonVisible = ko.observable(true); /* This is for displaying the remove button */
    _that.updateButtonVisible = ko.observable(true); /* This is for displaying the update button */
    _that.cartTitleMessageVisible = ko.observable(1); /* This is for displaying the your cart information */
    _that.numberOfItems = ko.observable(); /* This is for displaying the number of items available */
    _that.subTotal = ko.observable(); /* This is for displaying the product sub total */
    _that.removeAllDetailsVisible = ko.observable(1); /*After removing all the item from product, hide the block of view cart product details*/
    _that.currencySymbol = ko.observable(); /* Need currency symbol for catalog price */
    _that.quantity = ko.observable();
    _that.hasSessions = ko.observable(false);
    _that.totalSavings = ko.observable(); /* Showing total savings */
    _that.doWaitRemoveAttendee = ko.observable(false);

    /* error handling */
    _that.showError = ko.observable(0);
    _that.errorMessage = ko.observable('');

    /* Collection of cart items */
    _that.viewCartItems = function (data) {
        var self = this;
        self.showQtyError = ko.observable(0);
        self.qtyErrorMsg = ko.observable('');
        self.id = ko.observable(data["id"]);
        self.parentId = ko.observable(data["parentId"]);
        self.quantity = ko.observable(data["quantity"]);
        self.currencySymbol = ko.observable(_that["currencySymbol"]());
        self.price = ko.observable(parseFloat(data["price"]).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.discount = ko.observable(parseFloat(data["discount"]).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        if (data["webName"]) {
            self.name = ko.observable(data["webName"]);
        } else if (data["productName"]) {
            self.name = ko.observable(data["productName"]);
        } else if (data["name"]) { self.name = ko.observable(data["name"]); }

        self.productType = ko.observable(data["productType"]);
        self.description = ko.observable(data["description"]);
        if (self.productType().toLowerCase() === "meeting") {
            self.description = self.description().slice(17);
        }
        self.productId = ko.observable(data["productId"]);
        self.subProductsList = ko.observableArray();
        self.isParentProduct = ko.observable(0);
        self.isSubscription = ko.observable(data["isSubscription"]);
        self.autoRenew = ko.observable(data["autoRenew"]);
        self.totalDiscount = ko.observable(data["totalDiscount"]);
        self.totalFinalPrice = ko.observable(parseFloat(data["totalFinalPrice"]).toFixed(eb_Config.roundOffDigitsAfterDecimal));

        if (eb_Config.loadDefaultImage) {
            self.productImage = ko.observable(eb_productViewCart.defaultImage);
        }
        else {
            self.productImage = ko.observable(eb_Config.thumbnailImageURL + self.productId() + eb_Config.imageExtension);
        }

        self.sessionCollapse = ko.observable(0);

        /*calculating final discounted price at the front-end as per discussion in sprint planning
        *the formula is to calculate discount on the basis of discount field which is % in every case
        *hence calculating the percentage of original price and subtracting that amount from the original price gives the final price
        */
        var finalDiscountedPrice = data["price"] * (1 - data["discount"] / 100);
        self.finalPrice = ko.observable(parseFloat(finalDiscountedPrice).toFixed(eb_Config.roundOffDigitsAfterDecimal));

        if (eb_productViewCart.isOrderHistory) {
            self.price = ko.observable(self.finalPrice());
        }

        if (self.isSubscription()) {
            self.showUpdateButton = ko.observable(0);
        } else {
            self.showUpdateButton = ko.observable(1);
        }

        self.parentproductId = ko.observable(data["parentproductId"]);
        if (data["attendeeId"]) {
            self.attendeeId = ko.observable(data["attendeeId"]);
        }

        /* Auto Renew Check box click event. */
        self.autoRenewCheck = function (data) {
            if (eb_productViewCart.shoppingCart) {
                var dataToUpdate = {};
                dataToUpdate.quantity = data.quantity();
                dataToUpdate.id = data.id();
                dataToUpdate.autoRenew = data.autoRenew();
                if (data.isSubscription() === true) { dataToUpdate.productType = "subscription"; } else { dataToUpdate.productType = data.productType(); }

                eb_productViewCart.shoppingCart.updateCartItem(dataToUpdate).done(function (result) {
                    _that.showError(0);
                    if (Array.isArray(result)) { result = result[0]; }
                    self.autoRenew(result.autoRenew);
                }).fail(function (data, msg, jhr) {
                    _that.showError(1);
                    _that.errorMessage(eb_productViewCart.defaultErrorMessage);
                    self.autoRenew(data.autoRenew());
                    console.error("Failed to update shopping cart item" + data);
                });
            } else {
                self.autoRenew(data.autoRenew());
                console.error("Shopping cart object not exist.");
            }
            return true;
        };
        /*Toggling the session*/
        self.toggleSession = function () {
            self.sessionCollapse(!self.sessionCollapse());
        };

        /*Subscribe the quantity field to enter appropriate quantity value*/
        self.quantity.subscribe(function (value) {
            self.showQtyError(1);
            if (value === '') {
                self.qtyErrorMsg('This Field is required');
            }
            else if (value <= 0) {
                self.qtyErrorMsg('Please enter a value greater than 0');
            }
            else if (value % 1 > 0) {
                self.qtyErrorMsg('Please enter a digit');
            }
            else {
                self.showQtyError(0);
            }
        });
    };

    /* Redirect to the product detail page. */
    _that.productNameDetails = function (item) {
        if (eb_productViewCart.productDetailsURL || eb_productViewCart.eventDetailsURL) {
            if (item.productType().toLowerCase() === "meeting") {
                window.location.assign(eb_productViewCart.eventDetailsURL + "?" + encodeURIComponent("productId") + "=" + encodeURIComponent(item.productId()));
            } else {
                window.location.assign(eb_productViewCart.productDetailsURL + "?" + encodeURIComponent("productId") + "=" + encodeURIComponent(item.productId()));
            }
        }
        else {
            console.error("A redirection page is missing.");
        }
    };

    /* Load cart items in view cart page. */
    _that.loadViewCartItems = function (data) {
        /* Showing total savings
        * removing the cart items from front end, as this function gets called from PaymentSummary as well after coupon is applied
        * if we don't clear this, it loads items multiple times */
        _that.viewCartProduct.removeAll();

        if (data.length === 0) {
            _that.removeAllDetailsVisible(0);
            _that.cartEmptyMessageVisible(1);
            _that.cartEmptyMessage(eb_productViewCart.cartEmptyMessage);
        }

        eBusinessJQObject.map(data, function (row) {
            /* Product should not be parent product. */
            var productRecord;
            if (row.parentId <= 0) {
                /* If product is subscription then get autoRenew field from another service call. */
                if (row.isSubscription) {
                    row = ko.utils.arrayFirst(_that.subscriptionAllItems(), function (cartItem) {
                        return cartItem.id === row.id;
                    });
                    if (!row) {
                        throw { type: "argument_mismatch", message: 'Subscription record does not exists in order line. ID: ' + id, stack: Error().stack };
                    }

                    _that.viewCartProduct.push(new _that.viewCartItems(row));

                } else if (row.productType.toLowerCase() === "meeting") {
                    var idToMatch = row.id;
                    row = ko.utils.arrayFirst(_that.eventAllItems(), function (cartItem) {
                        return cartItem.id === row.id;
                    });
                    if (!row) {
                        throw { type: "argument_mismatch", message: 'Meeting record does not exists in order line. ID: ' + idToMatch, stack: Error().stack };
                    }

                    productRecord = ko.utils.arrayFirst(_that.viewCartProduct(), function (item) {
                        return item.productId() === Number(row.productId) && row.parentproductId <= 0;
                    });
                    if (row.parentproductId <= 0) {
                        var cartItem;
                        var record;
                        if (productRecord) {
                            cartItem = new _that.viewCartItems(row);
                            productRecord.subProductsList.push(cartItem);
                            for (record = 0; record < _that.eventAllItems().length; record++) {
                                if (_that.eventAllItems()[record].attendeeId === cartItem.attendeeId() && _that.eventAllItems()[record].parentproductId === cartItem.productId()) {
                                    productRecord.subProductsList.push(new _that.viewCartItems(_that.eventAllItems()[record]));
                                }
                            }
                        } else {
                            cartItem = new _that.viewCartItems(row);
                            _that.viewCartProduct.push(cartItem);
                            _that.viewCartProduct()[_that.viewCartProduct().length - 1].subProductsList.push(cartItem);
                            for (record = 0; record < _that.eventAllItems().length; record++) {
                                if (_that.eventAllItems()[record].attendeeId === cartItem.attendeeId() && _that.eventAllItems()[record].parentproductId === cartItem.productId()) {
                                    _that.viewCartProduct()[_that.viewCartProduct().length - 1].subProductsList.push(new _that.viewCartItems(_that.eventAllItems()[record]));
                                }
                            }
                        }
                    }
                } else {
                    _that.viewCartProduct.push(new _that.viewCartItems(row));
                }
            } else {
                /* Kit products. */
                productRecord = ko.utils.arrayFirst(_that.viewCartProduct(), function (item) {
                    return item.id() === Number(row.parentId);
                });
                if (productRecord) {
                    productRecord.isParentProduct(1);
                    productRecord.subProductsList.push(new _that.viewCartItems(row));
                }
            }
        });
        _that.calculateTotalSavings(data); /* calculation of total savings */
    };

    /* Load view cart details. */
    _that.loadViewCartPaymentDetails = function (data) {
        _that.numberOfItems(data.numberOfItems());
        _that.subTotal(parseFloat(data.subTotal()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        _that.currencySymbol(data.currencySymbol());
        if (data.numberOfItems() === 0 || data.numberOfItems() === "") {
            _that.cartEmptyMessageVisible(1);
            _that.cartEmptyMessage(eb_productViewCart.cartEmptyMessage);
        }
    };

    /* Showing total savings */
    _that.calculateTotalSavings = function (cartItems) {
        _that.totalSavings(0);
        eBusinessJQObject.each(cartItems || eb_productViewCart.shoppingCart.cartItems(), function (idx, cartItem) {
            _that.totalSavings(_that.totalSavings() + cartItem.totalDiscount);
        });
        _that.totalSavings(parseFloat(_that.totalSavings()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
    };

    /* Load external data into the view cart. */
    if (_that.data) {
        _that.loadViewCartItems(_that.data);
    }
    else {
        if (eb_productViewCart.shoppingCart) {
            /* showing total savings */
            _that.totalSavings(0);
            _that.loadViewCartPaymentDetails(eb_productViewCart.shoppingCart);
            _that.loadViewCartItems(eb_productViewCart.shoppingCart.cartItems());
        }
    }

    /* Remove a product from cart. */
    _that.removeProduct = function (data) {
        if (eb_productViewCart.shoppingCart) {
            var dataToRemove = {};
            dataToRemove.id = data.id();
            if (data.productType().toLowerCase() !== "meeting") {
                eb_productViewCart.shoppingCart.removeCartItem(dataToRemove).done(function (result) {
                    _that.showError(0);
                    loadSubscriptionAndEventCartItems();
                }).fail(function (data, msg, jhr) {
                    _that.showError(1);
                    _that.errorMessage(eb_productViewCart.defaultErrorMessage);
                    console.error("Failed to remove cart item. " + data.id);
                });
            } else {
                eb_productViewCart.shoppingCart.removeEventItems(dataToRemove).done(function (result) {
                    _that.showError(0);
                    loadSubscriptionAndEventCartItems();
                }).fail(function (data, msg, jhr) {
                    _that.showError(1);
                    _that.errorMessage(eb_productViewCart.defaultErrorMessage);
                    console.error("Failed to remove item from cart " + data.id);
                });
            }
        } else { console.error("Shopping cart object doesn't exist."); }
    };

    /*Load subscription and event cart items*/
    function loadSubscriptionAndEventCartItems() {
        _that.viewCartProduct.removeAll();
        _that.getSubscriptionAndEventCartItems().done(function () {
            _that.showError(0);
            _that.loadViewCartPaymentDetails(eb_productViewCart.shoppingCart);
        }).fail(function (data, msg, jhr) {
            _that.showError(1);
            _that.errorMessage(eb_productViewCart.defaultErrorMessage);
            console.error("Failed to get cart item. " + data.id);
        });
    }

    /* Remove all meeting products from cart. */
    _that.removeAllMeetingProduct = function (data) {
        function getAttendeeRecordCount(productList) {
            var count = 0;
            for (var record = 0; record < productList.length; record++) {
                if (productList[record].parentproductId() === 0) {
                    count = count + 1;
                }
            }
            return count;
        }

        data.subProductsList().sort(function (a, b) {
            return b.id() - a.id();
        });

        var recordCount = getAttendeeRecordCount(data.subProductsList());
        ko.utils.arrayForEach(data.subProductsList(), function (productRecord) {
            if (productRecord && productRecord.parentproductId() === 0) {
                var interval_removeAttendee = setInterval(function () {
                    if (!_that.doWaitRemoveAttendee()) {
                        _that.doWaitRemoveAttendee(true);
                        var dataToRemove = {};
                        dataToRemove.id = productRecord.id();
                        eb_productViewCart.shoppingCart.removeEventItems(dataToRemove).done(function (result) {
                            recordCount = recordCount - 1;
                            _that.doWaitRemoveAttendee(false);
                            clearInterval(interval_removeAttendee);
                            if (recordCount === 0) {
                                _that.viewCartProduct.removeAll();
                                _that.getSubscriptionAndEventCartItems().done(function () {
                                    _that.loadViewCartPaymentDetails(eb_productViewCart.shoppingCart);
                                }).fail(function (data, msg, jhr) {
                                    console.error("Failed to get cart information.");
                                });
                            }
                        }).fail(function (data, msg, jhr) {
                            clearInterval(interval_removeAttendee);
                            console.error("Failed to remove all meeting items from cart");
                        });
                    }
                }, 100);
            }
        });
    };

    /* Get subscription and events cart items from server. */
    _that.getSubscriptionAndEventCartItems = function () {
        var def = eBusinessJQObject.Deferred();
        eBusinessJQObject.when(eb_shoppingCart.viewSubscriptionCartItems(eb_productViewCart.shoppingCart.cartItems()),
            eb_shoppingCart.getEventProductItems(eb_productViewCart.shoppingCart.cartItems())).done(function (subscriptionAllItems, eventAllItems) {
                _that.subscriptionAllItems.removeAll();
                _that.subscriptionAllItems(subscriptionAllItems);
                _that.eventAllItems.removeAll();
                _that.eventAllItems(eventAllItems);
                _that.loadViewCartItems(eb_productViewCart.shoppingCart.cartItems());
                _that.loadViewCartPaymentDetails(eb_productViewCart.shoppingCart);
                _that.calculateTotalSavings();
                def.resolve();
            }).fail(def.reject);
        return def.promise();
    };

    /* Notify User that Cart is updated */
    function callShowCartUpdate() {
        var showCartUpdate = eBusinessJQObject(eb_productViewCart.domElement).find('#CartUpdateMsg')[0];
        showCartUpdate.className = "show";
        setTimeout(function () { showCartUpdate.className = showCartUpdate.className.replace("show", ""); }, 2000);
    }

    /* Update cart's quantity */
    _that.qtyUpdate = function (data, event) {
        if (data.quantity() !== "" && data.quantity() > "0") {
            if (data.isSubscription() === false) {
                if (eb_productViewCart.shoppingCart) {
                    data.showUpdateButton(0);
                    var dataToUpdate = {};
                    dataToUpdate.id = data.id();
                    dataToUpdate.quantity = data.quantity();
                    if (data.isSubscription() === true) { dataToUpdate.productType = "subscription"; } else { dataToUpdate.productType = data.productType(); }

              
                    eb_productViewCart.shoppingCart.updateCartItem(dataToUpdate).done(function (result) {
                        _that.showError(0);
                        /* Need to update price and discount */
                        data.price(parseFloat(result.price).toFixed(eb_Config.roundOffDigitsAfterDecimal));
                        data.discount(parseFloat(result.discount).toFixed(eb_Config.roundOffDigitsAfterDecimal));
                        data.totalDiscount(parseFloat(result.totalDiscount).toFixed(eb_Config.roundOffDigitsAfterDecimal));
                        data.totalFinalPrice(parseFloat(result.totalFinalPrice).toFixed(eb_Config.roundOffDigitsAfterDecimal));
                        /*To Apply discount price*/
                        var finalDiscountedPrice = result["price"] * (1 - result["discount"] / 100);
                        data.finalPrice(parseFloat(finalDiscountedPrice).toFixed(eb_Config.roundOffDigitsAfterDecimal));
                        /* Showing total savings */
                        _that.calculateTotalSavings();
                        /* Check this is parent product of kit then update quantity for all sub products. */
                        if (data.isParentProduct() > 0) {
                            ko.utils.arrayForEach(data.subProductsList(), function (productRecord) {
                                productRecord.quantity(result.quantity);
                            });
                        }
                        _that.loadViewCartPaymentDetails(eb_productViewCart.shoppingCart);
                        data.showUpdateButton(1);
                        callShowCartUpdate();
                    }).fail(function (data1, msg, jhr) {
                        _that.showError(1);
                        data.showUpdateButton(1);
                        if (data1 && typeof data1.responseJSON !== 'undefined') {
                            _that.errorMessage(eb_Config.getErrorMessageForControl(data1.responseJSON, eb_productViewCart));
                        } else {
                          _that.errorMessage(eb_productViewCart.defaultErrorMessage);
                        }
                    });
                } else {
                    console.error("Shopping cart object does not exist.");
                    data.showUpdateButton(1);
                }
            } else {
                console.log("Subscription product cannot be updated");
            }
        } else {
            console.log("Quantity field required. Minimum quantity should be 1");
        }
    };

    /* Redirect to meeting registration page */
    _that.editMeeting = function (item) {
        if (eb_productViewCart.eventRegistrationURL) {
            if (item.productType().toLowerCase() === "meeting") {
                window.location.assign(eb_productViewCart.eventRegistrationURL + "?" + encodeURIComponent("productId") + "=" + encodeURIComponent(item.productId()) + "&hasSessions=" + _that.hasSessions());
            }
        }
        else {
            console.error("A redirection page is missing.");
        }
    };

    /* Remove all view cart items. */
    _that.removeAllProduct = function () {
        if (eb_productViewCart.shoppingCart) {
            eb_productViewCart.shoppingCart.emptyCart().done(function () {
                _that.showError(0);
                _that.loadViewCartPaymentDetails(eb_productViewCart.shoppingCart);
                _that.viewCartProduct.removeAll();
                _that.removeAllDetailsVisible(0);
                _that.cartEmptyMessageVisible(1);
                _that.cartEmptyMessage(eb_productViewCart.cartEmptyMessage);
                _that.calculateTotalSavings();/*Showing total savings*/
            }).fail(function (data, msg, jhr) {
                _that.showError(1);
                _that.errorMessage(eb_productViewCart.defaultErrorMessage);
                console.error("Failed to execute emptyCart method" + data);
            });
        }
        else { console.error("Shopping cart object not exist."); }
    };

    /* Quantity validation allow only numeric character. */
    ko.bindingHandlers.numeric = {
        init: function (element, valueAccessor) {
            eBusinessJQObject(element).on("keydown", function (event) {
                /* Allow: backspace, delete, tab, escape, and enter */
                if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || event.keyCode === 13 ||
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
};

/**
 * Shopping cart object
 * @method eb_productViewCart.shoppingCart
 * @param {Object} shoppingCart  shopping cart object.
 * */
eb_productViewCart.shoppingCart = function (shoppingCart) {
    var self = this;
    self.shoppingCart = shoppingCart;
};

/* If image is not their, then attach no image found */
ko.bindingHandlers.imageSrc = {
    update: function (element, valueAccessor) {
        var options = valueAccessor();
        var src = ko.unwrap(options.src);
        eBusinessJQObject('<img />').attr('src', src).on('load', function () {
            eBusinessJQObject(element).attr('src', src);
        }).on('error', function () {
            eBusinessJQObject(element).attr('src', eb_productViewCart.defaultImage);
        });
    }
};

/**
* Page DOM element.
* @method eb_productViewCart.domElement
* @param {object} domElement current DOM element.
* */
eb_productViewCart.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_productViewCart.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_productViewCart);
});