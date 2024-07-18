/**
 * Define eb_eventDetails class.
 * @class eb_eventDetails
 * */
var eb_eventDetails = eb_eventDetails || {};

/**
 * Control level setting: Site path.
 * @property eb_eventDetails.SitePath
 * @type {String}
 */
eb_eventDetails.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_eventDetails.TemplatePath
 * @type {String}
 */
eb_eventDetails.TemplatePath = "html/events/EventDetails.html";

/**
 * The path to the eBusiness SOA layer.
 * @property eb_eventDetails.ServicePath
 * @type {String}
 */
eb_eventDetails.ServicePath = eb_Config.ServicePathV1;

/**
 * GET service to get all Event Details
 * @property eb_eventDetails.getEventDetail
 * @type {String}
 */
eb_eventDetails.getEventDetail = eb_eventDetails.ServicePath + "Events/{eventId}";

/**
 * GET service to get the speaker info
 * @property eb_eventDetails.getSpeakerData
 * @type {String}
 */
eb_eventDetails.getSpeakerData = eb_eventDetails.ServicePath + "Events/{eventId}/Speakers" + "?includeSessionSpeakers=true";

/**
 * GET Service to get the session Info
 * @property eb_eventDetails.getSessionInfoData
 * @type {String}
 */
eb_eventDetails.getSessionInfoData = eb_eventDetails.ServicePath + "Events/{eventId}/Sessions";

/**
 * GET service to get my Event records.
 * @property eb_eventDetails.getMyEventsURL
 * @type {String}
 */
eb_eventDetails.getMyEventsURL = eb_eventDetails.ServicePath + "ProfilePersons/{LinkId}/Events?TopLevelOnly=true";

/**
 * Default product image.
 * @property eb_eventDetails.defaultImage
 * @type {String}
 */
eb_eventDetails.defaultImage = "../images/products/coming-soon.png";

/**
 * Get event id from URL
 * @property eb_eventDetails.eventId
 * @type {String}
 */
eb_eventDetails.eventId = eb_Config.getUrlParameter("productId");

/**
 * Character length for show more and show less functionality
 * @property eb_eventDetails.charLength
 * @type {Number}
 * */
eb_eventDetails.charLength = 450;

/**
 * Rendering public method to load HTML template. Based on page level configuration it will select the template and load in DOM.
 * Template path and DOM element are required parameters.
 * @method eb_eventRegistration.render
 * @param {any} options Array of required data.
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * @return {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_eventDetails.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            var finalPath = eb_eventDetails.SitePath + eb_eventDetails.TemplatePath;
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
 * GET service call method for EventDetails
 * @method eb_eventDetails.getEventDetails 
 * @return {Object} To get all event details
 * */
eb_eventDetails.getEventDetails = function () {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for event details');
    if (eb_eventDetails.eventId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    if (!Number(eb_eventDetails.eventId)) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    eBusinessJQObject.get(
        {
            url: eb_eventDetails.getEventDetail.replace("{eventId}", eb_eventDetails.eventId),
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
 * @method eb_eventDetails.getSpeakerInfo
 * @return {Object} To get speaker info
 * */
eb_eventDetails.getSpeakerInfo = function () {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for getting speaker info');
    if (eb_eventDetails.eventId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    if (!Number(eb_eventDetails.eventId)) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    eBusinessJQObject.get(
        {
            url: eb_eventDetails.getSpeakerData.replace("{eventId}", eb_eventDetails.eventId),
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
 * @method eb_eventDetails.getSessionDetails 
 * @return {Object} To get session details
 * */
eb_eventDetails.getSessionDetails = function () {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for session details');
    if (eb_eventDetails.eventId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    if (!Number(eb_eventDetails.eventId)) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    eBusinessJQObject.get(
        {
            url: eb_eventDetails.getSessionInfoData.replace("{eventId}", eb_eventDetails.eventId),
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
 * EventDetails Model for binding data
 * @method eb_eventDetails.model
 * @param {any} options Contains necessary data which is required for Event details page.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 * @param {Object} options.data data of event details.
 * @param {Object} options.shoppingCart Shopping Cart Object.
 * @param {String} options.eventId eventId of particular event
 * @param {Object} options.userContext userContext object
 */
eb_eventDetails.model = function (options) {
    var _that = this;
    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement property is required.", stack: Error().stack };
    }

    _that.domElement = options.domElement;

    if (options.data) {
        _that.data = options.data;
    }

    if (options.speakerDetails) {
        _that.speakerDetails = options.speakerDetails;
    }

    if (options.shoppingCart) {
        _that.shoppingCart = options.shoppingCart;
        eb_eventDetails.shoppingCart(options.shoppingCart);
    }

    eb_eventDetails.domElement(_that.domElement);

    /*Details of Event*/

    _that.webImage = ko.observable();
    _that.speakerInfo = ko.observableArray();
    _that.sessionDetails = ko.observableArray();
    _that.eventPrice = ko.observable();
    _that.description = ko.observable();
    _that.sessionCollapse = ko.observable(1);
    _that.noSpeakerAvailabel = ko.observable(0);
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
    _that.showUniqueSpeaker = ko.observableArray(); /*For UnqiueSpeaker Name*/
    _that.showLoader = ko.observable(0);

    var geocoder;
    var map;
    /*To Load speaker details*/
    _that.loadSpeakerDetails = function (row) {
        var self = this;
        self.speakerName = ko.observable(row['name']);
        self.eventId = ko.observable(row['eventId']);
    };

    _that.loadSpeakerData = function (data) {
        /*This is used to show the unique speaker name, to display in UI*/
        eBusinessJQObject.map(data, function (speaker) {
            _that.showUniqueSpeaker.push({ speakerName: speaker.name });
        });

        /*This contains all the speaker names, which is used to identify the speaker for particular session*/
        eBusinessJQObject.map(data, function (row) {
            _that.speakerInfo.push(new _that.loadSpeakerDetails(row));
        });
    };

    /*Get speaker info details*/
    _that.getSpeakerDetailsFromServer = function () {
        return eb_eventDetails.getSpeakerInfo();
    };

    if (_that.speakerDetails) {
        /*If speaker data is available then directly load it*/
        if (_that.speakerDetails.length > 0) {
            _that.loadSpeakerData(_that.speakerDetails);
        } else {
            console.log("No Speaker Available");
        }
    } else {
        /*Get the speaker details from server*/
        _that.showLoader(1);
        _that.getSpeakerDetailsFromServer().done(function (speakerinfo) {
            _that.showLoader(0);
            _that.loadSpeakerData(speakerinfo);
        }).fail(function (xhr, textStatus, errorThrow) {
            _that.showLoader(0);
            console.info("getSpeakerDetailsFromServer failed:  " + xhr.responseText);
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
        var showDescription = description.substr(0, eb_eventDetails.charLength);
        var hideDescription = description.substr(eb_eventDetails.charLength, description.length - eb_eventDetails.charLength);
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
        var descriptionLength = data;
        if (descriptionLength.length < eb_eventDetails.charLength) {
            _that.description(data);
        } else {
            _that.showMoreData(data);
        }
    };

    /*To load event data*/
    _that.loadEventData = function (data) {
        if (eb_Config.loadDefaultImage) {
            _that.eventImage = ko.observable(eb_eventDetails.defaultImage);
        }
        else {
            _that.eventImage = ko.observable(eb_Config.largeImageURL + eb_eventDetails.eventId + eb_Config.imageExtension);
        }

        _that.name = ko.observable(data['webName']);
        _that.venue = ko.observable(data['venue']);

        _that.startDate = ko.computed(function () {
            var checkTime = new Date(data['startDate']);
            return checkTime.getHours() === 0 && checkTime.getMinutes() === 0 && checkTime.getSeconds() === 0 ?
                moment(data['startDate']).format(eb_Config.defaultDateFormat) : moment(data['startDate']).format(eb_Config.eventsDateFormat);
        });

        _that.hasScheduledSpeakers = ko.observable(data['hasScheduledSpeakers']);
        _that.checkEventDescription(data['webDescription']);
        _that.collapseExpandAllText("Collapse All");
        _that.hasSessions = ko.observable(data['hasSessions']);
        _that.doShowCollapseExpandAll = ko.observable(false);

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
    };

    /*Get event details*/
    _that.getEventDetailsFromServer = function () {
        return eb_eventDetails.getEventDetails();
    };

    if (_that.data) {
        /*If data is available then directly load it*/
        _that.loadEventData(_that.data);
    } else {
        /*If data is not available then get Event details from server*/
        _that.showLoader(1);
        _that.getEventDetailsFromServer().done(function (eventData) {
            _that.showLoader(0);
            _that.loadEventData(eventData);
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
        self.sessionVenu = ko.observable(data['venue']);
        self.sessionId = ko.observable(data['id']);
        self.sessionParentId = ko.observable(data['parentProductId']);
        /*Show Prices based on person category.*/
        self.defaultMemberPrice = ko.observable(parseFloat(data['defaultMemberPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.nonMemberPrice = ko.observable(parseFloat(data['nonMemberPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.defaultPrice = ko.observable(parseFloat(data['defaultPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.retailPrice = ko.observable(parseFloat(data['retailPrice']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.currencySymbol = ko.observable(data['currencySymbol']);

        self.showCurrencySymbol = ko.observable('');
        self.showPriceOrText = ko.observable('');
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
            self.eventPrice =  self.defaultPrice();
        }
        else {
            self.eventPrice =  self.retailPrice();
        }

        if (self.hasComplexPricing()) {
            self.showPriceOrText("<span class='clsShipStatus'> Add to Cart to see Price</span>");
            self.showCurrencySymbol("");
        }
        else {
            self.showPriceOrText(self.eventPrice);
            self.showCurrencySymbol(self.currencySymbol());
        }

        eBusinessJQObject.map(_that.speakerInfo(), function (item) {
            var result = 0;
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

        self.sessionCollapse = ko.observable(1);
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
            var showDescription = description.substr(0, eb_eventDetails.charLength);
            var hideDescription = description.substr(eb_eventDetails.charLength, description.length - eb_eventDetails.charLength);
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
            var descriptionLength = data;
            if (descriptionLength.length < eb_eventDetails.charLength) {
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
        return eb_eventDetails.getSessionDetails();
    };

    _that.sessionDetailsInfo = function () {
        _that.showLoader(1);
        _that.getSessionDetailsFromServer().done(function (sessions) {
            /*But this service call doesn't return any result in that case, hence writing logic here*/
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
        _that.sessionDetailsInfo();/*called it here rather than calling within speaker block*/
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
};

/*shopping cart object*/
eb_eventDetails.shoppingCart = function (shoppingCart) {
    var self = this;
    self.shoppingCart = shoppingCart;
};

/*If image is not their, then attach no image found*/
ko.bindingHandlers.imageSrc = {
    update: function (element, valueAccessor) {
        var options = valueAccessor();
        var src = ko.unwrap(options.src);
        eBusinessJQObject('<img />').attr('src', src).on('load', function () {
            eBusinessJQObject(element).attr('src', src);
        }).on('error', function () {
            eBusinessJQObject(element).attr('src', eb_eventDetails.defaultImage);
        });
    }
};

/**
 * Page DOM element.
 * @method eb_eventDetails.domElement
 * @param {object} domElement current DOM element.
 * */
eb_eventDetails.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_eventDetails.domElement).ajaxError(function (event, xhr, settings) {
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_eventDetails);
});