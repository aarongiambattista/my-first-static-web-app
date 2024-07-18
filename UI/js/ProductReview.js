//Define eb_productReview class.
var eb_productReview = eb_productReview || {};

//control level setting: Site path.
eb_productReview.SitePath = eb_Config.SitePath;

//control level setting Template path.
eb_productReview.TemplatePath = "html/ProductReview.html";

//The path to the Ebusiness SOA layer
eb_productReview.ServicePath = eb_Config.ServicePathV1;

//GET service to get all Product Review Details
eb_productReview.getProductReview = eb_productReview.ServicePath + "Products";

//get product id from URL
eb_productReview.productId = eb_Config.getUrlParameter("productId");

//GET service for Product is Purchased or not
eb_productReview.getProductPurchased = eb_productReview.ServicePath + "/ProfilePersons";

//TODO: Using mock service, Once the service is available will update the service path from eb_config.
//POST service for Product Review
eb_productReview.createProductReview = "http://ebizservices.mockable.io/productReviewDataSubmit";

//Default Product Image -if image is not set then this image will applied their 
eb_productReview.defaultImage = "images/products/coming-soon.png";

//character length for show more and show less functionality
eb_productReview.charLength = 450;

//Rendering public method to load HTML template. Based on page level configuration it will select the template and load in DOM.
eb_productReview.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            var finalPath = eb_productReview.SitePath + eb_productReview.TemplatePath;
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

//Known Responses
eb_productReview.knownResponses = [
    { code: "reviewTitle", message: "Enter the Review Title" },
    { code: "reviewDescritipn", message: "Enter the Review Description" },
    { code: "reviewDescriptionCharacter", message: "Enter up to the 50 Character" },
    { code: "productPurchase", message: "Review Product" },
    { code: "productNotPurchase", message: "Sorry. You need to purchase this product first to write a review" }
];

//GET service call method for ProductReview 
eb_productReview.getData = function () {
    var deferred = eBusinessJQObject.Deferred();
    eBusinessJQObject.get(
        {
            url: eb_productReview.getProductReview + "/" + eb_productReview.productId,
            xhrFields: {
                withCredentials: true
            }
        }
    ).done(function (result) {
        deferred.resolve(result);
    }).fail(deferred.reject);
    return deferred.promise();
};

//Post service call method for ProductReview
eb_productReview.createProductReviewData = function (data) {
    var deferred = eBusinessJQObject.Deferred();
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax(
            {
                url: eb_productReview.createProductReview,
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

//Get service call method for ProductMatch
eb_productReview.getProductPurchasedData = function (data) {
    var deferred = eBusinessJQObject.Deferred();
    eBusinessJQObject.ajax(
        {
            url: eb_productReview.getProductPurchased,
            xhrFields: {
                withCredentials: true
            }
        }
    ).done(function (result) {
        deferred.resolve(result);
    }).fail(deferred.reject);
    return deferred.promise();
};

//Product Review Model for binding data
eb_productReview.model = function (data, domElement) {
    var _that = this;
    _that.domElement = domElement;
    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

    if (typeof data === 'undefined') {
        data = {
            reviewTitle: "",
            productReview: "",
            showSuccessMessage: 0,
            showSuccessReview: 0,
            successReviewTitle: "",
            successReviewDescription: ""
        };
    }

    //ReviewTitle Field Validation
    _that.reviewTitle = ko.observable("").extend({
        minlength: 1,
        maxlength: 60
    });

    //ReviewProduct Description
    _that.productReviewInfo = ko.observable("").extend({
        minlength: 50,
        maxlength: 1000
    });

    //CharacterCount in Product Description Field
    _that.charCount = ko.computed(function () {
        var count = _that.productReviewInfo().length;
        return count;
    }, _that);

    _that.showSuccessMessage = ko.observable(data.showSuccessMessage);
    _that.showSuccessReview = ko.observable(data.showSuccessReview);
    _that.successReviewTitle = ko.observable();
    _that.successReviewDescription = ko.observable();
    _that.name = ko.observable();
    _that.productDescription = ko.observable();
    _that.productImage = ko.observable();
    _that.reviewProduct = ko.observable();
    _that.visible = ko.observable(false);
    _that.id = ko.observable();
    _that.description = ko.observable("");
    _that.productReviewMessage = ko.observable();

    //Show more and show less binding
    _that.remainingDescription = ko.observable("");
    _that.showRemainingDescription = ko.observable(0);
    _that.showMoreHide = ko.observable(0);
    _that.showMoreDescription = ko.observable(1);
    _that.hideRemainingDescription = ko.observable(0);
    _that.showEllipses = ko.observable(0);

    //Load the data
    _that.loadAllControl = function (data) {
        _that.name(data['name']);
        _that.productImage(data['webImage']);
        if (data['webImage'] === "") {
            data['webImage'] = eb_productReview.defaultImage;
        }
        _that.checkProductDescription(data['webDescription']);
    };

    //show less functionality
    _that.showLess = function () {
        _that.hideRemainingDescription(0);
        _that.showMoreDescription(1);
        _that.showMoreHide(1);
        _that.showRemainingDescription(0);
        _that.showEllipses(1);
    };

    //show more functionality
    _that.showMore = function () {
        _that.showRemainingDescription(1);
        _that.showMoreDescription(0);
        _that.showMoreHide(0);
        _that.hideRemainingDescription(1);
        _that.showEllipses(0);
    };

    //showing the data if char length is greater than 500 character
    _that.showMoreData = function (data) {
        var description = data;
        var showDescription = description.substr(0, eb_productReview.charLength);
        var hideDescription = description.substr(eb_productReview.charLength, description.length - eb_productReview.charLength);
        _that.description(showDescription);
        _that.remainingDescription(data);
        _that.showRemainingDescription(0);
        _that.showMoreHide(1);
        _that.showEllipses(1);
    };

    //End of show more and show less
    //Checking the product description if the product description length is greater than 200char than we are going to split the 
    //description in two different div.
    _that.checkProductDescription = function (data) {
        if (!data) {
            data = "";
        }
        data = eBusinessJQObject("<html>" + data + "</html>").text();
        var descriptionLength = data;
        if (descriptionLength.length < eb_productReview.charLength) {
            _that.description(data);
        } else {
            _that.showMoreData(data);
        }
    };

    //Get The Data From Services-
    _that.getProductReviewDataFromServer = function () {
        return eb_productReview.getData();
    };

    //Calling the loadAllControl
    _that.getProductReviewDataFromServer().done(function (loadData) {
        _that.loadAllControl(loadData);
    }).fail(function (xhr, textStatus, errorThrow) {
        console.info("Failed getProductReviewDataFromServer:  " + xhr.responseText);
    });

    //Get the data to check whether the product is purchase or not
    _that.getProductPurchasedDataFromServer = function () {
        return eb_productReview.getProductPurchasedData();
    };

    //Calling the loadProductPurchasedData 
    _that.getProductPurchasedDataFromServer().done(function (loadData) {
        _that.loadProductPurchasedData(loadData);
    }).fail(function (xhr, textStatus, errorThrow) {
        console.info("getNameDataFromServer failed:  " + xhr.responseText);
    });

    //Loading the data
    _that.loadProductPurchasedData = function (data) {
        if (data['shoppingCartID'] > 0) {
            _that.visible(false);
            _that.productReviewMessage(eb_productReview.knownResponses[3].message);
        } else {
            _that.visible(true);
            _that.productReviewMessage(eb_productReview.knownResponses[4].message);
        }
    };

    //Display for Review Title and Review Description Message
    _that.displayValidationMessage = function () {
        if (_that.reviewTitle().length < 1) {
            _that.showSuccessReview(1);
            _that.successReviewTitle(eb_productReview.knownResponses[0].message);
        }
        else if (_that.productReviewInfo().length === 0) {
            _that.showSuccessMessage(1);
            _that.successReviewDescription(eb_productReview.knownResponses[1].message);
        }
        else if (_that.productReviewInfo().length > 0 && _that.productReviewInfo().length < 50) {
            _that.showSuccessMessage(1);
            _that.successReviewDescription(eb_productReview.knownResponses[2].message);
        }
        else {
            _that.showSuccessReview(0);
            _that.showSuccessMessage(0);
            return true;
        }
        return false;
    };

    //Review Submit Functionality
    _that.submitReview = function () {
        //var flag = false;
        var dataToAdd = {
            reviewTitle: _that.reviewTitle(),
            productReviewInfo: _that.productReviewInfo()
        };
        _that.showSuccessReview(0);
        _that.showSuccessMessage(0);
        if (!_that.displayValidationMessage()) // For Displaying the validation Message
        {
            return false;
        }
        eb_productReview.createProductReviewData(dataToAdd).done(function (result) {
            alertify.delay(2000).success('Review Submitted Successfully..');
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("createProductReviewData failed:  " + xhr.responseText);
        });

    };
    //Cancel Functionality
    _that.reviewCancel = function () {
        _that.showSuccessReview(0);
        _that.showSuccessMessage(0);
        _that.successReviewTitle = "";
        _that.successReviewDescription = "";
    };
};





