/**
 * Event Calendar class.
 * @class eb_eventCalendar
 * */
var eb_eventCalendar = eb_eventCalendar || {};

/**
 * Control level setting: Site path.
 * @property eb_eventCalendar.SitePath
 * @type {String}
 */
eb_eventCalendar.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_eventCalendar.TemplatePath
 * @type {String}
 */
eb_eventCalendar.TemplatePath = eb_eventCalendar.SitePath + "html/events/EventCalendar.html";

/**
 * Event calender tool tip template.
 * @property eb_eventCalendar.TooltipTemplatePath
 * @type {String}
 */
eb_eventCalendar.TooltipTemplatePath = "EventCalendarTooltipTemplate.html";

/**
 * Tool Tip template path.
 * @property eb_eventCalendar.fullPathToolTipTemplate
 * @type {String}
 */
eb_eventCalendar.fullPathToolTipTemplate = eb_eventCalendar.SitePath + "html/events/" + eb_eventCalendar.TooltipTemplatePath;

/**
 * The path to the eBusiness SOA layer.
 * @property eb_eventCalendar.ServicePath
 * @type {String}
 */
eb_eventCalendar.ServicePath = eb_Config.ServicePathV1;

/**
 * GET service URL to get all Event records.
 * @property eb_eventCalendar.getAllEventsService
 * @type {String}
 */
eb_eventCalendar.getAllEventsService = eb_eventCalendar.ServicePath + "Events?TopLevelOnly=true";

/**
 * Redirect to Event Details Page.
 * @property eb_eventCalendar.productDetailsURL
 * @type {String}
 */
eb_eventCalendar.productDetailsURL = eb_eventCalendar.SitePath + 'events/EventDetails.html';

/*if set to true, will limit no of events and a "more" link comes up when events exceed, else the cell size expands to contain the events*/
eb_eventCalendar.eventLimit = true;

/*header*/
eb_eventCalendar.header = {
    left: 'prev,next today',
    center: 'title',
    right: 'year,month,agendaWeek,agendaDay'
};

/**
 * Render method for event calendar.
 * @method eb_eventCalendar.render
 * @param {any} options Array of required data.
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * @return {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_eventCalendar.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_eventCalendar.SitePath + eb_eventCalendar.TemplatePath;
        options.templatePath = finalPath;
    }

    if (!options.domElement) {
        throw { type: "argument_mismatch", message: 'Missing domElement.  The object passed in must have a domElement property with a non-empty DOM object.', stack: Error().stack };
    }

    if (options.productDetailsURL) {
        eb_eventCalendar.productDetailsURL = options.productDetailsURL;
    }
    if (options.getAllEventsService) {
        eb_eventCalendar.getAllEventsService = options.getAllEventsService;
    }
    if (options.eventLimit) {
        eb_eventCalendar.eventLimit = options.eventLimit;
    }
    if (options.header) {
        eb_eventCalendar.header = options.header;
    }

    eBusinessJQObject.get(options.templatePath).done(function (data) {
        options.domElement.innerHTML = data;
        defer.resolve(data);
    }).fail(function (data, msg, jhr) {
        defer.reject(data, msg, jhr);
    });
    return defer.promise();
};

/*Handle the response from the server re our input*/
eb_eventCalendar.HandleResponse = function (data) {
    /*Todo: Handle response from server*/
};

/*A list of known service responses and the messages that should be displayed to the user in the event that they are recieved.*/
eb_eventCalendar.KnownResponses = [{ code: "Error", message: "There was a problem loading the page" }
    , { code: "Failure", message: "Your request could not be completed." }];

/**
 * GET all event data and data based on category name.
 * @method eb_eventCalendar.getEvents
 * @return {String} jQuery promise object which when resolved returns list of all events.
 * @return {Object} jQuery promise object.
 */
eb_eventCalendar.getEvents = function () {
    var defer = eBusinessJQObject.Deferred();
    console.info('service call for all events');
    var serviceURL = eb_eventCalendar.getAllEventsService;

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
 * Event calendar Model object.
 * @method eb_eventCalendar.model
 * @param {any} options Array of required data.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 * @param {Object} options.data data of event details.
 * @param {Object} options.shoppingCart Shopping Cart Object.
 * @param {String} options.eventId eventId of particular event
 * @param {Object} options.userContext userContext object
 */
eb_eventCalendar.model = function (options) {
    var _that = this;

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement property is required.", stack: Error().stack };
    }

    _that.domElement = options.domElement;
    if (options.data) {
        _that.data = options.data;
    }

    eb_eventCalendar.domElement(eb_eventCalendar.domElement);
    /*load events data, apply paginations and filters on data.*/
    _that.loadEventsData = function (data, domElement) {
        eb_eventCalendar.loadCalendar(data, domElement);
    };

    /*check event data and load calendar on page.*/
    if (!_that.data) {
        data = {};
    }
    else {
        _that.loadEventsData(_that.data, _that.domElement);
    }

};

/**
 * Function to load calender.
 * @method eb_eventCalendar.loadCalendar
 * @param {Object} events List of events.
 * @param {Object} domElement Calender template.
 * @return {String} jQuery promise object.
 */
eb_eventCalendar.loadCalendar = function (events, domElement) {
    var defer = eBusinessJQObject.Deferred();

    var self = this;

    var eventsArray = [];

    /*To format the date*/
    function dateModified(date) {
        var dateFormat = new Date(date);
        return dateFormat = dateFormat.getHours() === 0 && dateFormat.getMinutes() === 0 && dateFormat.getSeconds() === 0 ?
            moment(dateFormat).format(eb_Config.defaultDateFormat) : moment(dateFormat).format(eb_Config.eventsDateFormat);
    }

    for (var i in events) {
        var title = events[i].webName;
        var start = dateModified(events[i].startDate);
        var end = dateModified(events[i].endDate);
        var productId = events[i].id;
        var venue = events[i].venue;
        var eventItem = {
            title: title,
            start: start,
            end: end,
            productId: productId,
            enddt: end,
            venue: venue
        };
        eventsArray.push(eventItem);
    }

    var params = {
        header: eb_eventCalendar.header || {
            left: 'prev,next today',
            center: 'title',
            right: 'year,month,agendaWeek,agendaDay'
        },
        events: eventsArray
    };

    ko.fullCalendar = {
        viewModel: function (config) {
            this.header = config.header;
            this.events = config.events;
        }
    };

    ko.bindingHandlers.fullCalendar = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            eBusinessJQObject(element).fullCalendar({
                views: viewModel.views,
                events: viewModel.events,
                header: viewModel.header,
                eventLimit: true,
                displayEventTime: false,
                viewRender: function (e) {
                },
                dayClick: function (e) {
                },
                eventClick: function (e) {
                    window.location.assign(eb_eventCalendar.productDetailsURL + "?" + "productId=" + encodeURIComponent(e.productId));
                },
                eventMouseover: function (dataEventMouseOver, event, view) {
                    var self = this;

                    var tooltipVM = function (dataToolTip) {
                        var self = this;
                        self.tooltipName = ko.observable(dataToolTip.title);
                        self.tooltipStart = ko.observable(dataToolTip.start._i);
                        self.tooltipVenue = ko.observable(dataToolTip.venue);
                    };

                    eb_eventCalendar.getEventCalendarTooltipTemplate().done(function (toolTipTemplate) {

                        eBusinessJQObject(domElement).append(toolTipTemplate);

                        ko.applyBindings(new tooltipVM(dataEventMouseOver), eBusinessJQObject(domElement).find('.tooltiptopicevent')[0]);

                        eBusinessJQObject(domElement).find('.tooltiptopicevent').css('top', event.pageY + 10);
                        eBusinessJQObject(domElement).find('.tooltiptopicevent').css('left', event.pageX + 20);

                        eBusinessJQObject(self).mouseover(function (e) {
                            eBusinessJQObject(domElement).find('.tooltiptopicevent').fadeIn('500');
                            eBusinessJQObject(domElement).find('.tooltiptopicevent').fadeTo('10', 1.9);
                        }).mousemove(function (e) {
                            eBusinessJQObject(domElement).find('.tooltiptopicevent').css('top', e.pageY + 10);
                            eBusinessJQObject(domElement).find('.tooltiptopicevent').css('left', e.pageX + 20);
                        });
                    }
                    ).fail(function (error) {
                        console.error("unable to fetch CalendarTooltipTemplate");
                    });
                },
                eventMouseout: function (data, event, view) {
                    var self = this;

                    eBusinessJQObject(domElement).find('.tooltiptopicevent').remove();

                },
                eventAfterAllRender: function (view) {
                    /*Scroller comes to the top rather than bottom as default*/
                    var renderedEvents;
                    if (eBusinessJQObject(domElement).find('.fc-time-grid-event').length > 0) {
                        renderedEvents = eBusinessJQObject('div.fc-event-container a');
                        var firstEventOffsetTop = renderedEvents && renderedEvents.length > 0 ? renderedEvents[0].offsetTop : 0;
                        eBusinessJQObject(domElement).find('div.fc-scroller').scrollTop(firstEventOffsetTop + 'px');
                    }
                    else {
                        renderedEvents = eBusinessJQObject(domElement).find('div.fc-event-container a');
                        eBusinessJQObject(domElement).find('div.fc-scroller').scrollTop(0 + 'px');
                    }
                }
            });
            eBusinessJQObject(element).fullCalendar('gotoDate', viewModel.viewDate);
        }

    };

    var calendarViewModel = new ko.fullCalendar.viewModel(params);

    ko.applyBindings(calendarViewModel, domElement);

    return defer.promise();
};

/*Global variable to hold tool tip template.*/
var toolTipTemplate;
/**
 * Get Event calender tool tip template .
 * @method eb_eventCalendar.getEventCalendarTooltipTemplate
 * @return {String} jQuery promise object which when resolved returns HTML template.
 */
eb_eventCalendar.getEventCalendarTooltipTemplate = function () {
    var defer = eBusinessJQObject.Deferred();
    if (!toolTipTemplate) {
        eBusinessJQObject.get(eb_eventCalendar.fullPathToolTipTemplate).done(function (data) {
            toolTipTemplate = data;
            defer.resolve(toolTipTemplate);
        }).fail(function (data, msg, jhr) {
            defer.fail();
        });
    }
    else {
        defer.resolve(toolTipTemplate);
    }
    return defer.promise();
};

/**
 * Page DOM element.
 * @method eb_eventCalendar.domElement
 * @param {object} domElement current DOM element.
 * */
eb_eventCalendar.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_eventCalendar.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_eventCalendar);
});