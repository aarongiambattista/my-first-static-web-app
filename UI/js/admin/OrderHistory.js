/**
 * Order History Admin class.
 * @class eb_OrderHistoryAdmin
 * */
var eb_OrderHistoryAdmin = eb_OrderHistoryAdmin || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_OrderHistoryAdmin.SitePath
 * @type {String}
 * */
eb_OrderHistoryAdmin.SitePath = eb_Config.SitePath;

/**
 * Order History Admin template path.
 * @property eb_OrderHistoryAdmin.TemplatePath
 * @type {String}
 * */
eb_OrderHistoryAdmin.TemplatePath = "html/admin/OrderHistory.html";

/**
 * SOA path.
 * @property eb_OrderHistoryAdmin.ServicePath
 * @type {String}
 * */
eb_OrderHistoryAdmin.ServicePath = eb_Config.ServicePathV1;

/**
 * Order History service for all orders.
 * @property eb_OrderHistoryAdmin.getOrderHistoryAdmin
 * @type {String}
 * */
eb_OrderHistoryAdmin.getOrderHistory = eb_OrderHistoryAdmin.ServicePath + "admin/company/{id}/OrderHistory";

/**
 * Order History service for particular order
 * @property eb_OrderHistoryAdmin.getOrderLineHistory
 * @type {String}
 * */
eb_OrderHistoryAdmin.getOrderLineHistory = eb_OrderHistoryAdmin.ServicePath + "admin/company/{id}/OrderHistory/{orderId}/Items";

/**
 * If Image is not available, then provide this image.
 * @property eb_OrderHistoryAdmin.defaultImage
 * @type {String}
 * */
eb_OrderHistoryAdmin.defaultImage = "../images/products/coming-soon.png";

/**
 * Redirect to product Details Page.
 * @property eb_OrderHistoryAdmin.productDetailsURL
 * @type {String}
 * */
eb_OrderHistoryAdmin.productDetailsURL = eb_OrderHistoryAdmin.SitePath + "ProductDetails.html";

/**
 * The service will return order history admin HTML.
 * @method eb_OrderHistoryAdmin.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Order History Admin template URL.
 * @return {String} Order History Admin HTML template.
 * */
eb_OrderHistoryAdmin.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_OrderHistoryAdmin.SitePath + eb_OrderHistoryAdmin.TemplatePath;
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

/**
 * This method is used to get order history data for company
 * @method eb_OrderHistoryAdmin.OrderHistoryService
 * @param {String} companyId current company selected.
 * @return {Object} jQuery promise object which when resolved returns order history data.
 */
eb_OrderHistoryAdmin.OrderHistoryService = function (companyId) {
    var defer = eBusinessJQObject.Deferred();
    var service = eb_OrderHistoryAdmin.getOrderHistory;
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }

    if (companyId > 0) {
        service = eb_OrderHistoryAdmin.getOrderHistory.replace("{id}", companyId);
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
 * This method is used to get order lines data.
 * @method eb_OrderHistoryAdmin.orderLinesHistoryService
 * @param {String} companyId current company selected Id.
 * @param {String} orderId OrderId.
 * @return {Object} jQuery promise object which when resolved returns order lines data.
 */
eb_OrderHistoryAdmin.orderLinesHistoryService = function (companyId, orderId) {
    var defer = eBusinessJQObject.Deferred();
    var service = eb_OrderHistoryAdmin.getOrderHistory;

    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (!orderId) {
        throw { type: "argument_null", message: "orderId property is required.", stack: Error().stack };
    }
    if (companyId > 0) {
        if (orderId > 0) {
            service = eb_OrderHistoryAdmin.getOrderLineHistory.replace("{id}", companyId).replace("{orderId}", orderId);
        }
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
 * Order History Admin model responsible for admin's order history operations.
 * @method eb_OrderHistoryAdmin.model
 * @param { any } options Object of order history admin data.
 * @param { String } options.ServicePath Service URL.
 * @param { String } options.SitePath Site URL.
 * @param { String } options.templatePath HTML path.
 * @param { Object } options.domElement Order History Admin DOM element.
 * */

eb_OrderHistoryAdmin.model = function (options) {
    var _that = this;
    var defer = eBusinessJQObject.Deferred();
    _that.domElement = options.domElement;
    _that.userContext = options.userContext;
    _that.companyName = ko.observable();
    _that.orderDetails = ko.observableArray(); /*Array for number for orders details*/
    _that.noOrderHistory = ko.observable(0);   /*If no data available, then it shows no data available*/
    _that.OrderHistoryAvailable = ko.observable();   /*If  data available, then it shows data available*/
    _that.radioSelectedOptionValue = ko.observable();
    _that.filtercollapse = ko.observable(0); /*To collapse filter on mobile*/
    _that.showLoader = ko.observable(0);

    if (options.data) {
        _that.data = options.data;
    }

    if (options.companyId) {
        eb_OrderHistoryAdmin.companyId = options.companyId;
    } else {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }

    /*Sorting functions start here*/
    _that.sortByOrderDate = function () {
        var data = _that.orderDetails();
        data.sort(function (a, b) {
            return new Date(b.orderDate()) - new Date(a.orderDate());
        });
        _that.orderDetails(data);
        return true;
    };

    _that.sortByShipToPerson = function () {
        var done = false;
        var data = _that.orderDetails();
        while (!done) {
            done = true;
            for (var i = 1; i < data.length; i += 1) {
                if (data[i - 1].shipToPerson() > data[i].shipToPerson()) {
                    done = false;
                    var tmp = data[i - 1];
                    data[i - 1] = data[i];
                    data[i] = tmp;
                }
            }
        }
        _that.orderDetails(data);
        return true;
    };

    _that.sortByBalance = function () {
        var data = _that.orderDetails();
        data.sort(function (a, b) {
            return b.numericBalance() - a.numericBalance();
        });
        _that.orderDetails(data);
        return true;
    };
    /*Sorting functions end here*/

    /*Order Lines data*/
    _that.orderLinesData = function (data) {
        var self = this;
        self.id = ko.observable(data.id);

        if (data.webName) {
            self.name = ko.observable(data.webName);
        } else {
            self.name = ko.observable(data.productName);
        }

        self.shipToPerson = ko.observable(data.shipToName);
        var price = String(data.price);

        self.currency = ko.observable(data.currencySymbol);
        if (self.currency()) {
            self.currencySymbol = self.currency().trim();
        } else {
            self.currencySymbol = self.currency();
        }

        var negative = parseFloat(price) < 0;
        if (negative) {
            self.price = price.replace("-", "");
            self.currencySymbol = "-" + self.currency().trim();
            self.price = ko.observable(self.currencySymbol + parseFloat(self.price).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        } else {
            self.price = ko.observable(self.currencySymbol + parseFloat(data.price).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        }

        self.description = ko.observable(data.description);
        self.quantity = ko.observable(data.quantity);
        self.productType = ko.observable(data.productType);
        self.productCategory = ko.observable(data.productCategory);
        self.productId = ko.observable(data.productId);
        self.displayDetails = ko.observable('Show Details')
        self.sessionCollapse = ko.observable(0);

        /*Kit Product*/
        self.subProductsList = ko.observableArray();
        self.isParentProduct = ko.observable(0);
        self.kitShow = ko.observable(0);
        /*Kit*/

        self.discount = ko.observable(data.discount);
        var DiscountedPrice = data.price * (1 - data.discount / 100);

        var finalDiscountedPrice = String(data.quantity * DiscountedPrice);
        if (parseFloat(finalDiscountedPrice) < 0) {
            self.finalPrice = finalDiscountedPrice.replace("-", "");
            self.currencySymbol = "-" + self.currency().trim();;
            self.finalPrice = ko.observable(self.currencySymbol + parseFloat(self.finalPrice).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        } else {
            self.finalPrice = ko.observable(self.currencySymbol + parseFloat(finalDiscountedPrice).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        }

        /*To load image for kit products*/
        if (eb_Config.loadDefaultImage) {
            self.webImage = ko.observable(eb_OrderHistoryAdmin.defaultImage);
        }
        else {
            self.webImage = ko.observable(eb_Config.thumbnailImageURL + data.productId + eb_Config.imageExtension);
        }

        /* Show Hide/ Show Details functionality */
        self.kitproduct = function () {
            if (self.displayDetails() === 'Show Details') {
                self.displayDetails('Hide Details');
            } else {
                self.displayDetails('Show Details');
            }
            self.kitShow(!self.kitShow());
        }
        /*Toggling the session*/
        self.toggleSession = function () {
            self.sessionCollapse(!self.sessionCollapse());
        };

        /*Redirect to the product detail page.*/
        self.productNameDetails = function (item, e) {
            if (eb_OrderHistoryAdmin.productDetailsURL || eb_OrderHistoryAdmin.eventDetailsURL) {
                if (item.productType().toLowerCase() === "meeting") {
                    if (item.parentProductId() === 0) {
                        /*If it is main meeting then send productId*/
                        window.location.assign(eb_OrderHistoryAdmin.eventDetailsURL + "?" + encodeURIComponent("ProductId") + "=" + encodeURIComponent(item.productId()));
                    } else {
                        /*If it is session then send parentProductId*/
                        window.location.assign(eb_OrderHistoryAdmin.eventDetailsURL + "?" + encodeURIComponent("ProductId") + "=" + encodeURIComponent(item.parentProductId()));
                    }
                }
                /*To check whether the category is fundraising */
                else if (item.productCategory() && item.productCategory().toLowerCase() === "fundraising") {
                    e.preventDefault();
                }
                else {
                    window.location.assign(eb_OrderHistoryAdmin.productDetailsURL + "?" + encodeURIComponent("productId") + "=" + encodeURIComponent(item.productId()));
                }
            }
            else {
                console.error("A redirection page is missing.");
            }
        };
    };

    /*Order Details*/
    _that.orderDetailsData = function (data) {
        var self = this;
        self.orderID = ko.observable(data.id);
        self.orderDate = ko.computed(function () {
            return moment(data.orderDate).format(eb_Config.defaultDateFormat);
        });
        self.orderStatus = ko.observable(data.orderStatus);
        self.currency = ko.observable(data.currencySymbol);
        self.currencySymbol = self.currency().trim();
        self.orderType = ko.observable(data.orderType);
        self.orderParty = ko.observable(data.orderParty);
        self.paymentParty = ko.observable(data.paymentParty);

        var billToPersonName = data.billToName;
        var shipToPersonName = data.shipToName;
        if (billToPersonName) {
            if (billToPersonName.trim() === "[Not Specified]") {
                billToPersonName = "";
            }
        }
        if (shipToPersonName) {
            if (shipToPersonName.trim() === "[Not Specified]") {
                shipToPersonName = "";
            }
        }
        
        self.billToPerson = ko.observable(billToPersonName);
        self.shipToPerson = ko.observable(shipToPersonName);
        self.numericBalance = ko.observable(parseFloat(data.balance));
        var orderBalance = String(data.balance);
        var orderTotal = String(data.subTotal);

        var negativeValue = parseFloat(orderTotal) < 0;
        if (negativeValue) {
            orderTotal = orderTotal.replace("-", "");
            self.currencySymbol = "-" + self.currency().trim();;
            self.subTotal = ko.observable(self.currencySymbol + parseFloat(orderTotal).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        } else {
            self.subTotal = ko.observable(self.currencySymbol + parseFloat(data.subTotal).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        }

        var negativeBalance = parseFloat(orderBalance) < 0;
        if (negativeBalance) {
            orderBalance = orderBalance.replace("-", "");
            self.currencySymbol = "-" + self.currency().trim();;
            self.balance = ko.observable(self.currencySymbol + parseFloat(orderBalance).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        } else {
            self.balance = ko.observable(self.currencySymbol + parseFloat(data.balance).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        }

        self.allOrderLines = ko.observableArray(); /*Array for all orders lines*/
        self.toogleName = ko.observable('Show Details');
        self.displayBlock = ko.observable(1);

        var finalDiscountedPrice = data.price * (1 - data.discount / 100);
        self.finalPrice = ko.observable(parseFloat(finalDiscountedPrice).toFixed(eb_Config.roundOffDigitsAfterDecimal));

        /*get call for order lines data*/
        self.orderLinesHistoryData = function (companyId, orderID) {
            return eb_OrderHistoryAdmin.orderLinesHistoryService(companyId, orderID);
        };

        /*show order details.*/
        self.showOrderDetails = function (model) {
            /*To change the text name to ShowDetails/HideDetails */
            if (self.displayBlock() === 1) {
                self.toogleName('Hide Details');
                self.displayBlock(0);
                self.allOrderLines.removeAll();
                _that.showLoader(1);
                self.orderLinesHistoryData(eb_OrderHistoryAdmin.companyId, model.orderID()).done(function (orderLines) {
                    eBusinessJQObject.map(orderLines, function (row) {
                        row.currencySymbol = self.currencySymbol;
                        if (row.parentId <= 0) {
                            self.allOrderLines.push(new _that.orderLinesData(row));
                        }
                        else {
                            /* Kit products. */
                            row.currencySymbol = self.currencySymbol;
                            var productRecord = ko.utils.arrayFirst(self.allOrderLines(), function (item) {
                                return item.id() === Number(row.parentId);
                            });
                            if (productRecord) {
                                productRecord.isParentProduct(1);
                                productRecord.subProductsList.push(new _that.orderLinesData(row));
                                return;
                            }
                            self.allOrderLines.push(new _that.orderLinesData(row));
                        }
                    });
                    _that.showLoader(0);
                }).fail(function (xhr, textStatus, errorThrow) {
                    console.info("orderLinesHistoryData failed:  " + xhr.responseText);
                    eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_OrderHistoryAdmin);
                });
            }
            else {
                self.displayBlock(1);
                self.toogleName('Show Details');
            }

        };
    };

    /*Get Order history data from service.*/
    _that.getOrderHistoryDataFromServer = function () {
        return eb_OrderHistoryAdmin.OrderHistoryService(eb_OrderHistoryAdmin.companyId);
    };

    /*load order history data*/
    _that.loadOrderHistoryDataFromServer = function (data) {
        _that.companyName(_that.userContext.CompanyName());
        if (data.length === 0) {
            _that.noOrderHistory(1);
            _that.OrderHistoryAvailable(0);
        } else {
            _that.orderDetails.removeAll();
            _that.noOrderHistory(0);
            _that.OrderHistoryAvailable(1);
        }
        eBusinessJQObject.map(data, function (row) {
            _that.orderDetails.push(new _that.orderDetailsData(row));
        });
        _that.radioSelectedOptionValue("OrderDate");
        _that.sortByOrderDate();
    };

    /*Load order history data.*/
    if (_that.data) {
        _that.loadOrderHistoryDataFromServer(_that.data);
    } else {
        _that.getOrderHistoryDataFromServer().done(function (loadData) {
            _that.loadOrderHistoryDataFromServer(loadData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getOrderHistoryDataFromServer failed:  " + xhr.responseText);
            eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_OrderHistoryAdmin);
        });
    }

    /*Handle user context on change of company from dropdown*/
    _that.handleUserContext = function () {
        eb_OrderHistoryAdmin.companyId = _that.userContext.companyId();
        _that.orderDetails.removeAll();
        _that.getOrderHistoryDataFromServer().done(function (loadData) {
            _that.loadOrderHistoryDataFromServer(loadData);    
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getOrderHistoryDataFromServer failed:  " + xhr.responseText);
            eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_OrderHistoryAdmin);
        });
    };

    /*Check if the field is null or undefined or invalid*/
    _that.checkIfValid = function (data) {
        if (data) {
            return data;
        }
        else {
            return "--";
        }
    };
    /* Filter control show hide on mobile device*/
    _that.togglefiltercontrol = function () {
        _that.filtercollapse(!_that.filtercollapse());
    };
};



/**
* Page DOM element.
* @method eb_OrderHistoryAdmin.domElement
* @param {object} domElement current DOM element.
* */
eb_OrderHistoryAdmin.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_OrderHistoryAdmin.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_OrderHistoryAdmin);
});