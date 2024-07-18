//Define eb_multipleProductDetails class.
var eb_multipleProductDetails = eb_multipleProductDetails || {};

//control level setting: Site path.
eb_multipleProductDetails.SitePath = eb_Config.SitePath;

//control level setting Template path.
eb_multipleProductDetails.TemplatePath = "html/MultipleProduct.html";

//The path to the Ebusiness SOA layer
eb_multipleProductDetails.ServicePath = eb_Config.ServicePathV1;

//GET service to get MultipleProductImages
eb_multipleProductDetails.getMultipleProductImages = eb_multipleProductDetails.ServicePath + "/TopRatedProduct"; //Mock Service for Top Rated Carousel Images

//POST Service to add the Product in cart
eb_multipleProductDetails.createAddToCardService = eb_multipleProductDetails.ServicePath + "/addProduct";

//Default Product Image -if image is not set then this image will applied their 
eb_multipleProductDetails.defaultImage = "images/products/coming-soon.png";

//Rendering public method to load HTML template. Based on page level configuration it will select the template and load in DOM.
eb_multipleProductDetails.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            var finalPath = eb_multipleProductDetails.SitePath + eb_multipleProductDetails.TemplatePath;
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

//GET service call method for MultipleProductImages
eb_multipleProductDetails.getMultipleProduct = function () {
    var deferred = eBusinessJQObject.Deferred();
    eBusinessJQObject.get(
        {
            url: eb_multipleProductDetails.getMultipleProductImages,
            xhrFields: {
                withCredentials: true
            }
        }
    ).done(function (data) {
        deferred.resolve(data);
    }).fail(deferred.reject);
    return deferred.promise();
};

//POST service call method for Product details
eb_productDetails.addToCart = function (data) {
    var deferred = eBusinessJQObject.Deferred();
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax(
            {
                url: eb_productDetails.createAddToCardService,
                type: "POST",
                data: data,
                xhrFields: {
                    withCredentials: true
                },
                headers: headers
            }
        ).done(function (result) {
            deferred.resolve(result);
        }).fail(deferred.reject);
    });
    return deferred.promise();
};

//Model object
eb_multipleProductDetails.model = function (data, domElement) {
    var _that = this;

    if (!domElement) {
        throw { type: "argument_null", message: "An object with values in the domElement property is required.", stack: Error().stack };
    }
    _that.domElement = domElement;

    if (typeof data === 'undefined') {
        data = {
            showSuccess: 0,
            successMessage: ""
        };
    }

    //Details of Product    
    _that.id = ko.observable();//
    _that.multipleProduct = ko.observableArray();
    _that.name = ko.observable(); //
    _that.retailPrice = ko.observable();//
    _that.webImage = ko.observable();//

    //Get MultipleProduct Data from server
    _that.getMultipleProductFromServer = function () {
        return eb_multipleProductDetails.getMultipleProduct();
    };

    //Calling the loadMultipleProduct
    _that.getMultipleProductFromServer().done(function (allData) {
        _that.loadMultipleProduct(allData);
    }).fail(function (xhr, textStatus, errorThrow) {
        console.info("getMultipleProductFromServer failed:  " + xhr.responseText);
    });

    //Get MultipleProduct data from Server
    _that.getMultipleProductModel = function (data) {
        var self = this;
        self.id = data['id'];
        self.name = data['name'];
        self.retailPrice = data['retailPrice'];
        self.webImage = data['webImage'];
    };

    //Displaying the Cart Update Message
    _that.productCartUpdate = function (data) {
        var dataToAdd = {
            id: _that.id()
        };
        eb_productDetails.addToCart(dataToAdd).done(function (result) {
            alertify.delay(2000).success('Cart Updated');
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("addToCart failed:  " + xhr.responseText);
        });
    };

    //Loading the data
    _that.loadMultipleProduct = function (data) {
        eBusinessJQObject.map(data, function (row) {
            if (row['webImage'] === "") {
                row['webImage'] = eb_multipleProductDetails.defaultImage;
            }
            _that.multipleProduct.push(new _that.getMultipleProductModel(row));
        });
    };
    //Calling the ProductImages in carousel
    eb_multipleProductDetails.loadMultipleProductSlider(domElement);
};

//LightSlider Carousel for SingleProductImages
eb_multipleProductDetails.loadMultipleProductSlider = function (domElement) {
    eBusinessJQObject(domElement).find(".light-slider").lightSlider();
};



