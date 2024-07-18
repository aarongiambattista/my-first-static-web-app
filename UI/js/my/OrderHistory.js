/**
 * Order history class.
 * @class eb_OrderHistory
 * */
var eb_OrderHistory = eb_OrderHistory || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_OrderHistory.SitePath
 * @type {String}
 * */
eb_OrderHistory.SitePath = eb_Config.SitePath;

/**
 * Template path.
 * @property eb_OrderHistory.TemplatePath
 * @type {String}
 * */
eb_OrderHistory.TemplatePath = "html/my/OrderHistory.html";

/**
 * SOA path.
 * It would be set from configuration file.
 * @property eb_OrderHistory.ServicePath
 * @type {String}
 * */
eb_OrderHistory.ServicePath = eb_Config.ServicePathV1;

/**
 * Order History service
 * @property eb_OrderHistory.getOrderHistory
 * @type {String}
 * */
eb_OrderHistory.getOrderHistory = eb_OrderHistory.ServicePath + "ProfilePersons/{personId}/OrderHistory";

/**
 * Order History service for particular order
 * @property eb_OrderHistory.getOrderLineHistory
 * @type {String}
 * */
eb_OrderHistory.getOrderLineHistory = eb_OrderHistory.ServicePath + "ProfilePersons/{personId}/OrderHistory/{orderId}/Items";

/**
 * GET service to get all Product Review Details.
 * @property eb_OrderHistory.getSubscriptionItemsService
 * @type {String}
 * */
eb_OrderHistory.getSubscriptionItemsService = eb_OrderHistory.ServicePath + "ProfilePersons/{personId}/OrderHistory/{orderId}/Items/SubscriptionGeneralProduct";

/**
 * GET service to get all Product Review Details.
 * @property eb_OrderHistory.getSubscriptionItemService
 * @type {String}
 * */
eb_OrderHistory.getSubscriptionItemService = eb_OrderHistory.ServicePath + "ProfilePersons/{personId}/OrderHistory/{orderId}/Items/{orderLineSequence}/SubscriptionGeneralProduct";

/**
 * GET service to get the attendee details.
 * @property eb_OrderHistory.getEventItemService
 * @type {String}
 * */
eb_OrderHistory.getEventItemService = eb_OrderHistory.ServicePath + "ProfilePersons/{personId}/OrderHistory/{orderId}/Items/EventProduct";

/**
 * If Image is not available, then provide this image.
 * @property eb_OrderHistory.defaultImage
 * @type {String}
 * */
eb_OrderHistory.defaultImage = "../images/products/coming-soon.png";

/**
 * Redirect to product Details Page.
 * @property eb_OrderHistory.productDetailsURL
 * @type {String}
 * */
eb_OrderHistory.productDetailsURL = eb_OrderHistory.SitePath + "ProductDetails.html";

/**
 * Redirect to event Details Page
 * @property eb_OrderHistory.eventDetailsURL
 * @type {String}
 * */
eb_OrderHistory.eventDetailsURL = eb_OrderHistory.SitePath + "events/EventDetails.html";

/*If the default date is  "01/01/0001" in ship Date, then showing -- */
eb_OrderHistory.defaultDate = "01/01/0001";

/**
 * Render order history page.
 * @method eb_OrderHistory.render
 * @param {Object} options Array of required data.
 * @param {String} options.templatePath Order history template URL.
 * @return {String} Order history HTML template.
 * */
eb_OrderHistory.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            options.templatePath = eb_OrderHistory.SitePath + eb_OrderHistory.TemplatePath;
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
 * This method is used to get order history data.
 * @method eb_OrderHistory.OrderHistoryService
 * @param {String} personId Logged-in person Id.
 * @return {Object} jQuery promise object which when resolved returns order history data.
 */
eb_OrderHistory.OrderHistoryService = function (personId) {
    var defer = eBusinessJQObject.Deferred();
    var service = eb_OrderHistory.getOrderHistory;
    if (!personId) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }

    if (personId > 0) {
        service = eb_OrderHistory.getOrderHistory.replace("{personId}", personId);
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
 * @method eb_OrderHistory.orderLinesHistoryService
 * @param {String} personId Logged-in person Id.
 * @param {String} orderId OrderId.
 * @return {Object} jQuery promise object which when resolved returns order lines data.
 */
eb_OrderHistory.orderLinesHistoryService = function (personId, orderId) {
    var defer = eBusinessJQObject.Deferred();
    var service = eb_OrderHistory.getOrderHistory;

    if (!personId) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    if (!orderId) {
        throw { type: "argument_null", message: "orderId property is required.", stack: Error().stack };
    }
    if (personId > 0) {
        if (orderId > 0) {
            service = eb_OrderHistory.getOrderLineHistory.replace("{personId}", personId).replace("{orderId}", orderId);
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
 * GET service call method for getting subscription order line data.
 * @method eb_OrderHistory.getSubscriptionOrderLineItems
 * @param {String} orderLines List of products.
 * @param {String} orderId OrderId.
 * @param {String} personId Logged-in person Id.
 * @param {Number} orderLineSequence Order line sequence.
 * @return {Object} jQuery promise object which will return subscription order line data.
 */
eb_OrderHistory.getSubscriptionOrderLineItems = function (orderLines, orderId, personId, orderLineSequence) {
    var deferred = eBusinessJQObject.Deferred();
    if (!personId) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }

    if (!orderId) {
        throw { type: "argument_null", message: "orderId property is required.", stack: Error().stack };
    }

    var service = eb_OrderHistory.getSubscriptionItemsService;
    var subsData = [];
    var value = true;
    var orderLineRecord = ko.utils.arrayFirst(orderLines, function (item) {
        return item.isSubscription === value;
    });

    if (orderLineRecord) {
        if (orderId > 0) {
            service = eb_OrderHistory.getSubscriptionItemsService.replace("{personId}", personId).replace("{orderId}", orderId);
            if (orderLineSequence && orderLineSequence > 0) {
                service = eb_OrderHistory.getSubscriptionItemService.replace("{personId}", personId).replace("{orderId}", orderId).replace("{orderLineSequence}", orderLineSequence);
            }
        }

        eBusinessJQObject.get(
            {
                url: service,
                xhrFields: {
                    withCredentials: true
                }
            }
        ).done(function (data) {
            deferred.resolve(data);
        }).fail(deferred.reject);
    } else { deferred.resolve(subsData); }
    return deferred.promise();
};

/**
 * This method is used to get event cart items.
 * @method eb_OrderHistory.getEventCartItemsFromServer
 * @param {String} orderLinesItems List of products.
 * @param {String} orderId OrderId.
 * @param {String} personId Logged-in person Id.
 * @return {Object} jQuery promise object which when resolved returns event cart list data.
 */
eb_OrderHistory.getEventCartItemsFromServer = function (orderLinesItems, orderId, personId) {
    var def = eBusinessJQObject.Deferred();
    var subItems = [];
    var cartItem = ko.utils.arrayFirst(orderLinesItems, function (item) {
        return item.productType.toLowerCase() === "meeting";
    });
    if (cartItem) {
        eBusinessJQObject.get({
            url: eb_OrderHistory.getEventItemService.replace("{personId}", personId).replace("{orderId}", orderId),
            xhrFields: {
                withCredentials: true
            }
        }).done(function (result) {
            def.resolve(result);
        }).fail(def.reject);
    } else { def.resolve(subItems); }
    return def.promise();
};

/**
 * Order history model.
 * 
 * @method eb_OrderHistory.model
 * 
 * @param {Object} options Object of Order history data.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL.
 * @param {String} options.templatePath HTML path.
 * @param {String} options.personId: User Linked ID.
 * @param {Object} options.domElement Order history DOM element.
 * @param {Object} options.data List of orders.
 * 
 * */
eb_OrderHistory.model = function (options) {
    var _that = this;
    _that.domElement = options.domElement;
    _that.orderDetails = ko.observableArray(); /*Array for number for orders details*/
    _that.noOrderHistory = ko.observable(0);   /*If no data available, then it shows no data available*/
    _that.OrderHistoryAvailable = ko.observable();   /*If  data available, then it shows data available*/
    _that.sortData = ko.observable("");
    _that.filterData = ko.observable("");
    _that.showLoader = ko.observable(0);

    if (options.data) {
        _that.data = options.data;
    }

    if (options.personId) {
        eb_OrderHistory.personId = options.personId;
    } else {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }

    eb_OrderHistory.domElement(_that.domElement);

    /*Order Lines data*/
    _that.orderLinesData = function (data) {
        var self = this;
        if (data["webName"]) {
            self.name = ko.observable(data["webName"]);
        } else {
            self.name = ko.observable(data["productName"]);
        }
        var price = String(data["price"]);
        self.currency = ko.observable(data["currencySymbol"]);
        if (self.currency()) {
            self.currencySymbol = self.currency().trim();
        } else {
            self.currencySymbol = self.currency();
        }

        self.id = ko.observable(data["id"]);
        self.description = ko.observable(data["description"]);
        /*Kit Product*/
        self.subProductsList = ko.observableArray();
        self.isParentProduct = ko.observable(0);
        self.kitShow = ko.observable(0);
        /*Kit*/

        var negative = parseFloat(price) < 0;
        if (negative) {
            self.price = price.replace("-", "");
            self.currencySymbol = "-" + self.currency().trim();
            self.price = ko.observable(self.currencySymbol + parseFloat(self.price).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        } else {
            self.price = ko.observable(self.currencySymbol + parseFloat(data["price"]).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        }
        self.quantity = ko.observable(data["quantity"]);
        self.autoRenew = ko.observable(data["autoRenew"]);
        self.isSubscription = ko.observable(data["isSubscription"]);
        self.productCategory = ko.observable(data["productCategory"]);
        self.applyClass = ko.observable('');
        self.displayDetails = ko.observable('Show Details')
        self.sessionCollapse = ko.observable(0);

        self.attendeeId = ko.observable(data["attendeeId"]);

        if (self.productCategory() && self.productCategory().toLowerCase() === "fundraising") {
            self.applyClass('changeColor')
        }

        if (eb_Config.loadDefaultImage) {
            self.webImage = ko.observable(eb_OrderHistory.defaultImage);
        }
        else {
            self.webImage = ko.observable(eb_Config.thumbnailImageURL + data.productId + eb_Config.imageExtension);
        }

        self.productType = ko.observable(data["productType"]);
        self.productId = ko.observable(data["productId"]);
        self.parentProductId = ko.observable(data["parentproductId"]);
        self.discount = ko.observable(data["discount"]);

        var finalDiscountedPrice = data["price"] * (1 - data["discount"] / 100);
        self.finalPrice = ko.observable(parseFloat(finalDiscountedPrice).toFixed(eb_Config.roundOffDigitsAfterDecimal));

        /*Redirect to the product detail page.*/
        self.productNameDetails = function (item, e) {
            if (eb_OrderHistory.productDetailsURL || eb_OrderHistory.eventDetailsURL) {
                if (item.productType().toLowerCase() === "meeting") {
                    if (item.parentProductId() === 0) {
                        /*If it is main meeting then send productId*/
                        window.location.assign(eb_OrderHistory.eventDetailsURL + "?" + encodeURIComponent("ProductId") + "=" + encodeURIComponent(item.productId()));
                    } else {
                        /*If it is session then send parentProductId*/
                        window.location.assign(eb_OrderHistory.eventDetailsURL + "?" + encodeURIComponent("ProductId") + "=" + encodeURIComponent(item.parentProductId()));
                    }
                }
                /*To check whether the category is fundraising */
                else if (item.productCategory() && item.productCategory().toLowerCase() === "fundraising") {
                    e.preventDefault();
                }
                else {
                    window.location.assign(eb_OrderHistory.productDetailsURL + "?" + encodeURIComponent("productId") + "=" + encodeURIComponent(item.productId()));
                }
            }
            else {
                console.error("A redirection page is missing.");
            }
        };
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
    };

    /*Order Details.*/
    _that.orderDetailsData = function (data) {
        var self = this;
        self.orderID = ko.observable(data["id"]);
        self.orderStatus = ko.observable(data["orderStatus"]);
        /*Date Format*/
        self.orderDate = ko.computed(function () {
            return moment(data["orderDate"]).format(eb_Config.defaultDateFormat);
        });
        self.shipDate = ko.computed(function () {
            var shipDate = moment(data["shipDate"]).format(eb_Config.defaultDateFormat);
            if (eb_OrderHistory.defaultDate !== shipDate) {
                return shipDate;
            } else {
                return '--';
            }
        });
        self.shipmentMethod = ko.observable(data["shipmentMethod"]);
        self.orderType = ko.observable(data["orderType"]);
        self.shipToName = ko.observable(data["shipToName"]);
        self.currency = ko.observable(data["currencySymbol"]);
        self.currencySymbol = self.currency().trim();
        var orderTotal = String(data["subTotal"]);

        var negativeValue = parseFloat(orderTotal) < 0;
        if (negativeValue) {
            orderTotal = orderTotal.replace("-", "");
            self.currencySymbol = "-" + self.currency().trim();;
            self.subTotal = ko.observable(self.currencySymbol + parseFloat(orderTotal).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        } else {
            self.subTotal = ko.observable(self.currencySymbol + parseFloat(data["subTotal"]).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        }

        self.trackingNumber = ko.observable(data["trackingNumber"]);
        self.allOrderLines = ko.observableArray(); /*Array for number for orders lines*/
        self.toogleName = ko.observable('Show Details');
        self.displayBlock = ko.observable(1);
        self.discount = ko.observable("discount");

        var finalDiscountedPrice = data["price"] * (1 - data["discount"] / 100);
        self.finalPrice = ko.observable(parseFloat(finalDiscountedPrice).toFixed(eb_Config.roundOffDigitsAfterDecimal));

        /*get call for order lines data*/
        self.orderLinesHistoryData = function (personId, orderID) {
            return eb_OrderHistory.orderLinesHistoryService(personId, orderID);
        };

        /*get call for order lines data*/
        self.getSubscriptionOrderLineItems = function (orderLines, orderID, personId) {
            return eb_OrderHistory.getSubscriptionOrderLineItems(orderLines, orderID, personId);
        };

        /*get call for session*/
        self.getMeetingOrderLines = function (orderLines, orderID, personId) {
            return eb_OrderHistory.getEventCartItemsFromServer(orderLines, orderID, personId);
        };

        /*show order details.*/
        self.showOrderDetails = function (model, event) {
            /*To change the text name to ShowDetails/HideDetails */
            if (self.displayBlock() === 1) {
                self.toogleName('Hide Details');
                self.displayBlock(0);
                self.allOrderLines.removeAll();
                _that.showLoader(1);
                self.orderLinesHistoryData(eb_OrderHistory.personId, model.orderID()).done(function (orderLines) {
                    eBusinessJQObject.when(self.getMeetingOrderLines(orderLines, model.orderID(), eb_OrderHistory.personId),
                        self.getSubscriptionOrderLineItems(orderLines, model.orderID(), eb_OrderHistory.personId)).done(function (eventData, subscriptionData) {
                            eBusinessJQObject.map(orderLines, function (row) {
                                row.currencySymbol = self.currencySymbol;
                                if (row.parentId <= 0) {
                                    /*if product is subscription then get autoRenew field from another service call.*/
                                    if (row.isSubscription) {
                                        row = ko.utils.arrayFirst(subscriptionData, function (item) {
                                            return item.id === row.id;
                                        });
                                        row.currencySymbol = self.currencySymbol;
                                        if (!row)
                                            throw { type: "argument_mismatch", message: 'Subscription record does not exists in order line. ID: ' + id, stack: Error().stack };

                                        self.allOrderLines.push(new _that.orderLinesData(row));
                                    } else if (row.productType.toLowerCase() === "meeting") {
                                        var idToMatch = row.id;
                                        row = ko.utils.arrayFirst(eventData, function (cartItem) {
                                            return cartItem.id === row.id;
                                        });
                                        if (!row) {
                                            throw { type: "argument_mismatch", message: 'Meeting record does not exists in order line. ID: ' + idToMatch, stack: Error().stack };
                                        }
                                        row.currencySymbol = self.currencySymbol;
                                        productRecord = ko.utils.arrayFirst(self.allOrderLines(), function (item) {
                                            return item.productId() === Number(row.productId) && row.parentproductId <= 0;
                                        });

                                        if (row.parentproductId <= 0) {
                                            var cartItem;
                                            var record;
                                            var eventRec;
                                            if (productRecord) {
                                                cartItem = new _that.orderLinesData(row);
                                                productRecord.subProductsList.push(cartItem);
                                                for (record = 0; record < eventData.length; record++) {
                                                    if (eventData[record].attendeeId === cartItem.attendeeId() && eventData[record].parentproductId === cartItem.productId()) {
                                                        eventRec = eventData[record];
                                                        eventRec.currencySymbol = self.currencySymbol;
                                                        productRecord.subProductsList.push(new _that.orderLinesData(eventRec));
                                                    }
                                                }
                                            } else {
                                                cartItem = new _that.orderLinesData(row);
                                                self.allOrderLines.push(cartItem);
                                                self.allOrderLines()[self.allOrderLines.length].subProductsList.push(cartItem);
                                                for (record = 0; record < eventData.length; record++) {
                                                    if (eventData[record].attendeeId === cartItem.attendeeId() && eventData[record].parentproductId === cartItem.productId()) {
                                                        eventRec = eventData[record];
                                                        eventRec.currencySymbol = self.currencySymbol;
                                                        self.allOrderLines()[self.allOrderLines().length - 1].subProductsList.push(new _that.orderLinesData(eventRec));
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        self.allOrderLines.push(new _that.orderLinesData(row));
                                    }
                                } else {
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
                        }).fail(function (xhr, textStatus, errorThrow) {
                            console.info("getSubscriptionOrderLineItems failed:  " + xhr.responseText);
                        }).always(function (result) {
                            _that.showLoader(0);
                        });
                }).fail(function (xhr, textStatus, errorThrow) {
                    console.info("orderLinesHistoryData failed:  " + xhr.responseText);
                });

            } else {
                self.displayBlock(1);
                self.toogleName('Show Details');
            }
        };
    };

    /*Get Order history data from service.*/
    _that.getOrderHistoryDataFromServer = function () {
        return eb_OrderHistory.OrderHistoryService(eb_OrderHistory.personId);
    };

    /*load order history data*/
    _that.loadOrderHistoryDataFromServer = function (data) {
        if (data.length === 0) {
            _that.noOrderHistory(1);
        } else {
            _that.orderDetails.removeAll();
            _that.noOrderHistory(0);
            _that.OrderHistoryAvailable(1);
        }
        eBusinessJQObject.map(data, function (row) {
            _that.orderDetails.push(new _that.orderDetailsData(row));
        });
    };

    /*Load order history data.*/
    if (_that.data) {
        _that.loadOrderHistoryDataFromServer(_that.data);
    } else {
        _that.getOrderHistoryDataFromServer().done(function (loadData) {
            _that.loadOrderHistoryDataFromServer(loadData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getOrderHistoryDataFromServer failed:  " + xhr.responseText);
        });
    }
};

/*If image is not their, then attach no image found*/
ko.bindingHandlers.imageSrc = {
    update: function (element, valueAccessor) {
        var options = valueAccessor();
        var src = ko.unwrap(options.src);
        eBusinessJQObject('<img />').attr('src', src).on('load', function () {
            eBusinessJQObject(element).attr('src', src);
        }).on('error', function () {
            eBusinessJQObject(element).attr('src', eb_OrderHistory.defaultImage);
        });
    }
};

/**
 * Page DOM element.
 * @method eb_OrderHistory.domElement
 * @param {object} domElement current DOM element.
 * */
eb_OrderHistory.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_OrderHistory.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_OrderHistory);
});