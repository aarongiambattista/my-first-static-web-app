//Our collection of user information object.
var eb_UserInformation = eb_UserInformation || {};

//Site path
eb_UserInformation.SitePath = eb_Config.SitePath;

//The path to the HTMLthat should be rendered for this control.
eb_UserInformation.TemplatePath = "html/UserInformation.html";

//TODO: Once the actual service is ready, service path will change.
//The path to the Ebusiness SOA layer
eb_UserInformation.ServicePath = eb_Config.ServicePath + "services/";

//User information service call.
eb_UserInformation.getUser = eb_UserInformation.ServicePath + "UserInformation";

//Get user information records.
eb_UserInformation.GetUser = function (model) {
    var defer = eBusinessJQObject.Deferred();
    console.info('called service to get user information');
    eBusinessJQObject.get({
        url: eb_UserInformation.getUser,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        }
    }).done(function (data) {
        defer.resolve(data);
        }).fail(defer.reject);
    return defer.promise();
};

//User information model.
eb_UserInformation.userModel = function (data, domElement) {
    var _that = this;
    _that.userName = ko.observableArray();
    _that.userName1 = ko.observableArray();

    //Fetch data from the server
    _that.getUserInformation = function () {
        eb_UserInformation.GetUser(_that).done(function (data) {
            _that.loadUser(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            console.error("Failed to get user Information.");
        });
    };

    //Load user data.
    _that.loadUser = function (data) {
        if (typeof data !== 'undefined') {
            _that.userName(data.userInfo["Email"]);
            var observableData = ko.mapping.fromJS(data.userInfo);
            _that.userName1(ko.mapping.fromJS(data));
        }
        else {
            //From session Storage
            _that.userName(sessionStorage.getItem("EBusiness_TokenId"));
        }
    };
    _that.getUserInformation();
};

//Render user information template.
eb_UserInformation.render = function (domElement, templatePath) {
    var defer = eBusinessJQObject.Deferred();
    var finalPath = eb_UserInformation.SitePath + eb_UserInformation.TemplatePath;
    if (typeof templatePath !== 'undefined' && templatePath !== '') {
        finalPath = templatePath;
    }

    eBusinessJQObject.get(finalPath).done(function (data) {
        domElement.innerHTML = data;
        defer.resolve(data);
    }).fail(defer.reject);
    return defer.promise();
};
