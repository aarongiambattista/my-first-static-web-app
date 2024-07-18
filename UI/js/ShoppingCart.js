/**
 * Shopping cart class.
 * @class eb_shoppingCart
 * */
var eb_shoppingCart = eb_shoppingCart || {};

/**
 * SOA path.
 * It would be set from configuration file.
 * @property eb_shoppingCart.ServicePath
 * @type {String}
 * */
eb_shoppingCart.ServicePath = eb_Config.ServicePathV1;

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_shoppingCart.SitePath
 * @type {String}
 * */
eb_shoppingCart.SitePath = eb_Config.SitePath;

/**
 * Shopping cart template path.
 * @property eb_shoppingCart.TemplatePath
 * @type {String}
 * */
eb_shoppingCart.TemplatePath = "html/ShoppingCart.html";

/**
 * Service URL based on product types.
 * @property eb_shoppingCart.productType
 * @type {Object} Array of product type names.
 * */
eb_shoppingCart.productType = [
    { code: "general", productType: "GeneralProduct" },
    { code: "subscription", productType: "SubscriptionGeneralProduct" },
    { code: "meeting", productType: "EventProduct" }
];

/**
 * Shopping cart service URLs.
 * @property eb_shoppingCart.serviceUrls
 * @type {Object} Object containing different shopping cart related service URLs.
 * */
eb_shoppingCart.serviceUrls = {};
eb_shoppingCart.serviceUrls.addItemToCartService = eb_shoppingCart.ServicePath + "ShoppingCarts/Items/{productType}";
eb_shoppingCart.serviceUrls.updateCartItemService = eb_shoppingCart.ServicePath + "ShoppingCarts/Items/{id}/{productType}";
eb_shoppingCart.serviceUrls.removeCartItemService = eb_shoppingCart.ServicePath + "ShoppingCarts/Items/{id}";
eb_shoppingCart.serviceUrls.emptyCartService = eb_shoppingCart.ServicePath + "ShoppingCarts/Items";
eb_shoppingCart.serviceUrls.getCartItemsService = eb_shoppingCart.ServicePath + "ShoppingCarts/Items";
eb_shoppingCart.serviceUrls.getCartService = eb_shoppingCart.ServicePath + "ShoppingCarts";
eb_shoppingCart.serviceUrls.updateCartService = eb_shoppingCart.ServicePath + "ShoppingCarts";
eb_shoppingCart.serviceUrls.checkout = eb_shoppingCart.ServicePath + "ShoppingCarts/Checkout/{purchaseOrder}";
eb_shoppingCart.serviceUrls.deleteCartService = eb_shoppingCart.ServicePath + "ShoppingCarts";
eb_shoppingCart.serviceUrls.getSubscriptionCartItemsService = eb_shoppingCart.ServicePath + "ShoppingCarts/Items/SubscriptionGeneralProduct";
eb_shoppingCart.serviceUrls.getSubscriptionCartItemService = eb_shoppingCart.ServicePath + "ShoppingCarts/Items/{orderLineSequence}/SubscriptionGeneralProduct";
eb_shoppingCart.serviceUrls.getEventProductCartItemService = eb_shoppingCart.ServicePath + "ShoppingCarts/Items/EventProduct";
eb_shoppingCart.serviceUrls.removeEventItemService = eb_shoppingCart.ServicePath + "ShoppingCarts/Items/{id}/EventProduct";
eb_shoppingCart.serviceUrls.zeroDollarPaymentService = eb_shoppingCart.ServicePath + "ShoppingCarts/Checkout/ZeroPaymentOrder";

/**
 * The service will return shopping cart HTML.
 * @method eb_shoppingCart.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Shopping cart template URL.
 * @return {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_shoppingCart.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_shoppingCart.SitePath + eb_shoppingCart.TemplatePath;
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
 * This method is used to view cart items.
 * The service call will return shopping cart data.
 * @method eb_shoppingCart.viewCartItems
 * @return {object} jQuery promise object return view cart Items
 * */
eb_shoppingCart.viewCartItems = function () {
    var defer = eBusinessJQObject.Deferred();
    console.info('get view cart items..');
    var serviceURL = eb_shoppingCart.serviceUrls.getCartItemsService;

    eBusinessJQObject.get({
        url: serviceURL,
        xhrFields: {
            withCredentials: true
        }
    }).done(function (result) {
        defer.resolve(result);
    }).fail(defer.reject);
    return defer.promise();
};

/**
 * This method is used to view cart items with event product.
 * The service call will return shopping cart data.
 * @method eb_shoppingCart.eventProductItems
 * @return {object} jQuery promise object return event product Items
 * */
eb_shoppingCart.eventProductItems = function () {
    var defer = eBusinessJQObject.Deferred();
    console.info('get event cart items..');
    var serviceURL = eb_shoppingCart.serviceUrls.getEventProductCartItemService;

    eBusinessJQObject.get({
        url: serviceURL,
        xhrFields: {
            withCredentials: true
        }
    }).done(function (result) {
        defer.resolve(result);
    }).fail(defer.reject);
    return defer.promise();
};

/**
 * This method is used to view cart items with event product.
 * The service call will return shopping cart data.
 * @method eb_shoppingCart.getEventProductItems
 * @param {String} cartItems cartItems in view cart
 * @return {object} jQuery promise object return event product Items
 * */
eb_shoppingCart.getEventProductItems = function (cartItems) {
    var defer = eBusinessJQObject.Deferred();
    console.info('get event cart items..');

    var value = true;
    var subItems = [];
    var cartItem = ko.utils.arrayFirst(cartItems, function (item) {
        return item.productType === "Meeting";
    });
    if (cartItem) {
        var serviceURL = eb_shoppingCart.serviceUrls.getEventProductCartItemService;

        eBusinessJQObject.get({
            url: serviceURL,
            xhrFields: {
                withCredentials: true
            }
        }).done(function (result) {
            defer.resolve(result);
        }).fail(defer.reject);

    } else { defer.resolve(subItems); }
    return defer.promise();
};

/**
 * This method is used to view cart items with subscription product.
 * The service call will return shopping cart data.
 * @method eb_shoppingCart.viewSubscriptionCartItems
 * @param {String} cartItems cartItems in view cart
 * @return {object} jQuery promise object return subscription cart Items
 * */
eb_shoppingCart.viewSubscriptionCartItems = function (cartItems) {
    var defer = eBusinessJQObject.Deferred();
    console.info('get shopping cart subscription items..');

    var value = true;
    var subItems = [];
    var cartItem = ko.utils.arrayFirst(cartItems, function (item) {
        return item.isSubscription === value;
    });
    if (cartItem) {
        var serviceURL = eb_shoppingCart.serviceUrls.getSubscriptionCartItemsService;

        eBusinessJQObject.get({
            url: serviceURL,
            xhrFields: {
                withCredentials: true
            }
        }).done(function (data) {
            defer.resolve(data);
        }).fail(defer.reject);

    } else { defer.resolve(subItems); }
    return defer.promise();
};

/**
 * This method used to update cart's item.
 * Based on the product type will call the service.
 * The service call will return updated shopping cart data.
 * @method eb_shoppingCart.updateCartItem
 * @param {Object} data Here data contains product id, product type and quantity.
 * @return {object} jQuery promise object return updated product details 
 * */
eb_shoppingCart.updateCartItem = function (data) {
    var defer = eBusinessJQObject.Deferred();
    var dataToPass = {};
    var servicePath = eb_shoppingCart.serviceUrls.updateCartItemService;
    if (data.productType) {
        switch (data.productType.toLowerCase()) {
            case "general":
            case "publication":
                var general = eb_shoppingCart.productType[0].productType;
                servicePath = eb_shoppingCart.serviceUrls.updateCartItemService.replace("{id}", data.id).replace("{productType}", general);
                /*data to pass to service.*/
                dataToPass.productId = data.productId;
                dataToPass.quantity = data.quantity;
                break;
            case "subscription":
                var subscription = eb_shoppingCart.productType[1].productType;
                servicePath = eb_shoppingCart.serviceUrls.updateCartItemService.replace("{id}", data.id).replace("{productType}", subscription);
                /*data to pass to service.*/
                dataToPass.autoRenew = data.autoRenew;
                break;
        }

    } else {
        throw { type: "argument_mismatch", message: 'Missing item productType as parameter.', stack: Error().stack };
    }

    eb_shoppingCart.updateCartItemService(dataToPass, servicePath).done(function (result) {
        console.info('update cart item...');
        defer.resolve(result);
    }).fail(defer.reject);
    return defer.promise();
};

/**
 * This method used to update cart's item.
 * Based on the product type will call the service.
 * The service call will return updated shopping cart data.
 * @method eb_shoppingCart.updateCartItemService
 * @param {Object} data Here data contains product id and quantity.
 * @param {String} servicePath Service URL for the current product type.
 * @return {object} jQuery promise object return updated product details.
 * */
eb_shoppingCart.updateCartItemService = function (data, servicePath) {
    var defer = eBusinessJQObject.Deferred();

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: servicePath,
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
 * This method used to add product to cart.
 * Based on the product type will call the service.
 * @method eb_shoppingCart.addItemToCart
 * @param {Object} data Object of required data.
 * @param {Boolean} data.newCartItem Boolean value to specify whether item is added to the current cart for first time .
 * @param {Number} data.productId Product ID.
 * @param {String} data.productType Product type.
 * @param {Number} data.quantity Quantity.
 * @return {object} jQuery promise object return product details which we want to add in your cart
 * */
eb_shoppingCart.addItemToCart = function (data) {
    var defer = eBusinessJQObject.Deferred();
    var dataToPass = {};
    var serviceURL = eb_shoppingCart.serviceUrls.addItemToCartService;
    if (data.productType) {
        switch (data.productType.toLowerCase()) {
            case "general":
            case "publication":
                var general = eb_shoppingCart.productType[0].productType;
                serviceURL = eb_shoppingCart.serviceUrls.addItemToCartService.replace("{productType}", general);
                /*data to pass to service.*/
                dataToPass.productId = data.productId;
                dataToPass.quantity = data.quantity;
                break;
            case "subscription":
                var subscription = eb_shoppingCart.productType[1].productType;
                serviceURL = eb_shoppingCart.serviceUrls.addItemToCartService.replace("{productType}", subscription);
                /*data to pass to service.*/
                dataToPass.productId = data.productId;
                dataToPass.quantity = data.quantity;
                break;
            case "meeting":
                var meeting = eb_shoppingCart.productType[2].productType;
                serviceURL = eb_shoppingCart.serviceUrls.addItemToCartService.replace("{productType}", meeting);
                /*data to pass to service.*/
                dataToPass.attendeeId = data.attendeeId;
                dataToPass.productId = data.productId;
                break;
        }
    } else {
        throw { type: "argument_mismatch", message: 'Missing item productType as parameter.', stack: Error().stack };
    }

    eb_shoppingCart.addItemToCartService(dataToPass, serviceURL).done(function (result) {
        console.info('add to cart...');
        defer.resolve(result);
    }).fail(defer.reject);
    return defer.promise();
};

/**
 * This method used to add product to cart.
 * Based on the product type will call the service.
 * @method eb_shoppingCart.addItemToCartService
 * @param {Object} data Here data contains product id and quantity.
 * @param {String} servicePath Service URL for the current product type.
 * @return {object} jQuery promise object return product details which we want to add in your cart.
 * */
eb_shoppingCart.addItemToCartService = function (data, servicePath) {
    var defer = eBusinessJQObject.Deferred();

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: servicePath,
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
 * This method used to remove product from cart.
 * @method eb_shoppingCart.removeCartItem
 * @param {Object} data Product id.
 * @return {object} jQuery promise object return product details which we want remove from cart
 * */
eb_shoppingCart.removeEventItem = function (data) {
    var deferred = eBusinessJQObject.Deferred();
    console.info('remove cart item...');

    var serviceURL = eb_shoppingCart.serviceUrls.removeEventItemService;
    if (data.id) {
        serviceURL = eb_shoppingCart.serviceUrls.removeEventItemService.replace("{id}", data.id);
    }
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: serviceURL,
            type: "DELETE",
            data: data,
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (result) {
            deferred.resolve(result);
        }).fail(deferred.reject);
    });
    return deferred.promise();
};

/**
 * This method used to remove product from cart.
 * @method eb_shoppingCart.removeCartItem
 * @param {Object} data Product id.
 * @return {object} jQuery promise return undefined 
 * */
eb_shoppingCart.removeCartItem = function (data) {
    var deferred = eBusinessJQObject.Deferred();
    console.info('remove cart item...');

    var serviceURL = eb_shoppingCart.serviceUrls.removeCartItemService;
    if (data.id) {
        serviceURL = eb_shoppingCart.serviceUrls.removeCartItemService.replace("{id}", data.id);
    }

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: serviceURL,
            type: "DELETE",
            data: data,
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (result) {
            deferred.resolve(result);
        }).fail(deferred.reject);
    });
    return deferred.promise();
};

/**
 * This method is used to remove all cart items.
 * @method eb_shoppingCart.emptyCart
 * @return {String} jQuery promise return undefined
 * */
eb_shoppingCart.emptyCart = function () {
    var deferred = eBusinessJQObject.Deferred();
    console.info('remove all cart items...');

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_shoppingCart.serviceUrls.emptyCartService,
            type: "DELETE",
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (result) {
            deferred.resolve(result);
        }).fail(deferred.reject);
    });
    return deferred.promise();
};

/**
 * This method is used to get shopping cart record.
 * @method eb_shoppingCart.getShoppingCart
 * @return {object} jQuery promise return shopping cart details
 * */
eb_shoppingCart.getShoppingCart = function () {
    var defer = eBusinessJQObject.Deferred();
    console.info('get shopping cart record');
    var serviceURL = eb_shoppingCart.serviceUrls.getCartService;

        eBusinessJQObject.get({
            url: serviceURL,
            xhrFields: {
                withCredentials: true
            }
        }).done(function (result) {
            defer.resolve(result);
        }).fail(defer.reject);
    return defer.promise();
};

/**
 * This method is used to update shopping cart's couponId, couponName, shippingAddressId and billingAddressId.
 * @method eb_shoppingCart.updateShoppingCart
 * @param {Object} data Billing and shipping address ids.
 * @return {object} jQuery promise return updated shopping cart details
 * */
eb_shoppingCart.updateShoppingCart = function (data) {
    var defer = eBusinessJQObject.Deferred();
    console.info('update shopping cart records...');

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_shoppingCart.serviceUrls.updateCartService,
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
 * This method is used to checkout cart.
 * @method eb_shoppingCart.checkout
 * @param {Object} data Credit card details or purchase order number.
 * @param {String} data.parameter "CreditCard" or "PurchaseOrder".
 * @return {object} jQuery promise return the id
 * */
eb_shoppingCart.checkout = function (data) {
    var defer = eBusinessJQObject.Deferred();
    console.info('checkout cart service...');

    var servicePath = eb_shoppingCart.serviceUrls.checkout;
    if (data.parameter) {
        servicePath = eb_shoppingCart.serviceUrls.checkout.replace("{purchaseOrder}", data.parameter);
    }
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: servicePath,
            type: "POST",
            data: data.data,
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

/*This method is used to delete shopping cart.*/
eb_shoppingCart.deleteShoppingCart = function (data) {
    var deferred = eBusinessJQObject.Deferred();
    console.info('delete shopping cart...');
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_shoppingCart.serviceUrls.deleteCartService,
            type: "DELETE",
            data: data,
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (result) {
            deferred.resolve(result);
        }).fail(deferred.reject);
    });
    return deferred.promise();
};

/**
 * This method is used to do the zero dollar payment.
 * @return {object} jQuery promise return id of placed order
 * */
eb_shoppingCart.zeroDollarPayment = function () {
    var defer = eBusinessJQObject.Deferred();
    console.info('zero dollar payment...');
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_shoppingCart.serviceUrls.zeroDollarPaymentService,
            type: "POST",
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
 * Shopping cart model responsible to all shopping cart operations.
 * 
 * @method eb_shoppingCart.shoppingCartModel
 * 
 * @param {any} options Object of cart data.
 * @param {Object} options.cartItems List of cart items.
 * @param {Object} options.domElement Shopping cart DOM element.
 * @param {Object} options.shoppingCartData Shopping cart data.
 * 
 * */
eb_shoppingCart.shoppingCartModel = function (options) {
    var _that = this;

    /*Shopping cart public properties.*/
    _that.showCartItems = ko.observable(1);
    _that.numberOfItems = ko.observable();
    _that.grandTotalBeforeDiscount = ko.observable();
    _that.subTotal = ko.observable();
    _that.tax = ko.observable();
    _that.shipping = ko.observable();
    _that.couponId = ko.observable();
    _that.couponName = ko.observable();
    _that.currencyTypeId = ko.observable();
    _that.currencySymbol = ko.observable();
    _that.shippingAddressId = ko.observable();
    _that.billingAddressId = ko.observable();
    _that.handling = ko.observable();
    _that.billToCity = ko.observable();
    _that.billToCountry = ko.observable();
    _that.billToLine1 = ko.observable();
    _that.billToLine2 = ko.observable();
    _that.billToState = ko.observable();
    _that.billToZipCode = ko.observable();
    _that.shipToCity = ko.observable();
    _that.shipToCountry = ko.observable();
    _that.shipToLine1 = ko.observable();
    _that.shipToLine2 = ko.observable();
    _that.shipToState = ko.observable();
    _that.shipToZipCode = ko.observable();
    _that.totalSavings = ko.observable();
    _that.shipmentTypeName = ko.observable();
    _that.styleClass = ko.observable("");
    /*Local cart to load server cart items.*/
    _that.cartItems = ko.observableArray();

    /*cart item class.*/
    _that.cartItem = function (data) {
        var self = this;
        self.id = data["id"];
        self.parentId = data["parentId"];
        self.productId = data["productId"];
        self.quantity = data["quantity"] || 1;
        self.price = data["price"];
        self.discount = data["discount"];
        if (data["webName"]) {
            self.name = data["webName"];
        } else {
            self.name = data["productName"];
        }
        self.description = data["description"];
        self.productType = data["productType"];
        self.isSubscription = data["isSubscription"];
        self.productImage = data["productImage"];
        self.additionalDetails = data["additionalDetails"];
        self.autoRenew = data["autoRenew"];
        self.totalDiscount = data["totalDiscount"];
        self.totalFinalPrice = data["totalFinalPrice"];
        self.parentproductId = data["parentproductId"];
    };

    /*load shopping cart data.*/
    _that.loadShoppingCartData = function (data) {
        _that.subTotal(data["subTotal"]);
        _that.tax(data["tax"]);
        _that.shipping(data["shipping"]);
        _that.handling(data["handling"]);
        _that.couponId(data["couponId"]);
        _that.couponName(data["couponName"]);
        _that.currencySymbol(data["currencySymbol"]);
        _that.currencyTypeId(data["currencyTypeId"]);
        _that.shippingAddressId(data["shippingAddressId"]);
        _that.billingAddressId(data["billingAddressId"]);
        _that.billToCity(data["billToCity"]);
        _that.billToCountry(data["billToCountry"]);
        _that.billToLine1(data["billToLine1"]);
        _that.billToLine2(data["billToLine2"]);
        _that.billToState(data["billToState"]);
        _that.billToZipCode(data["billToZipCode"]);
        _that.shipToCity(data["shipToCity"]);
        _that.shipToCountry(data["shipToCountry"]);
        _that.shipToLine1(data["shipToLine1"]);
        _that.shipToLine2(data["shipToLine2"]);
        _that.shipToState(data["shipToState"]);
        _that.shipToZipCode(data["shipToZipCode"]);
        _that.grandTotalBeforeDiscount(data["grandTotalBeforeDiscount"]);
        _that.totalSavings(data["totalSavings"]);
        _that.shipmentTypeName(data["shipmentTypeName"]);
        if (Number(data["numberOfItems"]) > 0) {
            _that.showCartItems(1);
            _that.numberOfItems(data["numberOfItems"]);
        } else {
            _that.numberOfItems(0);
            _that.showCartItems(0);
        }
    };

    /*load shoppingCart data from outside.*/
    if (options.shoppingCartData) {
        _that.loadShoppingCartData(options.shoppingCartData);
    }
    else {
        eb_shoppingCart.getShoppingCart().done(function (result) {
            _that.loadShoppingCartData(result);
        }).fail(function (data, msg, jhr) {
            throw { type: "argument_mismatch", message: 'Failed to sync shopping cart data from server.', stack: Error().stack };
        });
    }

    /*load server cart items in local cart.*/
    if (options.cartItems) {
        /*server cart items will be load in local cart array when we initialized shopping cart object on page to page.*/
        eBusinessJQObject.map(options.cartItems, function (row) {
            _that.cartItems.push(new _that.cartItem(row));
        });
    }

    /*Make shopping cart.*/
    _that.emptyShoppingCart = function () {
        _that.subTotal("0.00");
        _that.grandTotalBeforeDiscount("0.00");
        _that.tax("0.00");
        _that.shipping("0.00");
        _that.handling("0.00");
        _that.totalSavings("0.00");
        _that.couponName("");
        _that.couponId("0");
        _that.currencySymbol("$");
        _that.currencyTypeId("0");
        _that.shippingAddressId("0");
        _that.billingAddressId("0");
        _that.numberOfItems(0);
        _that.showCartItems(0);
    };

    /*Add item to cart service method.*/
    _that.addToCart = function (data) {
        var def = eBusinessJQObject.Deferred();
        if (!data) {
            throw { type: "argument_null", message: "An object with values in the productId, quantity and productType properties are required.", stack: Error().stack };
        }

        if (!data.productId) {
            throw { type: "argument_mismatch", message: 'Missing item productId.  The object passed in must have a id property with a non-empty DOM object.', stack: Error().stack };
        }

        if (!data.quantity) {
            throw { type: "argument_mismatch", message: 'Missing quantity.  The object passed in must have a quantity property with a non-empty DOM object.', stack: Error().stack };
        }

        if (!data.productType) {
            throw { type: "argument_mismatch", message: 'Missing productType.  The object passed in must have a productType property with a non-empty DOM object.', stack: Error().stack };
        }

        var productId = data["productId"];
        if (typeof data.newCartItem == 'undefined') { data.newCartItem = false; }

        /*Moved shopping cart/items call in add to cart method to avoid multiple devices and multiple browser tabs issues for same user.*/
        _that.getLocalCartItems(data.newCartItem).done(function (items) {
            /*Add item to cart service. In result we will get current added cart item record.*/
            var cartItem = ko.utils.arrayFirst(_that.cartItems(), function (item) {
                return item.productId === productId && item.parentId <= 0;
            });

            /*we don't have to update Subscription product's quantity. It will be new order line product.*/
            if (cartItem && !data.newCartItem) {
                /*If the cart item already added then update the quantity.*/
                data.id = cartItem.id;
                data.quantity = cartItem.quantity + Number(data.quantity);
                eb_shoppingCart.updateCartItem(data).done(function (result) {
                    cartItem.quantity = data.quantity;
                    cartItem.price = result.price;
                    cartItem.discount = result.discount;
                    eb_shoppingCart.getShoppingCart().done(function (shoppingCart) {
                        _that.loadShoppingCartData(shoppingCart);
                        def.resolve(result);
                    }).fail(def.reject);
                }).fail(def.reject);
            }
            else {
                /*If the cart item is not exists then add item to the cart.*/
                eb_shoppingCart.addItemToCart(data).done(function (result) {
                    if (Array.isArray(result)) {
                        eBusinessJQObject.map(result, function (row) {
                            _that.cartItems.push(new _that.cartItem(row));
                        });
                    } else {
                        _that.cartItems.push(new _that.cartItem(result));
                    }

                    if (data.productType.toLowerCase() != "meeting") {
                        eb_shoppingCart.getShoppingCart().done(function (shoppingCart) {
                            _that.loadShoppingCartData(shoppingCart);
                            def.resolve(result);
                        }).fail(def.reject);
                    } else { def.resolve(result); }
                }).fail(def.reject);
            }
        }).fail(def.reject);
        return def.promise();
    };

    /*get local cart items in object.*/
    _that.getLocalCartItems = function (newCartItem) {
        var def = eBusinessJQObject.Deferred();
        if (_that.cartItems().length <= 0 && newCartItem == false) {
            _that.viewCart().done(function (result) {
                def.resolve(result);
            }).fail(def.reject);
        }
        else {
            def.resolve(_that.cartItems());
        }
        return def.promise();
    };

    /*This method is used to update cart item based on id, quantity and product type.*/
    _that.updateCartItem = function (data) {
        var def = eBusinessJQObject.Deferred();
        if (!data) {
            throw { type: "argument_null", message: "An object with values in the productId and quantity properties is required.", stack: Error().stack };
        }

        if (!data.id) {
            throw { type: "argument_mismatch", message: 'Missing item sequence id.  The object passed in must have a id property with a non-empty DOM object.', stack: Error().stack };
        }

        if (!data.quantity) {
            throw { type: "argument_mismatch", message: 'Missing quantity.  The object passed in must have a quantity property with a non-empty DOM object.', stack: Error().stack };
        }

        if (!data.productType) {
            throw { type: "argument_mismatch", message: 'Missing productType.  The object passed in must have a productType property with a non-empty DOM object.', stack: Error().stack };
        }

        /*check product exists in local cart*/
        var id = data["id"];
        var cartItem = ko.utils.arrayFirst(_that.cartItems(), function (item) {
            return item.id === id;
        });

        /*if the product exists then update the quantity else add throw the error message.*/
        if (cartItem) {
            /*update to cart service.*/
            eb_shoppingCart.updateCartItem(data).done(function (result) {
                /*New parameter introduce if user need all cart items then return all cart items*/
                if (data.fetchAllCartItems) {
                    eBusinessJQObject.when(eb_shoppingCart.viewCartItems(),
                        eb_shoppingCart.getShoppingCart()).done(function (items, shoppingCart) {
                            _that.cartItems.removeAll();
                            eBusinessJQObject.map(items, function (row) {
                                _that.cartItems.push(new _that.cartItem(row));
                            });
                            _that.loadShoppingCartData(shoppingCart);
                            def.resolve(result);
                        }).fail(def.reject);
                } else {
                    /*Update cart item and shopping cart data.*/
                    if (Array.isArray(result)) { result = result[0]; }
                    cartItem.quantity = data.quantity;
                    cartItem.price = result.price;
                    cartItem.discount = result.discount;
                    cartItem.autoRenew = result.autoRenew;
                    cartItem.totalDiscount = result.totalDiscount;
                    cartItem.totalFinalPrice = result.totalFinalPrice;
                    eb_shoppingCart.getShoppingCart().done(function (shoppingCart) {
                        _that.loadShoppingCartData(shoppingCart);
                        def.resolve(result);
                    }).fail(def.reject);
                }
            }).fail(def.reject);
        } else {
            throw { type: "argument_mismatch", message: 'Missing cart Item ' + id, stack: Error().stack };
        }
        return def.promise();
    };

    /*This method is used to remove event from cart.*/
    _that.removeEventItems = function (data) {
        var def = eBusinessJQObject.Deferred();
        if (!data) {
            throw { type: "argument_null", message: "An object with values in the id properties is required.", stack: Error().stack };
        }

        if (!data.id) {
            throw { type: "argument_mismatch", message: 'Missing id.  The object passed in must have a id property with a non-empty DOM object.', stack: Error().stack };
        }

        /*remove event item service.*/
        eb_shoppingCart.removeEventItem(data).done(function (result) {
            eBusinessJQObject.when(eb_shoppingCart.viewCartItems(),
                eb_shoppingCart.getShoppingCart()).done(function (items, shoppingCart) {
                    /*On item removed, need to call shopping cart service to update cart data.*/
                    _that.cartItems.removeAll();
                    eBusinessJQObject.map(items, function (row) {
                        _that.cartItems.push(new _that.cartItem(row));
                    });
                    _that.loadShoppingCartData(shoppingCart);
                    def.resolve(result);
                }).fail(def.reject);
        }).fail(def.reject);

        return def.promise();
    };

    /*This method is used to remove cart item.*/
    _that.removeCartItem = function (data) {
        var def = eBusinessJQObject.Deferred();
        if (!data) {
            throw { type: "argument_null", message: "An object with values in the id properties is required.", stack: Error().stack };
        }

        if (!data.id) {
            throw { type: "argument_mismatch", message: 'Missing id.  The object passed in must have a id property with a non-empty DOM object.', stack: Error().stack };
        }

        /*remove cart item service.*/
        eb_shoppingCart.removeCartItem(data).done(function (result) {
            eBusinessJQObject.when(eb_shoppingCart.viewCartItems(),
                eb_shoppingCart.getShoppingCart()).done(function (items, shoppingCart) {
                    /*On item removed, need to call shopping cart service to update cart data.*/
                    _that.cartItems.removeAll();
                    eBusinessJQObject.map(items, function (row) {
                        _that.cartItems.push(new _that.cartItem(row));
                    });
                    _that.loadShoppingCartData(shoppingCart);
                    def.resolve(result);
                }).fail(def.reject);
        }).fail(def.reject);

        return def.promise();
    };

    /*This method is used to remove all cart items.*/
    _that.emptyCart = function () {
        var def = eBusinessJQObject.Deferred();
        eb_shoppingCart.emptyCart().done(function (result) {
            /*clear local cart*/
            _that.cartItems.removeAll();
            /*Need to clear all shopping cart properties.*/
            _that.emptyShoppingCart();
            def.resolve();
        }).fail(def.reject);
        return def.promise();
    };

    /*This method is used to view cart items.*/
    _that.viewCart = function () {
        var def = eBusinessJQObject.Deferred();
        eb_shoppingCart.viewCartItems().done(function (result) {
            _that.cartItems.removeAll();
            eBusinessJQObject.map(result, function (row) {
                _that.cartItems.push(new _that.cartItem(row));
            });
            def.resolve(result);
        }).fail(def.reject);
        return def.promise();
    };

    /*This method is used to update shopping cart's fields like couponId, couponName,shippingAddressId and billingAddressId*/
    _that.updateShoppingCart = function (data) {
        if (!data) {
            throw { type: "argument_null", message: "An object with values properties is required.", stack: Error().stack };
        }

        var def = eBusinessJQObject.Deferred();
        eb_shoppingCart.updateShoppingCart(data).done(function (result) {
            _that.loadShoppingCartData(result);
            def.resolve(result);
        }).fail(def.reject);
        return def.promise();
    };

    /*This method is used to get shopping cart record.*/
    _that.getShoppingCart = function () {
        var def = eBusinessJQObject.Deferred();
        eb_shoppingCart.getShoppingCart().done(function (result) {
            /*update local properties with cart data.*/
            _that.loadShoppingCartData(result);
            def.resolve(result);
        }).fail(def.reject);
        return def.promise();
    };

    /*This method is used to checkout cart items.*/
    _that.checkout = function (data) {
        var def = eBusinessJQObject.Deferred();
        if (!data) {
            throw { type: "argument_null", message: "An object with values in the payment properties is required.", stack: Error().stack };
        }

        eb_shoppingCart.checkout(data).done(function (result) {
            def.resolve(result);
        }).fail(def.reject);
        return def.promise();
    };

    /* This method is used to do the place order for zero dollar */
    _that.placeOrderForZeroDollarProduct = function () {
        var def = eBusinessJQObject.Deferred();
        /*calling zero dollar service*/
        eb_shoppingCart.zeroDollarPayment().done(function (result) {
            def.resolve(result);
        }).fail(def.reject);
        return def.promise();
    };
};