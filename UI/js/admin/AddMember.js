/**
 * Add Member class.
 * @class eb_AddMember
 * */
var eb_AddMember = eb_AddMember || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_AddMember.SitePath
 * @type {String}
 * */
eb_AddMember.SitePath = eb_Config.SitePath;

/**
 * Add Member template path.
 * @property eb_AddMember.TemplatePath
 * @type {String}
 * */
eb_AddMember.TemplatePath = "html/admin/AddMember.html";

/**
 * SOA path.
 * @property eb_AddMember.ServicePath
 * @type {String}
 * */
eb_AddMember.ServicePath = eb_Config.ServicePathV1;

/*Company Id of selected company from dropdown.*/
eb_AddMember.companyId = "0";

/**
 * Add Member service to add new member to Company.
 * @property eb_AddMember.addNewMemberService
 * @type {String}
 * */
eb_AddMember.addNewMemberService = eb_AddMember.ServicePath + "admin/company/{id}/members";

/**
 * Add new members to company method.
 * @method eb_AddMember.addNewMembersToCompany
 * @param {Object} data Data to be added.
 * @return {Object} jQuery promise object.
 */
eb_AddMember.addNewMembersToCompany = function (data) {
    var defer = eBusinessJQObject.Deferred();
    console.info('Adding new members...');
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_AddMember.addNewMemberService.replace("{id}", eb_AddMember.companyId),
            method: 'POST',
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

/* Error messages */
eb_AddMember.errorMessages = {
    'First name validation': 'First Name is required.',
    'Last name validation': 'Last Name is required.',
    'Email validation': 'Email Id is required.',
    'Invalid Email': 'Please enter a valid Email address (eg. johdoe@communitybrands.com).',
    'Incomplete information': 'Please fill in all required information correctly before submitting',
    'Failed adding members': 'There was an error encountered while adding members. Please try again. If the problem persists, please contact the customer support for further assistance.'
};

/* Success Messages */
eb_AddMember.successMessages = {
    'Members added successfully': 'Members have been added successfully.'
};

/**
 * The service will return add-member HTML.
 * @method eb_AddMember.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Add Member template URL.
 * @return {String} Add Member HTML template.
 * */
eb_AddMember.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_AddMember.SitePath + eb_AddMember.TemplatePath;
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
 * Add Member model responsible for admin's Add Member operations.
 * @method eb_AddMember.model
 * @param { any } options Object of Add Member data.
 * @param { String } options.ServicePath Service URL.
 * @param { String } options.SitePath Site URL.
 * @param { String } options.templatePath HTML path.
 * @param { Object } options.domElement Add Member DOM element.
 * 
 * */
eb_AddMember.model = function (options) {
    var _that = this;
    _that.domElement = options.domElement;
    _that.userContext = options.userContext;
    _that.companyId = ko.observable();
    _that.companyName = ko.observable();
    _that.addMemberRow = eBusinessJQObject(_that.domElement).find(".eb-add-member-grid-row").clone(true);
    _that.showSuccess = ko.observable(0);
    _that.showError = ko.observable(0);
    _that.showLoader = ko.observable(0);
    _that.successMessage = ko.observable();
    _that.errorMessage = ko.observable();
    _that.domElementId = 1;
    _that.firstName = ko.observable("").extend({ required: { params: true, message: eb_AddMember.errorMessages['First name validation'] } });
    _that.lastName = ko.observable("").extend({ required: { params: true, message: eb_AddMember.errorMessages['Last name validation'] } });
    _that.email = ko.observable("").extend({ email: { params: true, message: eb_AddMember.errorMessages['Invalid Email'] }, required: { params: true, message: eb_AddMember.errorMessages['Email validation'] } });
    _that.errors = ko.validation.group(_that);


    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null,
    }, true);

    if (_that.userContext) {
        _that.companyId(_that.userContext.companyId());
        _that.companyName(_that.userContext.CompanyName());
        eb_AddMember.companyId = _that.companyId();
    }
    
    _that.insertRow = function () {
        var row = eBusinessJQObject(_that.domElement).find(".eb-add-member-grid-row:last");                          /*select last row for cloning*/
        _that.showError(0);
        _that.showSuccess(0);
        if (row[0]) {
            var newRow = row.clone(true).find("input").val("").end().insertAfter(row);                              /*clone without entered values to get empty fields*/
            newRow[0].setAttribute("id", _that.domElementId);                                                       /*set id of row*/
            eBusinessJQObject(newRow[0]).find(".ebIcon-trash")[0].setAttribute("id", _that.domElementId);           /*set same id as row to "remove button" in order to track row's id on click event*/
            eBusinessJQObject(newRow[0]).find("#webUser")[0].checked = false;                                       /*uncheck checkbox as default state of checkbox is supposed to be unchecked*/
            eBusinessJQObject(newRow[0]).find(".validationMessage").hide();                                         /*delete any existing validation messages*/
            ko.applyBindings(new eb_AddMember.model(options), newRow[0]);
            _that.domElementId++;
        }
        else {
            _that.domElementId = 1;
            _that.addMemberRow.find("#webUser")[0].checked = false;
            _that.addMemberRow.find(".validationMessage").hide();
            eBusinessJQObject(_that.domElement).find("#addMemberRow").append(_that.addMemberRow.find("input").val("").end());

            var newRow = eBusinessJQObject(_that.domElement).find("#0")[0];
            ko.cleanNode(newRow);
            ko.applyBindings(new eb_AddMember.model(options), newRow);
        }
        eBusinessJQObject(_that.domElement).find("#submitButton")[0].disabled = false;
    };

    _that.deleteRow = function (data, event) {
        var idno = event.target.id;                                                                                 /*id of row for which delete was clicked*/
        var row = eBusinessJQObject(_that.domElement).find("#" + idno);
        row.remove();

        /*check if any rows exist after deleting this row. If no, disable submit button and if yes, keep submit button enabled*/
        var existingRow = eBusinessJQObject(_that.domElement).find(".eb-add-member-grid-row:last");
        if (existingRow[0]) {
            eBusinessJQObject(_that.domElement).find("#submitButton")[0].disabled = false;
        }
        else {
            eBusinessJQObject(_that.domElement).find("#submitButton")[0].disabled = true;
        }
        
    };

    _that.deleteAll = function () {
        _that.domElementId = 0;
        var row = eBusinessJQObject(_that.domElement).find(".eb-add-member-grid-row");                             /*selecting all rows*/
        row.remove();
        eBusinessJQObject(_that.domElement).find("#submitButton")[0].disabled = true;
    };

    _that.submit = function () {
        var personDetails = [];
        var error = false;

        /*iterate through each row and add to personDetails*/
        for (var id = 0; id < _that.domElementId; id++) {
            var row = eBusinessJQObject(_that.domElement).find("#" + id);
            if (row[0]) {
                if (_that.validateData(row)) {                                                                    /*add to personDetails and proceed only if all required fields are correctly filled*/
                    personDetails.push({
                        "firstName": row.find("#firstName").val(),
                        "lastName": row.find("#lastName").val(),
                        "title": row.find("#title").val(),
                        "email": row.find("#email").val(),
                        "doCreateWebUser": row.find("#webUser")[0].checked
                    });
                }
                else {
                    error = true;
                    _that.showError(1);
                    _that.showSuccess(0);
                    _that.errorMessage(eb_AddMember.errorMessages['Incomplete information']);
                    break;
                }
            }
        }
        if (!error) {
            _that.showLoader(1);
            eb_AddMember.addNewMembersToCompany(personDetails)
                .done(function () {
                    _that.showLoader(0);
                    _that.showSuccess(1);
                    _that.showError(0);
                    _that.successMessage(eb_AddMember.successMessages['Members added successfully']);
                    _that.deleteAll();
                })
                .fail(function (xhr, textStatus, errorThrow) {
                    _that.showLoader(0);
                    _that.showError(1);
                    _that.showSuccess(0);
                    eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_AddMember);
                    _that.errorMessage(eb_AddMember.errorMessages['Failed adding members']);
                });
        }    
    }

    /*update user context on company change from company dropdown control*/
    _that.handleUserContext = function () {
        _that.companyId(_that.userContext.companyId());
        _that.companyName(_that.userContext.CompanyName());
        eb_AddMember.companyId = _that.companyId();
        _that.showError(0);
        _that.showSuccess(0);

        /*Check if any row exists after company change from dropdown, if not, insert a default row*/
        var row = eBusinessJQObject(_that.domElement).find(".eb-add-member-grid-row:last");
        if (!row[0]) {
            _that.insertRow();
        }
    }

    /*checks if all required fields have correctly filled data*/
    _that.validateData = function (data) {
        var validEmailRegex = /^[a-zA-Z0-9"".#_%+-]+@[a-z0-9.-]+\.[a-zA-Z0-9]{2,}$$/;
        if (data.find("#firstName").val()) {
            if (data.find("#lastName").val()) {
                if (data.find("#email").val()) {
                    if (validEmailRegex.test(data.find("#email")[0].value)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    /*responsible for showing errors messages*/
    _that.errorMessagesHandler = ko.computed(function () {
        if (_that.errors().length > 0) {
            _that.errors.showAllMessages(true);
        }     
    });

};



/**
* Page DOM element.
* @method eb_AddMember.domElement
* @param {object} domElement current DOM element.
* */
eb_AddMember.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_AddMember.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_AddMember);
});