/**
 * Product Catalog class.
 * @class eb_productCatalog
 * */
var eb_productCatalog = eb_productCatalog || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_productCatalog.SitePath
 * @type {String}
 * */
eb_productCatalog.SitePath = eb_Config.SitePath;

/**
 * Product catalog template path.
 * @property eb_productCatalog.TemplatePath
 * @type {String}
 * */
eb_productCatalog.TemplatePath = "html/ProductCatalog.html";

/**
 * SOA path.
 * @property eb_productCatalog.ServicePath
 * @type {String}
 * */
eb_productCatalog.ServicePath = eb_Config.ServicePathV1;

/**
 * Service path to get all products.
 * @property eb_productCatalog.getAllProductsService
 * @type {String}
 * */
eb_productCatalog.getAllProductsService = eb_productCatalog.ServicePath + "Products";

/**
 * Default image URL.
 * If product image is not available, default image will be shown.
 * @property eb_productCatalog.defaultImage
 * @type {String}
 * */
eb_productCatalog.defaultImage = "./images/products/coming-soon.png";

/**
 * Page size option list for product catalog.
 * @property eb_productCatalog.pageSizeOptionsList
 * @type {Object}
 * */
eb_productCatalog.pageSizeOptionsList = [12, 24, 48, 96];

/**
 * Current page Size.
 * @property eb_productCatalog.currentPageSize
 * @type {Number}
 * @default 12
 * */
eb_productCatalog.currentPageSize = 12;

/**
 * Site path to get product details.
 * @property eb_productCatalog.productDetailsPage
 * @type {String}
 * */
eb_productCatalog.productDetailsPage = eb_productCatalog.SitePath + 'ProductDetails.html';

/**
 * The service will return product catalog HTML.
 * @method eb_productCatalog.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Product catalog template URL.
 * @return {String} Product catalog HTML template.
 * */
eb_productCatalog.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_productCatalog.SitePath + eb_productCatalog.TemplatePath;
        options.templatePath = finalPath;
    }

    if (!options.domElement) {
        throw { type: "argument_mismatch", message: 'Missing domElement.  The object passed in must have a domElement property with a non-empty DOM object.', stack: Error().stack };
    }

    eBusinessJQObject.get(options.templatePath).done(function (data) {
        options.domElement.innerHTML = data;
        defer.resolve(data);
    }).fail(function (data, msg, jhr) {
        defer.reject(data, msg, jhr);
    });
    return defer.promise();
};

/* Error messages in case of wrong inventory checks */
eb_productCatalog.inventoryCheckFailure = {
    'Error if backorder true': 'Sorry, this product is not available now. Please try again after some time.',
    'Error if backorder false': 'There are {quantity} unit(s) available. Please select a different quantity to proceed with this order.'
};

/*Success Response */
eb_productCatalog.successResponses = {
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
 * @property eb_productCatalog.errorResponses
 * @type {Object}
 * */
eb_productCatalog.errorResponses = {
    413: { useServerMessage: true },
    430: { useServerMessage: true }
};

/**
 * Default error message.
 * @property eb_productCatalog.defaultErrorMessage
 * @type {String}
 * */
eb_productCatalog.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/**
 * Get products data from the server through the get service call.
 * The service will return list of all products.
 * @method eb_productCatalog.getProducts
 * @param {String} data Service URL if passed from calling function.
 * @return {Object} jQuery promise object which when resolved returns list of products.
 */
eb_productCatalog.getProducts = function (data) {
    var defer = eBusinessJQObject.Deferred();
    console.info('service call for all products');
    var serviceURL = eb_productCatalog.getAllProductsService;
    if (data) {
        serviceURL = serviceURL + eb_productCatalog.productCategoriesParam + data;
    }
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
 * List of product properties on which search is applied.
 * @method eb_productCatalog.fieldsToSearch
 * @return {Object} Array of product name property.
 */
eb_productCatalog.fieldsToSearch = function () {
    return ["id", "name", "description"];
};

/**
 * Product catalog model responsible to all product catalog operations.
 * 
 * @method eb_productCatalog.model
 * 
 * @param {any} options Object of product catalog data.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL.
 * @param {String} options.templatePath HTML path.
 * @param {String} options.currentUserLoggedInID: User Linked ID.
 * @param {Object} options.domElement Product catalog DOM element.
 * @param {Object} options.data List of all products.
 * @param {Object} options.shoppingCart eb_shoppingCart.shoppingCartModel instance.
 * 
 * */
eb_productCatalog.model = function (options) {
    var _that = this;
    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement property is required.", stack: Error().stack };
    }

    _that.domElement = options.domElement;
    if (options.data) {
        _that.data = options.data;
    }
    /*Search text-box value binding. When user stops typing in search text-box, then search function will be called with 500 milliseconds delay.*/
    _that.search = ko.observable("").extend({ rateLimit: { method: "notifyWhenChangesStop", timeout: 500 } });
    _that.sortingOptions = ko.observableArray();
    _that.filterCategories = ko.observableArray();
    _that.ratingOptions = ko.observableArray();
    _that.clearCategory = ko.observable(0);
    _that.showingLabel = ko.observable("All");
    _that.showSuccess = ko.observable(0);
    _that.successMessage = ko.observable("");
    _that.showError = ko.observable(0);                  /* Product Catalog Page Validations */
    _that.errorMessage = ko.observable("");
    _that.productsObserver = ko.observable();            /* Observable to hold products list. */
    _that.priceFilter = ko.observable("");               /* By-default price-filter unchecked. */
    _that.filterCollapse = ko.observable(0);
    eb_productCatalog.domElement(_that.domElement);

    /* Change in sort-by radio buttons will trigger this function. */
    _that.priceFilter.subscribe(function (value) {
        if (value.length) {
            var productObj = _that.productsObserver();
            if (value.toLowerCase() === 'hightolow') {
                productObj.sort(function (a, b) {
                    return b.productPrice - a.productPrice;
                });
            }
            else {
                productObj.sort(function (a, b) {
                    return a.productPrice - b.productPrice;
                });
            }
            _that.productsObserver(productObj);
        }
    });

    /* Filter control show hide on mobile device*/
    _that.toggleFilterControl = function () {
        _that.filterCollapse(!_that.filterCollapse());
    };
    _that.catergoryFilter = ko.observable("All");       /* By-default filter set to 'All'. */
    /* On-click filter will trigger this function. */
    _that.catergoryFilter.subscribe(function (value) {
        var result = [];
        if (value === 'All') {
            _that.productsObserver(_that.products);
            _that.priceFilter.valueHasMutated();
            return;
        }

        for (var record = 0; record < _that.categoryCollection().length; record++) {
            if (_that.categoryCollection()[record].name() === value) {
                result.push(_that.categoryCollection()[record].records());
                break;
            }
        }
        _that.productsObserver(result[0]);
        /* Call subscribe method to apply price filter. */
        _that.priceFilter.valueHasMutated();
    });

    if (options.shoppingCart) {
        eb_productCatalog.shoppingCart(options.shoppingCart);
    }
    /* Sort product category name array. */
    _that.sortByCategoryName = function () {
        var collection = _that.categoryCollection();
        collection.sort(function (a, b) {
            return (a.name()).localeCompare(b.name());              /* use localeCompare to compare strings. */
        });
        _that.categoryCollection(collection);
    };

    _that.categoryCollection = ko.observableArray();                /* Category object collection */

    /* Category object containing category name and corresponding records. */
    _that.categories = function (categoryName, record) {
        var self = this;
        self.name = ko.observable(categoryName);
        self.records = ko.observableArray();
        self.records.push(record);
    };

    /*Function to extract product models.
     Convert the product object to model.
     Create array of products according to category.
     */
    _that.extractModels = function (parent, data, constructor) {
        var models = [];
        if (data === null) {
            return models;
        }

        for (var index = 0; index < data.length; index++) {
            var row = data[index];
            var model = new constructor(row, parent);
            models.push(model);

            var categoryRecord = ko.utils.arrayFirst(_that.categoryCollection(), function (record) {
                return record.name() === row.productCategory;
            });

            if (categoryRecord) {
                categoryRecord.records.push(model);
            } else {
                _that.categoryCollection.push(new _that.categories(row.productCategory, model));             /*push category object in collection.*/
            }
        }
        _that.sortByCategoryName();                                     /*call sort method to sort category name collection.*/
        return models;
    };

    /* Load products data, apply paginations and filters on data. */
    _that.loadProductsData = function (data) {
        _that.products = _that.extractModels(_that, data, eb_productCatalog.productModel);                  /*get product model.*/
        /* Call subscribe method so that we get _that.productsObserver and pass to search function. */
        _that.catergoryFilter.valueHasMutated();

        /* This function will be triggered whenever there is change in search text-box or _that.productsObserver */
        _that.resultRecords = ko.computed(function () {
            var res = new eb_productCatalog.searchRecords(_that.search(), eb_productCatalog.fieldsToSearch(), _that.productsObserver());
            return res;
        });

        /* Pass the search method's return value to this method so that whenever search method is triggered
          this method also gets triggered.*/
        _that.pager = ko.computed(function () {
            var res = new eb_productCatalog.pagerModel(_that.resultRecords().filteredRecords());
            return res;
        });
    };

    /* check product data and load on page. */
    if (!_that.data) {
        data = {};
    }
    else { _that.loadProductsData(_that.data); }

    /* Catalog list to grid toggling. */
    _that.toggleCatalogList = function () {
        var btnDom = eBusinessJQObject(_that.domElement).find(".ebusiness-view-switcher-btn");
        var listDom = eBusinessJQObject(_that.domElement).find('.ebusiness-product-list');
        if (btnDom.hasClass('ebIcon-list')) {
            /*list view*/
            listDom.removeClass('grid').addClass('list');
            btnDom.removeClass('ebIcon-list').addClass('ebIcon-th');
        }
        else if (btnDom.hasClass('ebIcon-th')) {
            /*grid view*/
            listDom.removeClass('list').addClass('grid');
            btnDom.removeClass('ebIcon-th').addClass('ebIcon-list');
        }
    };

    /*clear filter and load all product data.*/
    _that.clearFilter = function () {
        eb_productCatalog.getProducts().done(function (productData) {
            _that.showingLabel("All");
            _that.clearCategory(0);
            eb_productCatalog.loadSortedProductData(productData, _that);
        }).fail(function (data, msg, jhr) {
            console.info('getProducts...' + data);
        });
    };
};

/**
 * Global function to hold shopping cart object.
 * @method eb_productCatalog.shoppingCart
 * @param {Object} shoppingCart Instance of eb_shoppingCart.shoppingCartModel.
 */
eb_productCatalog.shoppingCart = function (shoppingCart) {
    var self = this;
    self.shoppingCart = shoppingCart;
};

/**
 * Product model.
 * Converts product object into knockout model.
 * @method eb_productCatalog.productModel
 * @param {Object} data Product object.
 * @param {Object} parent Instance of eb_productCatalog.model for accessing its properties.
 */
eb_productCatalog.productModel = function (data, parent) {
    var self = this;
    self.id = ko.observable(data['id']);
    self.name = ko.observable(data['name']);
    self.showProduct = ko.observable(1);

    if (eb_Config.loadDefaultImage) {
        self.webImage = ko.observable(eb_productCatalog.defaultImage);
    }
    else {
        self.webImage = ko.observable(eb_Config.thumbnailImageURL + self.id() + eb_Config.imageExtension);
    }

    var desc = "";
    if (eBusinessJQObject("<html>" + data['webDescription'] + "</html>").text().trim().length)
        desc = eBusinessJQObject("<html>" + data['webDescription'] + "</html>").text();
    else
        desc = data['description'];
    self.description = ko.observable(desc);
    self.productType = ko.observable(data['productType']);
    self.productCategory = ko.observable(data['productCategory']);
    self.parentId = ko.observable(data['parentId']);

    /*Show Prices based on person category.*/
    self.defaultMemberPrice = ko.observable(data['defaultMemberPrice']);
    self.nonMemberPrice = ko.observable(data['nonMemberPrice']);
    self.defaultPrice = ko.observable(data['defaultPrice']);
    self.retailPrice = ko.observable(data['retailPrice']);
    self.currencySymbol = ko.observable(data['currencySymbol']);
    self.showCurrencySymbol = ko.observable("");

    /*Pricing scenario for member*/
    if (self.defaultPrice() > 0) {
        self.productPrice = parseFloat(self.defaultPrice()).toFixed(eb_Config.roundOffDigitsAfterDecimal);
    }
    else {
        self.productPrice = parseFloat(self.retailPrice()).toFixed(eb_Config.roundOffDigitsAfterDecimal);
    }
    self.averageRating = ko.observable(0);
    self.ratingCount = ko.observable(0);
    self.ratingRecordedValueTotal = ko.observable(0);
    self.ratingRecordedValueAverage = ko.observable(0);

    /*check the complex price scenario*/
    self.hasComplexPricing = ko.observable(data['hasComplexPricing']);

    /* observable to show either price or text depending upon 'hasComplexPricing' scenario */
    self.showPriceOrText = ko.observable("");

    /* product inventory details */
    self.availableUntil = ko.observable(data['availableUntil']);
    self.requireInventory = ko.observable(data['requireInventory']);
    self.quantityAvailable = ko.observable(data['quantityAvailable']);

    self.allowBackorders = ko.observable(data['allowBackorders']);
    self.currencyID = ko.observable(data['currencyID']);
    self.outOfStock = ko.observable(0);
    self.disableAddToCartButton = ko.observable(0);
    self.isSubscription = ko.observable(data['isSubscription']);

    if (self.requireInventory() === true && self.quantityAvailable() < 1 && self.allowBackorders() === false) {         /* Showing 'Out of stock' */
        self.disableAddToCartButton(1);
        self.outOfStock(1);
    }

    if (self.hasComplexPricing()) {
        self.showPriceOrText("<span class='clsShipStatus'> Add to Cart to see Price</span>");
        self.showCurrencySymbol("");
    }
    else {
        self.showPriceOrText(self.productPrice);
        self.showCurrencySymbol(self.currencySymbol());
    }

    /*Add to cart : Use shopping cart's add to cart method.*/
    self.addToCart = function (item) {
        var cartItem = {};
        cartItem.productId = item.id();
        cartItem.quantity = 1;
        parent.showSuccess(0);
        parent.showError(0);
        if (item.isSubscription() === true) { cartItem.productType = "subscription"; cartItem.newCartItem = true; } else { cartItem.productType = item.productType(); }

        /* Notify User that Cart is updated */
        function callShowCartUpdate() {
            var showCartUpdate = eBusinessJQObject(eb_productCatalog.domElement).find('#CartUpdateMsg')[0];
            showCartUpdate.className = "show";
            setTimeout(function () { showCartUpdate.className = showCartUpdate.className.replace("show", ""); }, 2000);
        }

        eb_productCatalog.shoppingCart.styleClass("eb-addcart-selected-card");
        self.disableAddToCartButton(1);
        eb_productCatalog.shoppingCart.addToCart(cartItem).done(function (result) {
            parent.showError(0);
            callShowCartUpdate();
            if (self.requireInventory() === true && self.quantityAvailable() < parseInt(cartItem.quantity) && self.allowBackorders() === true) {              /* Backorder Handling */
                parent.showSuccess(1);
                parent.successMessage(eb_productCatalog.successResponses['Allow add to cart'].replace('{quantity}', cartItem.quantity));
                window.scrollTo(0, -1500);
            }
        }).fail(function (xhr, textStatus, errorThrown) {
            parent.showError(1);
            parent.errorMessage('');
            if (xhr && typeof xhr.responseJSON !== 'undefined') {
                if (xhr.responseJSON.errorCode === 450 && self.requireInventory() === true && self.allowBackorders() === true) {
                    parent.errorMessage(eb_productCatalog.inventoryCheckFailure['Error if backorder true']);
                }
                if (xhr.responseJSON.errorCode === 450 && self.requireInventory() === true && self.allowBackorders() === false) {
                    parent.errorMessage(eb_productCatalog.inventoryCheckFailure['Error if backorder false'].replace('{quantity}', self.quantityAvailable()));
                }
                if (parent.errorMessage() === '')
                    parent.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_productCatalog));
            }
            else {
                _that.errorMessage(eb_productCatalog.defaultErrorMessage);
            }
            window.scrollTo(0, -1500);          /*scroll-up to show error box.*/
        }).always(function (result) {
            self.disableAddToCartButton(0);
            eb_productCatalog.shoppingCart.styleClass("");
        });
    };

    /*Navigate to Product detail page.*/
    self.productNameDetails = function (item) {
        if (eb_productCatalog.productDetailsPage) {
            window.location.assign(eb_productCatalog.productDetailsPage + "?" + encodeURIComponent("productId") + "=" + encodeURIComponent(item.id()));             /* Redirected URL should properly on product details page. */
        }
        else {
            console.error("No Information is available");
        }
    };
};

/**
 * Pagination model.
 * Contains computed functions that get invoked when page size change or page navigation.
 * @method eb_productCatalog.pagerModel
 * @param {Object} records Product list.
 */
eb_productCatalog.pagerModel = function (records) {
    var self = this;
    self.pageSizeOptions = ko.observableArray(eb_productCatalog.pageSizeOptionsList);
    self.records = getObservableArray(records);

    self.currentPageIndex = ko.observable(self.records().length > 0 ? 0 : -1);
    self.currentPageSize = ko.observable(eb_productCatalog.currentPageSize);

    /*Get record count*/
    self.recordCount = ko.computed(function () {
        return self.records().length;
    });

    /*Get max page index*/
    self.maxPageIndex = ko.computed(function () {
        return Math.ceil(self.records().length / self.currentPageSize()) - 1;
    });

    /*Current Page record array computed property.*/
    self.currentPageRecords = ko.computed(function () {
        var newPageIndex = -1;
        var pageIndex = self.currentPageIndex();
        var maxPageIndex = self.maxPageIndex();
        if (pageIndex > maxPageIndex) {
            newPageIndex = maxPageIndex;
        }
        else if (pageIndex === -1) {
            if (maxPageIndex > -1) {
                newPageIndex = 0;
            }
            else {
                newPageIndex = -2;
            }
        }
        else {
            newPageIndex = pageIndex;
        }

        if (newPageIndex !== pageIndex) {
            if (newPageIndex >= -1) {
                self.currentPageIndex(newPageIndex);
            }

            return [];
        }

        var pageSize = self.currentPageSize();
        var startIndex = pageIndex * pageSize;
        var endIndex = startIndex + pageSize;

        return self.records().slice(startIndex, endIndex);
    }).extend({ rateLimit: 50 });               /* Using rateLimit extender for 'atomic updates' */

    /*Move to first page.*/
    self.moveFirst = function () {
        self.changePageIndex(0);
    };

    /*Move to Previous page.*/
    self.movePrevious = function () {
        self.changePageIndex(self.currentPageIndex() - 1);
    };

    /*Move to Next page*/
    self.moveNext = function () {
        self.changePageIndex(self.currentPageIndex() + 1);
    };

    /*Move to last page.*/
    self.moveLast = function () {
        self.changePageIndex(self.maxPageIndex());
    };

    /*Page index change event.*/
    self.changePageIndex = function (newIndex) {
        if (newIndex < 0
            || newIndex === self.currentPageIndex()
            || newIndex > self.maxPageIndex()) {
            return;
        }
        self.currentPageIndex(newIndex);
    };

    /* Page size change event.*/
    self.onPageSizeChange = function () {
        self.currentPageIndex(0);
    };
};

/*Get Observable array*/
function getObservableArray(array) {
    if (typeof array === 'function') {
        return array;
    }
    return ko.observableArray(array);
}

/**
 * Product catalog search function.
 * @method eb_productCatalog.searchRecords
 * @param {String} toSearch Value entered in search text-box field.
 * @param {Object} fields Array of product properties on which search will be performed.
 * @param {Object} productList List of product models.
 */
eb_productCatalog.searchRecords = function (toSearch, fields, productList) {
    var _that = this;
    _that.filteredRecords = ko.computed(function () {
        var filteredRecords = [];
        var ifFound = false;
        var item;

        for (var record = 0; record < productList.length; record++) {

            for (var field = 0; field < fields.length; field++) {
                /*check whether the field is observable or not and access the value according to it.*/
                if (ko.isObservable(productList[record][fields[field]]))
                    item = productList[record][fields[field]]();
                else
                    item = productList[record][fields[field]];

                if (item.toString().toLowerCase().indexOf(toSearch.toLowerCase()) !== -1) {
                    ifFound = true;
                    break;
                }
            }
            if (ifFound) {
                filteredRecords.push(productList[record]);
                ifFound = false;
            }
        }
        return filteredRecords;
    });
};

/*If image is not there, then attach No Photo Image*/
ko.bindingHandlers.imageSrc = {
    update: function (element, valueAccessor) {
        var options = valueAccessor();
        var src = ko.unwrap(options.src);
        eBusinessJQObject('<img />').attr('src', src).on('load', function () {
            eBusinessJQObject(element).attr('src', src);
        }).on('error', function () {
            eBusinessJQObject(element).attr('src', eb_productCatalog.defaultImage);
        });
    }
};

/**
* Page DOM element.
* @method eb_productCatalog.domElement
* @param {object} domElement current DOM element.
* */
eb_productCatalog.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_productCatalog.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_productCatalog);
});