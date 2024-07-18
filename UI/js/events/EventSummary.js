/**
 * Define Event Summary class.
 * @class eb_eventSummary
 * */
var eb_eventSummary = eb_eventSummary || {};

/**
 * Control level setting: Site path.
 * @property eb_eventSummary.SitePath
 * @type {String}
 */
eb_eventSummary.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_eventSummary.TemplatePath
 * @type {String}
 */
eb_eventSummary.TemplatePath = "html/events/EventSummary.html";

/**
 * The path to the eBusiness SOA layer.
 * @property eb_eventSummary.ServicePath
 * @type {String}
 */
eb_eventSummary.ServicePath = eb_Config.ServicePathV1;

/**
 * Redirect to Event Add Page URL.
 * @property eb_eventSummary.eventRegistration
 * @type {String}
 */
eb_eventSummary.eventRegistration = 'events/EventRegistration.html';

/**
 * URL to get all Event Details.
 * @property eb_eventSummary.getEventDetail
 * @type {String}
 */
eb_eventSummary.getEventDetail = eb_eventSummary.ServicePath + "Events/{eventId}";

/**
 * URL to get all user's Event list.
 * @property eb_eventSummary.getMyEventsURL
 * @type {String}
 */
eb_eventSummary.getMyEventsURL = eb_eventSummary.ServicePath + "ProfilePersons/{LinkId}/Events?TopLevelOnly=true";

/**
 * Default error message.
 * @property eb_eventSummary.defaultErrorMessage
 * @type {String}
 * */
eb_eventSummary.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';


/**
 * Render method for Event summary page.
 * Template path and DOM element are required parameters.
 * @method eb_eventSummary.render
 * @param {any} options Array of required data.
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * @return {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_eventSummary.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            var finalPath = eb_eventSummary.SitePath + eb_eventSummary.TemplatePath;
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

/*Known Responses*/
eb_eventSummary.knownResponses = [];

/**
 * GET service call method for EventDetails.
 * @method eb_eventSummary.getMyEventDetails
 * @param {String} personId User ID.
 * @return {Object} jQuery promise object which when resolved returns list of events.
 */
eb_eventSummary.getMyEventDetails = function (personId) {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for my event details');
    if (!personId) {
        throw { type: "argument_null", message: "personId property is required.", stack: Error().stack };
    }
    eBusinessJQObject.get(
        {
            url: eb_eventSummary.getMyEventsURL.replace("{LinkId}", personId),
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
 * GET service call method for EventDetails.
 * @method eb_eventSummary.getEventDetails
 * @param {String} eventId Event ID.
 * @return {Object} jQuery promise object which when resolved returns list of events.
 */
eb_eventSummary.getEventDetails = function (eventId) {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for event details');
    if (eventId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    if (!Number(eventId)) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    eBusinessJQObject.get(
        {
            url: eb_eventSummary.getEventDetail.replace("{eventId}", eventId),
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
 * @method eb_eventSummary.model
 * @param {any} options Array of required data.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 * @param {Object} options.data Events List.
 */
eb_eventSummary.model = function (options) {
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

    if (options.shoppingCart) {
        _that.shoppingCart = options.shoppingCart;
        eb_eventSummary.shoppingCart(options.shoppingCart);
    }

    if (options.userContext) {
        _that.userContext = options.userContext;
        eb_eventSummary.personId = _that.userContext.LinkId();
    }

    eb_eventSummary.domElement(_that.domElement);
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
    _that.locationAvailabel = ko.observable(1);
    _that.showRegisterButton = ko.observable(1); /*show the register button*/
    _that.enabledRegisterButton = ko.observable(1)
    _that.registerButton = ko.observable("Register");
    _that.errorMessage = ko.observable("");
    _that.meetingConflictHeader = ko.observable("Meeting Conflict");

    if (_that.userContext.isUserLoggedIn()) {
        /*To get my event details*/
        eb_eventSummary.getMyEventDetails(eb_eventSummary.personId).done(function (result) {
            var item = ko.utils.arrayFirst(result, function (meeting) {
                return (meeting.id.toString() === _that.eventID);
            });
            if (item) {
                _that.registerButton("You are already registered. Register another person");
            } else {
                _that.registerButton("Register");
            }
        }).fail(function (data, msg, jhr) {
            console.error("Failed to get my event data. ", data.responseJSON.message);
        });
    }

    /*Load event summary details page*/
    _that.loadEventSummaryData = function (data) {
        _that.name = ko.observable(data['webName']);
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
        _that.currencySymbol = ko.observable(data['currencySymbol']);
        _that.showCurrencySymbol = ko.observable('');
        _that.showPriceOrText = ko.observable('');
        _that.addressLine1 = ko.observable(data['addressLine1']);
        _that.addressLine2 = ko.observable(data['addressLine2']);
        _that.addressCity = ko.observable(data['addressCity']);
        _that.addressStateProvince = ko.observable(data['addressStateProvince']);
        _that.addressPostalCode = ko.observable(data['addressPostalCode']);
        _that.addressCountry = ko.observable(data['addressCountry']);
        _that.noLocationAvailabel = ko.observable('No Location Available');
        _that.hasSessions = ko.observable(data['hasSessions']);
        _that.eventId = ko.observable(data['id']);
        _that.fixedPanelEv = ko.observable('');
        _that.fullAddress = ko.computed(function () {
            return _that.venue() + " " + _that.addressLine1() + " " + _that.addressLine2() + " "
                + _that.addressCity() + " " + _that.addressStateProvince() + " " + _that.addressPostalCode() + " " + _that.addressCountry()
        });
        /*Pricing scenario*/
        if (_that.defaultPrice() > 0) {
            _that.eventPrice = _that.defaultPrice();
        }
        else {
            _that.eventPrice = _that.retailPrice();
        }

        if (_that.hasComplexPricing()) {
            _that.showPriceOrText("<span class='clsShipStatus'> Add to Cart to see Price</span>");
            _that.showCurrencySymbol("");
        }
        else {
            _that.showPriceOrText(_that.eventPrice);
            _that.showCurrencySymbol(_that.currencySymbol());
        }

        if (!_that.venue() && !_that.addressLine1() && !_that.addressLine2()
            && !_that.addressCity() && !_that.addressStateProvince() && !_that.addressPostalCode() && !_that.addressCountry()) {
            _that.noLocation(1);
            _that.locationAvailabel(0);
        }

        _that.availableSpace = ko.observable(data['availableSpace']);
        _that.maxSpace = ko.observable(data['maxSpace']);
        _that.requireAvailableSpace = ko.observable(data['requireAvailableSpace']);
    };
    /* The Summary Widget at the right side of the page will be fixed on scrolling */

    var winObject = eBusinessJQObject(window);
    winObject.scroll(function () {
        if (winObject.scrollTop() >= 102) {
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
        return eb_eventSummary.getEventDetails();
    };

    /*If the data is available, then directly bind it*/
    if (_that.data) {
        _that.loadEventSummaryData(_that.data);
    }

    /* Meeting Max Registration*/
    _that.clickEvent = function () {
        if (_that.meetingConflictHeader() === "Meeting Max Registration") {
            registerAttendee();
        }
    }

    /*To register attendee in event*/
    _that.registerAttendee = function () {
        /*Check AllowWaitListMeetingRegistration and requireAvailableSpace values to proceed further. if the values are true then show the information dialog else skip the dialog box.*/
        var value;
        if (eb_Config.AllowWaitListMeetingRegistration && _that.requireAvailableSpace()) {
            if (_that.availableSpace() > 0) {
                value = "You can register up to " + _that.availableSpace() + " people for the meeting. Any additional registrations will be added to the Wait List.";
            } else {
                value = "There is no space currently available for this meeting. Any attendee you register will be added to the Wait List.";
            }
            _that.errorMessage(value);
            _that.meetingConflictHeader("Meeting Max Registration");
            /*eBusinessJQObject(_that.domElement).find('#eb-modal-conflict-meeting').modal("show")*/
            /*Bootstrap5.3 Modal Code Change Start*/
            new bootstrap.Modal(document.getElementById('eb-modal-conflict-meeting')).show();
            /*Bootstrap5.3 Modal Code Change End*/
        }
        else {
            registerAttendee();
        }
    };

    /* Register Attendee*/
    function registerAttendee() {
        /*Checked user is logged-in, if yes then register meeting else redirect to login-in page.*/
        if (_that.userContext.isUserLoggedIn()) {
            if (eb_eventSummary.eventRegistration) {
                var cartItem = {};
                var ids = [_that.eventId()];
                cartItem.productId = ids;
                cartItem.quantity = 1;
                cartItem.attendeeId = eb_eventSummary.personId;
                cartItem.productType = 'meeting';
                cartItem.newCartItem = true;

                eb_eventSummary.getMyEventDetails(eb_eventSummary.personId).done(function (result) {
                    var item = ko.utils.arrayFirst(result, function (meeting) {
                        return (meeting.id.toString() === _that.eventID);
                    });

                    if (!item) {

                        var alreadyInCart = ko.utils.arrayFirst(eb_eventSummary.shoppingCart.cartItems(), function (meeting) {
                            return (meeting.productId.toString() === _that.eventID);
                        });

                        if (!alreadyInCart) {
                            eb_eventSummary.shoppingCart.addToCart(cartItem).done(function (result) {
                                window.location.assign(eb_eventSummary.SitePath + eb_eventSummary.eventRegistration + "?" + "productId=" + encodeURIComponent(_that.eventID) + "&" + "hasSessions=" + encodeURIComponent(_that.hasSessions()));
                            }).fail(function (xhr, textStatus, errorThrown) {
                                if (xhr && typeof xhr.responseJSON !== 'undefined') {
                                    if (xhr.responseJSON.errorCode === 405) {
                                        /*To get the first message from response*/
                                        _that.meetingConflictHeader("Meeting Conflict");
                                        _that.errorMessage(xhr.responseJSON.message.split('\n')[0]);
                                        /*Open the modal if their is any prohibited message*/
                                        /*eBusinessJQObject(_that.domElement).find('#eb-modal-conflict-meeting').modal("show")*/
                                        /*Bootstrap5.3 Modal Code Change Start*/
                                        new bootstrap.Modal(document.getElementById('eb-modal-conflict-meeting')).show();
                                        /*Bootstrap5.3 Modal Code Change End*/
                                    } else {
                                        _that.meetingConflictHeader("Error");
                                        _that.errorMessage(xhr.responseJSON.message.split('\n')[0]);
                                        /*eBusinessJQObject(_that.domElement).find('#eb-modal-conflict-meeting').modal("show")*/
                                        /*Bootstrap5.3 Modal Code Change Start*/
                                        new bootstrap.Modal(document.getElementById('eb-modal-conflict-meeting')).show();
                                        /*Bootstrap5.3 Modal Code Change End*/

                                        throw { type: "argument_null", message: "Failed to add event in cart.", stack: Error().stack };
                                    }
                                }
                            });
                        } else {
                            window.location.assign(eb_eventSummary.SitePath + eb_eventSummary.eventRegistration + "?" + "productId=" + encodeURIComponent(_that.eventID) + "&" + "hasSessions=" + encodeURIComponent(_that.hasSessions()));
                        }
                    } else {
                        window.location.assign(eb_eventSummary.SitePath + eb_eventSummary.eventRegistration + "?" + "productId=" + encodeURIComponent(_that.eventID) + "&" + "hasSessions=" + encodeURIComponent(_that.hasSessions()));
                    }
                });
            }
            else {
                console.error("No Page is Found");
            }
        }
        else {
            window.location.assign(eb_Config.loginPageURL + "?" + encodeURIComponent("RedirectPage=" + window.location.href));
        }
    }
};

/**
 * Global function to hold shopping cart object.
 * @method eb_eventSummary.shoppingCart
 * @param {Object} shoppingCart Instance of eb_shoppingCart.shoppingCartModel.
 */
eb_eventSummary.shoppingCart = function (shoppingCart) {
    var self = this;
    self.shoppingCart = shoppingCart;
};

/**
 * Page DOM element.
 * @method eb_eventSummary.domElement
 * @param {object} domElement current DOM element.
 * */
eb_eventSummary.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_eventSummary.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_eventSummary);
});