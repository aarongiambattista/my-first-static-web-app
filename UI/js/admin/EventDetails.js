/**
 * Event Details class.
 * @class eb_EventDetailsAdmin
 * */
var eb_EventDetailsAdmin = eb_EventDetailsAdmin || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_EventDetailsAdmin.SitePath
 * @type {String}
 * */
eb_EventDetailsAdmin.SitePath = eb_Config.SitePath;

/**
 * Event Details Admin template path.
 * @property eb_EventDetailsAdmin.TemplatePath
 * @type {String}
 * */
eb_EventDetailsAdmin.TemplatePath = "html/admin/EventDetails.html";

/**
 * SOA path.
 * @property eb_EventDetailsAdmin.ServicePath
 * @type {String}
 * */
eb_EventDetailsAdmin.ServicePath = eb_Config.ServicePathV1;

/**
 * GET service to get Event Details
 * @property eb_EventDetailsAdmin.getEventDetailsService
 * @type {String}
 */
eb_EventDetailsAdmin.getEventDetailsService = eb_EventDetailsAdmin.ServicePath + "admin/company/{id}/Events/{eventId}";

/**
 * GET service to get the speaker info
 * @property eb_EventDetailsAdmin.getSpeakerDataService
 * @type {String}
 */
eb_EventDetailsAdmin.getSpeakerDataService = eb_EventDetailsAdmin.ServicePath + "admin/company/{id}/Events/{eventId}/Speakers" + "?includeSessionSpeakers=true";

/**
 * GET Service to get the session Info
 * @property eb_EventDetailsAdmin.getSessionInfoDataService
 * @type {String}
 */
eb_EventDetailsAdmin.getSessionInfoDataService = eb_EventDetailsAdmin.ServicePath + "admin/company/{id}/Events/{eventId}/Sessions";

/**
 * Get event id from URL
 * @property eb_EventDetailsAdmin.productId
 * @type {String}
 */
eb_EventDetailsAdmin.productId = eb_Config.getUrlParameter("productId");

/**
 * Default product image.
 * @property eb_EventDetailsAdmin.defaultImage
 * @type {String}
 */
eb_EventDetailsAdmin.defaultImage = "../images/products/coming-soon.png";

/**
 * Character length for show more and show less functionality
 * @property eb_EventDetailsAdmin.charLength
 * @type {Number}
 * */
eb_EventDetailsAdmin.charLength = eb_Config.companyAdmin_descriptionCharLength || 450;

/**
 * Site path to event registration page.
 * @property eb_EventDetailsAdmin.eventRegistrationURL
 * @type {String}
 * */
eb_EventDetailsAdmin.eventRegistrationURL = eb_EventDetailsAdmin.SitePath + 'admin/EventRegistration.html';

/**
 * The service will return Event Details HTML.
 * Template path and DOM element are required parameters.
 * @method eb_EventDetailsAdmin.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Event Details template URL.
 * @return {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_EventDetailsAdmin.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_EventDetailsAdmin.SitePath + eb_EventDetailsAdmin.TemplatePath;
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
 * GET service call method for Event Details
 * @method eb_EventDetailsAdmin.getEventDetails
 * @return {Object} To get event details
 * */
eb_EventDetailsAdmin.getEventDetails = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for event details');

    if (companyId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing companyId.', stack: Error().stack };
    }

    if (!Number(companyId)) {
        throw { type: "argument_mismatch", message: 'Missing companyId.', stack: Error().stack };
    }

    if (eb_EventDetailsAdmin.productId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    if (!Number(eb_EventDetailsAdmin.productId)) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    eBusinessJQObject.get(
        {
            url: eb_EventDetailsAdmin.getEventDetailsService.replace("{id}", companyId).replace("{eventId}", eb_EventDetailsAdmin.productId),
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
 * GET service call method for SpeakerInfo
 * @method eb_EventDetailsAdmin.getSpeakerInfo
 * @return {Object} To get speaker info
 * */
eb_EventDetailsAdmin.getSpeakerInfo = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for getting speaker info');

    if (companyId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing companyId.', stack: Error().stack };
    }

    if (!Number(companyId)) {
        throw { type: "argument_mismatch", message: 'Missing companyId.', stack: Error().stack };
    }

    if (eb_EventDetailsAdmin.productId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    if (!Number(eb_EventDetailsAdmin.productId)) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    eBusinessJQObject.get(
        {
            url: eb_EventDetailsAdmin.getSpeakerDataService.replace("{id}", companyId).replace("{eventId}", eb_EventDetailsAdmin.productId),
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
 * GET service call method for SessionDetails
 * @method eb_EventDetailsAdmin.getSessionDetails 
 * @return {Object} To get session details
 * */
eb_EventDetailsAdmin.getSessionDetails = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for session details');

    if (companyId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing companyId.', stack: Error().stack };
    }

    if (!Number(companyId)) {
        throw { type: "argument_mismatch", message: 'Missing companyId.', stack: Error().stack };
    }

    if (eb_EventDetailsAdmin.productId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    if (!Number(eb_EventDetailsAdmin.productId)) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    eBusinessJQObject.get(
        {
            url: eb_EventDetailsAdmin.getSessionInfoDataService.replace("{id}", companyId).replace("{eventId}", eb_EventDetailsAdmin.productId),
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
 * Event Details model responsible for event details related operations.
 * @method eb_EventDetailsAdmin.model
 * @param {any} options Object of event details data.
 * @param {String} options.templatePath HTML path.
 * @param {Object} options.domElement Event Details DOM element. 
 * */
eb_EventDetailsAdmin.model = function (options) {
    var _that = this;
    _that.domElement = options.domElement;
    _that.userContext = options.userContext;
    eb_EventDetailsAdmin.domElement(_that.domElement);
    eb_EventDetailsAdmin.companyId = _that.userContext.companyId();
    _that.companyId = ko.observable(eb_EventDetailsAdmin.companyId);
    _that.eventData = options.eventData;
    _that.speakerData = options.speakerData;
    _that.companyName = ko.observable(options.userContext.CompanyName());

    /*Details of Event*/
    _that.name = ko.observable();
    _that.webImage = ko.observable();
    _that.speakerInfo = ko.observableArray();
    _that.sessionDetails = ko.observableArray();
    _that.eventPrice = ko.observable();
    _that.description = ko.observable();
    _that.sessionCollapse = ko.observable(1);
    _that.noSpeakerAvailable = ko.observable(0);

    /*Show more and show less binding*/
    _that.remainingDescription = ko.observable("");
    _that.showRemainingDescription = ko.observable(0);
    _that.showMoreHide = ko.observable(0);
    _that.showMoreDescription = ko.observable(1);
    _that.hideRemainingDescription = ko.observable(0);
    _that.showEllipses = ko.observable(0);

    _that.noSpeaker = ko.observable("");
    _that.sessionCollapse = ko.observable(1);
    _that.showSession = ko.observable(1);
    _that.collapseExpandAllText = ko.observable();
    _that.showMap = ko.observable(1);
    _that.noLocation = ko.observable(0);
    _that.uniqueSpeakersList = ko.observableArray(); /*For unqiue Speaker Name in order to avoid duplication*/
    _that.showLoader = ko.observable(0);
    _that.meetingConflictHeader = ko.observable();
    _that.errorMessage = ko.observable();

    var geocoder;

    /*To Load speaker details*/
    _that.loadSpeakerDetails = function (data) {
        var self = this;
        self.speakerName = ko.observable(data['name']);
        self.eventId = ko.observable(data['eventId']);
    };

    _that.loadSpeakerData = function (data) {
        /*This is used to show the unique speaker name, to display in UI*/
        eBusinessJQObject.map(data, function (speaker) {
            _that.uniqueSpeakersList.push({ speakerName: speaker.name });
        });

        /*This contains all the speaker names, which is used to identify the speaker for particular session*/
        eBusinessJQObject.map(data, function (row) {
            _that.speakerInfo.push(new _that.loadSpeakerDetails(row));
        });
    };

    /*Get speaker info details*/
    _that.getSpeakerInfoFromServer = function () {
        return eb_EventDetailsAdmin.getSpeakerInfo(_that.companyId());
    };

    if (_that.speakerData) {
        /*If speaker data is available then directly load it*/
        if (_that.speakerData.length > 0) {
            _that.loadSpeakerData(_that.speakerData);
        } else {
            console.log("No Speaker Available");
        }
    } else {
        /*Get the speaker details from server*/
        _that.showLoader(1);
        _that.getSpeakerInfoFromServer().done(function (speakerinfo) {
            _that.loadSpeakerData(speakerinfo);
            _that.showLoader(0);
        }).fail(function (xhr, textStatus, errorThrow) {
            _that.showLoader(0);
            console.info("getSpeakerInfoFromServer failed:  " + xhr.responseText);
        });
    }


    /*show less functionality*/
    _that.showLess = function () {
        _that.hideRemainingDescription(0);
        _that.showMoreDescription(1);
        _that.showMoreHide(1);
        _that.showRemainingDescription(0);
        _that.showEllipses(1);
    };

    /*show more functionality*/
    _that.showMore = function () {
        _that.showRemainingDescription(1);
        _that.showMoreDescription(0);
        _that.showMoreHide(0);
        _that.hideRemainingDescription(1);
        _that.showEllipses(0);
    };

    /*showing the data if char length is greater than 500 character*/
    _that.showMoreData = function (data) {
        var description = data;
        var showDescription = description.substr(0, eb_EventDetailsAdmin.charLength);
        _that.description(showDescription);
        _that.remainingDescription(data);
        _that.showRemainingDescription(0);
        _that.showMoreHide(1);
        _that.showEllipses(1);
    };

    _that.checkEventDescription = function (data) {
        if (!data) {
            data = "";
        }
        data = eBusinessJQObject("<html>" + data + "</html>").text();
        var descriptionData = data;
        if (descriptionData.length < eb_EventDetailsAdmin.charLength) {
            _that.description(data);
        } else {
            _that.showMoreData(data);
        }
    };

    /*To load event data*/
    _that.loadEventData = function (data) {
        if (eb_Config.loadDefaultImage) {
            _that.eventImage = ko.observable(eb_EventDetailsAdmin.defaultImage);
        }
        else {
            _that.eventImage = ko.observable(eb_Config.largeImageURL + eb_EventDetailsAdmin.productId + eb_Config.imageExtension);
        }

        _that.name = ko.observable(data['name']);
        _that.venue = ko.observable(data['venue']);

        _that.startDate = ko.computed(function () {
            var checkTime = new Date(data['startDate']);
            return checkTime.getHours() === 0 && checkTime.getMinutes() === 0 && checkTime.getSeconds() === 0 ?
                moment(data['startDate']).format(eb_Config.defaultDateFormat) : moment(data['startDate']).format(eb_Config.eventsDateFormat);
        });

        _that.availableSpace = ko.observable(data['availableSpace']);
        _that.maxSpace = ko.observable(data['maxSpace']);
        _that.requireAvailableSpace = ko.observable(data['requireAvailableSpace']);

        _that.checkEventDescription(data['webDescription']);
        _that.collapseExpandAllText("Expand All");
        _that.hasSessions = ko.observable(data['hasSessions']);
        _that.doShowCollapseExpandAll = ko.observable(false);
        _that.statusId = ko.observable(data['statusID']);
        _that.status = ko.observable(data['status']);
        _that.showEventCancelledAlert = ko.observable(0);

        _that.addressLine1 = ko.observable(data['addressLine1']);
        _that.addressLine2 = ko.observable(data['addressLine2']);
        _that.addressCity = ko.observable(data['addressCity']);
        _that.addressStateProvince = ko.observable(data['addressStateProvince']);
        _that.addressPostalCode = ko.observable(data['addressPostalCode']);
        _that.addressCountry = ko.observable(data['addressCountry']);

        _that.fullAddress = ko.computed(function () {
            if (_that.venue() !== "" || _that.addressLine1() !== null || _that.addressLine2() !== null || _that.addressCity() !== null) {
                return _that.venue() + " " + _that.addressLine1() + " " + _that.addressLine2() + " "
                    + _that.addressCity() + " " + _that.addressStateProvince() + " " + _that.addressPostalCode() + " " + _that.addressCountry();
            } else {
                return null;
            }
        });

        /*If status of event is "Cancelled", show the Event Cancelled alert.*/
        if (_that.statusId() === 3) {
            _that.showEventCancelledAlert(1);
        }
    };

    /*Get event details*/
    _that.getEventDetailsFromServer = function () {
        return eb_EventDetailsAdmin.getEventDetails(_that.companyId());
    };

    if (_that.eventData) {
        /*If event data is available then directly load it*/
        _that.loadEventData(_that.eventData);
    } else {
        /*If event data is not available then get Event details from server*/
        _that.showLoader(1);
        _that.getEventDetailsFromServer().done(function (eventData) {
            _that.loadEventData(eventData);
            _that.showLoader(0);
        }).fail(function (xhr, textStatus, errorThrow) {
            _that.showLoader(0);
            console.info("getEventDetailsFromServer failed:  " + xhr.responseText);
        });
    }

    /*Session List*/
    _that.sessionListDetails = function (data) {
        var self = this;
        self.speakerNamesData = ko.observableArray();
        self.sessionSpeakerName = ko.observable();
        self.sessionName = ko.observable(data['webName']);
        self.sessionDate = ko.computed(function () {
            var checkTime = new Date(data['startDate']);
            return checkTime.getHours() === 0 && checkTime.getMinutes() === 0 && checkTime.getSeconds() === 0 ?
                moment(data['startDate']).format(eb_Config.defaultDateFormat) : moment(data['startDate']).format(eb_Config.eventsDateFormat);
        });
        self.sessionVenue = ko.observable(data['venue']);
        self.sessionId = ko.observable(data['id']);
        self.sessionParentId = ko.observable(data['parentProductId']);

        /*Show Prices based on person category.*/
        self.defaultMemberPrice = ko.observable(parseFloat(data['defaultMemberPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.nonMemberPrice = ko.observable(parseFloat(data['nonMemberPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.defaultPrice = ko.observable(parseFloat(data['defaultPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.retailPrice = ko.observable(parseFloat(data['retailPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.currencySymbol = ko.observable(data['CurrencySymbol']);

        self.showCurrencySymbol = ko.observable('');
        self.showPrice = ko.observable();
        self.hasComplexPricing = ko.observable(data['hasComplexPricing']);

        self.remainingDescription = ko.observable("");
        self.showRemainingDescription = ko.observable(0);
        self.showMoreHide = ko.observable(0);
        self.showMoreDescription = ko.observable(1);
        self.hideRemainingDescription = ko.observable(0);
        self.showEllipses = ko.observable(0);
        self.sessionDescription = ko.observable("");

        /*Pricing scenario*/
        if (self.defaultPrice() > 0) {
            self.sessionPrice = self.defaultPrice();
        }
        else {
            self.sessionPrice = self.retailPrice();
        }

        if (self.hasComplexPricing()) {
            self.showPrice(0);
            self.showCurrencySymbol("");
        }
        else {
            self.showPrice(1);
            self.showCurrencySymbol(self.currencySymbol());
        }

        eBusinessJQObject.map(_that.speakerInfo(), function (item) {
            if (item.eventId() === self.sessionId()) {
                /*It is used to add the unique speaker name for particular session*/
                if (self.speakerNamesData().length > 0) {
                    var speakerResult = ko.utils.arrayFirst(self.speakerNamesData(), function (meeting) {
                        return meeting.sessionSpeakerName === item.speakerName()
                    });

                    /*If speaker name is not available then add the speaker name for session*/
                    if (!speakerResult) {
                        self.speakerNamesData.push({ sessionSpeakerName: item.speakerName() })
                    }
                } else {
                    /*Adding one speaker name first*/
                    self.speakerNamesData.push({ sessionSpeakerName: item.speakerName() });
                }
            }
        });

        self.sessionCollapse = ko.observable(0);

        /*Toggle the session panel*/
        self.toggleSession = function () {
            self.sessionCollapse(!self.sessionCollapse());
            var isAllCollapsed = true;
            var isAllExpanded = true;
            eBusinessJQObject.each(_that.sessionDetails(), function (idx, sessionDetail) {
                if (sessionDetail.sessionCollapse()) {
                    isAllCollapsed = false;
                }
                else {
                    isAllExpanded = false;
                }
            });
            if (isAllCollapsed) {
                _that.collapseExpandAllText("Expand All");
            }
            else if (isAllExpanded) {
                _that.collapseExpandAllText("Collapse All");
            }
        };

        /*collapse session*/
        self.collapseSession = function () {
            self.sessionCollapse(0);
        };
        /*expand session*/
        self.expandSession = function () {
            self.sessionCollapse(1);
        };

        /*show less functionality*/
        self.showLess = function () {
            self.hideRemainingDescription(0);
            self.showMoreDescription(1);
            self.showMoreHide(1);
            self.showRemainingDescription(0);
            self.showEllipses(1);
        };

        /*show more functionality*/
        self.showMore = function () {
            self.showRemainingDescription(1);
            self.showMoreDescription(0);
            self.showMoreHide(0);
            self.hideRemainingDescription(1);
            self.showEllipses(0);
        };

        /*showing the data if char length is greater than 500 character*/
        self.showMoreData = function (data) {
            var description = data;
            var showDescription = description.substr(0, eb_EventDetailsAdmin.charLength);
            self.sessionDescription(showDescription);
            self.remainingDescription(data);
            self.showRemainingDescription(0);
            self.showMoreHide(1);
            self.showEllipses(1);
        };

        self.checkEventDescription = function (data) {
            if (!data) {
                data = "";
            }
            data = eBusinessJQObject("<html>" + data + "</html>").text();
            var descriptionData = data;
            if (descriptionData.length < eb_EventDetailsAdmin.charLength) {
                self.sessionDescription(data);
            } else {
                self.showMoreData(data);
            }
        };

        self.checkEventDescription(data['webDescription']);
    };

    /*Session Data*/
    _that.loadSessionData = function (sessionData) {
        eBusinessJQObject.map(sessionData, function (row) {
            _that.sessionDetails.push(new _that.sessionListDetails(row));
        });
    };

    _that.getSessionDetailsFromServer = function () {
        return eb_EventDetailsAdmin.getSessionDetails(_that.companyId());
    };

    _that.sessionDetailsInfo = function () {
        _that.showLoader(1);
        _that.getSessionDetailsFromServer().done(function (sessions) {
            _that.showLoader(0);
            if (sessions.length > 0) {
                _that.doShowCollapseExpandAll(true);
                _that.loadSessionData(sessions);
            }
            else {
                _that.doShowCollapseExpandAll(false);
            }
        }).fail(function (xhr, textStatus, errorThrow) {
            _that.showLoader(0);
            console.info("getSpeakerDetailsFromServer failed:  " + xhr.responseText);
        });
    };

    if (_that.hasSessions()) {
        _that.sessionDetailsInfo();  /*Get call for session details only if sessions exists.*/
    }

    /*collapse/expand all*/
    _that.collapseExpandAll = function () {
        if (_that.collapseExpandAllText() === "Collapse All") {
            eBusinessJQObject.each(_that.sessionDetails(), function (idx, sessionDetail) {
                sessionDetail.collapseSession();
            });
            _that.collapseExpandAllText("Expand All");
        }
        else {
            eBusinessJQObject.each(_that.sessionDetails(), function (idx, sessionDetail) {
                sessionDetail.expandSession();
            });
            _that.collapseExpandAllText("Collapse All");
        }
    };

    /* To get the geocode functionality*/
    _that.codeAddress = function (geocoder, map) {
        if (_that.fullAddress()) {
            geocoder.geocode({ address: _that.fullAddress() }, function (results, status) {
                if (status === "OK") {
                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                } else {
                    _that.showMap(0);
                    _that.noLocation(1);
                }
            });
        } else {
            console.log('No Address Specified');
            _that.showMap(0);
            _that.noLocation(1);
        }
    };

    /*To Initialize Map*/
    _that.initMap = function () {
        if (google && google.maps) {
            var map = new google.maps.Map(document.getElementById("map"), {
                zoom: 15
            });
            geocoder = new google.maps.Geocoder();
            _that.codeAddress(geocoder, map);
        } else {
            console.error('Map is not loaded yet');
        }
    };

    /*Invoke initMap function*/
    _that.initMap();

    _that.eventSummaryButtonClick = function (e) {
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
            /*eBusinessJQObject(_that.domElement).find('#eb-modal-conflict-meeting').modal("show");*/
            /*Bootstrap5.3 Modal Code Change Start*/
            new bootstrap.Modal(document.getElementById('eb-modal-conflict-meeting')).show();
            /*Bootstrap5.3 Modal Code Change End*/
        }
        else {
            _that.proceedToEventRegistration();
        }
    }

    _that.conflictPopUpClick = function () {
        if (_that.meetingConflictHeader() === "Meeting Max Registration") {
            _that.proceedToEventRegistration();
        }
    }

    _that.proceedToEventRegistration = function () {
        if (eb_EventDetailsAdmin.eventRegistrationURL) {
            window.location.assign(eb_EventDetailsAdmin.eventRegistrationURL + "?" + "productId=" + encodeURIComponent(eb_EventDetailsAdmin.productId) + "&" + "hasSessions=" + encodeURIComponent(_that.hasSessions()));
        }
        else {
            console.error("No Information is available");
        }
    }
};

/**
 * Page DOM element.
 * @method eb_EventDetailsAdmin.domElement
 * @param {object} domElement current DOM element.
 * */
eb_EventDetailsAdmin.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_EventDetailsAdmin.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_EventDetailsAdmin);
});