/**
 * Company Dropdown class.
 * @class eb_CompanyDropdown
 * */
var eb_CompanyDropdown = eb_CompanyDropdown || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_CompanyDropdown.SitePath
 * @type {String}
 * */
eb_CompanyDropdown.SitePath = eb_Config.SitePath;

/**
 * Company Dropdown template path.
 * @property eb_CompanyDropdown.TemplatePath
 * @type {String}
 * */
eb_CompanyDropdown.TemplatePath = "html/admin/CompanyDropdown.html";

/**
 * SOA path.
 * @property eb_CompanyDropdown.ServicePath
 * @type {String}
 * */
eb_CompanyDropdown.ServicePath = eb_Config.ServicePathV1;

/**
 * @property eb_CompanyDropdown.getCompanies
 * @type {String}
 * */
eb_CompanyDropdown.getCompanies = eb_CompanyDropdown.ServicePath + "admin/companies";

/**
 * Public method to get companies data for admin.
 * @method eb_CompanyDropdown.getCompaniesData
 * @return { Object } jQuery promise object.
 **/
eb_CompanyDropdown.getCompaniesData = function () {
    var defer = eBusinessJQObject.Deferred();
    var serviceURL = eb_CompanyDropdown.getCompanies;
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

/**
 * The service will return company dropdown HTML.
 * @method eb_CompanyDropdown.render
 * @param {any} options Array of required data.
 * @param {String} options.templatePath Company Dropdown template URL.
 * @return {String} Company Dropdown HTML template.
 * */
eb_CompanyDropdown.render = function (options) {
    var defer = eBusinessJQObject.Deferred();

    if (!options) {
        throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
    }

    if (!options.templatePath) {
        var finalPath = eb_CompanyDropdown.SitePath + eb_CompanyDropdown.TemplatePath;
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
 * Company Dropdown model responsible for all company dropdown operations.
 * 
 * @method eb_CompanyDropdown.model
    * 
 * @param { any } options Object of company dropdown data.
 * @param { String } options.ServicePath Service URL.
 * @param { String } options.SitePath Site URL.
 * @param { String } options.templatePath HTML path.
 * @param { Object } options.domElement Company dropdown DOM element.
 * @param {Object} userContext eb_UserContext.model instance.
 * 
 * */

eb_CompanyDropdown.model = function (options, control) {
    var _that = this;
    _that.userContext = options.userContext;
    _that.parentControl = control;
    _that.domElement = options.domElement;
    _that.companies = ko.observableArray([]);
    _that.companyId = ko.observable();
    _that.companyName = ko.observable();

    //get company data
    _that.getCompanyDataFromServer = function () {
        return eb_CompanyDropdown.getCompaniesData();
    }

    //load companies data
    _that.loadCompanyData = function (data) {
        if (data.length > 0) {
            ko.utils.arrayPushAll(_that.companies, data);               //load all company data in companies
            if (!_that.userContext.checkCompanyAdminInUserContext()) {
                var defaultCompany = (data[0]);                             //initialize first instance of company data as default company
                _that.setCompany(defaultCompany);                           //set up default company's dashboard
            }
           
        }
    }

    //load default company data into observables (bind company info)
    _that.setCompany = function (data) {
        _that.companyId(data.id);
        _that.companyName(data.name);

        //save company Id and company name in session storage
        var dataOut = { companyId: _that.companyId(), CompanyName: _that.companyName() };
        var fields = ['companyId', 'CompanyName'];
        _that.userContext.Load(dataOut);
        _that.userContext.saveUpdateCache(fields, dataOut);
        _that.parentControl.handleUserContext();
    }

    //Get company data from the server.
    _that.getCompanyDataFromServer().done(function (companyData) {
        _that.loadCompanyData(companyData);
    }).fail(function (xhr, textStatus, errorThrow) {
        console.info("getCompanyDataFromServer" + xhr.responseText);
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyDropdown);
    });
};



/**
* Page DOM element.
* @method eb_CompanyAdmin.domElement
* @param {object} domElement current DOM element.
* */
eb_CompanyDropdown.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_CompanyDropdown.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['Http Response']))
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_CompanyDropdown);
});