/**
 * Event Catalog class.
 * @class eb_eventCatalog
 * */
var eb_eventCatalog = eb_eventCatalog || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_eventCatalog.SitePath
 * @type {String}
 * */
eb_eventCatalog.SitePath = eb_Config.SitePath;

/**
 * Event catalog template path.
 * @property eb_eventCatalog.TemplatePath
 * @type {String}
 * */
eb_eventCatalog.TemplatePath = "html/events/EventCatalog.html";

/**
 * SOA path.
 * @property eb_eventCatalog.ServicePath
 * @type {String}
 * */
eb_eventCatalog.ServicePath = eb_Config.ServicePathV1;

/**
 * Service path to get all events.
 * @property eb_eventCatalog.getAllEventsService
 * @type {String}
 * */
eb_eventCatalog.getAllEventsService = eb_eventCatalog.ServicePath + "Events?TopLevelOnly=true";

/**
 * Service path to get all events which is registered by logged-in user.
 * @property eb_eventCatalog.getMyEventsURL
 * @type {String}
 * */
eb_eventCatalog.getMyEventsURL = eb_eventCatalog.ServicePath + "ProfilePersons/{LinkId}/Events?TopLevelOnly=true";

/**
 * Default image URL.
 * If event photo is not available, default image will be shown.
 * @property eb_eventCatalog.defaultImage
 * @type {String}
 * */
eb_eventCatalog.defaultImage = "../images/products/coming-soon.png";

/**
 * Site path to get event details.
 * @property eb_eventCatalog.productDetailsURL
 * @type {String}
 * */
eb_eventCatalog.productDetailsURL = eb_eventCatalog.SitePath + 'events/EventDetails.html';

/*Page size option list for product catalog*/
eb_eventCatalog.pageSizeOptionsList = [12, 24, 48, 96];

/*Current page Size*/
eb_eventCatalog.currentPageSize = 12;

/**
 * The service will return event catalog HTML.
 * Template path and DOM element are required parameters.
 * @method eb_eventCatalog.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Events catalog template URL.
 * @return {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_eventCatalog.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_eventCatalog.SitePath + eb_eventCatalog.TemplatePath;
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

/*Handle the response from the server input */
eb_eventCatalog.HandleResponse = function (data) {
    //Todo: Handle response from server
};

/*A list of known service responses and the messages that should be displayed to the user in the event that they are recieved.*/
eb_eventCatalog.KnownResponses = [{ code: "Error", message: "There was a problem loading the page" }
    , { code: "Failure", message: "Your request could not be completed." }];

/**
 * Get events data from the server through the get service call.
 * The service will return list of all events.
 * @method eb_eventCatalog.getEvents
 * @return {Object} jQuery promise object which when resolved returns list of all events.
 */
eb_eventCatalog.getEvents = function () {
    var defer = eBusinessJQObject.Deferred();
    console.info('service call for all events');
    var serviceURL = eb_eventCatalog.getAllEventsService;

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
 * Get events to which user has registered from the server through the get service call.
 * The service will return list of all events to which logged-in user is registered.
 * @method eb_eventCatalog.getMyEvents
 * @param {String} url URL for my-events service.
 * @return {Object} jQuery promise object which when resolved returns list of all events to which logged-in user is registered.
 */
eb_eventCatalog.getMyEvents = function (url) {
    var defer = eBusinessJQObject.Deferred();
    console.info('service call for my-events');
    eBusinessJQObject.ajax({
        url: url,
        xhrFields: {
            withCredentials: true
        }
    }).done(function (result) {
        defer.resolve(result);
    }).fail(defer.reject);
    return defer.promise();
};


/**
 * List of event product properties on which search is applied.
 * @method eb_eventCatalog.fieldsToSearch
 * @return {Object} Array of event product name property.
 */
eb_eventCatalog.fieldsToSearch = function () {
    return ["id", "name", "webDescription"];
};

/**
 * Event catalog model responsible to all event catalog operations.
 * 
 * @method eb_eventCatalog.model
 * 
 * @param {any} options Object of event catalog data.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL.
 * @param {String} options.templatePath HTML path.
 * @param {String} options.currentUserLoggedInID: User Linked ID.
 * @param {Object} options.domElement Event catalog DOM element.
 * @param {Object} options.data List of all events.
 * @param {Object} options.shoppingCart eb_shoppingCart.shoppingCartModel instance.
 * 
 * */
eb_eventCatalog.model = function (options) {
    var _that = this;
    /*Search text-box value binding. When user stops typing in search text-box, then search function will be called with 500 milliseconds delay.*/
    _that.search = ko.observable("").extend({ rateLimit: { method: "notifyWhenChangesStop", timeout: 500 } });
    _that.eventsObserver = ko.observable();/*To hold events list.*/
    _that.noMyEvents = ko.observable(false);/*To show the error template for my-events.*/
    _that.myEvents = ko.observable(false);/*By Default myEvents un-checked*/
    _that.filterCollapse = ko.observable(0); /*To collapse filter on mobile*/

    /*Gets executed on my-events check-box value change.
     When check-box value is true, call my-events service.
     When check-box value is false, call all-events service.
     After data is returned, mutate the observable properties so that corresponding computed functions gets invoked.
     If no data returned, empty the category-name array and enable corresponding message templates.
     */
    _that.myEvents.subscribe(function (val) { 
        if (_that.myEvents()) {
            var defer = eBusinessJQObject.Deferred();
            var serviceURL = eb_eventCatalog.getMyEventsURL.replace("{LinkId}", options.currentUserLoggedInID);
            eb_eventCatalog.getMyEvents(serviceURL).done(function (result) {      /*service call for my-events.*/
                if (result.length) {
                    _that.noMyEvents(false);
                    _that.categoryCollection([]);
                    _that.events('');
                    _that.events(_that.extractModels(_that, result, eb_eventCatalog.eventModel));
                    _that.catergoryFilter('All');
                    _that.catergoryFilter.valueHasMutated();
                }
                else {
                    _that.noMyEvents(true);
                    _that.categoryCollection([]);
                    _that.events('');
                    _that.eventsObserver(result);
                }
            }).fail(function (result) {
                defer.reject(result);
            });
        }
        else {
            eb_eventCatalog.getEvents().done(function (result) {              /*service call for all-events.*/
                if (result.length) {
                    _that.noMyEvents(false);
                    _that.categoryCollection([]);
                    _that.events('');
                    _that.events(_that.extractModels(_that, result, eb_eventCatalog.eventModel));
                    _that.catergoryFilter('All');
                    _that.catergoryFilter.valueHasMutated();
                }
                else {
                    _that.noMyEvents(false);
                    _that.events('');
                    _that.categoryCollection([]);
                    _that.eventsObserver(result);
                }
            }).fail(function (result) {
                defer.reject(result);
            });
        }

        return true;
    });

    _that.catergoryFilter = ko.observable("All");     /*By default ALL types of Events*/
    /* Filter control show hide on mobile device*/
    _that.toggleFilterControl = function () {
        _that.filterCollapse(!_that.filterCollapse());
    };
     /*On-click filter will trigger this function.*/
    _that.catergoryFilter.subscribe(function (value) {                 
        var result = [];
        if (value === 'All') {
            _that.eventsObserver(_that.events());
            return;
        }

        for (var record = 0; record < _that.categoryCollection().length; record++) {
            if (_that.categoryCollection()[record].name() === value) {
                result.push(_that.categoryCollection()[record].records());
                break;
            }
        }
        _that.eventsObserver(result[0]);
    });

     /*sort event category name array.*/
    _that.sortByCategoryName = function () {                       
        var collection = _that.categoryCollection();
        collection.sort(function (a, b) {
            return (a.name()).localeCompare(b.name());          
        });
        _that.categoryCollection(collection);
    };

    _that.categoryCollection = ko.observableArray();  /*category object collection*/

    /*category object containing category name and corresponding records.*/
    _that.categories = function (categoryName, record) {            
        var self = this;
        self.name = ko.observable(categoryName);
        self.records = ko.observableArray();
        self.records.push(record);
    };

    /*Function to extract event models.
     Convert the event object to model.
     Create array of events according to category.
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
                _that.categoryCollection.push(new _that.categories(row.productCategory, model));      
            }

        }

        _that.sortByCategoryName();     
        return models;
    };

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement property is required.", stack: Error().stack };
    }

    _that.domElement = options.domElement;
    if (options.data) {
        _that.data = options.data;
    }

    if (options.shoppingCart) {
        eb_eventCatalog.shoppingCart(options.shoppingCart);
    }

    eb_eventCatalog.domElement(_that.domElement);

    /* Load events data, apply paginations and filters on data.*/
    _that.loadEventsData = function (data) {
        _that.events = ko.observable();     /*To hold all events or my-events list.*/
        _that.events(_that.extractModels(_that, data, eb_eventCatalog.eventModel));
        /* Trigger subscribe method of catergoryFilter explicitly to get _that.eventsObserver and pass to search function */
        _that.catergoryFilter.valueHasMutated();

        /* This function will be triggered whenever there is change in search text-box or _that.eventsObserver */
        _that.resultRecords = ko.computed(function () {
            var res = new eb_eventCatalog.searchRecords(_that.search(), eb_eventCatalog.fieldsToSearch(), _that.eventsObserver());
            return res;
        });
        /* Pass the search method's return value to this method so that whenever above search is triggered
          this method also gets triggered.*/
        _that.pager = ko.computed(function () {
            var res = new eb_eventCatalog.pagerModel(_that.resultRecords().filteredRecords());
            return res;
        });
    };

    /*check event data and load on page.*/
    if (!_that.data) {
        data = {};
    }
    else {
        _that.loadEventsData(_that.data);
    }

    /* To Hide the My events field if the User is not logged in. */
    _that.doShowMyEvents = ko.observable(options.currentUserLoggedInID);
};

/**
 * Global function to hold shopping cart object.
 * @method eb_eventCatalog.shoppingCart
 * @param {Object} shoppingCart Instance of eb_shoppingCart.shoppingCartModel.
 */
eb_eventCatalog.shoppingCart = function (shoppingCart) {
    var self = this;
    self.shoppingCart = shoppingCart;
};

/**
 * Event product model.
 * Converts event object into knockout model.
 * @method eb_eventCatalog.eventModel
 * @param {Object} data Event object.
 */
eb_eventCatalog.eventModel = function (data) {
    var self = this;
    self.parentProductId = ko.observable(data['parentProductId']);
    self.id = ko.observable(data['id']);
    var desc = eBusinessJQObject("<html>" + data['webDescription'] + "</html>").text();
    self.webDescription = ko.observable(desc);
    self.webLongDescription = ko.observable(data['webLongDescription']);
    self.name = ko.observable(data['name']);
    self.webName = ko.observable(data['webName']);

    if (eb_Config.loadDefaultImage) {
        self.webImage = ko.observable(eb_eventCatalog.defaultImage);
    }
    else {
        self.webImage = ko.observable(eb_Config.thumbnailImageURL + self.id() + eb_Config.imageExtension);
    }
    
    self.productCategory = ko.observable(data['productCategory']);

    /*For address */
    self.addressCity = ko.observable(data['addressCity']);
    self.addressCountry = ko.observable(data['addressCountry']);
    self.addressLine1 = ko.observable(data['addressLine1']);
    self.addressLine2 = ko.observable(data['addressLine2']);
    self.addressPostalCode = ko.observable(data['addressPostalCode']);
    self.addressStateProvince = ko.observable(data['addressStateProvince']);

    /*To show Prices based on person category.*/
    self.defaultMemberPrice = ko.observable(parseFloat(data['defaultMemberPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
    self.nonMemberPrice = ko.observable(parseFloat(['nonMemberPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
    self.defaultPrice = ko.observable(parseFloat(data['defaultPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
    self.retailPrice = ko.observable(parseFloat(data['retailPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
    self.currencyId = ko.observable(data['currencyId']);
    self.currencySymbol = ko.observable(data['currencySymbol']);
    self.hasComplexPricing = ko.observable(data['hasComplexPricing']);

    /* To venue details */
    self.venue = ko.observable(data['venue']);
    self.availableSpace = ko.observable(data['availableSpace']);
    self.hasScheduledSpeakers = ko.observable(data['hasScheduledSpeakers']);
    self.hasSessions = ko.observable(data['hasSessions']);
    self.hasSponsors = ko.observable(data['hasSponsors']);
    self.maxSpace = ko.observable(data['maxSpace']);
    self.requireAvailableSpace = ko.observable(data['requireAvailableSpace']);

    /* start/end date */
    self.startDate = ko.computed(function () {
        var checkTime = new Date(data['startDate']);
        return checkTime.getHours() === 0 && checkTime.getMinutes() === 0 && checkTime.getSeconds() === 0 ?
            moment(data['startDate']).format(eb_Config.defaultDateFormat) : moment(data['startDate']).format(eb_Config.eventsDateFormat);
    });
    self.endDate = ko.observable(data['endDate']);

    /* Early registraion */
    self.earlyRegistrationDiscount = ko.observable(data['earlyRegistrationDiscount']);
    self.earlyRegistrationDate = ko.observable(data['earlyRegistrationDate']);

    /* Late registration */ 
    self.lateRegistrationDate = ko.observable(data['lateRegistrationDate']);
    self.lateRegistrationFee = ko.observable(data['lateRegistrationFee']);

    /* Regular registration */  
    self.regularRegistrationDate = ko.observable(data['regularRegistrationDate']);

    /* Navigate to event detail page. */
    self.eventNameDetails = function (item) {
        if (eb_eventCatalog.productDetailsURL) {
            window.location.assign(eb_eventCatalog.productDetailsURL + "?" + "productId=" + encodeURIComponent(item.id()));
        }
        else {
            console.error("No Information is available");
        }
    };
};

/**
 * Pagination model.
 * Contains computed functions that get invoked when page size change or page navigation.
 * @method eb_eventCatalog.pagerModel
 * @param {Object} records Events list.
 */
eb_eventCatalog.pagerModel = function (records) {
    var self = this;
    self.pageSizeOptions = ko.observableArray(eb_eventCatalog.pageSizeOptionsList);
    self.records = getObservableArray(records);     /* Declaring as getObservableArray will trigger the corresponding computed functions whenever there is change in self.records().*/
    self.currentPageIndex = ko.observable(self.records().length > 0 ? 0 : -1);
    self.currentPageSize = ko.observable(eb_eventCatalog.currentPageSize);

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
 * Events search function.
 * @method eb_eventCatalog.searchRecords
 * @param {String} toSearch Value entered in search text-box field.
 * @param {Object} fields Array of event product properties on which search will be performed.
 * @param {Object} eventsList List of events models.
 */
eb_eventCatalog.searchRecords = function (toSearch, fields, eventsList) {
    var _that = this;

    _that.filteredRecords = ko.computed(function () {
        var filteredRecords = [];
        var ifFound = false;
        var item;

        for (var record = 0; record < eventsList.length; record++) {

            for (var field = 0; field < fields.length; field++) {
                /*check whether the field is observable or not and access the value according to it.*/
                if (ko.isObservable(eventsList[record][fields[field]]))
                    item = eventsList[record][fields[field]]();
                else
                    item = eventsList[record][fields[field]];

                if (item.toString().toLowerCase().indexOf(toSearch.toLowerCase()) !== -1) {
                    ifFound = true;
                    break;
                }
            }
            if (ifFound) {
                filteredRecords.push(eventsList[record]);
                ifFound = false;
            }
        }

        return filteredRecords;
    });

};

/*If image is not their, then attach no image found*/
ko.bindingHandlers.imageSrc = {
    update: function (element, valueAccessor) {
        var options = valueAccessor();
        var src = ko.unwrap(options.src);
        eBusinessJQObject('<img />').attr('src', src).on('load', function () {
            eBusinessJQObject(element).attr('src', src);
        }).on('error', function () {
            eBusinessJQObject(element).attr('src', eb_eventCatalog.defaultImage);
        });
    }
};

/**
 * Page DOM element.
 * @method eb_eventCatalog.domElement
 * @param {object} domElement current DOM element.
 * */
eb_eventCatalog.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_eventCatalog.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_eventCatalog);
});