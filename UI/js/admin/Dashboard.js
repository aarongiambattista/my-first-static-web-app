/**
 * Company Admin class.
 * @class eb_CompanyAdmin
 * */
var eb_CompanyAdmin = eb_CompanyAdmin || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_CompanyAdmin.SitePath
 * @type {String}
 * */
eb_CompanyAdmin.SitePath = eb_Config.SitePath;

/**
 * Company Admin template path.
 * @property eb_CompanyAdmin.TemplatePath
 * @type {String}
 * */
eb_CompanyAdmin.TemplatePath = "html/admin/Dashboard.html";

/**
 * SOA path.
 * @property eb_CompanyAdmin.ServicePath
 * @type {String}
 * */
eb_CompanyAdmin.ServicePath = eb_Config.ServicePathV1;

/**
 * Site path to Company Admin Dashboard.
 * @property eb_CompanyAdmin.getCompanies
 * @type {String}
 * */
eb_CompanyAdmin.getCompanies = eb_CompanyAdmin.ServicePath + "admin/companies";

/**
 * Character length for show more and show less functionality
 * @property  eb_productDetails.charLength
 * @type {String}
 */
eb_CompanyAdmin.charLength = eb_Config.companyAdmin_descriptionCharLength || 450;

/**
 * Public method to get companies data for admin.
 * @method eb_CompanyAdmin.getCompaniesData
 * @return { Object } jQuery promise object.
 **/
eb_CompanyAdmin.getCompaniesData = function () {
    var defer = eBusinessJQObject.Deferred();
    var serviceURL = eb_CompanyAdmin.getCompanies;
    eBusinessJQObject.get({
        url: serviceURL,
        xhrFields: {
            withCredentials: true
        }
    }).done(function (result) {
        defer.resolve(result);

        //eb_CompanyAdmin.model.loadCompanyData(result);

    }).fail(function (data, msg, jhr) {
        defer.reject(data, msg, jhr);
        console.log("Unable to fetch companies for the user:-", msg);
    });
    return defer.promise();
}

/**
 * The service will return company admin HTML.
 * @method eb_CompanyAdmin.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Company Admin template URL.
 * @return {String} Company Admin HTML template.
 * */
eb_CompanyAdmin.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_CompanyAdmin.SitePath + eb_CompanyAdmin.TemplatePath;
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
 * Company Admin model responsible for all company admin operations.
 * 
 * @method eb_CompanyAdmin.model
    * 
 * @param { any } options Object of company admin data.
 * @param { String } options.ServicePath Service URL.
 * @param { String } options.SitePath Site URL.
 * @param { String } options.templatePath HTML path.
 * @param { Object } options.domElement Company admin DOM element.
 * @param {Object} userContext eb_UserContext.model instance.
 * 
 * */

eb_CompanyAdmin.model = function (options) {
    var _that = this;
    _that.userContext = options.userContext;
    _that.data = options.data;

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the domElement property is required.", stack: Error().stack };
    }

    _that.domElement = options.domElement;
    if (options.data) {
        _that.data = options.data;
    }

    _that.companies = ko.observableArray([]);
    _that.adminName = ko.observable();
    _that.companyId = ko.observable();
    _that.companyName = ko.observable();
    _that.description = ko.observable("");

    //Show more and show less binding
    _that.remainingDescription = ko.observable("");
    _that.showRemainingDescription = ko.observable(0);
    _that.showMoreHide = ko.observable(0);
    _that.showMoreDescription = ko.observable(1);
    _that.hideRemainingDescription = ko.observable(0);
    _that.showEllipses = ko.observable(0);

    //show less functionality
    _that.showLess = function () {
        _that.hideRemainingDescription(0);
        _that.showMoreDescription(1);
        _that.showMoreHide(1);
        _that.showRemainingDescription(0);
        _that.showEllipses(1);
    };

    //show more functionality
    _that.showMore = function () {
        _that.showMoreHide(0);
        _that.showRemainingDescription(1);
        _that.showMoreDescription(0);
        _that.hideRemainingDescription(1);
        _that.showEllipses(0);
    };

    //showing the data if char length is greater than set character length
    _that.showMoreData = function (data) {
        var description = data;
        var showDescription = description.substr(0, eb_CompanyAdmin.charLength);
        _that.description(showDescription);
        _that.remainingDescription(data);
        _that.showRemainingDescription(0);
        _that.showMoreHide(1);
        _that.showEllipses(1);
    };

    //End of show more and show less
    //Checking the description if the description length is greater than set char length then we are going to split the 
    //description in two different div.
    _that.checkDescription = function (data) {
        if (!data) {
            data = "";
        }
        data = eBusinessJQObject("<html>" + data + "</html>").text();
        var descriptionLength = data;
        if (descriptionLength.length < eb_CompanyAdmin.charLength) {
            _that.description(data);
        } else {
            _that.showMoreData(data);
        }
    };

    //load First name of admin from local storage
    if (_that.userContext) {
        _that.adminName = ko.observable(_that.userContext.FirstName());
    }

    //get company data
    _that.getCompanyDataFromServer = function () {
        return eb_CompanyAdmin.getCompaniesData();
    }

    //load companies data
    _that.loadCompanyData = function (data) {
        if (data.length > 0) {
            var defaultCompany = (data[0]);                             //initialize first instance of company data as default company
            ko.utils.arrayPushAll(_that.companies, data);               //load all company data in companies
            if (_that.userContext.companyId() > 0) {                   //check if companyId exists in user context
                ko.utils.arrayFirst(data, function (item) {
                    if (item.id == _that.userContext.companyId()) {
                        defaultCompany = item;                          //set company with user context's companyId as default company
                    }

                });
            }
            _that.setCompany(defaultCompany);                           //set up default company's dashboard
        }
    }

    //load default company data into observables (bind company info)
    _that.setCompany = function (data) {
        _that.remainingDescription("");
        _that.showRemainingDescription(0);
        _that.showMoreHide(0);
        _that.showMoreDescription(1);
        _that.hideRemainingDescription(0);
        _that.showEllipses(0);

        _that.companyId(data.id);
        _that.companyName(data.name);
        _that.checkDescription(data.Description);

        //load default company into session storage
        var dataOut = { companyId: _that.companyId(), CompanyName: _that.companyName() };
        var fields = ['companyId', 'CompanyName'];
        _that.userContext.Load(dataOut);
        _that.userContext.saveUpdateCache(fields, dataOut);

        //set company id to admin shopping cart
        eb_adminShoppingCart.companyId = _that.companyId();

        //reload shopping cart & header control
        eb_CompanyAdmin.loadShoppingCart().done(function (cartData) {
            console.log("Admin Shopping Cart loaded successfully!!");
            //load header control
            eb_CompanyAdmin.loadHeaderControl().done(function () {
                console.log("Header Menu loaded successfully!!");
            });
        });

    }

    if (_that.data) {
        _that.loadCompanyData(_that.data);
    }
    else {
        //Get company data from the server.
        _that.getCompanyDataFromServer().done(function (companyData) {
            _that.loadCompanyData(companyData);
        }).fail(function (xhr, textStatus, errorThrow) {
            console.info("getCompanyDataFromServer" + xhr.responseText);
            eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyAdmin);
        });
    }

};

eb_CompanyAdmin.loadShoppingCart = function (cartOptions) {
    var deferred = eBusinessJQObject.Deferred();

    eb_adminShoppingCart.getShoppingCart().done(function (cartData) {
        var cartOptions = {};
        cartOptions.shoppingCartData = cartData;
        eb_adminShoppingCart.live = new eb_adminShoppingCart.shoppingCartModel(cartOptions);

        deferred.resolve(cartData);

    }).fail(function (data, msg, jhr) {
        console.error('Failed to render Admin Shopping Cart...' + data);
        deferred.reject(data, msg, jhr);
    });;
    return deferred.promise();
};

eb_CompanyAdmin.loadHeaderControl = function () {
    var deferred = eBusinessJQObject.Deferred();

    var headerOptions = headerOptions || {};
    headerOptions.domElement = eBusinessJQObject('#ebHeaderMenu')[0];
    headerOptions.templatePath = eb_Config.SitePath + "html/HeaderMenu.html";
    headerOptions.userContext = eb_UserContext.live;
    headerOptions.shoppingCart = eb_adminShoppingCart.live;
    headerOptions.activePage = "AdminDashboard";
    headerOptions.sitePath = eb_Config.SitePath;
    headerOptions.cartText = "My Company Cart";
    headerOptions.viewCartURL = eb_CompanyAdmin.SitePath + "admin/" + eb_HeaderMenu.pages["ViewCart"];
    eb_HeaderMenu.viewCartURL = eb_Config.SitePath + "admin/ViewCart.html";

    eb_HeaderMenu.render(headerOptions).done(function () {
        eb_HeaderMenu.live = new eb_HeaderMenu.model(headerOptions);
        ko.cleanNode(headerOptions.domElement);
        ko.applyBindings(eb_HeaderMenu.live, headerOptions.domElement); /*Apply KO bindings, fire up the control*/

        deferred.resolve();
    }).fail(function (data, msg, jhr) {
        console.error('Failed to render header control...');
        deferred.reject(data, msg, jhr);
    });
    return deferred.promise();
}

/**
* Page DOM element.
* @method eb_CompanyAdmin.domElement
* @param {object} domElement current DOM element.
* */
eb_CompanyAdmin.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_CompanyAdmin.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyAdmin);
});


