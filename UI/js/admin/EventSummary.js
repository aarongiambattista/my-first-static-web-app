/**
 * Define Event Summary class.
 * @class eb_adminEventSummary
 * */
var eb_adminEventSummary = eb_adminEventSummary || {};

/**
 * Control level setting: Site path.
 * @property eb_adminEventSummary.SitePath
 * @type {String}
 */
eb_adminEventSummary.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_adminEventSummary.TemplatePath
 * @type {String}
 */
eb_adminEventSummary.TemplatePath = "html/events/EventSummary.html";

/**
 * The path to the eBusiness SOA layer.
 * @property eb_adminEventSummary.ServicePath
 * @type {String}
 */
eb_adminEventSummary.ServicePath = eb_Config.ServicePathV1;

/**
 * URL to get all Event Details.
 * @property eb_adminEventSummary.getEventDetail
 * @type {String}
 */
eb_adminEventSummary.getEventDetail = eb_adminEventSummary.ServicePath + "admin/company/{id}/Events/{eventId}";

/**
 * Default error message.
 * @property eb_adminEventSummary.defaultErrorMessage
 * @type {String}
 * */
eb_adminEventSummary.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/**
 * Render method for Event summary page.
 * Template path and DOM element are required parameters.
 * @method eb_adminEventSummary.render
 * @param {any} options Array of required data.
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * @return {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_adminEventSummary.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            var finalPath = eb_adminEventSummary.SitePath + eb_adminEventSummary.TemplatePath;
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
 * GET service call method for EventDetails.
 * @method eb_adminEventSummary.getEventDetails
 * @param {String} companyId Company ID.
 * @param {String} eventId Event ID.
 * @return {Object} jQuery promise object which when resolved returns list of events.
 */
eb_adminEventSummary.getEventDetails = function (companyId, eventId) {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for event details');

    if (companyId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing companyId.', stack: Error().stack };
    }

    if (!Number(companyId)) {
        throw { type: "argument_mismatch", message: 'Missing companyId.', stack: Error().stack };
    }
    if (eventId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    if (!Number(eventId)) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    eBusinessJQObject.get(
        {
            url: eb_adminEventSummary.getEventDetail.replace("{id}", companyId).replace("{eventId}", eventId),
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
 * Payment Summary Model object.
 * @method eb_adminEventSummary.model
 * @param {any} options Array of required data.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 * @param {Object} options.data Events List.
 */
eb_adminEventSummary.model = function (options, control) {
    var _that = this;
    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement property is required.", stack: Error().stack };
    }
    _that.domElement = options.domElement;

    if (options.data) {
        _that.data = options.data;
    }

    if (options.eventID) {
        _that.eventID = options.eventID;
    }

    if (options.companyId) {
        _that.companyId = options.companyId;
    }

    if (options.userContext) {
        _that.userContext = options.userContext;
    }

    _that.parentControl = control;

    eb_adminEventSummary.domElement(_that.domElement);
    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

    /*Data of summary widget*/
    _that.eventPrice = ko.observable();
    _that.noLocation = ko.observable(0);
    _that.locationAvailable = ko.observable(1);
    _that.showRegisterButton = ko.observable(0); /*show the register button*/
    _that.showBackToEventsButton = ko.observable(); /*show the Back To Events button*/
    _that.registerButton = ko.observable();
    _that.backToEventsButton = ko.observable();
    _that.errorMessage = ko.observable("");

    /*Load event summary details page*/
    _that.loadEventSummaryData = function (data) {
        _that.name = ko.observable(data['webName'] || data['name']);
        _that.venue = ko.observable(data['venue']);
        _that.startDate = ko.computed(function () {
            var checkStartDate = new Date(data['startDate']);
            return checkStartDate.getHours() === 0 && checkStartDate.getMinutes() === 0 && checkStartDate.getSeconds() === 0 ?
                moment(data['startDate']).format(eb_Config.defaultDateFormat) : moment(data['startDate']).format(eb_Config.eventsDateFormat);

        });
        _that.endDate = ko.computed(function () {
            var checkEndDate = new Date(data['endDate']);
            return checkEndDate.getHours() === 0 && checkEndDate.getMinutes() === 0 && checkEndDate.getSeconds() === 0 ?
                moment(data['endDate']).format(eb_Config.defaultDateFormat) : moment(data['endDate']).format(eb_Config.eventsDateFormat);
        });
        _that.defaultMemberPrice = ko.observable(parseFloat(data['defaultMemberPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        _that.nonMemberPrice = ko.observable(parseFloat(data['nonMemberPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        _that.defaultPrice = ko.observable(parseFloat(data['defaultPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        _that.retailPrice = ko.observable(parseFloat(data['retailPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        _that.hasComplexPricing = ko.observable(data['hasComplexPricing']);
        _that.currencySymbol = ko.observable(data['CurrencySymbol'] || data['currencySymbol']);
        _that.showCurrencySymbol = ko.observable('');
        _that.showPrice = ko.observable(0);
        _that.showPriceText = ko.observable(0);
        _that.addressLine1 = ko.observable(data['addressLine1']);
        _that.addressLine2 = ko.observable(data['addressLine2']);
        _that.addressCity = ko.observable(data['addressCity']);
        _that.addressStateProvince = ko.observable(data['addressStateProvince']);
        _that.addressPostalCode = ko.observable(data['addressPostalCode']);
        _that.addressCountry = ko.observable(data['addressCountry']);
        _that.nolocationAvailable = ko.observable('No Location Available');
        _that.hasSessions = ko.observable(data['hasSessions']);
        _that.eventId = ko.observable(data['id']);
        _that.fixedPanelEv = ko.observable('');
        _that.statusId = ko.observable(data['statusID']);
        _that.status = ko.observable(data['status']);

        _that.fullAddress = ko.computed(function () {
            var address = "";
            if (_that.venue()) {
                address += _that.venue() + " ";
            }
            if (_that.addressLine1()) {
                address += _that.addressLine1() + " ";
            }
            if (_that.addressLine2()) {
                address += _that.addressLine2() + " ";
            }
            if (_that.addressCity()) {
                address += _that.addressCity() + " ";
            }
            if (_that.addressStateProvince()) {
                address += _that.addressStateProvince() + " ";
            }
            if (_that.addressPostalCode()) {
                address += _that.addressPostalCode() + " ";
            }
            if (_that.addressCountry()) {
                address += _that.addressCountry() + " ";
            }
            return address;
        });
        /*Pricing scenario*/
        if (_that.defaultPrice() > 0) {
            _that.eventPrice = _that.defaultPrice();
        }
        else {
            _that.eventPrice = _that.retailPrice();
        }

        if (_that.hasComplexPricing()) {
            _that.showPrice(0);
            _that.showPriceText(1);
            _that.showCurrencySymbol("");
        }
        else {
            _that.showPrice(1);
            _that.showPriceText(0);
            _that.showCurrencySymbol(_that.currencySymbol());
        }

        if (!_that.venue() && !_that.addressLine1() && !_that.addressLine2()
            && !_that.addressCity() && !_that.addressStateProvince() && !_that.addressPostalCode() && !_that.addressCountry()) {
            _that.noLocation(1);
            _that.locationAvailable(0);
        }

        _that.availableSpace = ko.observable(data['availableSpace']);
        _that.maxSpace = ko.observable(data['maxSpace']);
        _that.requireAvailableSpace = ko.observable(data['requireAvailableSpace']);

        var currentDate = new Date();
        currentDate = currentDate.getHours() === 0 && currentDate.getMinutes() === 0 && currentDate.getSeconds() === 0 ?
            moment(currentDate).format(eb_Config.defaultDateFormat) : moment(currentDate).format(eb_Config.eventsDateFormat);

        /*If the status of the event is "Planned", only then consider showing Register button. For "Occurred" and "Cancelled", hide Register button.*/
        if (_that.statusId() === 1) {
            /*Show Register button only if end date is a future date.*/
            if (moment(_that.endDate()).isAfter(currentDate)) {
                _that.showRegisterButton(1);
            }
        }
        
    };
    /* The Summary Widget at the right side of the page will be fixed on scrolling */

    var winObject = eBusinessJQObject(window);
    winObject.scroll(function () {
        if (winObject.scrollTop() >= 50) {
            summaryStartScrolling();
        } else {
            summaryStopScrolling();
        }
    });

    function summaryStartScrolling() {
        _that.fixedPanelEv("fixedPanelEvent");
    }

    function summaryStopScrolling() {
        _that.fixedPanelEv("");
    }

    /*Get event details*/
    _that.getEventDetailsFromServer = function () {
        return eb_adminEventSummary.getEventDetails(_that.companyId,_that.eventID);
    };

    /*If the data is available, then directly bind it*/
    if (_that.data) {
        _that.loadEventSummaryData(_that.data);
    }
    else {
        _that.getEventDetailsFromServer().done(function (summaryData) {
            _that.loadEventSummaryData(summaryData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getEventDetailsFromServer failed:  " + xhr.responseText);
        });
    }

    /*To register attendee in event*/
    _that.summaryButtonClick = function () {
        if (_that.parentControl) {
            _that.parentControl.eventSummaryButtonClick();
        }
    };
};

/**
 * Page DOM element.
 * @method eb_adminEventSummary.domElement
 * @param {object} domElement current DOM element.
 * */
eb_adminEventSummary.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_adminEventSummary.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_adminEventSummary);
});