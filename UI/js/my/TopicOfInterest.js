/**
 * Topic code class.
 * @class eb_topicCode
 * */
var eb_topicCode = eb_topicCode || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_topicCode.SitePath
 * @type {String}
 * */
eb_topicCode.SitePath = eb_Config.SitePath;

/**
 * SOA path.
 * It would be set from configuration file.
 * @property eb_topicCode.ServicePath
 * @type {String}
 * */
eb_topicCode.ServicePath = eb_Config.ServicePathV1;

/**
 * Topic of Interest service path
 * @property eb_topicCode.getTopicCodeService
 * @type {String}
 * */
eb_topicCode.getTopicCodeService = "ProfilePersons/TopicCodes";

/**
 * Selected Interests service path
 * @property eb_topicCode.getSelectedTopicCodeService
 * @type {String}
 * */
eb_topicCode.getSelectedTopicCodeService = 'ProfilePersons/{LinkedId}/TopicCodes';

/**
 * Service path for saving selected Topic of Interests.
 * @property eb_topicCode.saveTopicCodeService
 * @type {String}
 * */
eb_topicCode.saveTopicCodeService = '/ProfilePersons/{LinkedId}/TopicCodes';

/**
 * Topic of Interest site path.
 * It would be set from configuration file.
 * @property eb_topicCode.topicOfInterest
 * @type {String}
 * */
eb_topicCode.topicOfInterest = eb_topicCode.SitePath + "/html/my/TopicOfInterest.html";

/**
 * Stores user's LinkedID.
 * It is required to get saved interests and to save selected interests of the user.
 * @property eb_topicCode.UserLinkedID
 * @type {String}
 * @default '';
 * */
eb_topicCode.UserLinkedID = '';

/* Success messages. */
eb_topicCode.SuccessResponses = {
    'Save success': 'Changes have been successfully saved.'
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
 * @property eb_topicCode.errorResponses
 * @type {Object}
 * */
eb_topicCode.errorResponses = {
    903: { useServerMessage: false, frontEndMessage: 'An error was occurred while saving the data. Please try again.' }
};

/**
 * Default error message.
 * @property eb_topicCode.defaultErrorMessage
 * @type {String}
 * */
eb_topicCode.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/**
 * To get Topic of Interest DOM element.
 * Template path and DOM element are required parameters.
 * @method eb_topicCode.render
 * @param {Object} options Array of required data.
 * @param {String} options.ServicePath Service path.
 * @param {String} options.SitePath Site path.
 * @param {String} options.UserLinkedID User's LinkedID.
 * @param {Object} options.allTopicCodes Array of all topic codes.
 * @param {Object} options.selectedTopicCodes Array of all selected topic codes.
 * @param {String} options.templatePath Topic of Interests HTML file path.
 * @param {Object} options.domElement Topic of Interests DOM element.
 * 
 * @return {String} jQuery promise object which when resolved returns HTML template.
 * */
eb_topicCode.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options.templatePath) {
        options.templatePath = eb_topicCode.topicOfInterest;
    }

    eBusinessJQObject.get(options.templatePath).done(function (data) {
        options.domElement.innerHTML = data;
        defer.resolve(data);
    }).fail(function (data, msg, xhr) {
        defer.reject(data, msg, xhr);
    });

    return defer.promise();

};

/**
 * Get Topic code data from the server through the get service call.
 * @method eb_topicCode.getTopicCodeData
 * @return {Object} Returns list of available topic of interests.
 */
eb_topicCode.getTopicCodeData = function () {
    var deferred = eBusinessJQObject.Deferred();
    eBusinessJQObject.get(
        {
            url: eb_topicCode.ServicePath + eb_topicCode.getTopicCodeService,
            datatype: "json"
        }
    ).done(function (data) {
        deferred.resolve(data);
    }).fail(deferred.reject);
    return deferred.promise();
};

/** 
 * Get selected Topic code data. 
 * @method eb_topicCode.getSelectedTopicCodeData
 * @param {String} LinkedID User ID.
 * @return {Object} Returns user's selected topic of interests.
 */
eb_topicCode.getSelectedTopicCodeData = function (LinkedID) {
    var deferred = eBusinessJQObject.Deferred();
    eBusinessJQObject.get(
        {
            url: eb_topicCode.ServicePath + eb_topicCode.getSelectedTopicCodeService.replace('{LinkedId}', LinkedID),
            datatype: "json",
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
 * Save user selected topic of interests. 
 * @method eb_topicCode.saveTopicCodeData
 * @param {Object} data array of topic codes IDs.
 * @return {Object} Returns array of topic code IDs that are saved.
 */
eb_topicCode.saveTopicCodeData = function (data) {
    var deferred = eBusinessJQObject.Deferred();
    var requestData = { "topicCodeIds": data };

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_topicCode.ServicePath + eb_topicCode.saveTopicCodeService.replace('{LinkedId}', eb_topicCode.UserLinkedID),
            type: 'PUT',
            data: JSON.stringify(requestData),
            contentType: "application/json",
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
 * It is class module which is responsible for binding data, events and validation of the fields.
 * 
 * @method eb_topicCode.model
 * 
 * @param {Object} topicOfInterestData Object of topic of interest data.
 * @param {String} topicOfInterestData.ServicePath Service URL.
 * @param {String} topicOfInterestData.SitePath Site URL.
 * @param {String} topicOfInterestData.templatePath HTML path.
 * @param {String} topicOfInterestData.UserLinkedID User Linked ID.
 * @param {Object} topicOfInterestData.domElement Topic of interest DOM element.
 * @param {Object} topicOfInterestData.allTopicCodes Array of all topic codes.
 * @param {Object} topicOfInterestData.selectedTopicCodes Array of all topic codes selected by user.
 * 
 * */
eb_topicCode.model = function (topicOfInterestData) {
    var _that = this;
    _that.domElement = topicOfInterestData.domElement;

    if (topicOfInterestData.allTopicCodes) {
        _that.data = topicOfInterestData.allTopicCodes;
    }

    if (topicOfInterestData.selectedTopicCodes) {
        _that.selectedTopic = topicOfInterestData.selectedTopicCodes;
    }

    if (topicOfInterestData.UserLinkedID) {
        eb_topicCode.UserLinkedID = topicOfInterestData.UserLinkedID;
    }

    eb_topicCode.domElement(_that.domElement);
    _that.showTopicSuccess = ko.observable(0);
    _that.topicSuccessMessage = ko.observable('');
    _that.showTopicError = ko.observable(0);
    _that.topicErrorMessage = ko.observable('');

    /* Search text-box value binding. Search function will be called after 500 milliseconds delay. */
    _that.search = ko.observable("").extend({ rateLimit: { method: "notifyWhenChangesStop", timeout: 500 } });
    _that.discardSearch = function () {
        if (_that.search().length)
            _that.search("");
    };

    /* Array to hold selected interests. */
    _that.selectedInterests = ko.observableArray();

    /* object to hold topic code and its children topic codes if any. */
    _that.singleTopicCode = function (model) {
        var self = this;
        self.topicCode = ko.observable(model);
        self.children = ko.observableArray();
        self.openChildList = ko.observable(false);
        self.heightApplied = ko.observable(1);
        self.topicCode().isChecked.subscribe(function (val) {
            self.topicCode().checkParent(false);

            if (self.children().length) {
                for (var index = 0; index < self.children().length; index++) {
                    self.children()[index].isChecked(val);
                }
            }
        });
        self.topicCode().isChecked.extend({ notify: 'always' });

        /* Check if any of the children is selected */
        self.checkAnyChildSelected = function () {
            if (self.children().length) {
                var inc = 0;
                for (var i = 0; i < self.children().length; i++) {
                    if (self.children()[i].isChecked()) {
                        inc++
                    }
                }
                if (inc > 0) {
                    return true;
                }
                return false;
            }
        };

        /* Check if all the children are selected */
        self.checkForAllChildSelected = function () {
            if (self.children().length) {
                var inc = 0;
                for (var i = 0; i < self.children().length; i++) {
                    if (self.children()[i].isChecked()) {
                        inc++
                    }
                }
                if (inc === self.children().length) {
                    return true;
                }
                return false;
            }
        };

    };

    /* Array to hold all topic codes. */
    _that.topiCodesCollection = ko.observableArray();

    /* Function to extract topic code models
     * , fill array of selected topic codes
     * , fill array of top-level topic codes 
     * , fill array of child topic codes
     * and return observable array of topic codes. 
     * */
    _that.extractModels = function (parent, data, constructor) {
        var model;

        /* Return empty array if no topic code data is available. */
        if (data === null) {
            return _that.topiCodesCollection;
        }

        for (var index = 0; index < data.length; index++) {
            var row = data[index];

            var isSelected = ko.utils.arrayFirst(_that.selectedTopic, function (record) {
                return record.topicCodeId === row.id;
            });

            if (isSelected) {
                model = new constructor(row, true, _that);             /* Create topic code object. */

            }
            else {
                model = new constructor(row, false, _that);            /* Create topic code object. */
            }

            /* Create array with top-level topic codes and also push in selected interests array if selected. */
            if (model.parentId() === -1) {
                _that.topiCodesCollection.push(new _that.singleTopicCode(model));
                _that.topiCodesCollection.sort(function (a, b) {
                    return (a.topicCode().name()).localeCompare(b.topicCode().name());
                });
                if (model.isChecked()) {
                    _that.selectedInterests.push(model);
                    _that.selectedInterests.sort(function (a, b) {
                        return (a.name()).localeCompare(b.name());
                    });
                }
            }

            /* Create array of child topic code objects and push in respective parent topic code object. */
            var childTopicCodes = ko.utils.arrayFirst(_that.topiCodesCollection(), function (record) {
                return record.topicCode().Id() === model.parentId();
            });

            if (childTopicCodes) {
                childTopicCodes.children.push(model);
                if (model.isChecked()) {
                    _that.selectedInterests.push(model);
                    _that.selectedInterests.sort(function (a, b) {
                        return (a.name()).localeCompare(b.name());
                    });
                }
            }
        }

        return _that.topiCodesCollection;
    };

    if (typeof data === 'undefined') {
        data = {
            showTopicsOfInterest: 0,
            showSelectedInterests: 1
        };
    }

    /* Get all the selected topic code IDs and call save function. */
    _that.saveChanges = function () {
        _that.showTopicError(0);
        _that.showTopicSuccess(0);
        var deferred = eBusinessJQObject.Deferred();
        var topicCodeIDArray = [];

        /* Push all topic code IDs in an array and call save function. */
        for (var index = 0; index < _that.topicCodes().length; index++) {
            if (_that.topicCodes()[index].topicCode().isChecked() === true) {
                topicCodeIDArray.push(_that.topicCodes()[index].topicCode().Id());
            }

            if (_that.topicCodes()[index].children().length) {
                for (var itr = 0; itr < _that.topicCodes()[index].children().length; itr++) {
                    if (_that.topicCodes()[index].children()[itr].isChecked() === true) {
                        topicCodeIDArray.push(_that.topicCodes()[index].children()[itr].Id());
                    }
                }
            }
        }

        eb_topicCode.saveTopicCodeData(topicCodeIDArray).done(function (savedData) {
            _that.showTopicError(0);
            _that.showTopicSuccess(1);
            _that.topicSuccessMessage(eb_topicCode.SuccessResponses['Save success']);

            _that.topicCodes().forEach(function (item) {
                item.topicCode().savedOnServer(false);
                item.topicCode().savedCode(false);
                item.topicCode().unSavedCode(false);
                if (item.children().length) {
                    item.children().forEach(function (child) {
                        child.savedCode(false);
                        child.unSavedCode(false);
                        child.savedOnServer(false);
                    });
                }
            });

            _that.selectedInterests().forEach(function (item) {
                item.savedOnServer(true);
                item.unSavedCode(false);
                item.savedCode(true);
            });

        }).fail(function (xhr, textStatus, errorThrow) {
            _that.showTopicSuccess(0);
            _that.showTopicError(1);
            if (xhr && typeof xhr.responseJSON !== 'undefined')
                _that.topicErrorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_topicCode));
            else
                _that.topicErrorMessage(eb_topicCode.defaultErrorMessage);
        });
        return deferred.promise();
    };

    /* Set all the check-boxes property to false. */
    _that.clearAll = function () {
        var list = _that.selectedInterests();

        while (list.length) {
            list[0].isChecked(false);
        }
        if (_that.search().length)
            _that.search('');                                       /* Clear search text if present. */
    };

    /* Set all the check-boxes property to true. */
    _that.selectAll = function () {
        var list = _that.topiCodesCollection();

        for (var index = 0; index < list.length; index++) {
            list[index].topicCode().isChecked(true);
        }
        if (_that.search().length)                                   /* Clear search text if present. */
            _that.search('');
    };

    _that.selectOrPartiallySelectTopicCode = function (allTopicCodeList) {
        allTopicCodeList().forEach(function (singleParentCode) {
            if (singleParentCode.children().length) {
                singleParentCode.children().forEach(function (singleCode) {
                    if (!singleParentCode.topicCode().isChecked() && singleCode.isChecked()) {
                        singleParentCode.topicCode().checkParent(true);
                    }
                });
            }
        });
    };


    /* Load data , create models. */
    _that.loadTopicCodesData = function (data) {

        _that.topicCodes = _that.extractModels(_that, data, eb_topicCode.topicCodesmodel);

        _that.selectOrPartiallySelectTopicCode(_that.topicCodes);
        /* Any change in search text box or topicCodes list will trigger this method and filtered records will be displayed. */
        _that.resultRecords = ko.computed(function () {
            _that.showTopicSuccess(0);
            _that.showTopicError(0);
            var res = new eb_topicCode.searchTopicCodes(_that.search(), _that.topicCodes());
            return res;
        });
    };

    /* check topic code data and load on page. */
    if (!_that.data) {
        data = {};
    }
    else { _that.loadTopicCodesData(_that.data); }

    /* Topic of Interest. */
    _that.showTopicsOfInterest = ko.observable(data['showTopicsOfInterest']);

    _that.showSelectedInterests = ko.observable(data['showSelectedInterests']);

    _that.toggleShowSelectedInterests = function () {
        _that.showSelectedInterests(!_that.showSelectedInterests());
    };

};

/**
 * Converts topic code data object into knockout model.
 * @method eb_topicCode.topicCodesmodel
 * @param {Object} data Single topic code data object.
 * @param {Boolean} checked State of the topic code whether selected or not.
 * @param {Object} parent Instance of eb_topicCode.model.
 */
eb_topicCode.topicCodesmodel = function (data, checked, parent) {
    var self = this;

    self.Id = ko.observable(data['id']);
    self.name = ko.observable(data['name']);
    self.parentId = ko.observable(data['parent']);
    self.description = ko.observable(data['description']);
    self.isChecked = ko.observable(checked);                /* check-box binding. */
    self.savedOnServer = ko.observable(checked);
    self.savedCode = ko.observable(checked);
    self.unSavedCode = ko.observable(checked);
    self.checkParent = ko.observable(false);

    /* Change in check-box value will push or remove from selected interest array. */
    self.isChecked.subscribe(function (val) {

        parent.showTopicError(0);
        parent.showTopicSuccess(0);

        if (val) {
            var ifPresent = ko.utils.arrayFirst(parent.selectedInterests(), function (item) {
                return self.Id() === item.Id();
            });
            if (!ifPresent) {
                if (self.savedOnServer()) {
                    self.savedCode(true);
                    self.unSavedCode(false);
                }
                else {
                    self.savedCode(false);
                    self.unSavedCode(true);
                }
                parent.selectedInterests.push(self);
                parent.selectedInterests.sort(function (a, b) {
                    return (a.name()).localeCompare(b.name());
                });
            }

        }
        else {
            var removedCode = parent.selectedInterests.remove(function (item) {
                return item.Id() === self.Id();
            });
        }

        var ifParentPresent = ko.utils.arrayFirst(parent.topicCodes(), function (item) {
            return self.parentId() === item.topicCode().Id();
        });
        if (ifParentPresent) {
            if (ifParentPresent.checkAnyChildSelected())
                ifParentPresent.topicCode().checkParent(true);
            else
                ifParentPresent.topicCode().checkParent(false);

            if (ifParentPresent.checkForAllChildSelected()) {
                ifParentPresent.topicCode().checkParent(false);
                ifParentPresent.topicCode().isChecked(true);
            }

        }
    });

    self.removeInterest = function () {
        var interestToBeRemoved = ko.utils.arrayFirst(parent.selectedInterests(), function (item) {
            return self.Id() === item.Id();
        });
        if (interestToBeRemoved) {
            interestToBeRemoved.isChecked(false);
        }
    };

};

/**
 * Topic code search function.
 * Computed function returns array of topic code objects.
 * @method eb_topicCode.searchTopicCodes
 * @param {String} toSearch Value entered in search text-box field.
 * @param {Object} topicCodesList Array of topic code objects.
 */
eb_topicCode.searchTopicCodes = function (toSearch, topicCodesList) {
    var _that = this;

    _that.filteredRecords = ko.computed(function () {
        var filteredRecords = [];

        topicCodesList.forEach(function (item) {
            item.openChildList(false);
        });

        var ifFound = false;

        if (!toSearch.trim().length) {
            filteredRecords = topicCodesList;
            return filteredRecords;
        }

        for (var index = 0; index < topicCodesList.length; index++) {
            if (topicCodesList[index].topicCode().name().toString().toLowerCase().indexOf(toSearch.toLowerCase()) !== -1) {
                ifFound = true;
            }
            else if (topicCodesList[index].children().length) {
                for (var itr = 0; itr < topicCodesList[index].children().length; itr++) {
                    if (topicCodesList[index].children()[itr].name().toString().toLowerCase().indexOf(toSearch.toLowerCase()) !== -1) {
                        ifFound = true;
                    }
                }
            }

            if (ifFound) {
                filteredRecords.push(topicCodesList[index]);
                ifFound = false;
            }
        }
        if (filteredRecords.length && toSearch.length) {
            filteredRecords.forEach(function (item) {
                item.openChildList(true);
            });
        }
        return filteredRecords;
    });

};

/**
 * Page DOM element.
 * @method eb_topicCode.domElement
 * @param {object} domElement current DOM element.
 * */
eb_topicCode.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_topicCode.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_topicCode);
});