/**
 * Define eb_relatedProducts class.
 * @class eb_relatedProducts 
 * */
var eb_relatedProducts = eb_relatedProducts || {};

/**
 * Control level setting: Site path.
 * @property eb_relatedProducts.SitePath
 * @type {String}
 */
eb_relatedProducts.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_relatedProducts.TemplatePath
 * @type {String}
 */
eb_relatedProducts.TemplatePath = "html/RelatedProducts.html";

/**
 * The path to the Ebusiness SOA layer.
 * @property eb_relatedProducts.ServicePath
 * @type {String}
 */
eb_relatedProducts.ServicePath = eb_Config.ServicePathV1;

/**
 * Default Product Image -if image is not set then this image will applied their
 * @property eb_relatedProducts.defaultImage
 * @type {String}
 */
eb_relatedProducts.defaultImage = "images/products/coming-soon.png";

/**
 * Default Product Image -if image is not set then this image will applied their
 * @property eb_relatedProducts.defaultImage
 * @type {String}
 */
eb_relatedProducts.defaultMeetingsImage = "../images/products/coming-soon.png";


/**
 * Site path to product details page.
 * @property eb_relatedProducts.productDetailsURL
 * @type {String}
 * */
eb_relatedProducts.productDetailsURL = eb_relatedProducts.SitePath + 'ProductDetails.html';

/**
 * Site path to event details page.
 * @property eb_relatedProducts.eventDetailsURL
 * @type {String}
 * */
eb_relatedProducts.eventDetailsURL = eb_relatedProducts.SitePath + 'events/EventDetails.html';

/**
 * GET product id from URL
 * @property  eb_relatedProducts.productId
 * @type {String}
 */
eb_relatedProducts.productId = eb_Config.getUrlParameter("productId");

/**
 * GET service to get related products
 * @property  eb_relatedProducts.getRelatedProducts
 * @type {String}
 */
eb_relatedProducts.getRelatedGeneralProducts = eb_relatedProducts.ServicePath + "Products/{productId}/RelatedProducts";

/**
 * GET service to get related products
 * @property  eb_relatedProducts.getRelatedProducts
 * @type {String}
 */
eb_relatedProducts.getRelatedMeetingProducts = eb_relatedProducts.ServicePath + "events/{productIds}/RelatedProducts";

/**
 * GET service to get cart related products
 * @property  eb_relatedProducts.getRelatedProducts
 * @type {String}
 */
eb_relatedProducts.getShoppingCartRelatedProducts = eb_relatedProducts.ServicePath + "ShoppingCarts/RelatedProducts";

/**
 * GET service call method for Related General Product Details
 * @method eb_relatedProducts.getRelatedGeneralProductsData
 * @return {Object} Details of related general product
 * */
eb_relatedProducts.getRelatedGeneralProductsData = function () {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for product details');
    if (eb_relatedProducts.productId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing productId.', stack: Error().stack };
    }

    if (!Number(eb_relatedProducts.productId)) {
        throw { type: "argument_mismatch", message: 'Missing productId.', stack: Error().stack };
    }

    eBusinessJQObject.get(
        {
            url: eb_relatedProducts.getRelatedGeneralProducts.replace("{productId}", eb_relatedProducts.productId),
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
 * GET service call method for Related Meeting Product Details
 * @method eb_relatedProducts.getRelatedMeetingProductsData
 * @return {Object} Details of related meeting product
 * */
eb_relatedProducts.getRelatedMeetingProductsData = function () {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for product details');
    if (eb_relatedProducts.productId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing productId.', stack: Error().stack };
    }

    if (!Number(eb_relatedProducts.productId)) {
        throw { type: "argument_mismatch", message: 'Missing productId.', stack: Error().stack };
    }

    eBusinessJQObject.get(
        {
            url: eb_relatedProducts.getRelatedMeetingProducts.replace("{productIds}", eb_relatedProducts.productId),
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
 * GET service call method for Shopping Cart Related Product Details
 * @method eb_relatedProducts.getShoppingCartRelatedProductsData
 * @return {Object} Details of related meeting product
 * */
eb_relatedProducts.getShoppingCartRelatedProductsData = function () {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for product details');

    eBusinessJQObject.get(
        {
            url: eb_relatedProducts.getShoppingCartRelatedProducts,
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
 * Rendering public method to load HTML template. Based on page level configuration it will select the template and load in DOM
 * @method eb_relatedProducts.render
 * @param {any} options options contains different parameter like Sitepath, templatePath and domElement..
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * @returns {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_relatedProducts.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            var finalPath = eb_relatedProducts.SitePath + eb_relatedProducts.TemplatePath;
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
 * Related Products Model for binding data
 * @method eb_relatedProducts.model
 * @param {any} options Parameter options
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL
 * @param {String} options.data data.
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 */
eb_relatedProducts.model = function (options) {
    var _that = this;
    _that.domElement = options.domElement;
    _that.templatePath = options.templatePath;
    _that.relatedProducts = options.relatedProducts;
    _that.parentControl = options.parentControl;

    _that.relatedProductsList = ko.observableArray([]);
    _that.carouselVisible = ko.observable(0);
    _that.carouselPrevButtonVisible = ko.observable(0);
    _that.carouselNextButtonVisible = ko.observable(0);
    _that.numberOfClicks = ko.observable(0);
    
    

    /*Related Products model.*/
    _that.relatedProductsModel = function (data) {
        var self = this;
        var descriptionData;

        self.name = ko.observable(data['name']);
        self.id = ko.observable(data['id']);
        self.description = ko.observable();
        self.promptText = ko.observable(data['promptText']);
        self.relationship = ko.observable(data['relationship']);
        self.productType = ko.observable(data['productType']);
        self.imagePath = ko.observable();
        self.displayName = ko.observable();
        self.detailsPageURL = ko.observable();


        /*If the length of the product name and description exceeds the value given, append "..." in order to maintain aesthetic widget boxes.*/
        if (self.name().length < eb_Config.relatedProductsNameCharLength) {
            self.displayName(self.name());
        }
        else {
            self.displayName(self.name().substr(0, eb_Config.relatedProductsNameCharLength) + "...")
        }

        descriptionData = eBusinessJQObject("<html>" + data['description'] + "</html>").text();
        if (descriptionData.length < eb_Config.relatedProductsDescriptionCharLength) {
            self.description(descriptionData);
        }
        else {
            self.description(descriptionData.substr(0, eb_Config.relatedProductsDescriptionCharLength) + "...");
        }

        /*URL of the details page of the product/event.*/
        if (self.productType().toLowerCase() == "general") {
            self.detailsPageURL(eb_relatedProducts.productDetailsURL + "?" + "productId=" + self.id());
        }
        if (self.productType().toLowerCase() == "meeting") {
            self.detailsPageURL(eb_relatedProducts.eventDetailsURL + "?" + "productId=" + self.id());
        }

        if (eb_Config.loadDefaultImage) {
            if (self.productType().toLowerCase() == "meeting") {
                self.imagePath(eb_relatedProducts.defaultMeetingsImage);
            }
            else {
                self.imagePath(eb_relatedProducts.defaultImage);
            }
        }
        else {
            self.imagePath(eb_Config.thumbnailImageURL + self.id() + eb_Config.imageExtension);
        }
    };

    /*Responsible for loading data into the observables.*/
    _that.loadRelatedProductsDataControl = function (data) {
        eBusinessJQObject.map(data, function (row) {
            _that.relatedProductsList.push(new _that.relatedProductsModel(row));
        });

        /*Show Carousel control only if related products list exists.*/
        if (_that.relatedProductsList().length > 0) {
            _that.carouselVisible(1);
        }
    };

    _that.getRelatedGeneralProductsDataFromServer = function () {
        return eb_relatedProducts.getRelatedGeneralProductsData();
    };

    _that.getRelatedMeetingProductsDataFromServer = function () {
        return eb_relatedProducts.getRelatedMeetingProductsData();
    };

    if (_that.relatedProducts) {
        _that.loadRelatedProductsDataControl(_that.relatedProducts);
    } else {
        if (_that.parentControl == "productDetails") {
            _that.getRelatedGeneralProductsDataFromServer().done(function (data) {
                _that.loadRelatedProductsDataControl(data);
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getRelatedGeneralProductsDataFromServer failed:  " + xhr.responseText);
            });
        }
        if (_that.parentControl == "eventDetails") {
            _that.getRelatedMeetingProductsDataFromServer().done(function (data) {
                _that.loadRelatedProductsDataControl(data);
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getRelatedMeetingProductsDataFromServer failed:  " + xhr.responseText);
            });
        }

    }
   
    
     /*This function breaks down the relatedProductsList array into blocks of images to fit into carousel as one item.*/
    _that.relatedProductsBlock = ko.computed(function () {
        var products_array = [];
        var maxImagesPerBlock;

        /*If current device is tablet, show maximum 2 images in one carousel item.*/
        if (window.matchMedia("(min-width:768px) and (max-width:1023px)").matches) {
            maxImagesPerBlock = 2;
        }
        /*If current device is mobile phone, show maximum 1 image in one carousel item.*/
        else if (window.matchMedia("(max-width:480px)").matches) {
            maxImagesPerBlock = 1;
        }
        /*If current device is desktop, show maximum 4 images in one carousel item.*/
        else {
            maxImagesPerBlock = 4;
        }
        // Below Code Handles the Default Condition when Page Load
        if (_that.relatedProductsList().length > maxImagesPerBlock)  {
            _that.carouselNextButtonVisible(1);
        }
        //The below two functions are called on clicking previous and next caraousel Buttons and handle the condition when to show buttons
        _that.countCarouselPrevClick = function () {
            _that.numberOfClicks(_that.numberOfClicks() - 1)
            if (_that.numberOfClicks() == 0) {
                _that.carouselPrevButtonVisible(0);
            }
            if (_that.relatedProductsList().length > maxImagesPerBlock) {
                _that.carouselNextButtonVisible(1);
            }
        };
        _that.countCarouselNextClick = function () {
            _that.numberOfClicks(_that.numberOfClicks() + 1)
            if (_that.numberOfClicks() > 0) {
                _that.carouselPrevButtonVisible(1);
            }
            if (_that.numberOfClicks() == _that.relatedProductsBlock().length - 1) {
                _that.carouselNextButtonVisible(0);
            }
        }; 
        eBusinessJQObject.each(_that.relatedProductsList(), function (index, item) {
            if (index % maxImagesPerBlock == 0) {
                products_array.push(ko.observableArray([item]));
            } else {
                products_array[products_array.length - 1]().push(item);
            }
        });
        return products_array;
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
            eBusinessJQObject(element).attr('src', eb_relatedProducts.defaultImage);
        });
    }
};

