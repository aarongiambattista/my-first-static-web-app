/**
 * Event Catalog Admin class.
 * @class eb_EventCatalogAdmin
 * */
var eb_EventCatalogAdmin = eb_EventCatalogAdmin || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_EventCatalogAdmin.SitePath
 * @type {String}
 * */
eb_EventCatalogAdmin.SitePath = eb_Config.SitePath;

/**
 * Event catalog Admin template path.
 * @property eb_EventCatalogAdmin.TemplatePath
 * @type {String}
 * */
eb_EventCatalogAdmin.TemplatePath = "html/admin/EventCatalog.html";

/**
 * SOA path.
 * @property eb_EventCatalogAdmin.ServicePath
 * @type {String}
 * */
eb_EventCatalogAdmin.ServicePath = eb_Config.ServicePathV1;

/**
 * Service path to get all upcoming events.
 * @property eb_EventCatalogAdmin.getUpcomingEventsService
 * @type {String}
 * */
eb_EventCatalogAdmin.getUpcomingEventsService = eb_EventCatalogAdmin.ServicePath + "admin/company/{id}/Events/Upcoming?TopLevelOnly=true";

/**
 * Service path to get all past events.
 * @property eb_EventCatalogAdmin.getPastEventsService
 * @type {String}
 * */
eb_EventCatalogAdmin.getPastEventsService = eb_EventCatalogAdmin.ServicePath + "admin/company/{id}/Events/Past?TopLevelOnly=true";

/**
 * Default image URL.
 * If event photo is not available, default image will be shown.
 * @property eb_EventCatalogAdmin.defaultImage
 * @type {String}
 * */
eb_EventCatalogAdmin.defaultImage = "../images/products/coming-soon.png";

/**
 * Site path to get event details.
 * @property eb_EventCatalogAdmin.productDetailsURL
 * @type {String}
 * */
eb_EventCatalogAdmin.productDetailsURL = eb_EventCatalogAdmin.SitePath + 'admin/EventDetails.html';

/**
 * Site path to get event members.
 * @property eb_EventCatalogAdmin.eventMembersURL
 * @type {String}
 * */
eb_EventCatalogAdmin.eventMembersURL = eb_EventCatalogAdmin.SitePath + 'admin/EventMembers.html';


/*Company Id of selected company from dropdown.*/
eb_EventCatalogAdmin.companyId = 0;

/**
 * The service will return event catalog admin HTML.
 * Template path and DOM element are required parameters.
 * @method eb_EventCatalogAdmin.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Events catalog admin template URL.
 * @return {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_EventCatalogAdmin.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_EventCatalogAdmin.SitePath + eb_EventCatalogAdmin.TemplatePath;
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
 * Get upcoming events data from the server through the get service call.
 * The service will return list of all upcoming events.
 * @method eb_EventCatalogAdmin.getUpcomingEvents
 * @return {Object} jQuery promise object which when resolved returns list of all upcoming events.
 */
eb_EventCatalogAdmin.getUpcomingEvents = function (companyId) {
    var defer = eBusinessJQObject.Deferred();
    console.info('service call for all upcoming events');
    var serviceURL = eb_EventCatalogAdmin.getUpcomingEventsService.replace("{id}", companyId);

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
 * Get past events from the server through the get service call.
 * The service will return list of all past events.
 * @method eb_EventCatalogAdmin.getPastEvents
 * @return {Object} jQuery promise object which when resolved returns list of all past events.
 */
eb_EventCatalogAdmin.getPastEvents = function (companyId) {
    var defer = eBusinessJQObject.Deferred();
    console.info('service call for past events');
    var serviceURL = eb_EventCatalogAdmin.getPastEventsService.replace("{id}", companyId);
    eBusinessJQObject.ajax({
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
 * List of event product properties on which search is applied.
 * @method eb_EventCatalogAdmin.fieldsToSearch
 * @return {Object} Array of event product name property.
 */
eb_EventCatalogAdmin.fieldsToSearch = function () {
    return ["id", "name", "webDescription"];
};

/**
 * Event catalog admin model responsible for all event catalog operations.
 * @method eb_EventCatalogAdmin.model
 * @param {any} options Object of event catalog admin data.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL.
 * @param {String} options.templatePath HTML path.
 * @param {Object} options.domElement Event catalog admin DOM element.
 * @param {Object} options.data List of all events. 
 * */
eb_EventCatalogAdmin.model = function (options) {
    var _that = this;
    _that.domElement = options.domElement;
    _that.userContext = options.userContext;
    eb_EventCatalogAdmin.domElement(_that.domElement);
    eb_EventCatalogAdmin.companyId = _that.userContext.companyId();

    _that.companyId = ko.observable(eb_EventCatalogAdmin.companyId);
    _that.companyName = ko.observable(_that.userContext.CompanyName());

    /*Search text-box value binding. When user stops typing in search text-box, then search function will be called with 500 milliseconds delay.*/
    _that.search = ko.observable("").extend({ rateLimit: { method: "notifyWhenChangesStop", timeout: eb_Config.companyAdminSearchTimeOut } });
    _that.eventsObserver = ko.observable(); /*To hold unfiltered events list.*/
    _that.events = ko.observable();     /*To hold all upcoming events or past events list.*/
    _that.eventsList = ko.observable(); /*To hold the filtered list of events. This is bound to the HTML.*/
    _that.categoryCollection = ko.observableArray();  /*category object collection*/
    _that.categoryFilter = ko.observable("All");     /*By default ALL types of Events*/
    _that.noEvents = ko.observable(false);/*To show the error template for no events availability.*/
    _that.filterCollapse = ko.observable(0); /*To collapse filter on mobile*/
    _that.confirmedCount = ko.observable(); /*To hold number of confirmed attendees*/
    _that.waitListCount = ko.observable();  /*To hold number of attendees in waitlist*/
    _that.allCount = ko.observable();  /*To hold number of all attendees(confirmed + waitlist)*/
    _that.showLoader = ko.observable(0);
    _that.upcomingEventsClicked = ko.observable(1);  /*To highlight the Upcoming Events as active link*/
    _that.pastEventsClicked = ko.observable(0);  /*To highlight the Past Events as active link*/

    _that.upcomingEvents = function () {
        _that.showLoader(1);
        _that.upcomingEventsClicked(1);
        _that.pastEventsClicked(0);
        eb_EventCatalogAdmin.getUpcomingEvents(eb_EventCatalogAdmin.companyId).done(function (upcomingEvents) {      /*service call for upcoming events.*/
            if (upcomingEvents.length) {
                _that.noEvents(false);
                _that.categoryCollection([]);
                _that.events('');
                _that.events(_that.extractModels(_that, upcomingEvents, eb_EventCatalogAdmin.eventModel));
                _that.categoryFilter('All');
                _that.categoryFilter.valueHasMutated();
                _that.showLoader(0);
            }
            else {
                _that.noEvents(true);
                _that.categoryCollection([]);
                _that.events('');
                _that.categoryFilter('All');
                _that.eventsObserver(upcomingEvents);
                _that.showLoader(0);
            }
        }).fail(function (xhr, textStatus, errorThrow) {
            _that.showLoader(0);
            console.info("getUpcomingEvents failed:  " + xhr.responseText);
            eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_EventCatalogAdmin);
        });
    };

    _that.pastEvents = function () {
        _that.showLoader(1);
        _that.upcomingEventsClicked(0);
        _that.pastEventsClicked(1);
        eb_EventCatalogAdmin.getPastEvents(eb_EventCatalogAdmin.companyId).done(function (pastEvents) {      /*service call for past events.*/
            if (pastEvents.length) {
                _that.noEvents(false);
                _that.categoryCollection([]);
                _that.events('');
                _that.events(_that.extractModels(_that, pastEvents, eb_EventCatalogAdmin.eventModel));
                _that.categoryFilter('All');
                _that.categoryFilter.valueHasMutated();
                _that.showLoader(0);
            }
            else {
                _that.noEvents(true);
                _that.categoryCollection([]);
                _that.events('');
                _that.categoryFilter('All');
                _that.eventsObserver(pastEvents);
                _that.showLoader(0);
            }
        }).fail(function (xhr, textStatus, errorThrow) {
            _that.showLoader(0);
            console.info("getPastEvents failed:  " + xhr.responseText);
            eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_EventCatalogAdmin);
        });
    };

    
    /* Filter control show hide on mobile device*/
    _that.toggleFilterControl = function () {
        _that.filterCollapse(!_that.filterCollapse());
    };
    /*On-click filter will trigger this function.*/
    _that.categoryFilter.subscribe(function (value) {
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

    if (options.data) {
        _that.data = options.data;
    }

    /* Load events data, apply paginations and filters on data.*/
    _that.loadEventsData = function (data) {
        _that.events(_that.extractModels(_that, data, eb_EventCatalogAdmin.eventModel));

        /* Trigger subscribe method of categoryFilter explicitly to get _that.eventsObserver and pass to search function */
        _that.categoryFilter.valueHasMutated();

        /* This function will be triggered whenever there is change in search text-box or _that.eventsObserver */
        _that.resultRecords = ko.computed(function () {
            var res = new eb_EventCatalogAdmin.searchRecords(_that.search(), eb_EventCatalogAdmin.fieldsToSearch(), _that.eventsObserver());
            return res;
        });

        /* Pass the search method's return value to this method so that whenever above search is triggered
          this method also gets triggered.*/
        _that.filteredEvents = ko.computed(function () {
            if (!_that.resultRecords().filteredRecords().length) {
                _that.noEvents(1);
            }
            else {
                _that.noEvents(0);
            }
            _that.eventsList(_that.resultRecords().filteredRecords());
        });
    };

    /*check event data and load on page.*/
    if (!_that.data) {
        _that.upcomingEvents();
    }
    else {
        _that.loadEventsData(_that.data);
    }

};

/**
 * Event product model.
 * Converts event object into knockout model.
 * @method eb_EventCatalogAdmin.eventModel
 * @param {Object} data Event object.
 */
eb_EventCatalogAdmin.eventModel = function (data, parent) {
    var self = this;
    self.id = ko.observable(data['id']);
    var desc = eBusinessJQObject("<html>" + data['webDescription'] + "</html>").text();
    self.webDescription = ko.observable(desc);
    self.name = ko.observable(data['name']);

    if (eb_Config.loadDefaultImage) {
        self.webImage = ko.observable(eb_EventCatalogAdmin.defaultImage);
    }
    else {
        self.webImage = ko.observable(eb_Config.thumbnailImageURL + self.id() + eb_Config.imageExtension);
    }

    self.productCategory = ko.observable(data['productCategory']);

    /* To venue details */
    self.venue = ko.observable(data['venue'] || "--");

    /* start/end date */
    self.startDate = ko.computed(function () {
        var checkTime = new Date(data['startDate']);
        return checkTime.getHours() === 0 && checkTime.getMinutes() === 0 && checkTime.getSeconds() === 0 ?
            moment(data['startDate']).format(eb_Config.defaultDateFormat) : moment(data['startDate']).format(eb_Config.eventsDateFormat);
    });

    self.totalConfirmed = ko.observable(data['TotalRegistrants']);
    self.totalWaitlist = ko.observable(data['TotalWaitList']);
    self.totalAttendees = ko.observable(data['TotalAttendees']);

    /* Navigate to event detail page. */
    self.eventNameDetails = function (item) {
        self.resaveCompanyInfo();
            if (eb_EventCatalogAdmin.productDetailsURL) {
                window.location.assign(eb_EventCatalogAdmin.productDetailsURL + "?" + "productId=" + encodeURIComponent(item.id()));
            }
            else {
                console.error("No Information is available");
            }
    
    };

    /* Navigate to event members page. */
        self.eventMembers = function (item, event) {
            self.resaveCompanyInfo();
            var innerHTMLText = event.currentTarget.innerText.split(" ");
            var registrationType = innerHTMLText[1];
            if (eb_EventCatalogAdmin.eventMembersURL) {
                window.location.assign(eb_EventCatalogAdmin.eventMembersURL + "?" + "productId=" + encodeURIComponent(item.id()) + "&" + "registrationType=" + registrationType);
            }
            else {
                console.error("No Information is available");
            }
        };

    /*Resave company Id and company name in session storage in order to avoid session expiry*/
    self.resaveCompanyInfo = function () {
        var dataOut = { companyId: parent.companyId(), CompanyName: parent.companyName() };
        var fields = ['companyId', 'CompanyName'];
        parent.userContext.Load(dataOut);
        parent.userContext.saveUpdateCache(fields, dataOut);
    }
};

/**
 * Events search function.
 * @method eb_EventCatalogAdmin.searchRecords
 * @param {String} toSearch Value entered in search text-box field.
 * @param {Object} fields Array of event product properties on which search will be performed.
 * @param {Object} eventsList List of events models.
 */
eb_EventCatalogAdmin.searchRecords = function (toSearch, fields, eventsList) {
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

/*If image is not there, then attach no image found*/
ko.bindingHandlers.imageSrc = {
    update: function (element, valueAccessor) {
        var options = valueAccessor();
        var src = ko.unwrap(options.src);
        eBusinessJQObject('<img />').attr('src', src).on('load', function () {
            eBusinessJQObject(element).attr('src', src);
        }).on('error', function () {
            eBusinessJQObject(element).attr('src', eb_EventCatalogAdmin.defaultImage);
        });
    }
};

/**
 * Page DOM element.
 * @method eb_EventCatalogAdmin.domElement
 * @param {object} domElement current DOM element.
 * */
eb_EventCatalogAdmin.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_EventCatalogAdmin.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_EventCatalogAdmin);
});