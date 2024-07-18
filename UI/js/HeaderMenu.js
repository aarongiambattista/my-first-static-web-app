/**
 * Header class.
 * This control is dependent on the UserContext control to persist user information.
 * @class eb_HeaderMenu
 * */
var eb_HeaderMenu = eb_HeaderMenu || {};

/**
 * Site path.
 * It would be set from configuration file.
 * @property eb_HeaderMenu.SitePath
 * @type {String}
 * */
eb_HeaderMenu.SitePath = eb_Config.SitePath;

/**
 * Login template path.
 * @property eb_HeaderMenu.TemplatePath
 * @type {String}
 * */
eb_HeaderMenu.TemplatePath = "html/HeaderMenu.html";

/**
 * Default error message.
 * @property eb_HeaderMenu.defaultErrorMessage
 * @type {String}
 **/
eb_HeaderMenu.defaultErrorMessage = 'Sorry, there was an unexpected error. If the problem persists, please contact customer support for further assistance.';

/**
 * eBusiness Pages.
 * All pages.
 * @property eb_HeaderMenu.pages
 * @type {Object}
 * */
eb_HeaderMenu.pages = {
    'Donations': "Donations.html",
    'Login': "Login.html",
    'MembershipApplication': "MembershipApplication.html",
    'PersonProfile': "PersonProfile.html",
    'SignUp': "SignUp.html",
    'ViewCart': "ViewCart.html",
    'Index': "Index.html",
    'EventCatalog': "Events/EventCatalog.html",
    'ProductCatalog': "ProductCatalog.html",
    'AdminDashboard': "admin/Dashboard.html",
    'CommitteeListing': "committees/CommitteeListing.html",
    'MyCommittees': "committees/MyCommittees.html",
    'CompanyDirectory': "directory/CompanyDirectory.html"
}

/**
 * header model.
 * @method eb_HeaderMenu.model
 * @param {any} options header data for binding if required.
 * @param {Object} domElement header DOM element.
 * @param {Object} userContext userContext instance.
 * @param {Object} shoppingCart shoppingCart instance.
 * @param {String} sitePath sitePath.
 * @param {String} activePage current active page.
 * 
 * */
eb_HeaderMenu.model = function (options) {
    var _that = this;
    _that.domElement = options.domElement;
    //eb_HeaderMenu.domElement(_that.domElement); need to   TEST if its a breaking change

    _that.userContext = options.userContext;
    /*Required mock userContext object if actual object is not availabe. like login, signup etc.*/
    if (!_that.userContext) {
        _that.userContext = {};
        _that.userContext.userLoggedIn = ko.observable(0);
        _that.userContext.FirstName = ko.observable();
    }

    _that.shoppingCart = options.shoppingCart;
    /*Required mock shopping cart object if actual object is not availabe. like login, signup etc.*/
    if (!_that.shoppingCart) {
        _that.shoppingCart = {};
        _that.shoppingCart.showCartItems = ko.observable();
        _that.shoppingCart.numberOfItems = ko.observable();
    }

    if (options.sitePath) {
        _that.sitePath = options.sitePath;
    } else (_that.sitePath = "");

    _that.activePage = ko.observable(options.activePage);
    _that.membershipApplicationText = ko.observable("Become a Member");
    _that.membershipApplicationURL = ko.observable(_that.sitePath + eb_HeaderMenu.pages["MembershipApplication"]);
    _that.donationsText = ko.observable("Donate Now");
    _that.donationsURL = ko.observable(_that.sitePath + eb_HeaderMenu.pages["Donations"]);

    _that.committeeListing = ko.observable("Committee Listing");
    _that.myCommittees = ko.observable("My Committees");
    _that.committeeListingURL = ko.observable(_that.sitePath + eb_HeaderMenu.pages["CommitteeListing"]);
    _that.myCommitteesURL = ko.observable(_that.sitePath + eb_HeaderMenu.pages["MyCommittees"]);

    _that.companyDirectory = ko.observable("Company Directory");
    _that.companyDirectoryURL = ko.observable(_that.sitePath + eb_HeaderMenu.pages["CompanyDirectory"]);

    _that.myProfilePage = ko.observable("My Profile");
    _that.logoutText = ko.observable("Logout");
    _that.myProfileURL = ko.observable(_that.sitePath + eb_HeaderMenu.pages["PersonProfile"]);
    _that.loginURL = ko.observable(_that.sitePath + eb_HeaderMenu.pages["Login"]);

    _that.signUpURL = ko.observable(_that.sitePath + eb_HeaderMenu.pages["SignUp"]);
    _that.loginURL = ko.observable(_that.sitePath + eb_HeaderMenu.pages["Login"]);

    _that.signUpImage = ko.observable(_that.sitePath + "images/icons/fontawesome/user-plus.svg");
    _that.loginImage = ko.observable(_that.sitePath + "images/icons/fontawesome/sign-in-alt.svg");
    _that.shoppingCartImage = ko.observable(_that.sitePath + "images/icons/fontawesome/shopping-cart.svg");

    //_that.viewCartURL = ko.observable(_that.sitePath + eb_HeaderMenu.pages["ViewCart"]);
    var viewCartURL = options.viewCartURL || _that.sitePath + eb_HeaderMenu.pages["ViewCart"];
    _that.viewCartURL = ko.observable(viewCartURL);
    _that.visibleCart = ko.observable(1);

    _that.hasCompanyAdminAccess = ko.observable(0);

    _that.cartText = options.cartText || "My Cart";

    /*Logout user and clear session cache*/
    _that.logOutUser = function () {
        eb_UserContext.live.Logout().done(function () {
            window.location.assign(eb_Config.loginPageURL);
        }).fail(function (data, msg, jhr) {
            if (data && data.responseText) {
                window.location.assign(eb_Config.loginPageURL);
                console.error(data.responseText);
            }
        });
    }

    /*Load main menu*/
    _that.mainMenu = function (data) {
        self = this;
        self.labelText = ko.observable(data.labelText);
        self.URL = ko.observable(data.URL);
        self.hasAccess = ko.observable(data.hasAccess);
        self.imagePath = ko.observable(data.imagePath);
        self.activeClass = ko.observable(data.activeClass);
        self.subMenuList = ko.observableArray();
    }
    _that.mainMenuAdmin = function (data) {
        self = this;
        self.labelText = ko.observable(data.labelText);
        self.URL = ko.observable(data.URL);
        self.hasAccess = ko.observable(data.hasAccess);
        self.imagePath = ko.observable(data.imagePath);
        self.activeClass = ko.observable(data.activeClass);
        self.subMenuList = ko.observableArray();
    }
    /*Load main menu items*/
    _that.mainMenuItems = ko.observableArray();
    _that.mainMenuAdminItems = ko.observableArray();

    /*Select active */
    function addActiveClass(pageName, currentPage) {
        if (!pageName) { return ""; }
        if (pageName.toLowerCase() === currentPage.toLowerCase()) {
            return "active";
        } else {
            return "";
        }
    }

    //get company data
    _that.getCompanies = function () {
        eb_UserContext.getCompanies().done(function (data) {

            if (data.length > 0) {
                //set default company Id in session storage
                if (!eb_UserContext.live.checkCompanyAdminInUserContext()) {
                    _that.setCompany(data[0]);
                }

                var companyAdminMenuItem = eBusinessJQObject.grep(_that.mainMenuAdminItems(), function (n, i) {
                    return (n.URL() == "admin/Dashboard.html");
                });

                if (companyAdminMenuItem.length > 0) {
                    companyAdminMenuItem[0].hasAccess(1);
                }
            }

        }).fail(function (data, msg, jhr) {
            console.log("Unable to fetch companies for the user:-", msg);
        });
    }

    checkIfCompanyAdmin();

    function checkIfCompanyAdmin() {
        if (eb_UserContext.live) {
            if (_that.userContext.userLoggedIn()) {
                if (eb_UserContext.live.checkCompanyAdminInUserContext()) {
                    _that.hasCompanyAdminAccess(1);
                }
                else {
                    _that.getCompanies();
                }
            }
        }
    }

    _that.setCompany = function (data) {
        //save company Id and company name in session storage
        var dataOut = { companyId: data.id, CompanyName: data.name };
        var fields = ['companyId', 'CompanyName'];
        _that.userContext.Load(dataOut);
        _that.userContext.saveUpdateCache(fields, dataOut);
    }

    if (options.menuData) { } else {
        var data1 = { labelText: "Home", URL: _that.sitePath + eb_HeaderMenu.pages["Index"], hasAccess: 1, imagePath: "", activeClass: addActiveClass(options.activePage, "Index") };
        var data2 = { labelText: "Event", URL: _that.sitePath + eb_HeaderMenu.pages["EventCatalog"], hasAccess: 1, imagePath: "", activeClass: addActiveClass(options.activePage, "EventCatalog") };
        var data3 = { labelText: "Products", URL: _that.sitePath + eb_HeaderMenu.pages["ProductCatalog"], hasAccess: 1, imagePath: "", activeClass: addActiveClass(options.activePage, "ProductCatalog") };

        //List of menu items.
        _that.mainMenuItems.push(new _that.mainMenu(data1))
        _that.mainMenuItems.push(new _that.mainMenu(data2))
        _that.mainMenuItems.push(new _that.mainMenu(data3))
    }
    if (options.menuDataAdmin) { } else {
        var data1 = { labelText: "Manage Company", URL: _that.sitePath + eb_HeaderMenu.pages["AdminDashboard"], hasAccess: _that.hasCompanyAdminAccess(), imagePath: "", activeClass: addActiveClass(options.activePage, "AdminDashboard") };

        //List of menu items.
        _that.mainMenuAdminItems.push(new _that.mainMenuAdmin(data1))
    }

    if (_that.activePage()) {
        if (_that.activePage().toLowerCase() === "login" ||
            _that.activePage().toLowerCase() === "signup" ||
            _that.activePage().toLowerCase() === "passwordresetrequest" ||
            _that.activePage().toLowerCase() === "passwordreset") {
            _that.visibleCart(0);
        } else {
            _that.visibleCart(1);
        }
    } else { _that.visibleCart(1); }
};

/**
* Render header page.
* @method eb_HeaderMenu.render
* @param {any} options Array of required data.
* @param {String} options.templatePath header template URL.
* @return {String} header HTML template.
* */
eb_HeaderMenu.render = function (options) {
    var defer = eBusinessJQObject.Deferred();
    if (options) {
        if (!options) {
            throw { type: "argument_null", message: "An object with values in the templatePath and domElement properties is required.", stack: Error().stack };
        }

        if (!options.templatePath) {
            options.templatePath = eb_HeaderMenu.SitePath + eb_HeaderMenu.TemplatePath;
        }

        if (!options.domElement) {
            throw { type: "argument_mismatch", message: 'Missing domElement.  The object passed in must have a domElement property with a non-empty DOM object.', stack: Error().stack };
        }

        eBusinessJQObject.get(options.templatePath).done(function (data) {
            options.domElement.innerHTML = data;
            defer.resolve(data);
        }).fail(function (data, msg, jhr) {
            defer.reject(data, msg, jhr);
            console.info(msg);
        });
    }
    return defer.promise();
};

/**
 * Page DOM element.
 * @method eb_HeaderMenu.domElement
 * @param {object} domElement current DOM element.
 * */
eb_HeaderMenu.domElement = function (domElement) {
    var self = this;
    self.domElement = domElement;
};

/* Ajax handler for catching error message. If service returns error type is SecurityRequirementFailed, It will redirect to login page*/
eBusinessJQObject(eb_HeaderMenu.domElement).ajaxError(function (event, xhr, settings) {
    if (xhr && typeof xhr.responseJSON !== 'undefined' && (xhr.responseJSON.type === eb_Config.serviceErrorType['Security Requirement Failed'] || xhr.responseJSON.type === eb_Config.serviceErrorType['http Response']) && eb_HeaderMenu.skipPageRedirection === false)
        eb_Config.getErrorMessageForControl(xhr.responseJSON, eb_HeaderMenu);
});

/*Javascript Code to Add Class in Header Dropdown Menu When #drop is checked*/
setTimeout(function () {
    eBusinessJQObject('#ebCommunityCheckbox').change(function () {
        if (eBusinessJQObject(this).is(":checked")) {
            eBusinessJQObject(this).parent().addClass('dropcheck');
        } else {
            eBusinessJQObject(this).parent().removeClass('dropcheck');
        }
    });
}, 1000);