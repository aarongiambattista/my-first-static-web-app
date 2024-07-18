/**
 * Define eb_productDetails class.
 * @class eb_productDetails 
 * */
var eb_productDetails = eb_productDetails || {};

/**
 * Control level setting: Site path.
 * @property eb_productDetails.SitePath
 * @type {String}
 */
eb_productDetails.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_productDetails.TemplatePath
 * @type {String}
 */
eb_productDetails.TemplatePath = "html/productDetails.html";

/**
 * The path to the Ebusiness SOA layer.
 * @property eb_productDetails.ServicePath
 * @type {String}
 */
eb_productDetails.ServicePath = eb_Config.ServicePathV1;

/**
 * GET service to get all Product Details
 * @property eb_productDetails.getProductDetails
 * @type {String}
 */
eb_productDetails.getProductDetails = eb_productDetails.ServicePath + "Products/{productId}";

/**
 * GET service to get Group/Kit Product
 * @property  eb_productDetails.getSubProductDetails
 * @type {String}
 */
eb_productDetails.getSubProductDetails = eb_productDetails.ServicePath + "Products/{productId}/AssemblyParts";

/**
 * GET service to get ProductImages
 * @property  eb_productDetails.getProductCarouselImages
 * @type {String}
 */
eb_productDetails.getProductCarouselImages = eb_productDetails.ServicePath + "/productCarouselImages/1";

/**
 * Default Product Image -if image is not set then this image will applied their
 * @property eb_productDetails.defaultImage
 * @type {String}
 */
eb_productDetails.defaultImage = "images/products/coming-soon.png";

/**
 * GET product id from URL
 * @property  eb_productDetails.productId
 * @type {String}
 */
eb_productDetails.productId = eb_Config.getUrlParameter("productId");

/**
 * Character length for show more and show less functionality
 * @property  eb_productDetails.charLength
 * @type {String}
 */
eb_productDetails.charLength = 450;

/**
 * default Max Height to show more and show less
 * @property  eb_productDetails.defaultMaxHeight
 * @type {String}
 */
eb_productDetails.defaultMaxHeight = '318px'

/**
 * Redirect to Product Review Page
 * @property  eb_productDetails.writeReviewUrl
 * @type {String}
 */
eb_productDetails.writeReviewUrl = 'ProductReview.html';

/* Error messages in case of wrong inventory checks */
eb_productDetails.inventoryCheckFailure = {
    'Error if backorder true': 'Sorry, this product is not available now. Please try again after some time.',
    'Error if backorder false': 'There are {quantity} unit(s) available. Please select a different quantity to proceed with this order.'
};

/*Success Response */
eb_productDetails.successResponses = {
    'Allow add to cart': 'We do not have {quantity} unit(s) available for immediate shipment. You can proceed with this order. However, you may expect some delay in shipment.'
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
 * @property eb_productDetails.errorResponses
 * @type {Object}
 * */
eb_productDetails.errorResponses = {
    413: { useServerMessage: true },
    430: { useServerMessage: true }
};


/**
 * Default error message.
 * @property eb_productDetails.defaultErrorMessage
 * @type {String}
 * */
eb_productDetails.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/**
 * Rendering public method to load HTML template. Based on page level configuration it will select the template and load in DOM
 * @method eb_productDetails.render
 * @param {any} options options contains different parameter like Sitepath, templatePath and domElement..
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * @returns {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_productDetails.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            var finalPath = eb_productDetails.SitePath + eb_productDetails.TemplatePath;
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
 * GET service call method for ProductDetails
 * @method eb_productDetails.getData
 * @return {Object} Details of product
 * */
eb_productDetails.getData = function () {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for product details');
    if (eb_productDetails.productId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing productId.', stack: Error().stack };
    }

    if (!Number(eb_productDetails.productId)) {
        throw { type: "argument_mismatch", message: 'Missing productId.', stack: Error().stack };
    }

    eBusinessJQObject.get(
        {
            url: eb_productDetails.getProductDetails.replace("{productId}", eb_productDetails.productId),
            xhrFields: {
                withCredentials: true
            }
        }
    ).done(function (result) {
        deferred.resolve(result);
    }).fail(deferred.reject);

    return deferred.promise();
};

/** 
 * GET service call method for sub ProductDetails
 * @method eb_productDetails.getSubProducts
 * @param {Number} productId productId to retrieve the particular product
 * @return {Object} Details of sub product.
 * */
eb_productDetails.getSubProducts = function (productId) {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for product details');
    if (productId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing productId.', stack: Error().stack };
    }

    if (!Number(productId)) {
        throw { type: "argument_mismatch", message: 'Missing productId.', stack: Error().stack };
    }

    eBusinessJQObject.get(
        {
            url: eb_productDetails.getSubProductDetails.replace("{productId}", productId)
        }
    ).done(function (result) {
        deferred.resolve(result);
    }).fail(deferred.reject);

    return deferred.promise();
};

/**
 * Product Details Model for binding data
 * @method eb_productDetails.model
 * @param {any} options Parameter options
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL
 * @param {String} options.data data.
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 */
eb_productDetails.model = function (options) {
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
        eb_productDetails.shoppingCart(options.shoppingCart);
    }

    eb_productDetails.domElement(_that.domElement);

    /* Details of Product */
    _that.pDescription = ko.observable();
    _that.toggleShowMoreText = ko.observable("Show more");
    _that.name = ko.observable();
    _that.description = ko.observable();
    _that.longDescription = ko.observable();
    _that.id = ko.observable();
    _that.productCategory = ko.observable();
    _that.averageRating = ko.observable();
    _that.defaultPrice = ko.observable();
    _that.personalPrice = ko.observable();
    _that.singleProductCarousel = ko.observableArray();
    _that.ratingCount = ko.observable();
    _that.topRatedProduct = ko.observableArray();
    _that.imagePath = ko.observable();
    _that.carouselProductName = ko.observable();
    _that.carouselRetailPrice = ko.observable();
    _that.productImagePath = ko.observable();
    _that.productQty = ko.observable(1);
    _that.outOfStock = ko.observable(0);
    _that.productType = ko.observable();
    _that.disableAddToCartButton = ko.observable(0);
    _that.isSubscription = ko.observable();
    _that.requireInventory = ko.observable();
    _that.quantityAvailable = ko.observable();
    _that.allowBackorders = ko.observable();
    _that.subProducts = ko.observableArray();
    _that.productPrice = ko.observable();
    _that.assemblyType = ko.observable();
    _that.showSubProducts = ko.observable(0);
    _that.visibleDescription = ko.observable(1);

    /* Ordering a Publication Product and wiring up the same. */
    _that.ISBN = ko.observable("");
    _that.datepublished = ko.observable("");
    _that.hasISBN = ko.observable(false);
    _that.hasDatepublished = ko.observable(false);

    /* Show more and show less binding */
    _that.remainingDescription = ko.observable("");
    _that.showRemainingDescription = ko.observable(0);
    _that.showMoreHide = ko.observable(0);
    _that.toggleShowMoreVisible = ko.observable(1);
    _that.showLessContent = ko.observable();
    _that.showMoreContent = ko.observable();
    _that.showMoreDescription = ko.observable(1);
    _that.hideRemainingDescription = ko.observable(0);
    _that.showEllipses = ko.observable(0);
    _that.showSuccess = ko.observable(0);
    _that.successMessage = ko.observable("");
    _that.showError = ko.observable(0);
    _that.errorMessage = ko.observable("");

    _that.descriptionMaxHeight = ko.observable();
    _that.displayStyle = ko.observable();
    _that.overflowStyle = ko.observable();

    /* currency symbol */
    _that.currencySymbol = ko.observable();
    _that.showCurrencySymbol = ko.observable("");

    /*check the complex price scenario*/
    _that.hasComplexPricing = ko.observable("");

    /* observable to show either price or text depending upon 'hasComplexPricing' scenario */
    _that.showPriceOrText = ko.observable("");

    /* observable to check complex pricing message */
    _that.complexPriceText = ko.observable("");

    _that.showQtyError = ko.observable(0);
    _that.qtyErrorMsg = ko.observable('');

    /*Subscribe the quantity field to enter appropriate quantity value*/
    _that.productQty.subscribe(function (value) {
        _that.showQtyError(1);
        if (value === '') {
            _that.qtyErrorMsg('This Field is required');
        }
        else if (value <= 0) {
            _that.qtyErrorMsg('Please enter a value greater than 0');
        }
        else if (value % 1 > 0) {
            _that.qtyErrorMsg('Please enter a digit');
        }
        else {
            _that.showQtyError(0);
        }
    });

    /* subProduct fields */
    _that.subProductDetails = function (data) {
        var self = this;
        self.id = ko.observable(data['id']);
        self.productName = ko.observable(data['name']);
        self.productQuantity = ko.observable(data['quantity']);
        /*Show Prices based on person category.*/
        self.productDefaultPrice = ko.observable(parseFloat(data['defaultPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.productRetailPrice = ko.observable(parseFloat(data['retailPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.currencySymbol = ko.observable(data['currencySymbol']);
        self.isGroupProduct = ko.observable(data['isGroupProduct']);
        self.productDescription = ko.observable(data['webDescription']);
        self.showPriceOrText = ko.observable('');
        self.showCurrencySymbol = ko.observable('');
        self.hasComplexPricing = ko.observable(data['hasComplexPricing']);

        if (eb_Config.loadDefaultImage) {
            self.subProductImage = ko.observable(eb_productDetails.defaultImage);
        }
        else {
            self.subProductImage = ko.observable(eb_Config.thumbnailImageURL + self.id() + eb_Config.imageExtension);
        }

        if (self.productDefaultPrice() > 0) {
            self.productPrice = self.productDefaultPrice();
        }
        else {
            self.productPrice = self.productRetailPrice();
        }
        if (self.hasComplexPricing()) {
            self.showPriceOrText("<span class='clsShipStatus'> Add to Cart to see Price</span>");
            self.showCurrencySymbol("");
        }
        else {
            self.showPriceOrText(self.productPrice);
            self.showCurrencySymbol(self.currencySymbol());
        }
    };

    /* Load all data from the server. */
    _that.loadProductDataControl = function (data) {
        _that.name(data['name']);
        _that.id(data['id']);
        _that.productCategory(data['productCategory']);
        _that.productType(data['productType']);
        _that.isSubscription(data['isSubscription']);
        _that.requireInventory(data['requireInventory']);
        _that.quantityAvailable(data['quantityAvailable']);
        _that.allowBackorders(data['allowBackorders']);
        _that.assemblyType(data['assemblyType']);

        if (eb_Config.loadDefaultImage) {
            _that.imagePath(eb_productDetails.defaultImage);
        }
        else {
            _that.imagePath(eb_Config.largeImageURL + _that.id() + eb_Config.imageExtension);
        }

        _that.currencySymbol(data['currencySymbol']);
        _that.hasComplexPricing(data['hasComplexPricing']);

        /*  To convert the HTML description into text From smart client, if the web description is null still we get the html and body tag, 
            so we need to convert it into text and the bind it 
        */
        _that.pDescription = ko.computed(function () {
            var webDescription = eBusinessJQObject("" + data['webDescription'] + "").text().trim();
            var descriptionText = "";
            if (webDescription.length <= 0) {
                descriptionText = data['description'];
                webDescription = data['description'];
            } else {
                descriptionText = data['webDescription']
            }
            if (webDescription.length < eb_productDetails.charLength) {
                _that.visibleDescription(0);
            } else {
                _that.visibleDescription(1);
                _that.descriptionMaxHeight(eb_productDetails.defaultMaxHeight)
                _that.displayStyle('inline-block')
                _that.overflowStyle('hidden')
            }
            return descriptionText;
        });

        /* Toggle show more*/
        _that.toggleShowMore = function () {
            if (_that.toggleShowMoreText() === 'Show more') {
                _that.toggleShowMoreText('Show less');
                _that.descriptionMaxHeight('100%')
                _that.displayStyle('inline-block')
                _that.overflowStyle('visible')
            }
            else {
                _that.toggleShowMoreText('Show more');
                _that.descriptionMaxHeight(eb_productDetails.defaultMaxHeight)
                _that.displayStyle('inline-block')
                _that.overflowStyle('hidden')
            }
        };

        _that.longDescription(data['webLongDescription']);
        if (!data['defaultPrice'] && data['retailPrice']) {
            _that.defaultPrice(data['currencySymbol'] + (parseFloat(data['retailPrice'])).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        }
        else {
            _that.defaultPrice(data['currencySymbol'] + (parseFloat(data['defaultPrice'])).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        }

        /* Ordering a Publication Product and wiring up the same. */
        if (data && data['ISBN'].length) {
            _that.ISBN(data['ISBN']);
            _that.hasISBN(true);
        }

        if (data && data['datepublished'].length) {
            if ("0001-01-01T00:00:00" !== data['datepublished'] && "1900-01-01T00:00:00" !== data['datepublished']) {
                /* Date Format */
                _that.datepublished = ko.computed(function () {
                    return moment(data['datepublished']).format(eb_Config.defaultDateFormat);
                });
                _that.hasDatepublished(true);
            }
        }

        if (_that.hasComplexPricing()) {
            _that.showPriceOrText("<span class='clsShipStatus'> Add to Cart to see Price</span>");
            _that.showCurrencySymbol("");
            _that.complexPriceText("Add to Cart to see Price")
        }
        else {
            _that.showPriceOrText(_that.defaultPrice());
            _that.showCurrencySymbol(_that.currencySymbol());
        }

        _that.subProductCount = ko.computed(function () {
            /* If the product is kit, then return the count of product */
            var count = 0;
            if (_that.assemblyType().toLowerCase() === 'kit') {
                ko.utils.arrayFirst(this.subProducts(), function (item) {
                    count = count + 1;
                });
                return count;
            }
            /* If the product is group, then return the count as total quantity of product */
            else if (_that.assemblyType().toLowerCase() === 'group') {
                ko.utils.arrayFirst(this.subProducts(), function (item) {
                    count = count + item.productQuantity();
                });
                return count;
            }
        }, _that);

        /* To check whether sub product is available or not */
        if (_that.assemblyType().toLowerCase() === 'group' || _that.assemblyType().toLowerCase() === 'kit') {
            eb_productDetails.getSubProducts(eb_productDetails.productId).done(function (productData) {
                if (productData.length > 0) {
                    _that.showSubProducts(1);
                    eBusinessJQObject.map(productData, function (row) {
                        row.isGroupProduct = _that.assemblyType().toLowerCase() === 'group' ? true : false;
                        _that.subProducts.push(new _that.subProductDetails(row));
                    });
                }
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getSubProductDataFromServer failed:  " + xhr.responseText);
            });
        }
    };


    /* show less functionality */
    _that.showLess = function () {
        _that.hideRemainingDescription(0);
        _that.showMoreDescription(1);
        _that.showMoreHide(1);
        _that.showRemainingDescription(0);
        _that.showEllipses(1);
    };

    /* show more functionality */
    _that.showMore = function () {
        _that.showRemainingDescription(1);
        _that.showMoreDescription(0);
        _that.showMoreHide(0);
        _that.hideRemainingDescription(1);
        _that.showEllipses(0);
    };

    /* Get all record from server */
    _that.getProductDataFromServer = function () {
        return eb_productDetails.getData();
    };

    /* Calling LoadNameControl */
    if (_that.data) {
        _that.loadProductDataControl(_that.data);
    } else {
        _that.getProductDataFromServer().done(function (nameData) {
            _that.loadProductDataControl(nameData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getProductDataFromServer failed:  " + xhr.responseText);
        });
    }

    if (_that.requireInventory() === true && _that.quantityAvailable() < 1 && _that.allowBackorders() === false) {         /*Showing 'Out of stock'*/
        _that.disableAddToCartButton(1);
        _that.outOfStock(1);
    }

    /* Notify User that Cart is updated */
    function callShowCartUpdate() {
        var showCartUpdate = eBusinessJQObject(eb_productDetails.domElement).find('#CartUpdateMsg')[0];
        showCartUpdate.className = "show";
        setTimeout(function () { showCartUpdate.className = showCartUpdate.className.replace("show", ""); }, 2000);
    }

    /* Add to cart method */
    _that.addProductToCart = function (item) {
        var self = this;
        if (_that.productQty() !== "" && _that.productQty() > "0") {
            if (eb_productDetails.shoppingCart) {
                var cartItem = {};
                cartItem.productId = item.id();
                cartItem.quantity = _that.productQty();
                cartItem.productType = item.productType();

                if (item.isSubscription() === true) { cartItem.productType = "subscription"; cartItem.newCartItem = true; } else { cartItem.productType = item.productType(); }

                _that.disableAddToCartButton(1);
                eb_productDetails.shoppingCart.addToCart(cartItem).done(function (result) {
                    callShowCartUpdate();
                    _that.showError(0);
                    if (_that.requireInventory() === true && _that.quantityAvailable() < parseInt(cartItem.quantity) && _that.allowBackorders() === true) {           /*Backorder Handling*/
                        _that.showSuccess(1);
                        _that.successMessage(eb_productDetails.successResponses['Allow add to cart'].replace('{quantity}', cartItem.quantity));
                    }
                }).fail(function (xhr, textStatus, errorThrown) {
                    _that.showError(1);
                    _that.errorMessage('');
                    if (xhr && typeof xhr.responseJSON !== 'undefined') {
                        if (xhr.responseJSON.errorCode === 450 && self.requireInventory() === true && self.allowBackorders() === true) {
                            _that.errorMessage(eb_productDetails.inventoryCheckFailure['Error if backorder true']);
                        }
                        if (xhr.responseJSON.errorCode === 450 && self.requireInventory() === true && self.allowBackorders() === false) {
                            _that.errorMessage(eb_productDetails.inventoryCheckFailure['Error if backorder false'].replace('{quantity}', self.quantityAvailable()));
                        }
                        if (_that.errorMessage() === '')
                            _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_productDetails));
                    }
                    else {
                        _that.errorMessage(eb_productDetails.defaultErrorMessage);
                    }
                }).always(function (result) {
                    _that.disableAddToCartButton(0);
                });
            }
        }
    };

    /* Write to review redirection. */
    _that.writeReview = function (item) {
        if (eb_productDetails.writeReviewUrl) {
            window.location.replace(eb_productDetails.writeReviewUrl + "?" + "=" + encodeURIComponent("productId") + encodeURIComponent(item.id()));
        }
        else {
            console.error("No Information is available");
        }
    };

    /* Quantity field validations */
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
                    event.keyCode >= 35 && event.keyCode <= 39) {
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

/* LightSlider Carousel for SingleProductImages */
eb_productDetails.loadProductImageSlider = function (domElement) {
    eBusinessJQObject(domElement).find('.image-gallery').lightSlider({
        gallery: true,
        item: 1,
        thumbItem: 4,
        slideMargin: 0,
        speed: 500,
        adaptiveHeight: true,
        autoWidth: false,
        auto: false,
        loop: true,
        onSliderLoad: function () {
            eBusinessJQObject(domElement).find('.image-gallery').removeClass('cS-hidden');
        }
    });
};

/**
 * Shopping cart object
 * @method eb_productDetails.shoppingCart
 * @param {Object} shoppingCart  shopping cart object.
 * */
eb_productDetails.shoppingCart = function (shoppingCart) {
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
            eBusinessJQObject(element).attr('src', eb_productDetails.defaultImage);
        });
    }
};

/**
* Page DOM element.
* @method eb_productDetails.domElement
* @param {object} domElement current DOM element.
* */
eb_productDetails.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_productDetails.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_productDetails);
});