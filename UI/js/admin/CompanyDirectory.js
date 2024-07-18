/**
 * Company Directory class.
 * @class eb_CompanyDirectory
 * */
var eb_CompanyDirectory = eb_CompanyDirectory || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_CompanyDirectory.SitePath
 * @type {String}
 * */
eb_CompanyDirectory.SitePath = eb_Config.SitePath;

/**
 * Company Directory template path.
 * @property eb_CompanyDirectory.TemplatePath
 * @type {String}
 * */
eb_CompanyDirectory.TemplatePath = "html/admin/CompanyDirectory.html";

/**
 * SOA path.
 * @property eb_CompanyDirectory.ServicePath
 * @type {String}
 * */
eb_CompanyDirectory.ServicePath = eb_Config.ServicePathV1;

/**
 * Company directory service to get directory.
 * @property eb_CompanyDirectory.getCompanyDirectory
 * @type {String}
 * */
eb_CompanyDirectory.getCompanyDirectory = eb_CompanyDirectory.ServicePath + "admin/company/{id}/directory";

/**
 * Company directory service to get single member's data.
 * @property eb_CompanyDirectory.getMemberDataService
 * @type {String}
 * */
eb_CompanyDirectory.getMemberDataService = eb_CompanyDirectory.ServicePath + "admin/company/{id}/Directorymember/{memberId}";

/**
 * Company directory service to update single member's data.
 * @property eb_CompanyDirectory.updateMemberDataService
 * @type {String}
 * */
eb_CompanyDirectory.updateMemberDataService = eb_CompanyDirectory.ServicePath + "admin/company/{id}/member/{memberId}";

/**
 * Company directory service to update single member's profile phone data.
 * @property eb_CompanyDirectory.updateProfilePhoneDataService
 * @type {String}
 * */
eb_CompanyDirectory.updateProfilePhoneDataService = eb_CompanyDirectory.ServicePath + "admin/company/{id}/member/{memberId}/ProfilePhones/Business Phone";

/* To Check blank date, if we didn't enter any value in date in smart client, then by default it return "01/01/0001" */
eb_CompanyDirectory.defaultDate = "01/01/0001";

/*Company Id of selected company from dropdown.*/
eb_CompanyDirectory.companyId = "0";

/*Default error message*/
eb_CompanyDirectory.defaultErrorMessage = "There was an error encountered while removing members. Please try again. If the problem persists, please contact the customer support for further assistance.";

/**
 * Public method to get company directory from the server.
 * The service will return company directory.
 * @method eb_CompanyDirectory.getCompanyDirectoryData
 * @return { Object } jQuery promise object which when resolved returns directory.
 **/
eb_CompanyDirectory.getCompanyDirectoryData = function (companyId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (companyId > 0) {
        var service = eb_CompanyDirectory.getCompanyDirectory.replace("{id}", companyId);
    }
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
 * Public method to get single member's data from the server.
 * The service will return single member's data.
 * @method eb_CompanyDirectory.getMemberData
 * @return { Object } jQuery promise object which when resolved returns single member's data.
 **/
eb_CompanyDirectory.getMemberData = function (companyId, memberId) {
    var deferred = eBusinessJQObject.Deferred();
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (!memberId) {
        throw { type: "argument_null", message: "memberId property is required.", stack: Error().stack };
    }
    if (companyId > 0 && memberId > 0) {
        var service = eb_CompanyDirectory.getMemberDataService.replace("{id}", companyId).replace("{memberId}", memberId);
    }

    
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
 * Update member data method.
 * @method eb_CompanyDirectory.updateMemberData
 * @param {Object} data Data to be updated.
 * @return {Object} jQuery promise object which when resolved returns updated member data.
 */
eb_CompanyDirectory.updateMemberData = function (companyId, memberId, data) {
    var defer = eBusinessJQObject.Deferred();
    console.info('update member Service...');
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (!memberId) {
        throw { type: "argument_null", message: "memberId property is required.", stack: Error().stack };
    }
    if (companyId > 0 && memberId > 0) {
        var service = eb_CompanyDirectory.updateMemberDataService.replace("{id}", companyId).replace("{memberId}", memberId);
    }

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: service,
            method: 'PATCH',
            data: data,
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
 * Update single member's profile phone number (Business Phone)
 * @method eb_CompanyDirectroy.updateProfilePhoneNumbersData
 * @return {Object} jQuery promise object
 */
eb_CompanyDirectory.updateProfilePhoneNumberData = function (phoneData, companyId, memberId) {
    var defer = eBusinessJQObject.Deferred();
    if (!phoneData) {
        throw { type: "argument_null", message: "phone details is required.", stack: Error().stack };
    }
    if (!companyId) {
        throw { type: "argument_null", message: "companyId property is required.", stack: Error().stack };
    }
    if (!memberId) {
        throw { type: "argument_null", message: "memberId property is required.", stack: Error().stack };
    }
    if (companyId > 0 && memberId > 0) {
        var service = eb_CompanyDirectory.updateProfilePhoneDataService.replace("{id}", companyId).replace("{memberId}", memberId);
    }
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: service,
            method: 'PATCH',
            contentType: "application/json",                /*request header*/
            data: JSON.stringify(phoneData),
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
 * List of company directory properties on which search is applied.
 * @method eb_CompanyDirectory.fieldsToSearch
 * @return {Object} Array of company directory name property.
 */
eb_CompanyDirectory.fieldsToSearch = function () {
    return ["name", "emailId", "membershipType", "status"];
};

/* Error messages */
eb_CompanyDirectory.errorMessages = {
    'First name validation': 'First Name is required.',
    'Last name validation': 'Last Name is required.',
    'Email validation': 'Email Id is required.',
    'Invalid Email': 'Please enter a valid Email address (eg. johdoe@communitybrands.com).',
    'Member edit failed': 'There was an error encountered while updating the profile. Please try again. If the problem persists, please contact the customer support for further assistance.'
};

/* Success Responses */
eb_CompanyDirectory.successResponses = {
    'Member updated': 'Changes have been successfully saved.'
};

/**
 * The service will return company directory HTML.
 * @method eb_CompanyDirectory.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Company Directory template URL.
 * @return {String} Company Directory HTML template.
 * */
eb_CompanyDirectory.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_CompanyDirectory.SitePath + eb_CompanyDirectory.TemplatePath;
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
 * Company Directory model responsible for admin's company directory operations.
 * @method eb_CompanyDirectory.model
 * @param { any } options Object of company directory data.
 * @param { String } options.ServicePath Service URL.
 * @param { String } options.SitePath Site URL.
 * @param { String } options.templatePath HTML path.
 * @param { Object } options.domElement Company Directory DOM element.
 * 
 * */

eb_CompanyDirectory.model = function (options) {
    var _that = this;
    _that.domElement = options.domElement;
    _that.userContext = options.userContext;
    _that.data = options.data;
    _that.companyId = ko.observable();
    _that.companyName = ko.observable();
    _that.companyDirectoryObserver = ko.observableArray();
    _that.companyDirectory = ko.observableArray();
    _that.noCompanyDirectoryAvailable = ko.observable(0);
    _that.companyDirectoryAvailable = ko.observable();
    _that.radioSelectedOptionValue = ko.observable();
    _that.filterCollapse = ko.observable(0); /*To collapse filter on mobile*/
    /*Search text-box value binding. When user stops typing in search text-box, then search function will be called with 500 milliseconds delay.*/
    _that.search = ko.observable("").extend({ rateLimit: { method: "notifyWhenChangesStop", timeout: eb_Config.companyAdminSearchTimeOut } });

    _that.showError = ko.observable(0);
    _that.errorMessage = ko.observable("");
    _that.showSuccess = ko.observable(0);
    _that.successMessage = ko.observable("");
    _that.allowLoader = ko.observable(0);

    _that.mainSelect = ko.observable(0);
    _that.totalChecked = ko.observable(0);

    /*Observables for single member's data when Edit popup is opened.*/
    _that.memberId = ko.observable();
    _that.memberFirstName = ko.observable().extend({ required: { params: true, message: eb_CompanyDirectory.errorMessages['First name validation'] } });
    _that.memberLastName = ko.observable().extend({ required: { params: true, message: eb_CompanyDirectory.errorMessages['Last name validation'] } });
    _that.memberEmailId = ko.observable().extend({ email: { params: true, message: eb_CompanyDirectory.errorMessages['Invalid Email'] }, required: { params: true, message: eb_CompanyDirectory.errorMessages['Email validation'] } });
    _that.memberTitle = ko.observable();
    _that.isMemberPhoneUpdated = ko.observable(0);
    _that.memberPhoneRequired = ko.observable(0);
    _that.memberPhone = ko.observable()
    _that.memberCountryCode = ko.observable();
    _that.memberAreaCode = ko.observable();
    _that.memberPhoneExtension = ko.observable();
    _that.errors = ko.validation.group(_that);
    _that.showEditError = ko.observable(0);
    _that.editErrorMessage = ko.observable("");
    _that.showEditSuccess = ko.observable(0);
    _that.editSuccessMessage = ko.observable("");

    _that.memberCountryCode.subscribe(function (newValue) {
        if (newValue) {
            if (newValue.length >= 0) {
                _that.isMemberPhoneUpdated(1);
            }
        }
    });

    _that.memberPhone.subscribe(function (newValue) {
        if (newValue) {
            if (newValue.length >= 0) {
                _that.isMemberPhoneUpdated(1);
            }
        }
    });

    _that.memberAreaCode.subscribe(function (newValue) {
        if (newValue) {
            if (newValue.length >= 0) {
                _that.isMemberPhoneUpdated(1);
            }
        }
    });

    _that.memberPhoneExtension.subscribe(function (newValue) {
        if (newValue) {
            if (newValue.length >= 0) {
                _that.isMemberPhoneUpdated(1);
            }
        }
    });

    _that.hideErrorMessage = function (data, e) {
        _that.memberPhoneRequired(0);
        e.stopPropagation();
    }

    if (_that.userContext) {
        _that.companyId(_that.userContext.companyId());
        _that.companyName(_that.userContext.CompanyName());
        eb_CompanyDirectory.companyId = _that.companyId();
    }

    /*Sorting functions start here*/
    _that.sortByEndDate = function () {
        var data = _that.companyDirectory();
        data.sort(function (a, b) {
            if (a.endDate() == "--") {
                a.endDate(null);
            }
            if (b.endDate() == "--") {
                b.endDate(null);
            }
            return new Date(a.endDate()) - new Date(b.endDate());
        });
        _that.companyDirectory(data);
        return true;
    };

    _that.sortByName = function () {
        var done = false;
        var data = _that.companyDirectory();
        while (!done) {
            done = true;
            for (var i = 1; i < data.length; i += 1) {
                if (data[i - 1].name() > data[i].name()) {
                    done = false;
                    var tmp = data[i - 1];
                    data[i - 1] = data[i];
                    data[i] = tmp;
                }
            }
        }
        _that.companyDirectory(data);
        return true;
    };

    _that.sortByMembershipType = function () {
        var done = false;
        var data = _that.companyDirectory();
        while (!done) {
            done = true;
            for (var i = 1; i < data.length; i += 1) {
                if (data[i - 1].membershipType() > data[i].membershipType()) {
                    done = false;
                    var tmp = data[i - 1];
                    data[i - 1] = data[i];
                    data[i] = tmp;
                }
            }
        }
        _that.companyDirectory(data);
        return true;
    };

    _that.sortByStatus = function () {
        var done = false;
        var data = _that.companyDirectory();
        while (!done) {
            done = true;
            for (var i = 1; i < data.length; i += 1) {
                if (data[i - 1].status() > data[i].status()) {
                    done = false;
                    var tmp = data[i - 1];
                    data[i - 1] = data[i];
                    data[i] = tmp;
                }
            }
        }
        _that.companyDirectory(data);
        return true;
    };
    /*Sorting functions end here*/

    /*Check the validity of date field.*/
    _that.validDate = function (date) {
        var validDate = moment(date).format(eb_Config.defaultDateFormat);
        if (eb_CompanyDirectory.defaultDate !== validDate) {
            return validDate;
        } else {
            return null;
        }
    }

    /*Checks if value is null and handles accordingly.*/
    _that.handleIfNull = function (data) {
        if (data) {
            return data;
        }
        else {
            return "--";
        }
    }

    _that.companyDirectoryData = function (data) {
        var self = this;
        self.id = ko.observable(data.id);
        self.name = ko.observable(_that.handleIfNull(data.FirstLast));
        self.title = ko.observable(_that.handleIfNull(data.Title));
        self.emailId = ko.observable(_that.handleIfNull(data.Email));
        self.phone = ko.observable(_that.handleIfNull(data.preferredPhoneNumber));
        self.membershipType = ko.observable(_that.handleIfNull(data.MemberType));
        self.status = ko.observable(_that.handleIfNull(data.StatusName));

        var phoneNumber = _that.handleIfNull(data.preferredPhoneNumber);
        if (phoneNumber == "--") {
            self.phone = ko.observable(phoneNumber);
        }
        else {
            if (phoneNumber.endsWith("-")) {
                self.phone = ko.observable(phoneNumber.substring(0, phoneNumber.length - 1));
            }
            else {
                self.phone = ko.observable(phoneNumber);
            }
        }

        var startingDate = _that.validDate(data.JoinDate);
        var endingDate = _that.validDate(data.DuesPaidThru);
        self.startDate = ko.observable(_that.handleIfNull(startingDate));
        self.endDate = ko.observable(_that.handleIfNull(endingDate));

        self.isSelected = ko.observable(0);

        /* Order Clicked via checkbox*/
        self.memberClicked = function () {
            _that.showSuccess(0);
            _that.showError(0);
            if (event.target.checked) {
                _that.totalChecked(_that.totalChecked() + 1);
            }
            else {
                _that.totalChecked(_that.totalChecked() - 1);
                _that.mainSelect(0);
            }

            return true;
        };

        /*gets called after clicking on edit icon from UI in order to fetch all editable informtion for member selected*/
        self.fetchMemberInformation = function () {
            _that.showError(0);
            _that.showSuccess(0);
            _that.showEditError(0);
            _that.showEditSuccess(0);
            _that.isMemberPhoneUpdated(0);
            _that.memberPhoneRequired(0);

            /* Call getMemberDataFromServer method. */
            _that.getMemberDataFromServer(self.id()).done(function (memberData) {
                _that.loadMemberData(memberData);
            }).fail(function (xhr, textStatus, errorThrow) {
                console.error("getMemberDataFromServer failed:  " + xhr.responseText);
                eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyDirectory);
            });
        }
    }

    _that.getCompanyDirectoryDataFromServer = function () {
        return eb_CompanyDirectory.getCompanyDirectoryData(eb_CompanyDirectory.companyId);
    }

    _that.loadCompanyDirectoryData = function (data) {
        if (data.length === 0) {
            _that.noCompanyDirectoryAvailable(1);
            _that.companyDirectoryAvailable(0);
        } else {
            _that.companyDirectoryObserver.removeAll();
            _that.noCompanyDirectoryAvailable(0);
            _that.companyDirectoryAvailable(1);
        }
        eBusinessJQObject.map(data, function (row) {
            _that.companyDirectoryObserver.push(new _that.companyDirectoryData(row));
        });

        /* This function will be triggered whenever there is change in search text-box or _that.companyDirectoryObserver */
        _that.resultRecords = ko.computed(function () {
            var res = new eb_CompanyDirectory.searchRecords(_that.search(), eb_CompanyDirectory.fieldsToSearch(), _that.companyDirectoryObserver());
            return res;
        });

        /* Pass the search method's return value to this method so that whenever search method is triggered
          this method also gets triggered.*/
        _that.filteredCompanyDirectory = ko.computed(function () {
            _that.radioSelectedOptionValue("");
            _that.companyDirectory(_that.resultRecords().filteredRecords());
        })
    };


    /*Call to this method gets and load all company directory data.*/
    _that.getAndLoadCompanyDirectoryDataFromServer = function () {
        _that.allowLoader(1);
        _that.getCompanyDirectoryDataFromServer()
            .done(function (companyDirectoryData) {
                _that.loadCompanyDirectoryData(companyDirectoryData);
                _that.allowLoader(0);
            }).fail(function (xhr, textStatus, errorThrow) {
                _that.allowLoader(0);
                console.info("getCompanyDirectoryDataFromServer failed:  " + xhr.responseText);
                eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyDirectory);
            });
    };

    if (_that.data) {
        _that.loadCompanyDirectoryData(_that.data);
    }
    else {
        _that.getAndLoadCompanyDirectoryDataFromServer();
    }

    /*update user context on company change from company dropdown control*/
    _that.handleUserContext = function () {
        _that.showSuccess(0);
        _that.showError(0);
        _that.successMessage("");
        _that.errorMessage("");
        _that.radioSelectedOptionValue("");
        _that.mainSelect(0);
        _that.companyId(_that.userContext.companyId());
        _that.companyName(_that.userContext.CompanyName());
        eb_CompanyDirectory.companyId = _that.companyId();
        _that.search("");
        _that.totalChecked(0);
        _that.getAndLoadCompanyDirectoryDataFromServer();
    }

    /* Filter control show hide on mobile device*/
    _that.togglefiltercontrol = function () {
        _that.filterCollapse(!_that.filterCollapse());
    };

    _that.RemoveSelectedMembers = function () {

        var serviceURL = (eb_CompanyDirectory.ServicePath + "admin/company/{id}/members").replace('{id}', eb_CompanyDirectory.companyId);

        var postDataArray = new Array();

        eBusinessJQObject.map(_that.companyDirectoryObserver(), function (row) {
            if (row.isSelected()) {
                console.log(row.id());
                postDataArray.push({ "personId": row.id() });
            }
        });


        if (postDataArray.length > 0) {
            _that.allowLoader(1);
            eb_Config.retrieveCSRFTokens().always(function (headers) {
                eBusinessJQObject.ajax({
                    url: serviceURL,
                    type: "DELETE",
                    data: JSON.stringify(postDataArray),
                    xhrFields: {
                        withCredentials: true
                    },
                    headers: headers,
                    contentType: 'application/json'
                }).done(function (xhr, msg, data) {
                    _that.allowLoader(0);
                    console.log(data);
                    if (data.status === 204) {
                        console.log("success");
                        _that.showError(0);
                        _that.showSuccess(1);
                        _that.successMessage("Selected members removed from Company Directory");
                        _that.mainSelect(0);
                        _that.totalChecked(0);
                        _that.getAndLoadCompanyDirectoryDataFromServer();
                    }
                }).fail(function (xhr, msg, data) {
                    if (xhr && typeof xhr.responseJSON !== 'undefined')
                        _that.errorMessage(eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyDirectory));
                    else
                        _that.errorMessage(eb_CompanyDirectory.defaultErrorMessage);
                    _that.showError(1);
                    _that.showSuccess(0);
                    _that.allowLoader(0);
                });
            });
        }
    };

    /*Select and Unselect All checkbox*/
    _that.selectAll = function (data, event) {
        var total = 0;
        _that.showSuccess(0);
        _that.showError(0);
        _that.totalChecked(0);
        //eBusinessJQObject.map(_that.companyDirectoryObserver(), function (row) {
        eBusinessJQObject.map(_that.resultRecords().filteredRecords(), function (row) {
            if (event.target.checked) {
                row.isSelected(true);
                _that.mainSelect(1);
                _that.totalChecked(_that.totalChecked() + 1);
            } else {
                row.isSelected(false);
                _that.mainSelect(0);
            }
        });
        return true;
    };

    /*disable the Remove Button if no entries are checked*/
    _that.removeButtonHandler = ko.computed(function () {
        if (_that.totalChecked() > 0) {
            eBusinessJQObject(_that.domElement).find("#removeButton")[0].disabled = false;
        }
        else {
            eBusinessJQObject(_that.domElement).find("#removeButton")[0].disabled = true;
        }
    });

    /*This function is used to validate the phone control*/
    _that.validatePhoneNumber = function () {
        var triggerCall = true; /*To Check whether, we need to trigger phone call */
        if (_that.isMemberPhoneUpdated() === 1) {
            /*If all the fields like Country Code / Area Code / Extension is available and phone fields is empty then don't trigger the call */
            if (!_that.memberPhone()) {
                triggerCall = false;
                console.error('Phone Field is Mandatory');
                _that.memberPhoneRequired(1);
                return triggerCall;
            }
        }
        return triggerCall;
    }

    /*Load member's data into observables when Edit pop-up opens.*/
    _that.loadMemberData = function (data) {
        _that.memberId(data.id);
        _that.memberFirstName(data.FirstName);
        _that.memberLastName(data.LastName);
        _that.memberEmailId(data.Email);
        _that.memberTitle(data.Title);
        _that.memberPhone(data.phone != null ? data.phone.trim() : data.phone);
        _that.memberCountryCode(data.countryCode != null ? data.countryCode.trim() : data.countryCode);
        _that.memberAreaCode(data.areaCode != null ? data.areaCode.trim() : data.areaCode);
        _that.memberPhoneExtension(data.PhoneExtension != null ? data.PhoneExtension.trim() : data.PhoneExtension);
    };

    /* Get data for member from the server. */
    _that.getMemberDataFromServer = function (memberId) {
        return eb_CompanyDirectory.getMemberData(_that.companyId(), memberId);
    };

    /*Update company's profile.*/
    _that.updateMember = function () {
        _that.showError(0);
        _that.showSuccess(0);
        _that.showEditError(0);
        _that.showEditSuccess(0);
        if (_that.companyId() > 0) {
            if (_that.validatePhoneNumber()) {
                updatedMemberData = {
                    firstName: _that.memberFirstName(),
                    lastName: _that.memberLastName(),
                    title: _that.memberTitle(),
                    primaryEmail: _that.memberEmailId()
                };

                if (_that.errors().length === 0) {
                    /*Member data update service call*/
                    eb_CompanyDirectory.updateMemberData(_that.companyId(), _that.memberId(), updatedMemberData)
                        .done(function (data) {
                            /*Update Phone Numbers information. */
                            var phoneData = {
                                countryCode: _that.memberCountryCode(),
                                areaCode: _that.memberAreaCode(),
                                phone: _that.memberPhone(),
                                phoneExtension: _that.memberPhoneExtension()
                            }

                            eb_CompanyDirectory.updateProfilePhoneNumberData(phoneData, _that.companyId(), _that.memberId())
                                .done(function (phoneData) {
                                    _that.showEditSuccess(1);
                                    _that.editSuccessMessage(eb_CompanyDirectory.successResponses['Member updated']);
                                })
                                .fail(function (xhr, textStatus, errorThrow) {
                                    _that.showEditSuccess(0);
                                    _that.showEditError(1);
                                    _that.editErrorMessage(eb_CompanyDirectory.errorMessages['Member edit failed']);
                                    eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyDirectory);
                                    console.info("updateProfilePhoneNumberData failed:  " + xhr.responseText);
                                });
                        }).fail(function (xhr, textStatus, errorThrow) {
                            _that.showEditSuccess(0);
                            _that.showEditError(1);
                            _that.editErrorMessage(eb_CompanyDirectory.errorMessages['Member edit failed']);
                            eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyDirectory);
                            console.info("updateMemberData failed:  " + xhr.responseText);
                        });
                } else {
                    _that.errors.showAllMessages();
                }
            }
        }
    };

    /* Quantity validation allow only numeric character. */
    ko.bindingHandlers.numeric = {
        init: function (element, valueAccessor) {
            eBusinessJQObject(element).on("keydown", function (event) {
                /* Allow: backspace, delete, tab, escape, and enter */
                if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 || event.keyCode === 13 || event.keyCode === 189 || event.keyCode === 109 || event.keyCode === 187 || event.keyCode === 107 ||
                    /* Allow: Ctrl+A */
                    event.keyCode === 65 && event.ctrlKey === true ||
                    /* Allow: home, end, left, right */
                    event.keyCode >= 35 && event.keyCode <= 40) {
                    /* let it happen, don't do anything */
                    return;
                }
                else {
                    /* Ensure that it is a number and stop the key press */
                    if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                        event.preventDefault();
                    }
                }
            });
        }
    };

    /*Custom binding to handle actions to be performed when user clicks outside the edit member pop-up which causes it to be closed.*/
    ko.bindingHandlers.clickOutside = {
        init: function (element, valueAccessor) {
            eBusinessJQObject(element).on('hidden.bs.modal', function () {
                _that.getAndLoadCompanyDirectoryDataFromServer();
            });
        },
    }

};

/**
 * Company Directory search function.
 * @method eb_CompanyDirectory.searchRecords
 * @param { String } toSearch Value entered in search text - box field.
 * @param { Object } fields Array of company directory properties on which search will be performed.
 * @param { Object } companyDirectory Full company directory.
 **/
eb_CompanyDirectory.searchRecords = function (toSearch, fields, companyDirectory) {
    var _that = this;
    _that.filteredRecords = ko.computed(function () {
        var filteredRecords = [];
        var ifFound = false;
        var item;

        for (var record = 0; record < companyDirectory.length; record++) {

            for (var field = 0; field < fields.length; field++) {
                /*check whether the field is observable or not and access the value according to it.*/
                if (ko.isObservable(companyDirectory[record][fields[field]]))
                    item = companyDirectory[record][fields[field]]();
                else
                    item = companyDirectory[record][fields[field]];

                if (item.toString().toLowerCase().indexOf(toSearch.toLowerCase()) !== -1) {
                    ifFound = true;
                    break;
                }
            }
            if (ifFound) {
                filteredRecords.push(companyDirectory[record]);
                ifFound = false;
            }
        }
        return filteredRecords;
    });
};

/**
* Page DOM element.
* @method eb_CompanyDirectory.domElement
* @param {object} domElement current DOM element.
* */
eb_CompanyDirectory.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_CompanyDirectory.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyDirectory);
});