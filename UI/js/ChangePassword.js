//Collection for the change password control.
//WARNING: Dependant on UserContext object
var eb_ChangePassword = eb_ChangePassword || {};

//Site Path
eb_ChangePassword.SitePath = eb_Config.SitePath;

//Path to the SOA layer
eb_ChangePassword.ServicePath = eb_Config.ServicePath + "services";

//Path off of the SOA path to the User Information service
eb_ChangePassword.ChangePwdService = "/User";

//Default template path
eb_ChangePassword.TemplatePath = "html/ChangePassword.html";

/*
A collection of known responses for the change password endpoint
 and the messages we should display to the user when we receive them.
 */
eb_ChangePassword.KnownResponses = [{ code: "\"Incorrect\"", message: "The old password you provided was incorrect." }
    , { code: "\"WebUserNotCreated\"", message: "There may be a user in the system with your information, please contact sutomer service." }
    , { code: "\"Success\"", message: "Your password was successfully changed." }
    , { code: "\"Person/User already exist!\"", message: "The information you provided is already in the system. Please contact customer service for assistance." }
    , { code: "\"Some reason Person Not Created\"", message: "There was a problem with your registration. Please contact customer service." }];

//Dependant on UserContext object
eb_ChangePassword.callChangeUserPassword = function (model) {
    var deferred = eBusinessJQObject.Deferred();
    var dataToPass = {
        "PersonID": model.userContext.UserId(),//Don't ask
        "OldPassword": model.currentPwd(),
        "NewPassword": model.newPwd(),
        "RetypeNewPassword": model.newPwdConfirm()
    };

    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.post({
            url: eb_ChangePassword.ServicePath + eb_ChangePassword.ChangePwdService,
            headers: { "AptifyAuthorization": "eBusinessWebUser " + model.userContext.TokenId() },
            data: dataToPass,
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (data) {
            if (data === "\"Success\"") {
                model.showSuccessfulChangePwd(1);
                model.showError(0);
                model.showChangePasswordForm(0);
                model.userContext.Destroy();
                deferred.resolve(data);
            }
        }).fail(function (data, message, xhr) {
            if (typeof data === "object") {
                console.error(data.responseText);
                eBusinessJQObject.map(eb_ChangePassword.KnownResponses, function (res) {
                    if (res.code === data['responseText']) {
                        console.info(res.message);
                        model.errorMessage(res.message);
                        model.showError(1);
                        deferred.reject();
                    }
                });
            }
        });//fail
    });
    return deferred.promise();
};//callChangeUserPassword

/*
Change Password UI model.
Dependant on User Context to see if the user is logged in already.
 */
eb_ChangePassword.model = function (data, domElement, userContext) {
    var _that = this;

    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
    }, true);

    ko.validation.rules['confirmPasswordMatches'] = {
        getValue: function (o) {
            return typeof o === 'function' ? o() : o;
        },
        validator: function (val, otherField) {
            return val === this.getValue(otherField);
        },
        message: 'The confirm password field must have the same value'
    };
    ko.validation.registerExtenders();

    _that.domElement = domElement;
    _that.userContext = userContext;//Store the user context model on this model for easy access. May move this to a sub/pub later.
    _that.currentPwd = ko.observable().extend({ required: true });
    _that.newPwd = ko.observable();
    _that.newPwdConfirm = ko.observable().extend({ confirmPasswordMatches: _that.newPwd });
    _that.errorMessage = ko.observable();//error message  here
    _that.showError = ko.observable(0);//should we show the error message
    _that.showSuccessfulChangePwd = ko.observable(0);//show password change success message
    _that.showNotLoggedInMessage = ko.observable(0);//should we show the error message
    _that.showChangePasswordForm = ko.observable(0);
    _that.errors = ko.validation.group(_that);

    //Load up the settable data fields from a data source.
    _that.Load = function (data) {
        _that.newPwd(data['newPwd']);
        _that.currentPwd(data['currentPwd']);
        _that.newPwdConfirm(data['newPwdConfirm']);
    };
    _that.clickChangePwd = function () {
        //Is the user logged in
        //Does their old password match their new password?
        //Does their new password = the new password confirm
        //Is the password the minimum length
        //does the password meet the minimum complexity requirement
        //Everything peachy? Call change password service.
        if (_that.errors().length === 0) {
            eb_ChangePassword.callChangeUserPassword(_that);
        } else {
            _that.errors.showAllMessages();
        }
    };

    /*Check and see if the user is logged in
      * If the user is logged in, then it should be OK for them to change their password.
      * Subscribe to isUserLoggedIn so if the user loggs in while this control is loaded, we will change the UI.
      */
    _that.userContext.isUserLoggedIn.subscribe(function (newValue) {
        _that.showNotLoggedInMessage(!newValue);
        _that.showChangePasswordForm(newValue);
        console.info("Logged in status changed to:" + newValue);
    });
    _that.userContext.getDataFromCacheOrServer();//Load up the user context from the server or from a local store.
    if (_that.userContext.isUserLoggedIn() === 1) {
        _that.showChangePasswordForm(1);
        _that.showNotLoggedInMessage(0);
    }
    console.info("ChangePassword says user is logged in:" + _that.userContext.isUserLoggedIn());
};

//Render this control on the Dom element provided.
eb_ChangePassword.render = function (options) {
    var defer = eBusinessJQObject.Deferred();
    eBusinessJQObject.get(eb_ChangePassword.SitePath + eb_ChangePassword.TemplatePath).done(function (data) {
        options.domElement.innerHTML = data;
        defer.resolve(data);
    }).fail(defer.reject);
    return defer.promise();
};