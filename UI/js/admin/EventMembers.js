/**
 * Event Members class.
 * @class eb_EventMembers
 * */
var eb_EventMembers = eb_EventMembers || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_EventMembers.SitePath
 * @type {String}
 * */
eb_EventMembers.SitePath = eb_Config.SitePath;

/**
 * Event Members template path.
 * @property eb_EventMembers.TemplatePath
 * @type {String}
 * */
eb_EventMembers.TemplatePath = "html/admin/EventMembers.html";

/**
 * SOA path.
 * @property eb_EventMembers.ServicePath
 * @type {String}
 * */
eb_EventMembers.ServicePath = eb_Config.ServicePathV1;

/**
 * GET service to get all confirmed Member details for event
 * @property eb_EventMembers.getEventConfirmedMembersService
 * @type {String}
 */
eb_EventMembers.getEventConfirmedMembersService = eb_EventMembers.ServicePath + "admin/company/{id}/Events/{productId}/Registered";

/**
 * GET service to get all waitlist Member details for event
 * @property eb_EventMembers.getEventWaitlistMembersService
 * @type {String}
 */
eb_EventMembers.getEventWaitlistMembersService = eb_EventMembers.ServicePath + "admin/company/{id}/Events/{productId}/Waitlisting";

/**
 * GET service to get all Member details for event
 * @property eb_EventMembers.getEventAllMembersService
 * @type {String}
 */
eb_EventMembers.getEventAllMembersService = eb_EventMembers.ServicePath + "admin/company/{id}/Events/{productId}/All";

/**
 * GET service to get badge information
 * @property eb_EventMembers.getBadgeInformationService
 * @type {String}
 */
eb_EventMembers.getBadgeInformationService = eb_EventMembers.ServicePath + "admin/company/{id}/Order/{orderId}/OrderDetail/{orderDetailId}/BadgeDetails";

/**
 * PATCH service to update badge information
 * @property eb_EventMembers.updateBadgeInformationService
 * @type {String}
 */
eb_EventMembers.updateBadgeInformationService = eb_EventMembers.ServicePath + "admin/company/{id}/Order/{orderId}/OrderMeetDetail/{orderMeetDetailId}/BadgeDetails";

/**
 * GET event id from URL
 * @property  eb_EventMembers.productId
 * @type {String}
 */
eb_EventMembers.productId = eb_Config.getUrlParameter("productId");

/**
 * GET company id from URL
 * @property  eb_EventMembers.companyId
 * @type {String}
 */
eb_EventMembers.companyId = 0;

/**
 * GET registration type from URL
 * @property  eb_EventMembers.registrationType
 * @type {String}
 */
eb_EventMembers.registrationType = eb_Config.getUrlParameter("registrationType");

/**
 * The service will return Event Members HTML.
 * Template path and DOM element are required parameters.
 * @method eb_EventMembers.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Events Members template URL.
 * @return {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_EventMembers.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_EventMembers.SitePath + eb_EventMembers.TemplatePath;
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
 * Get event members data from the server through the get service call.
 * The service will return list of all required members for the event.
 * @method eb_EventMembers.getUpcomingEvents
 * @return {Object} jQuery promise object which when resolved returns list of all required members.
 */
eb_EventMembers.getEventMembers = function (companyId) {
    var defer = eBusinessJQObject.Deferred();
    var memberRegistrationType = eb_EventMembers.registrationType;
    var serviceURL = "";
    console.info('service call for all getting  members for event');

    if (companyId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing companyId.', stack: Error().stack };
    }

    if (!Number(companyId)) {
        throw { type: "argument_mismatch", message: 'Missing companyId.', stack: Error().stack };
    }

    if (eb_EventMembers.productId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    if (!Number(eb_EventMembers.productId)) {
        throw { type: "argument_mismatch", message: 'Missing eventId.', stack: Error().stack };
    }

    switch (memberRegistrationType) {
        case "Confirmed":
            serviceURL = eb_EventMembers.getEventConfirmedMembersService.replace("{id}", companyId).replace("{productId}", eb_EventMembers.productId);
            break;
        case "Waitlist":
            serviceURL = eb_EventMembers.getEventWaitlistMembersService.replace("{id}", companyId).replace("{productId}", eb_EventMembers.productId);
            break;
        default:
            serviceURL = eb_EventMembers.getEventAllMembersService.replace("{id}", companyId).replace("{productId}", eb_EventMembers.productId);
            break;
    }

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
 * Public method to get badge information from the server.
 * The service will return badge information for person.
 * @method eb_EventMembers.getBadgeInformation
 * @return { Object } jQuery promise object which when resolved returns badge information.
 **/
eb_EventMembers.getBadgeInformation = function (companyId, orderId, orderDetailId) {
    var deferred = eBusinessJQObject.Deferred();
    if (companyId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing companyId.', stack: Error().stack };
    }

    if (!Number(companyId)) {
        throw { type: "argument_mismatch", message: 'Missing companyId.', stack: Error().stack };
    }

    if (orderId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing orderId.', stack: Error().stack };
    }

    if (orderDetailId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing orderDetailId.', stack: Error().stack };
    }

    var service = eb_EventMembers.getBadgeInformationService.replace("{id}", companyId).replace("{orderId}", orderId).replace("{orderDetailId}", orderDetailId);
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

    return deferred.promise();
};

/**
 * PATCH service call method.
 * @method eb_EventMembers.updateBadgeInformation
 * @param {Object} data Data to be updated.
 * @return {Object} jQuery promise object which when resolved returns updated badge information.
 */
eb_EventMembers.updateBadgeInformation = function (data, companyId, orderId, orderMeetDetailId) {
    var defer = eBusinessJQObject.Deferred();
    if (companyId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing companyId.', stack: Error().stack };
    }

    if (!Number(companyId)) {
        throw { type: "argument_mismatch", message: 'Missing companyId.', stack: Error().stack };
    }

    if (orderId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing orderId.', stack: Error().stack };
    }

    if (orderMeetDetailId <= 0) {
        throw { type: "argument_mismatch", message: 'Missing orderMeetDetailId.', stack: Error().stack };
    }
    console.info('update badge information...');
    var service = eb_EventMembers.updateBadgeInformationService.replace("{id}", companyId).replace("{orderId}", orderId).replace("{orderMeetDetailId}", orderMeetDetailId);
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: service,
            type: "PATCH",
            contentType: "application/json",                /*request header*/
            data: JSON.stringify(data),
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (result) {
            defer.resolve(result);
        }).fail(defer.reject);
    });
    return defer.promise();
};

/**
 * List of  member properties on which search is applied.
 * @method eb_EventMembers.fieldsToSearch
 * @return {Object} Array of searched  members.
 */
eb_EventMembers.fieldsToSearch = function () {
    return ["id", "name", "title", "status"];
};

/**
 * Event  Members model responsible for all member related operations.
 * @method eb_EventMembers.model
 * @param {any} options Object of event  members data.
 * @param {String} options.ServicePath Service URL.
 * @param {String} options.SitePath Site URL.
 * @param {String} options.templatePath HTML path.
 * @param {Object} options.domElement Event  Members DOM element.
 * @param {Object} options.memberData List of all required members. 
 * */
eb_EventMembers.model = function (options) {
    var _that = this;
    _that.domElement = options.domElement;
    eb_EventMembers.companyId = options.userContext.companyId();
    _that.companyId = ko.observable(eb_EventMembers.companyId);
    _that.companyName = ko.observable(options.userContext.CompanyName());
    _that.memberData = options.memberData;
    _that.showLoader = ko.observable(0);
    _that.showError = ko.observable(0);
    _that.errorMessage = ko.observable();

    _that.badgeName = ko.observable();
    _that.badgeTitle = ko.observable();
    _that.badgeCompany = ko.observable();

    _that.currentOrderId = ko.observable();
    _that.currentOrderDetailId = ko.observable();
    _that.currentOrderMeetDetailId = ko.observable();

    if (eb_EventMembers.registrationType == "Confirmed" || eb_EventMembers.registrationType == "Waitlist") {
        _that.registrationType = eb_EventMembers.registrationType;
    }
    else {
        eb_EventMembers.registrationType = "All";
        _that.registrationType = eb_EventMembers.registrationType;
    }

    /*Search text-box value binding. When user stops typing in search text-box, then search function will be called with 500 milliseconds delay.*/
    _that.search = ko.observable("").extend({ rateLimit: { method: "notifyWhenChangesStop", timeout: eb_Config.companyAdminSearchTimeOut } });
    _that.membersObserver = ko.observableArray();
    _that.members = ko.observableArray();
    _that.noMembers = ko.observable(0);

    _that.eventMembersData = function (data) {
        var self = this;
        self.id = ko.observable(data.AttendeeID);
        self.name = ko.observable(_that.handleIfNull(data.Subscriber));
        self.title = ko.observable(_that.handleIfNull(data.Title));
        self.city = ko.observable(_that.handleIfNull(data.City));
        self.status = ko.observable(_that.handleIfNull(data.Status));
        self.orderId = ko.observable(data.OrderID);
        self.orderDetailId = ko.observable(data.OrderDetailID);
    };

    /*Checks if value is null and handles accordingly.*/
    _that.handleIfNull = function (data) {
        if (data) {
            return data;
        }
        else {
            return "--";
        }
    }

    /*Button click event from event summary control.*/
    _that.eventSummaryButtonClick = function (e) {
        window.location.assign("EventCatalog.html");
    }

    /*Get the  members list.*/
    _that.getEventMembersFromServer = function (companyId) {
        return eb_EventMembers.getEventMembers(companyId);
    }

    /*Load the  members list.*/
    _that.loadEventMembersData = function (data) {
        if (data.length === 0) {
            _that.noMembers(1);
        } else {
            _that.membersObserver.removeAll();
            _that.noMembers(0);
        }
        eBusinessJQObject.map(data, function (row) {
            _that.membersObserver.push(new _that.eventMembersData(row));
        });

        /* This function will be triggered whenever there is change in search text-box or _that.MembersObserver */
        _that.resultRecords = ko.computed(function () {
            var res = new eb_EventMembers.searchRecords(_that.search(), eb_EventMembers.fieldsToSearch(), _that.membersObserver());
            return res;
        });

        /* Pass the search method's return value to this method so that whenever search method is triggered
          this method also gets triggered.*/
        _that.filteredMembers = ko.computed(function () {
            _that.showError(0);
            if (!_that.resultRecords().filteredRecords().length) {
                _that.noMembers(1);
            }
            else {
                _that.noMembers(0);
            }
            _that.members(_that.resultRecords().filteredRecords());
        });
    };


    if (_that.memberData) {
        _that.loadEventMembersData(_that.memberData);
    }
    else {
        _that.getEventMembersFromServer(eb_EventMembers.companyId)
            .done(function (memberData) {
                _that.loadEventMembersData(memberData);
                _that.showError(0);
            }).fail(function (xhr, textStatus, errorThrow) {
                console.info("getEventMembersFromServer failed:  " + xhr.responseText);
                _that.showError(1);
                _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_EventMembers));
            });
    }


    /*Badge Information related functions.*/   
    _that.getBadgeInfo = function (companyId, orderId, orderDetailId) {
        return eb_EventMembers.getBadgeInformation(companyId, orderId, orderDetailId);
    };

    /*Load the badge details.*/
    _that.loadBadgeInfo = function (item) {
        _that.showLoader(1);
        _that.currentOrderId(item.orderId());
        _that.currentOrderDetailId(item.orderDetailId());
        _that.getBadgeInfo(_that.companyId(), _that.currentOrderId(), _that.currentOrderDetailId()).done(function (data) {
            _that.badgeName(data.BadgeName);
            _that.badgeTitle(data.BadgeTitle);
            _that.badgeCompany(data.BadgeCompanyName);
            _that.currentOrderMeetDetailId(data.ID);
            _that.showLoader(0);
            _that.showError(0);
        }).fail(function (xhr, textStatus, errorThrow) {
            _that.showLoader(0);
            console.info("getBadgeInformation failed:  " + xhr.responseText);
            _that.showError(1);
            _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_EventMembers));
        });
    };

    /*When update button is clicked from Badge Information window.*/
    _that.update = function () {
        var updateBadgeInfo = {          
            badgeName: _that.badgeName(),
            badgeCompanyName: _that.badgeCompany(),
            badgeTitle: _that.badgeTitle()
        };
        _that.showLoader(1);
        eb_EventMembers.updateBadgeInformation(updateBadgeInfo, _that.companyId(), _that.currentOrderId(), _that.currentOrderMeetDetailId()).done(function () {
            _that.showLoader(0);
            _that.showError(0);
        }).fail(function (xhr, textStatus, errorThrow) {
            _that.showLoader(0);
            console.info("updateBadgeInformation failed:  " + xhr.responseText);
            _that.showError(1);
            _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_EventMembers));
        });
    }
};

/**
 * Event Members search function.
 * @method eb_EventMembers.searchRecords
 * @param {String} toSearch Value entered in search text-box field.
 * @param {Object} fields Array of required member properties on which search will be performed.
 * @param {Object} membersList List of members.
 */
eb_EventMembers.searchRecords = function (toSearch, fields, membersList) {
    var _that = this;

    _that.filteredRecords = ko.computed(function () {
        var filteredRecords = [];
        var ifFound = false;
        var item;

        for (var record = 0; record < membersList.length; record++) {

            for (var field = 0; field < fields.length; field++) {
                /*check whether the field is observable or not and access the value according to it.*/
                if (ko.isObservable(membersList[record][fields[field]]))
                    item = membersList[record][fields[field]]();
                else
                    item = membersList[record][fields[field]];

                if (item.toString().toLowerCase().indexOf(toSearch.toLowerCase()) !== -1) {
                    ifFound = true;
                    break;
                }
            }
            if (ifFound) {
                filteredRecords.push(membersList[record]);
                ifFound = false;
            }
        }

        return filteredRecords;
    });

};

/**
 * Page DOM element.
 * @method eb_EventMembers.domElement
 * @param {object} domElement current DOM element.
 * */
eb_EventMembers.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_EventMembers.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_EventMembers);
});