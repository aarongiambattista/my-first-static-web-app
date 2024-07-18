/**
 * User Context class.
 * @class eb_UserContext
 * */
var eb_UserContext = eb_UserContext || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_UserContext.SitePath
 * @type {String}
 * */
eb_UserContext.SitePath = eb_Config.SitePath;

/**
 * SOA path.
 * It would be set from configuration file.
 * @property eb_UserContext.ServicePath
 * @type {String}
 * */
eb_UserContext.ServicePath = eb_Config.ServicePath + "services";

/**
 * User Information service URL.
 * @property eb_UserContext.UserInfoService
 * @type {String}
 * */
eb_UserContext.UserInfoService = "/UserInformation";

/**
 * Logout service URL.
 * @property eb_UserContext.LogoutService
 * @type {String}
 * */
eb_UserContext.LogoutService = "/Authentication/Logout/";

/**
 * User Context template path.
 * @property eb_UserContext.TemplatePath
 * @type {String}
 * */
eb_UserContext.TemplatePath = "html/UserContext.html";

/**
 * User context model fields collection
 * @property eb_UserContext.fields
 * @type {Object}
 * */
eb_UserContext.fields = ["UserName", "FirstName", "LastName", "Email", "AuthenticatedPersonId", "UserId", "LinkId", "companyId", "CompanyName", "CacheUserContextExpiration"];/*Store a list of fields on the context object for easy iteration.*/

/**
 * This is cache user context expiration field
 * @property eb_UserContext.CacheUserContextExpirationField
 * @type {String}
 * */
eb_UserContext.CacheUserContextExpirationField = "CacheUserContextExpiration";

/**
 * This prefix will be attached to all items added to session storage.
 * @property eb_UserContext.StoragePrefix
 * @type {String}
 * */
eb_UserContext.StoragePrefix = "eb_";

/**
 * Login service URL.
 * @property eb_UserContext.LoginServicePath
 * @type {String}
 * */
eb_UserContext.LoginServicePath = eb_UserContext.ServicePath + "/Authentication/Login/eBusinessWebUser";

/**
 * Function to grab context data from where-ever it is being stored or from the server.
 * @method eb_UserContext.getContextData
 * @param {Boolean} useCache Boolean value
 * @return {Object} jQuery promise object which when resolved returns user information data.
 */
eb_UserContext.getContextData = function (useCache) {
    var defer = eBusinessJQObject.Deferred();
    var dataOut = {};
//EB-1939: store company id in memory and set in session storage once getUserData is done
    var sessionStorageCompanyId = -1;
    var sessionStorageCompanyName = "";
    if (eb_UserContext.isSessionTimeOut()) {
        sessionStorageCompanyId = sessionStorage.getItem(eb_UserContext.StoragePrefix + "companyId");
        sessionStorageCompanyName = sessionStorage.getItem(eb_UserContext.StoragePrefix + "CompanyName");
        sessionStorage.clear();
    }
    var AuthenticatedPersonId = sessionStorage.getItem(eb_UserContext.StoragePrefix + "UserId");
    if (AuthenticatedPersonId && useCache) {
        for (var i = 0; i < eb_UserContext.fields.length; i++) {
            var field = eb_UserContext.fields[i];
            dataOut[field] = sessionStorage.getItem(eb_UserContext.StoragePrefix + field);
        }
        defer.resolve(dataOut);
    } else {
        eb_UserContext.getUserData(defer).done(function (result) {
            if (result) {
                eb_UserContext.setUserContextDataInStorage(eb_UserContext.fields, result);
                if (sessionStorageCompanyId > 0) {
                    sessionStorage.setItem(eb_UserContext.StoragePrefix + "companyId", sessionStorageCompanyId);
                    sessionStorage.setItem(eb_UserContext.StoragePrefix + "CompanyName", sessionStorageCompanyName);
                }
            } else {
                sessionStorage.clear();
            }
        }).fail(defer.reject);
    }
    return defer.promise();
};

/**
 * Function for getting user information.
 * @method eb_UserContext.getUserData
 * @param {any} defer Defer object 
 * @return {Object} jQuery object which return user information.
 */
eb_UserContext.getUserData = function (defer) {
    var dataOut = {};
    var def = eBusinessJQObject.Deferred();
    eb_UserContext.getUserInformation().done(function (result) {
        if (result.userInfo) {
            //dataOut = {}; //Sumit: not sure why this is declared here, when its already declared at the start of this function
            dataOut = result.userInfo;
            def.resolve(dataOut);
        }
        //Sumit: During FE session timeout (in the "getContextData" method in this file), we store the company id back in the session storage
        //Fetch it here and send along with the data sent out from user context, this will persist the company id
        dataOut.companyId = sessionStorage.getItem(eb_UserContext.StoragePrefix + "companyId");
        dataOut.CompanyName = sessionStorage.getItem(eb_UserContext.StoragePrefix + "CompanyName");

        defer.resolve(dataOut);
    }).fail(defer.reject);
    return def.promise();
};

/**
 * This method is use to set user information in session storage.
 * @method eb_UserContext.setUserContextDataInStorage
 * @param {any} fields Fields collection
 * @param {any} userData user data return to caller.
 */
eb_UserContext.setUserContextDataInStorage = function (fields, userData) {
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        if (eb_UserContext.CacheUserContextExpirationField === field) {
            sessionStorage.setItem(eb_UserContext.StoragePrefix + eb_UserContext.CacheUserContextExpirationField, eb_UserContext.calculateSessionExpirationDate());
        } else {
            sessionStorage.setItem(eb_UserContext.StoragePrefix + field, userData[field]);
        }
    }
};

/**
 * This method is calculate session expiration date based on session expiration in min attribute [eb_Config.sessionExpirationInMin=10] in config file.
 * @method eb_UserContext.calculateSessionExpirationDate
 * @return {Date} Session expiration date.
 * */
eb_UserContext.calculateSessionExpirationDate = function () {
    return new Date(new Date().getTime() + (60000 * eb_Config.sessionExpirationInMin));
};

/**
 * Function to check whether session is going to time out or not with the eb_config sessionExpirationInMin attribute.
 * @method eb_UserContext.isSessionTimeOut
 * @return {Boolean} Return true or false based on session is time out or not with login date and time stored in session storage.
 * */
eb_UserContext.isSessionTimeOut = function () {
    var sessionExpirationDate = sessionStorage.getItem(eb_UserContext.StoragePrefix + eb_UserContext.CacheUserContextExpirationField);
    let expirationDate = new Date(sessionExpirationDate);
    var currentDateTime = new Date();
    if (expirationDate > currentDateTime) {
        return false;
    } else {
        return true;
    }
};

/**
 * Method to get user information.
 * @method eb_UserContext.getUserInformation
 * @return {Object} jQuery promise object which when resolved returns user information data.
 */
eb_UserContext.getUserInformation = function () {
    var defer = eBusinessJQObject.Deferred();
    eBusinessJQObject.ajax(
        {
            url: eb_UserContext.ServicePath + eb_UserContext.UserInfoService,
            method: "GET",
            xhrFields: {
                withCredentials: true
            }
        }
    ).done(function (data, textStatus, jqXHR) {
        //if CSRF setting is true then these tokens gets from service response and we are setting it in config properties and pass to every non get service request.
        eb_Config.__requestverificationtokenValue = jqXHR.getResponseHeader(eb_Config.__requestverificationtoken);
        eb_Config.CSRFDefenseInDepthTokenValue = jqXHR.getResponseHeader(eb_Config.CSRFDefenseInDepthToken);
        defer.resolve(data);
    }).fail(defer.reject);
    return defer.promise();
};

/* Called by the login control on successful login to set the local context data.
   If an existing user context model is not passed in, one will be created and returned to the user.
   This function should always return a user context model.
 */
eb_UserContext.setContextData = function (data, model, domElement) {
    if (typeof model === 'undefined') {
        model = new eb_UserContext.model(data, domElement);
    } else {
        model.Load(data);
    }
    var saveSuccess = eb_UserContext.saveContext(model);
    if (!saveSuccess) {
        console.error("Unable to persist user info in storage mechanism");
    }
    return model;
};

/**
 * This function is responsible for persisting the user context between page loads via whatever mechanism we choose.
 * @method eb_UserContext.saveContext
 * @param {Object} model Instance of eb_UserContext.model.
 * @return {Boolean} jQuery promise object which when resolved returns boolean value.
 */
eb_UserContext.saveContext = function (model) {
    var result = false;
    for (var i = 0; i < eb_UserContext.fields.length; i++) {
        var field = eb_UserContext.fields[i];
        if (field === eb_UserContext.CacheUserContextExpirationField) {
            sessionStorage.setItem(eb_UserContext.StoragePrefix + eb_UserContext.CacheUserContextExpirationField, eb_UserContext.calculateSessionExpirationDate());
        } else {
            sessionStorage.setItem(eb_UserContext.StoragePrefix + field, model[field]());
        }
    }
    return result;
};

/**
 * This function is responsible for clearing the user context data.
 * @method eb_UserContext.destoryContext
 * @param {Object} model Instance of eb_UserContext.model.
 */
eb_UserContext.destoryContext = function (model) {
    for (var i = 0; i < eb_UserContext.fields.length; i++) {
        var field = eb_UserContext.fields[i];
        if (model && model[field]) {
            model[field](null);
        }
    }
    sessionStorage.clear();
    if (model) {
        model.isUserLoggedIn(0);
    }
};

/**
 * Logout function.
 * Logs the user out of SOA and destroy user context.
 * @method eb_UserContext.Logout
 * @param {Object} model Instance of eb_UserContext.model.
 * @return {String} jQuery promise object which when resolved returns empty string.
 */
eb_UserContext.Logout = function (model) {
    var defer = eBusinessJQObject.Deferred();
    eb_Config.retrieveCSRFTokens().always(function (headers) {
        eBusinessJQObject.ajax({
            url: eb_UserContext.ServicePath + eb_UserContext.LogoutService,
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        }).done(function (result) {
            eb_UserContext.destoryContext(model);
            defer.resolve(result);
        }).fail(function (result) {
            eb_UserContext.destoryContext(model);
            defer.reject(result);
        });
    });

    return defer.promise();
};

/**
 * Login function.
 * @method eb_UserContext.login
 * @param {Object} loginParameters Login credentials.
 * @return {Object} jQuery promise object which when resolved returns user information object.
 */
eb_UserContext.login = function (loginParameters) {
    var localDeferred = eBusinessJQObject.Deferred();
    console.info('Authenticating...');

    function internalLogin(deferred, repeatOnSecurityFailure) {
        eb_Config.retrieveCSRFTokens().always(function (headers) {
            eBusinessJQObject.ajax({
                url: eb_UserContext.LoginServicePath,
                crossDomain: true,
                type: "POST",
                data: loginParameters,
                /*This will save the cookie in the browser*/
                xhrFields: {
                    withCredentials: true
                },
                headers: headers
            }).done(deferred.resolve).fail(function (data, msg, jhr) {
                //if the browser has an existing authentication cookie that's expired, services will
                //respond with a SecurityRequirementFailed exception because it was asked to execute
                //a request with an invalid token.  This is correct behavior but results in a poor 
                //user experience on the front end.  So we will detect it and resubmit.  It should 
                //pass the second time because the first response deletes the invalid token.  
                if (repeatOnSecurityFailure && data.responseJSON.type === "SecurityRequirementFailed")
                    internalLogin(deferred, false);
                else
                    deferred.reject(data, msg, jhr);
            });
        });
    }

    internalLogin(localDeferred, true);

    return localDeferred.promise();
};

/**
 * UserContext Model.
 * Any information specific to an individual instance of this model should be stored here.
 * 
 * @method eb_UserContext.model
 * 
 * @param {Object} data User Context Data
 * @param {Object} domElement User context DOM element.
 * 
 * */
eb_UserContext.model = function (data, domElement) {
    var _that = this;
    _that.domElement = domElement;
    _that.UserName = ko.observable();
    _that.FirstName = ko.observable();
    _that.LastName = ko.observable();
    _that.Email = ko.observable();
    _that.AuthenticatedPersonId = ko.observable();
    _that.LinkId = ko.observable();
    _that.UserId = ko.observable();
    _that.companyId = ko.observable();
    _that.CompanyName = ko.observable();
    _that.isUserLoggedIn = ko.observable(0);
    _that.showUserContext = ko.observable(0);
    _that.userLoggedIn = ko.observable(0);
    _that.userLoggedOut = ko.observable(0);

    /*Load up only the predefined fields for the user context and stored in to the session storage.*/
    _that.Load = function (data) {
        if (data !== 'undefined') {
            for (var i = 0; i < eb_UserContext.fields.length; i++) {
                var field = eb_UserContext.fields[i];
                if (typeof data !== 'undefined' && typeof field !== 'undefined' && typeof data[field] !== 'undefined')
                    _that[field](data[field]);
            }
        }

        if (_that.UserName() && _that.UserName() !== 'null' && _that.LinkId() !== 'null') {
            _that.isUserLoggedIn(1);
            _that.userLoggedIn(1);
        } else {
            _that.isUserLoggedIn(0);
            _that.userLoggedIn(0);
        }
    };

    /*If a local cache is available, grab it, otherwise call the server to refresh it.*/
    _that.getDataFromCacheOrServer = function () {
        eb_UserContext.getContextData(true).done(function (myData) {
            _that.Load(myData);
        }).fail(function (data, msg, jhr) {
            console.error("Failed to get user context data.");
        });
    };

    /*cache user context expiration date*/
    _that.CacheUserContextExpiration = ko.observable();

    /*Save data to local cache*/
    _that.saveToCache = function () {
        eb_UserContext.saveContext(_that);
    };

    /*Save user data in session storage.*/
    _that.saveUpdateCache = function (fields, userData) {
        eb_UserContext.setUserContextDataInStorage(fields, userData);
    };

    /*Empty the model and destroy session storage*/
    _that.Destroy = function () {
        eb_UserContext.destoryContext(_that);
    };

    /*Log the user out of SOA and call the destroy object.*/
    _that.Logout = function () {
        var defer = eBusinessJQObject.Deferred();
        _that.Destroy();
        eb_UserContext.Logout(_that).done(function () {
            _that.userLoggedOut(1);
            defer.resolve();
        }).fail(defer.reject);
        return defer.promise();
    };

    /*Login method.*/
    _that.login = function (data) {
        var defer = eBusinessJQObject.Deferred();
        eb_UserContext.login(data).done(function (result) {
            _that.userLoggedIn(1);
            defer.resolve(result);
        }).fail(defer.reject);
        return defer.promise();
    };

    if (typeof data !== 'undefined') {
        _that.Load(data);
    } else {
        _that.isUserLoggedIn(0);
        _that.userLoggedIn(0);
    }

    _that.checkCompanyAdminInUserContext = function () {
        _that.companyId(sessionStorage.getItem(eb_UserContext.StoragePrefix + "companyId"));
        if (_that.companyId() > 0 && _that.companyId() != "undefined" && _that.companyId() != null) {
            return true;
        }
        return false;
    }

};

/*Render control function.*/
eb_UserContext.render = function (options) {
    var defer = eBusinessJQObject.Deferred();
    /*check and see if options is overriding any of our global control settings.*/
    if (typeof options.SitePath !== 'undefined' && options.SitePath !== '') eb_UserContext.SitePath = options.SitePath;
    if (typeof options.ServicePath !== 'undefined' && options.ServicePath !== '') eb_UserContext.ServicePath = options.ServicePath;

    var finalPath = eb_UserContext.SitePath + eb_UserContext.TemplatePath;
    if (typeof options.TemplatePath !== 'undefined' && options.TemplatePath !== '') {
        finalPath = eb_UserContext.SitePath + options.TemplatePath;
        eb_UserContext.TemplatePath = options.TemplatePath;
    }
    eBusinessJQObject.get(finalPath).done(function (data) {
        options.domElement.innerHTML = data;
        defer.resolve(data);
    }).fail(defer.reject);
    return defer.promise();
};

//get company data
eb_UserContext.getCompanies = function () {
    var defer = eBusinessJQObject.Deferred();
    var serviceURL = eb_Config.ServicePathV1 + "admin/companies";

    eBusinessJQObject.get({
        url: serviceURL,
        xhrFields: {
            withCredentials: true
        }
    }).done(function (result) {
        defer.resolve(result);
    }).fail(function (data, msg, jhr) {
        defer.reject(data, msg, jhr);
        console.log("Unable to fetch companies for the user:-", msg);
    });

    return defer.promise();
}

