/**
 * Define eb_eventRegistration class.
 * @class eb_eventRegistration
 * */
var eb_eventRegistration = eb_eventRegistration || {};

/**
 * Control level setting: Site path.
 * @property eb_eventRegistration.SitePath
 * @type {String}
 */
eb_eventRegistration.SitePath = eb_Config.SitePath;

/**
 * Control level setting Template path.
 * @property eb_eventRegistration.TemplatePath
 * @type {String}
 */
eb_eventRegistration.TemplatePath = "html/events/EventRegistration.html";

/**
 * The path to the eBusiness SOA layer.
 * @property eb_eventRegistration.ServicePath
 * @type {String}
 */
eb_eventRegistration.ServicePath = eb_Config.ServicePathV1;

/**
 * GET service to get the speaker info
 * @property eb_eventRegistration.getSpeakerData
 * @type {String}
 */
eb_eventRegistration.getSpeakerData = eb_eventRegistration.ServicePath + "Events/{eventId}/Speakers" + "?includeSessionSpeakers=true";

/**
 * GET service to get the session Info
 * @property eb_eventRegistration.getSessionInfoData
 * @type {String}
 */
eb_eventRegistration.getSessionInfoData = eb_eventRegistration.ServicePath + "Events/{eventId}/Sessions";

/**
 * GET event search result
 * @property eb_eventRegistration.getSearchDetails
 * @type {String}
 */
eb_eventRegistration.getSearchDetails = eb_eventRegistration.ServicePath + "Events/Attendees/Search?SearchTerm={search}";

/**
 * POST to Create New Attendee
 * @property eb_eventRegistration.createNewAttendee
 * @type {String}
 */
eb_eventRegistration.createNewAttendee = eb_eventRegistration.ServicePath + "Events/Attendees";

/**
 * Default product image.
 * @property eb_eventRegistration.defaultImage
 * @type {String}
 */
eb_eventRegistration.defaultImage = "../images/products/coming-soon.png";

/**
 * Get event id from URL
 * @property eb_eventRegistration.eventId
 * @type {String}
 */
eb_eventRegistration.eventId = eb_Config.getUrlParameter("productId");

/**
 * Get session true/false from URL
 * @property eb_eventRegistration.hasSessions
 * @type {String}
 */
eb_eventRegistration.hasSessions = eb_Config.getUrlParameter("hasSessions");

/**
 * Character length for show more and show less functionality
 * @property eb_eventRegistration.charLength
 * @type {Number}
 * */
eb_eventRegistration.charLength = 450;

/**
 * set second for search service call - [After particular second the search service call will be hit]
 * @property eb_eventRegistration.setSecond
 * @type {Number}
 * */
eb_eventRegistration.setSecond = 2000; /*It is in milliseconds [1000 milliseconds == 1 seconds]*/

/**
 * Process Button URL
 * @property eb_eventRegistration.proceedButtonURL
 * @type {String}
 * */
eb_eventRegistration.proceedButtonURL = eb_eventRegistration.SitePath + "viewCart.html";

/* Error messages */
eb_eventRegistration.errorMessages = {
    'Select attendee': 'Please Select the attendee to add the session.',
    'Already registered for meeting': 'Attendee is already registered.',
    'Already registered for sessions': ' is already registered.',
    'Enter new attendee details': 'Please enter First Name, Last Name, City and Email.',
    'No attendee selected': 'Please Select the attendee to add the session.',
    'Session already registered': 'Session name has already been selected for ',
    'Sessions already registered': 'Session(s) name has already been selected for '
};

/**
 * Globally defined error codes object for the control.
 * Every error code should have boolean 'useServerMessage' attribute, which when true suggests we are
 * showing service error message on the UI.
 * If the 'useServerMessage' is defined as false, then provide another attribute 'frontEndMessage' with
 * the error string which will be shown on UI.
 * If 'useServerMessage' is false and 'frontEndMessage' is not defined, default error message will be shown.
 * If service error response contains error code not defined in this object then default error message will be shown.
 * 
 * @property eb_eventRegistration.errorResponses
 * @type {Object}
 * */
eb_eventRegistration.errorResponses = {
    190: { useServerMessage: false, frontEndMessage: 'Person with same details already exists. Please try again.' },
    414: { useServerMessage: true }
};

/**
 * Default error message.
 * @property eb_eventRegistration.defaultErrorMessage
 * @type {String}
 * */
eb_eventRegistration.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/**
 * Rendering public method to load HTML template. Based on page level configuration it will select the template and load in DOM
 * @method eb_eventRegistration.render
 * @param {any} options
 * @param {String} options.SitePath Site path.
 * @param {String} options.templatePath  HTML file path.
 * @param {Object} options.domElement  DOM element.
 * */
eb_eventRegistration.render = function (options) {
    var def = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            var finalPath = eb_eventRegistration.SitePath + eb_eventRegistration.TemplatePath;
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
 * Get Speaker Info Service
 * @method eb_eventRegistration.getSpeakerInfo
 * @param {Boolean} hasSession True/False value for validating the session is available or not
 * @param {Number} eventId EventId 
 * @return {Object} To get speaker info
 * */
eb_eventRegistration.getSpeakerInfo = function (eventId, hasSession) {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for getting speaker info');
    var speakerData = [];
    if (hasSession) {
        if (eventId <= 0) {
            throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
        }

        if (!Number(eventId)) {
            throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
        }

        eBusinessJQObject.get(
            {
                url: eb_eventRegistration.getSpeakerData.replace("{eventId}", eventId),
                xhrFields: {
                    withCredentials: true
                }
            }
        ).done(function (result) {
            deferred.resolve(result);
        }).fail(deferred.reject);
    } else {
        deferred.resolve(speakerData);
    }
    return deferred.promise();
};

/** 
 * Get Session Details
 * @method eb_eventRegistration.getSessionDetails
 * @param {Boolean} hasSession True/False value for validating the session is available or not
 * @param {Number} eventId EventId 
 * @return {Object} To get session details
 * */
eb_eventRegistration.getSessionDetails = function (eventId, hasSession) {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for session details');
    var sessionDetails = [];
    if (hasSession) {
        if (eventId <= 0) {
            throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
        }

        if (!Number(eventId)) {
            throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
        }

        eBusinessJQObject.get(
            {
                url: eb_eventRegistration.getSessionInfoData.replace("{eventId}", eventId),
                xhrFields: {
                    withCredentials: true
                }
            }
        ).done(function (result) {
            deferred.resolve(result);
        }).fail(deferred.reject);
    } else {
        deferred.resolve(sessionDetails);
    }
    return deferred.promise();
};

/** 
 * Get Search Results
 * @method eb_eventRegistration.getSearchData
 * @param {String} Search Text data to search the record
 * @return {Object} To get all search record
 * */
eb_eventRegistration.getSearchData = function (search) {
    var deferred = eBusinessJQObject.Deferred();
    console.info('service call for search data');
    if (!search) {
        throw { type: "argument_mismatch", message: 'Missing result.', stack: Error().stack };
    }
    eBusinessJQObject.get(
        {
            url: eb_eventRegistration.getSearchDetails.replace("{search}", search),
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
 * POST to Create New Attendee
 * @method eb_eventRegistration.createAttendee
 * @param {String} firstName firstName
 * @param {String} lastName lastName
 * @param {String} email    email
 * @param {String} city     city
 * @return {Number} Id of created Attendee
 * */
eb_eventRegistration.createAttendee = function (firstName, lastName, email, city) {
    var deferred = eBusinessJQObject.Deferred();

    if (!firstName) {
        throw { type: "argument_mismatch", message: 'Missing firstName.', stack: Error().stack };
    }
    if (!lastName) {
        throw { type: "argument_mismatch", message: 'Missing lastName.', stack: Error().stack };
    }
    if (!email) {
        throw { type: "argument_mismatch", message: 'Missing email.', stack: Error().stack };
    }
    if (!city) {
        throw { type: "argument_mismatch", message: 'Missing city.', stack: Error().stack };
    }

    console.log('service call to create new attendee');

    data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        city: city
    };
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_eventRegistration.createNewAttendee,
            type: "POST",
            data: data,
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (result) {
            deferred.resolve(result);
        }).fail(deferred.reject);
    });
    return deferred.promise();
};

/**
 * EventRegistration Model for binding data
 * @method eb_eventRegistration.model
 * @param {any} options
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL
 * @param {Object} options.shoppingCart Shopping cart data.
 * @param {Object} options.domElement DOM element.
 * @param {String} options.templatePath HTML path.
 * @param {Number} options.personId Id of person.
 * @param {Object} options.sessionDetails All the session details
 * @param {Object} options.speakerData All the speaker details
 */
eb_eventRegistration.model = function (options) {
    var _that = this;
    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement property is required.", stack: Error().stack };
    }

    _that.domElement = options.domElement;
    _that.speakerInfo = ko.observableArray();
    _that.sessionDetails = ko.observableArray();
    _that.allSearchData = ko.observableArray();
    _that.noRecord = ko.observable(0); /*search result not found*/
    _that.recordFound = ko.observable(0); /*search result found*/
    _that.result = ko.observable(0); /*show search result*/
    _that.showPersonDetails = ko.observable(0); /*Person Details */
    _that.search = ko.observable().extend({ rateLimit: eb_eventRegistration.setSecond }); /* Set the second */
    _that.personId = ko.observable();
    _that.personFirstName = ko.observable();
    _that.personLastName = ko.observable();
    _that.personCity = ko.observable();
    _that.numberOfSessionSelected = ko.observableArray();
    _that.newPersonDetails = ko.observable(0);
    _that.newFirstName = ko.observable("");
    _that.newLastName = ko.observable("");
    _that.newCity = ko.observable("");
    _that.newEmail = ko.observable("");
    _that.showAddAttendee = ko.observable(0);
    _that.NewAttendee = ko.observable(0);
    _that.showSearchBox = ko.observable(1);
    _that.addSession = ko.observable(1);
    _that.registerMeeting = ko.observableArray();
    _that.registerSession = ko.observableArray();
    _that.errorSessionMessage = ko.observable();
    _that.errorCreateAttendee = ko.observable(0);
    _that.errorCreateAttendeeMessage = ko.observable();
    _that.totalFinalPrice = ko.observable(0);
    _that.hideRegistrationSummary = ko.observable(0);
    _that.disableProceedButton = ko.observable(0);
    _that.showSelectExpandBar = ko.observable(1);
    _that.total = ko.observable(0);
    _that.doWaitAddAttendee = ko.observable(false);
    _that.selectAllText = ko.observable("Select All");
    _that.sessionErrorCount = ko.observable(0);
    _that.listOfSession = ko.observable();
    _that.selectedSession = ko.observable();
    _that.selectError = ko.observable(0);
    _that.selectAllErrorMessage = ko.observable("");
    _that.collapseExpandAllText = ko.observable();
    eb_eventRegistration.domElement(_that.domElement);
    _that.showLoader = ko.observable(0);

    /*Check user context*/
    if (options.personId) {
        eb_eventRegistration.personId = options.personId;
    }

    /*Name of Login User*/
    if (options.nameOfUser) {
        eb_eventRegistration.userName = options.nameOfUser;
    }

    /*Shopping cart*/
    if (options.shoppingCart) {
        _that.shoppingCart = options.shoppingCart;
        _that.currencySymbol = _that.shoppingCart.currencySymbol();
        eb_eventRegistration.shoppingCart(options.shoppingCart);
    }

    /*To registration summary to show meeting*/
    _that.registrationSummary = function (row) {
        var self = this;
        var _row = row[0] || row;
        var attendeeName = _row['description'].slice(17);
        self.meetingAttendeeName = ko.observable(attendeeName);
        if (_row['webName']) {
            self.meetingName = ko.observable(_row['webName']);
        } else {
            self.meetingName = ko.observable(_row['productName']);
        }

        self.meetingPrice = ko.observable(_that.currencySymbol + parseFloat(_row['price']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.attendeeId = ko.observable(_row['attendeeId']);
        self.productId = ko.observable(_row['productId']);
        self.id = ko.observable(_row['id']);
        self.registerSession = ko.observableArray();
        _that.total(_that.total() + _row.price);
        _that.totalFinalPrice(_that.currencySymbol + parseFloat(_that.total()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
    };

    /*To show session*/
    _that.registerSessions = function (data) {
        var self = this;
        if (data['webName']) {
            self.sessionName = ko.observable(data['webName']);
        } else {
            self.sessionName = ko.observable(data['productName']);
        }
        self.sessionPrice = ko.observable(_that.currencySymbol + parseFloat(data['price']).toFixed(eb_Config.roundOffDigitsAfterDecimal));
        self.sessionProductId = ko.observable(data['productId']);
        self.sessionAttendeeId = ko.observable(data['attendeeId']);
        self.id = ko.observable(data['id']);
        _that.total(_that.total() + data.price);
        _that.totalFinalPrice(_that.currencySymbol + parseFloat(_that.total()).toFixed(eb_Config.roundOffDigitsAfterDecimal));
    };

    /*To show all the meeting and session data*/
    _that.getAttendeeData = function () {
        _that.errorCreateAttendee(0);
        _that.showLoader(1);
        eb_shoppingCart.eventProductItems().done(function (result) {
            _that.showLoader(0);
            if (result.length > 0) {
                eBusinessJQObject.map(result, function (row) {
                    if (row.productType.toLowerCase() === "meeting") {
                        if (eb_eventRegistration.eventId == row.productId || eb_eventRegistration.eventId == row.parentproductId) {
                            var mainMeeting = ko.utils.arrayFirst(_that.registerMeeting(), function (meeting) {
                                if (meeting.attendeeId() === row.attendeeId) {
                                    return meeting.productId() === row.parentproductId;
                                } else {
                                    return null;
                                }
                            });
                            if (mainMeeting) {
                                mainMeeting.registerSession.push(new _that.registerSessions(row));
                            } else {
                                _that.registerMeeting.push(new _that.registrationSummary(row))
                            }
                            _that.hideRegistrationSummary(1);
                            _that.disableProceedButton(1);
                        }
                    }
                });
            }
        });
        _that.collapseExpandAllText("Expand All");
    };

    /*To get Meeting and sessions data*/
    _that.getAttendeeData();

    /*Search Result*/
    _that.searchResults = function (row) {
        var self = this;
        self.firstName = ko.observable(row['firstName']);
        self.lastName = ko.observable(row['lastName']);
        self.city = ko.observable(row['city']);
        self.attendeeID = ko.observable(row['id']);
    };

    /*Proceed to view cart page*/
    _that.proceedClick = function () {
        if (eb_eventRegistration.proceedButtonURL) {
            window.location.assign(eb_eventRegistration.proceedButtonURL);
        }
        else {
            console.error("Incorrect file path.");
        }
    };

    /*Search Service Call*/
    _that.search.subscribe(function () {
        var result = _that.search().trim();   /*value of search field */
        _that.newPersonDetails(0);
        _that.newPersonDetails(0);
        _that.NewAttendee(0);
        _that.errorCreateAttendee(0);
        if (result.length > 0) {
            if (result.length > 2) {
                eBusinessJQObject.when(eb_eventRegistration.getSearchData(result)).done(function (searchResult) {
                    _that.allSearchData.removeAll();
                    _that.result(1);
                    _that.noRecord(0);
                    if (searchResult.length > 0) {
                        _that.result(1);
                        _that.recordFound(1);
                        eBusinessJQObject.map(searchResult, function (row) {
                            _that.allSearchData.push(new _that.searchResults(row));
                        });
                    } else {
                        _that.noRecord(1);
                    }
                }).fail(function (xhr, textStatus, errorThrow) {
                    _that.result(1);
                    _that.noRecord(1);
                    console.info("getSearchData failed:  " + xhr.responseText);
                });
            }
        } else {
            _that.showPersonDetails(0);
            _that.showAddAttendee(0);
            _that.recordFound(0);
            _that.result(1);
            _that.noRecord(1);
            _that.addSession(1);
            _that.personId("");
            _that.personFirstName("");
            _that.personLastName("");
        }
    });

    /*Select the particular attendee on search field*/
    _that.selectAttendee = function (data) {
        _that.recordFound(0);
        _that.result(0);
        _that.addSession(0);
        _that.showPersonDetails(1);
        _that.showAddAttendee(1);
        _that.personId(data.attendeeID());
        _that.personFirstName(data.firstName());
        _that.personLastName(data.lastName());
        _that.personCity(data.city());
        _that.NewAttendee(0);
    };

    /*Getting Speaker Details*/
    _that.loadSpeakerDetails = function (row) {
        var self = this;
        self.speakerName = ko.observable(row['name']);
        self.eventId = ko.observable(row['eventId']);
        self.companyName = ko.observable(row['companyName']);
        self.title = ko.observable(row['title']);
        self.type = ko.observable(row['type']);
    };

    /*Speaker Info*/
    if (options.speakerData) {
        eBusinessJQObject.map(options.speakerData, function (row) {
            _that.speakerInfo.push(new _that.loadSpeakerDetails(row));
        });
    }

    /*Session List*/
    _that.sessionListDetails = function (data) {
        var self = this;
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

        self.hasComplexPricing = ko.observable(data['hasComplexPricing']);
        self.showCurrencySymbol = ko.observable('');
        self.showPriceOrText = ko.observable('');

        self.remainingDescription = ko.observable("");
        self.showRemainingDescription = ko.observable(0);
        self.showMoreHide = ko.observable(0);
        self.showMoreDescription = ko.observable(1);
        self.hideRemainingDescription = ko.observable(0);
        self.showEllipses = ko.observable(0);
        self.sessionDescription = ko.observable("");
        self.sessionSpeakerMultiName = ko.observableArray();
        self.selectedSession = ko.observableArray();
        self.selectTheSession = ko.observable(0);
        self.unselectTheSession = ko.observable(0);
        self.sessionErrorShow = ko.observable(0);
        self.sessionErrorMessage = ko.observable();

        /*On Check box clicked function will trigger*/
        self.sessionClicked = function () {
            /*If it is new person created, then don't check session is already registered or not*/
            if (_that.newFirstName() == "" && _that.newLastName() == "" && _that.newCity() == "" && _that.newEmail() == "") {
                /*logic to check if all sessions are selected/unselected and change text of Select/Unselected All accordingly */
                var isSelected = true;
                var isUnselected = true;
                var isSessionAdded = true;
                var personId = _that.personId() || eb_eventRegistration.personId;
                self.sessionErrorMessage("");
                eBusinessJQObject.each(_that.sessionDetails(), function (idx, sessionDetail) {
                    if (sessionDetail.selectTheSession()) {
                        isUnselected = false;
                    }
                    else {
                        isSelected = false;
                    }
                });
                if (isSelected) {
                    _that.selectAllText("Unselect All");
                }
                else if (isUnselected) {
                    _that.selectAllText("Select All");
                }

                /*On Session Check box click, it will generate message if it has been already registered to particular attendee*/
                var registerMeeting = ko.utils.arrayFirst(_that.registerMeeting(), function (meetings) {
                    return meetings.attendeeId() == personId;
                });

                /*To Check Attendee register to meeting and also checked whether the session is selected*/
                if (registerMeeting && self.selectTheSession()) {
                    var registerSession = ko.utils.arrayFirst(registerMeeting.registerSession(), function (row) {
                        if (row.sessionProductId() == self.sessionId() && row.sessionAttendeeId() == personId) {
                            recordFound = true;
                            self.sessionErrorShow(1);

                            if (_that.personFirstName() && _that.personLastName()) {
                                self.sessionErrorMessage(eb_eventRegistration.errorMessages['Session already registered'].replace("name", row.sessionName()) + _that.personFirstName() + " " + _that.personLastName());
                                isSessionAdded = false;
                                self.selectTheSession(false)
                            }
                            else if (_that.newFirstName() || _that.newLastName()) {
                                self.sessionErrorMessage(eb_eventRegistration.errorMessages['Session already registered'].replace("name", row.sessionName()) + _that.newFirstName() + " " + _that.newLastName());
                                isSessionAdded = false;
                                self.selectTheSession(false)
                            }
                            else {
                                self.sessionErrorMessage(eb_eventRegistration.errorMessages['Session already registered'].replace("name", row.sessionName()) + eb_eventRegistration.userName);
                                isSessionAdded = false;
                                self.selectTheSession(false)
                            }
                            if (isSessionAdded) {
                                _that.selectedSession(row.sessionName());
                            }

                            /*eBusinessJQObject(_that.domElement).find('#collapse' + self.sessionId()).modal();*/
                            /*Bootstrap5.3 Modal Code Change Start*/
                            var meetingConflictModal = document.getElementById("collapse" + self.sessionId());
                            new bootstrap.Modal(meetingConflictModal).show();
                            /*Bootstrap5.3 Modal Code Change End*/
                        }
                    })
                }
            } else { return true; }
            return isSessionAdded;
        };

        /*Pricing scenario*/
        if (self.defaultPrice() > 0) {
            self.eventPrice = self.defaultPrice();
        }
        else {
            self.eventPrice = self.retailPrice();
        }

        if (self.hasComplexPricing()) {
            self.showPriceOrText("<span class='clsShipStatus'> Add to Cart to see Price</span>");
            self.showCurrencySymbol("");
        }
        else {
            self.showPriceOrText(self.eventPrice);
            self.showCurrencySymbol(self.currencySymbol());
        }

        var sessionSpeakerName = '';
        if (_that.speakerInfo().length !== 0) {
            eBusinessJQObject.map(_that.speakerInfo(), function (item) {
                if (item.eventId() === self.sessionId()) {
                    if (item.speakerName() !== '') {
                        sessionSpeakerName = item.speakerName();
                    } else
                        sessionSpeakerName = 'N/A';
                }
            });

        } else {
            sessionSpeakerName = 'N/A';
        }

        self.sessionSpeakerName = ko.observable(sessionSpeakerName);
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
            var showDescription = description.substr(0, eb_eventRegistration.charLength);
            var hideDescription = description.substr(eb_eventRegistration.charLength, description.length - eb_eventRegistration.charLength);
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
            if (descriptionLength.length < eb_eventRegistration.charLength) {
                self.sessionDescription(data);
            } else {
                self.showMoreData(data);
            }
        };
        self.checkEventDescription(data['webDescription']);

    };

    /*To Unchecked the individual session*/
    _that.unCheckedSession = function (unchecked) {
        unchecked.selectTheSession(0);
    }

    /*collapse/expand all*/
    _that.collapseExpandAll = function () {
        if (_that.collapseExpandAllText() == "Collapse All") {
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

    /*Session List*/
    if (options.sessionDetails) {
        if (options.sessionDetails.length > 0) {
            eBusinessJQObject.map(options.sessionDetails, function (row) {
                _that.sessionDetails.push(new _that.sessionListDetails(row));
            });
        } else {
            _that.addSession(0);
            _that.showSelectExpandBar(0);
        }
    }

    /*Add session to attendee*/
    _that.addSelectedSessionToAttendee = function (sessionId, quantity, productType, personId) {
        var def = eBusinessJQObject.Deferred();
        var addSession = {};
        addSession.quantity = 1;
        addSession.productType = productType;
        addSession.attendeeId = personId;
        addSession.productId = sessionId;
        addSession.newCartItem = true;

        var registerMeeting = ko.utils.arrayFirst(_that.registerMeeting(), function (meetings) {
            return meetings.attendeeId() == personId;
        });

        if (registerMeeting) {
            eb_eventRegistration.shoppingCart.addToCart(addSession).done(function (result) {
                _that.showLoader(0);

                ko.utils.arrayFirst(_that.sessionDetails(), function (sessionData) {
                    if (sessionData.selectTheSession()) {
                        sessionData.selectTheSession(0);
                    }
                });

                var regMeeting = ko.utils.arrayFirst(_that.registerMeeting(), function (meetings) {
                    return meetings.attendeeId() == personId;
                });

                for (var i = 0; i < result.length; i++)
                    regMeeting.registerSession.push(new _that.registerSessions(result[i]));

                _that.hideRegistrationSummary(1);
                _that.disableProceedButton(1);
                def.resolve(result);

            }).fail(function (data, msg, jhr) {
                _that.showLoader(0);
                console.error("Failed to add the sessions to attendee. " + personId);
            });
        } else {
            _that.showLoader(0);
            _that.errorCreateAttendee(1);
            _that.errorCreateAttendeeMessage(eb_eventRegistration.errorMessages['No attendee selected']);
        }
        return def.promise();
    };

    /*Add Session Call*/
    _that.addAttendeeSession = function (def, quantity, productType, attendeeId) {
        var defin = eBusinessJQObject.Deferred();
        var seesionCount = 0;
        var sessionServiceDone = 0;
        var sessionIds = [];

        var addSessions = ko.utils.arrayFirst(_that.sessionDetails(), function (sessionData) {
            if (sessionData.selectTheSession()) {
                sessionIds.push(sessionData.sessionId())
            }
        });
        _that.showLoader(1);
        if (sessionIds.length) {
            _that.addSelectedSessionToAttendee(sessionIds, quantity, "meeting", attendeeId).done(function (result) {
                _that.showLoader(0);
                _that.selectAllText("Select All");
                defin.resolve(result);
            }).fail(function (xhr, data, msg) {
                _that.showLoader(0);
            });
        }
        else {
            defin.resolve();
        }
        
        return defin.promise();
    };

    /*Attendee Call*/
    _that.checkAttendeeAvailable = function (quantity, productType, attendeeId, productId) {
        var def = eBusinessJQObject.Deferred();
        var addAttendee = {};
        addAttendee.quantity = quantity;
        addAttendee.productType = productType;
        var ids = [productId];
        addAttendee.productId = ids;
        addAttendee.attendeeId = attendeeId;
        addAttendee.newCartItem = true;
        _that.showLoader(1);
        if (!checkAttendeeExist(attendeeId)) {
            eb_eventRegistration.shoppingCart.addToCart(addAttendee).done(function (result) {

                for (var i = 0; i < result.length; i++)
                    _that.registerMeeting.push(new _that.registrationSummary(result[i]));

                _that.addAttendeeSession(def, quantity, productType, attendeeId).done(function () {
                    _that.showLoader(1);
                    eb_eventRegistration.shoppingCart.getShoppingCart().done(function (shoppingCart) {
                        _that.showLoader(0);
                        def.resolve(result);
                    }).fail(function (data, msg, jhr) {
                        _that.showLoader(0);
                        _that.errorCreateAttendee(1);
                        if (data && typeof data.responseJSON !== 'undefined')
                            _that.errorCreateAttendeeMessage(eb_Config.getErrorMessageForControl(data.responseJSON, eb_eventRegistration));
                        else
                            _that.errorCreateAttendeeMessage(eb_eventRegistration.defaultErrorMessage);
                    });
                }).fail(function (data, msg, jhr) {
                    _that.showLoader(0);
                    _that.errorCreateAttendee(1);
                    if (data && typeof data.responseJSON !== 'undefined')
                        _that.errorCreateAttendeeMessage(eb_Config.getErrorMessageForControl(data.responseJSON, eb_eventRegistration));
                    else
                        _that.errorCreateAttendeeMessage(eb_eventRegistration.defaultErrorMessage);
                });
                _that.hideRegistrationSummary(1);
                _that.disableProceedButton(1);
                _that.selectAllText("Select All");
            }).fail(function (data, msg, jhr) {
                _that.showLoader(0);
                _that.errorCreateAttendee(1);
                if (data && typeof data.responseJSON !== 'undefined')
                    _that.errorCreateAttendeeMessage(eb_Config.getErrorMessageForControl(data.responseJSON, eb_eventRegistration));
                else
                    _that.errorCreateAttendeeMessage(eb_eventRegistration.defaultErrorMessage);
            });
        } else {
            _that.showLoader(0);
            _that.errorCreateAttendee(1);
            _that.errorCreateAttendeeMessage(eb_eventRegistration.errorMessages['Already registered for meeting']);
            _that.addAttendeeSession(def, quantity, productType, attendeeId).done(function () {
                _that.showLoader(1);
                eb_eventRegistration.shoppingCart.getShoppingCart().done(function (shoppingCart) {
                    _that.showLoader(0);
                }).fail(function (data, msg, jhr) {
                    _that.showLoader(0);
                });
            }).fail(function (data, msg, jhr) {
                _that.showLoader(0);
                _that.errorCreateAttendee(1);
                if (data && typeof data.responseJSON !== 'undefined')
                    _that.errorCreateAttendeeMessage(eb_Config.getErrorMessageForControl(data.responseJSON, eb_eventRegistration));
                else
                    _that.errorCreateAttendeeMessage(eb_eventRegistration.defaultErrorMessage);
            });
        }

        function checkAttendeeExist(attendeeId) {
            var recordFound = false;
            ko.utils.arrayFirst(_that.registerMeeting(), function (row) {
                if (row.attendeeId() === attendeeId) {
                    recordFound = true;
                }
            });
            return recordFound;
        }
    };

    /*Add Attendee*/
    /*If the person is selected from search field, then this call will trigger*/
    _that.addAttendee = function () {
        var addAttendee = {};
        addAttendee.quantity = 1;
        addAttendee.productType = 'meeting';
        addAttendee.attendeeId = _that.personId();
        addAttendee.productId = eb_eventRegistration.eventId;
        _that.sessionErrorCount(0);
        _that.errorSessionMessage("");
        _that.errorCreateAttendee(0);
        _that.selectedSession("")
        /*Attendee Call*/
        _that.checkAttendeeAvailable(addAttendee.quantity, addAttendee.productType, addAttendee.attendeeId, addAttendee.productId);
    };

    /*function executes when we click on Create New Person Link*/
    _that.createNewPerson = function () {
        _that.result(0);
        _that.showAddAttendee(0);
        _that.NewAttendee(1);
        _that.newPersonDetails(1);
        _that.showPersonDetails(0);
        _that.recordFound(0);
        _that.noRecord(0);
        _that.addSession(0);
        _that.errorCreateAttendee(0);
    };

    /*To Create The Attendee*/
    _that.createAttendee = function () {
        _that.errorCreateAttendee(0);
        var createAttendee = {};
        createAttendee.quantity = 1;
        createAttendee.productType = 'meeting';
        createAttendee.productId = eb_eventRegistration.eventId;
        if (_that.newFirstName() && _that.newLastName() && _that.newCity() && _that.newEmail()) {
            _that.showLoader(1);
            eb_eventRegistration.createAttendee(_that.newFirstName(), _that.newLastName(), _that.newEmail(), _that.newCity()).done(function (result) {
                createAttendee.attendeeId = result.id;
                _that.checkAttendeeAvailable(createAttendee.quantity, createAttendee.productType, createAttendee.attendeeId, createAttendee.productId);
                _that.newFirstName("");
                _that.newLastName("");
                _that.newCity("");
                _that.newEmail("");
                _that.errorCreateAttendee(0);
            }).fail(function (xhr, data, msg) {
                _that.showLoader(0);
                _that.errorCreateAttendee(1);
                if (xhr && typeof xhr.responseJSON !== 'undefined')
                    _that.errorCreateAttendeeMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_eventRegistration));
                else
                    _that.errorCreateAttendeeMessage(eb_eventRegistration.defaultErrorMessage);
            });
        } else {
            _that.showLoader(0);
            _that.errorCreateAttendee(1);
            _that.errorCreateAttendeeMessage(eb_eventRegistration.errorMessages['Enter new attendee details']);
        }
    };

    /*Add Session to attendee, when no person is selected from search box, it execute only for the user login personID */
    _that.addSessionToAttendee = function () {
        _that.errorCreateAttendee(0);
        _that.sessionErrorCount(0);
        _that.errorSessionMessage("");
        _that.selectedSession("");
        var sessionName = "";
        var addAttendee = {};
        var sessionIds = [];
        addAttendee.quantity = 1;
        addAttendee.productType = 'meeting';
        addAttendee.personId = eb_eventRegistration.personId;
        var sessionsCount = 0;
        var serviceDoneCount = 0;
        _that.showLoader(1);
        var addSessions = ko.utils.arrayFirst(_that.sessionDetails(), function (sessionData) {
            if (sessionData.selectTheSession()) {
                sessionIds.push(sessionData.sessionId())
            }
        });

        _that.addSelectedSessionToAttendee(sessionIds, addAttendee.quantity, addAttendee.productType, addAttendee.personId).done(function (result) {
            _that.showLoader(1);
            eb_eventRegistration.shoppingCart.getShoppingCart().done(function (shoppingCart) {
                _that.showLoader(0);
                _that.selectAllText("Select All");
            }).fail(function (data, msg, jhr) {
                _that.showLoader(0);
            });
        }).fail(function (xhr, data, msg) {
            _that.showLoader(0);
        });
    };

    /*Remove Session*/
    _that.removeMeeting = function (data) {
        if (data.id()) {
            var dataToRemove = {};
            dataToRemove.id = data.id();
            _that.showLoader(1);
            eb_eventRegistration.shoppingCart.removeEventItems(dataToRemove).done(function (result) {
                _that.registerMeeting.removeAll();
                _that.hideRegistrationSummary(0);
                _that.disableProceedButton(0);
                _that.total(0);
                _that.totalFinalPrice(0);
                _that.getAttendeeData();
                _that.showLoader(0);
            }).fail(function (data, msg, jhr) {
                _that.showLoader(0);
                console.error("Failed to remove item from cart : " + data.id());
            });
        }
    }

    /*On click on the session check box, add Session Button Will be enable*/
    _that.enableAddSessionButton = ko.computed(function () {
        var selected = false;
        var isSelectedSession = ko.utils.arrayFirst(_that.sessionDetails(), function (sessionData) {
            if (sessionData.selectTheSession()) {
                selected = true;
            }
        });
        _that.errorCreateAttendee(0);

        return selected;
    });

    /*To select all the session*/
    _that.selectAll = function (e) {
        eBusinessJQObject.each(_that.sessionDetails(), function (idx, sessionDetail) {
            sessionDetail.selectTheSession(1);
        });
    };

    /*To unselected all the session*/
    _that.unSelectAll = function (e) {
        eBusinessJQObject.each(_that.sessionDetails(), function (idx, sessionDetail) {
            sessionDetail.unselectTheSession(0);
        });
    };

    /*Select Unselected Session*/
    _that.selectUnselectAll = function () {
        _that.selectedSession("");
        _that.listOfSession("");
        _that.sessionErrorCount(0);
        var recordFound = false;
        if (_that.selectAllText() == "Select All") {
            /*To Get the PersonId */
            var personId = _that.personId() || eb_eventRegistration.personId;
            var registerMeeting = ko.utils.arrayFirst(_that.registerMeeting(), function (meetings) {
                return meetings.attendeeId() == personId;
            });

            /*This is for to select all attendee*/
            eBusinessJQObject.each(_that.sessionDetails(), function (idx, sessionDetail) {
                sessionDetail.selectTheSession(1);
                /*To Check Attendee register to meeting */
                if (registerMeeting) {
                    var registerSession = ko.utils.arrayFirst(registerMeeting.registerSession(), function (row) {
                        if (row.sessionProductId() == sessionDetail.sessionId() && row.sessionAttendeeId() == personId) {
                            recordFound = true;
                            _that.listOfSession(row.sessionName());
                            if (_that.sessionErrorCount() == 0) {
                                sessionDetail.selectTheSession(0)
                                _that.sessionErrorCount(_that.sessionErrorCount() + 1);
                            } else {
                                _that.listOfSession(_that.listOfSession() + " ," + row.sessionName());
                                sessionDetail.selectTheSession(0);
                            }
                        }
                    });
                }
            });

            /*To Check the session error count and accordingly update the session*/
            if (_that.sessionErrorCount() > 0) {
                _that.selectError(1);
                if (_that.personFirstName() && _that.personLastName()) {
                    _that.selectAllErrorMessage(eb_eventRegistration.errorMessages['Sessions already registered'].replace("name", _that.selectedSession()) + _that.personFirstName() + " " + _that.personLastName());
                }
                else if (_that.newFirstName() || _that.newLastName()) {
                    _that.selectAllErrorMessage(eb_eventRegistration.errorMessages['Sessions already registered'].replace("name", _that.selectedSession()) + _that.newFirstName() + " " + _that.newLastName());
                }
                else {
                    _that.selectAllErrorMessage(eb_eventRegistration.errorMessages['Sessions already registered'].replace("name", _that.selectedSession()) + eb_eventRegistration.userName);
                }

                /*eBusinessJQObject(_that.domElement).find('#eb-conflict-meeting-for-selectAll').modal()*/
                /*Bootstrap5.3 Modal Code Change Start*/
                var meetingConflictModal = document.getElementById("eb-conflict-meeting-for-selectAll");
                new bootstrap.Modal(meetingConflictModal).show();
                /*Bootstrap5.3 Modal Code Change End*/
            }

            /*If session is already register then it unselected the session and text remain the SelectAll, 
             * if session is not register previously then text changes to  UnSelectAll 
             */
            if (recordFound) {
                _that.selectAllText("Select All");
            } else {
                _that.selectAllText("Unselect All");
            }
        }
        else {
            eBusinessJQObject.each(_that.sessionDetails(), function (idx, sessionDetail) {
                sessionDetail.selectTheSession(0);
            });
            _that.selectAllText("Select All");
        }
    };

    /*To Unchecked the sessions if they are already registered, which are selected by select All */
    _that.unSelectExitsingAttendee = function () {
        var personId = _that.personId() || eb_eventRegistration.personId;
        var registerMeeting = ko.utils.arrayFirst(_that.registerMeeting(), function (meetings) {
            return meetings.attendeeId() == personId;
        });

        /*To Check Attendee register to meeting */
        if (registerMeeting) {
            eBusinessJQObject.each(_that.sessionDetails(), function (idx, sessionDetail) {
                var registerSession = ko.utils.arrayFirst(registerMeeting.registerSession(), function (row) {
                    if (row.sessionProductId() == sessionDetail.sessionId() && row.sessionAttendeeId() == personId) {
                        /*Uncheck the sessions if they are already registered*/
                        sessionDetail.selectTheSession(0);
                    }
                });
            });
        }
    };
};

/*Shopping cart object.*/
eb_eventRegistration.shoppingCart = function (shoppingCart) {
    var self = this;
    self.shoppingCart = shoppingCart;
};

/**
 * Page DOM element.
 * @method eb_eventRegistration.domElement
 * @param {object} domElement current DOM element.
 * */
eb_eventRegistration.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_eventRegistration.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_eventRegistration);
});